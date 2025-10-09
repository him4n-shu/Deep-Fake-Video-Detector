from fastapi import FastAPI, File, UploadFile, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from sqlalchemy import func, case
import uvicorn
import os
import sys
import hashlib
import uuid
from datetime import datetime
import pytz
from typing import List, Optional
import json

# Add model directory to path
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'model'))

from database import get_db, create_tables, VerificationRecord, User
from migrate_database import migrate_database
from sqlalchemy import text, func, case
from models import VerificationRecordCreate
from services import DeepfakeDetectionService, BlockchainService
from schemas import VideoAnalysisRequest, VideoAnalysisResponse, VerificationResponse, UserCreate, UserResponse

# Initialize FastAPI app
app = FastAPI(
    title="Veritas AI - Deepfake Detection System",
    description="Veritas AI: Seeing Through the Illusion. Advanced AI-powered system to detect and verify deepfake videos in electoral content.",
    version="1.0.0"
)

# CORS middleware for frontend communication
# Get allowed origins from environment variable for production
allowed_origins = os.getenv("ALLOWED_ORIGINS", "http://localhost:3000,http://localhost:5173,https://deep-fake-video-detector.vercel.app").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize services
deepfake_service = DeepfakeDetectionService()
blockchain_service = BlockchainService()

def check_user_id_column_exists(db: Session) -> bool:
    """Check if user_id column exists in verification_records table"""
    try:
        # Try to query the user_id column
        result = db.execute(text("SELECT user_id FROM verification_records LIMIT 1"))
        return True
    except Exception:
        return False

def get_verification_records_safe(db: Session, limit: int = 50, offset: int = 0, 
                                 constituency: Optional[str] = None, 
                                 candidate_name: Optional[str] = None):
    """Get verification records with fallback for missing user_id column"""
    try:
        # Try normal ORM query first
        query = db.query(VerificationRecord)
        
        if constituency:
            query = query.filter(VerificationRecord.constituency == constituency)
        if candidate_name:
            query = query.filter(VerificationRecord.candidate_name == candidate_name)
        
        return query.order_by(VerificationRecord.created_at.desc()).offset(offset).limit(limit).all()
    except Exception as e:
        print(f"⚠️ ORM query failed, trying raw SQL: {e}")
        # Fallback to raw SQL without user_id column
        sql = """
        SELECT id, analysis_id, filename, file_hash, verification_hash, 
               is_deepfake, confidence_score, election_context, candidate_name, 
               constituency, analysis_details, created_at, updated_at
        FROM verification_records
        """
        params = {}
        conditions = []
        
        if constituency:
            conditions.append("constituency = :constituency")
            params['constituency'] = constituency
        if candidate_name:
            conditions.append("candidate_name = :candidate_name")
            params['candidate_name'] = candidate_name
            
        if conditions:
            sql += " WHERE " + " AND ".join(conditions)
            
        sql += " ORDER BY created_at DESC LIMIT :limit OFFSET :offset"
        params['limit'] = limit
        params['offset'] = offset
        
        result = db.execute(text(sql), params)
        
        # Convert to VerificationRecord objects
        records = []
        for row in result:
            record = VerificationRecord()
            record.id = row[0]
            record.analysis_id = row[1]
            record.filename = row[2]
            record.file_hash = row[3]
            record.verification_hash = row[4]
            record.is_deepfake = row[5]
            record.confidence_score = row[6]
            record.election_context = row[7]
            record.candidate_name = row[8]
            record.constituency = row[9]
            record.analysis_details = row[10]
            record.created_at = row[11]
            record.updated_at = row[12]
            record.user_id = None  # Set to None since column doesn't exist
            records.append(record)
        
        return records

def get_verification_count_safe(db: Session):
    """Get verification count with fallback for missing user_id column"""
    try:
        # Try normal ORM query first
        return db.query(VerificationRecord).count()
    except Exception as e:
        print(f"⚠️ ORM count query failed, trying raw SQL: {e}")
        # Fallback to raw SQL without user_id column
        result = db.execute(text("SELECT COUNT(*) FROM verification_records"))
        return result.scalar()

def get_deepfake_count_safe(db: Session):
    """Get deepfake count with fallback for missing user_id column"""
    try:
        # Try normal ORM query first
        return db.query(VerificationRecord).filter(VerificationRecord.is_deepfake == True).count()
    except Exception as e:
        print(f"⚠️ ORM deepfake count query failed, trying raw SQL: {e}")
        # Fallback to raw SQL without user_id column
        result = db.execute(text("SELECT COUNT(*) FROM verification_records WHERE is_deepfake = true"))
        return result.scalar()

def get_constituency_stats_safe(db: Session):
    """Get constituency statistics with fallback for missing user_id column"""
    try:
        # Try normal ORM query first
        return db.query(
            VerificationRecord.constituency,
            func.count(VerificationRecord.id).label('count'),
            func.sum(case((VerificationRecord.is_deepfake == True, 1), else_=0)).label('deepfake_count')
        ).group_by(VerificationRecord.constituency).all()
    except Exception as e:
        print(f"⚠️ ORM constituency stats query failed, trying raw SQL: {e}")
        # Fallback to raw SQL without user_id column
        sql = """
        SELECT constituency, 
               COUNT(*) as count,
               SUM(CASE WHEN is_deepfake = true THEN 1 ELSE 0 END) as deepfake_count
        FROM verification_records 
        GROUP BY constituency
        """
        result = db.execute(text(sql))
        
        # Convert to similar format as ORM result
        stats = []
        for row in result:
            class Stat:
                def __init__(self, constituency, count, deepfake_count):
                    self.constituency = constituency
                    self.count = count
                    self.deepfake_count = deepfake_count
            
            stats.append(Stat(row[0], row[1], row[2]))
        
        return stats

@app.on_event("startup")
async def startup_event():
    """Initialize database and services on startup"""
    create_tables()
    # Run database migration to add missing columns
    print("🔄 Running database migration...")
    try:
        migrate_database()
        print("✅ Database migration completed")
    except Exception as e:
        print(f"❌ Database migration failed: {e}")
        # Don't fail startup, but log the error
    print("🚀 Veritas AI - Deepfake Detection System started!")
    print("🎯 Seeing Through the Illusion")
    print("📊 Database initialized")
    print("🔗 Blockchain service ready")

@app.get("/")
async def root():
    """Root endpoint with system information"""
    return {
        "message": "Veritas AI Deepfake Detection System",
        "version": "1.0.0",
        "status": "active",
        "features": [
            "Deepfake detection using deep learning",
            "Local verification storage",
            "Tamper-evident verification results",
            "Real-time video analysis"
        ]
    }

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "timestamp": datetime.now(pytz.timezone('Asia/Kolkata')).isoformat(),
        "services": {
            "deepfake_detection": "active",
            "database": "connected",
            "blockchain": "ready"
        }
    }

@app.post("/users", response_model=UserResponse)
async def create_user(user_data: UserCreate, db: Session = Depends(get_db)):
    """
    Create a new user or get existing user by email
    """
    try:
        # Check if user already exists
        existing_user = db.query(User).filter(User.email == user_data.email).first()
        
        if existing_user:
            # Update existing user information
            existing_user.name = user_data.name
            existing_user.phone = user_data.phone
            existing_user.organization = user_data.organization
            existing_user.purpose = user_data.purpose
            existing_user.updated_at = datetime.now(pytz.timezone('Asia/Kolkata'))
            
            db.commit()
            db.refresh(existing_user)
            return existing_user
        else:
            # Create new user
            new_user = User(
                name=user_data.name,
                email=user_data.email,
                phone=user_data.phone,
                organization=user_data.organization,
                purpose=user_data.purpose
            )
            
            db.add(new_user)
            db.commit()
            db.refresh(new_user)
            return new_user
            
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error creating user: {str(e)}")

@app.get("/users/{email}", response_model=UserResponse)
async def get_user_by_email(email: str, db: Session = Depends(get_db)):
    """
    Get user by email address
    """
    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@app.post("/analyze-video", response_model=VideoAnalysisResponse)
async def analyze_video(
    file: UploadFile = File(...),
    user_id: Optional[int] = None,
    election_context: Optional[str] = None,
    candidate_name: Optional[str] = None,
    constituency: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """
    Analyze uploaded video for deepfake detection
    """
    try:
        # Validate file type
        if not file.content_type.startswith('video/'):
            raise HTTPException(status_code=400, detail="Only video files are allowed")
        
        # Generate unique analysis ID
        analysis_id = str(uuid.uuid4())
        
        # Save uploaded file temporarily
        temp_file_path = f"temp_uploads/{analysis_id}_{file.filename}"
        os.makedirs("temp_uploads", exist_ok=True)
        
        with open(temp_file_path, "wb") as buffer:
            content = await file.read()
            buffer.write(content)
        
        # Calculate file hash for integrity
        file_hash = hashlib.sha256(content).hexdigest()
        
        # Perform deepfake detection
        print(f"🔍 Analyzing video: {file.filename}")
        detection_result = await deepfake_service.analyze_video(temp_file_path)
        
        # Create blockchain hash for tamper-proof verification
        verification_hash = blockchain_service.create_verification_hash(
            analysis_id=analysis_id,
            file_hash=file_hash,
            detection_result=detection_result,
            metadata={
                "filename": file.filename,
                "election_context": election_context,
                "candidate_name": candidate_name,
                "constituency": constituency,
                "timestamp": datetime.now(pytz.timezone('Asia/Kolkata')).isoformat()
            }
        )
        
        # Store verification record in database
        verification_record = VerificationRecordCreate(
            analysis_id=analysis_id,
            filename=file.filename,
            file_hash=file_hash,
            verification_hash=verification_hash,
            is_deepfake=detection_result["is_deepfake"],
            confidence_score=detection_result["confidence"],
            election_context=election_context,
            candidate_name=candidate_name,
            constituency=constituency,
            analysis_details=detection_result
        )
        
        db_record = VerificationRecord(**verification_record.dict())
        if user_id:
            db_record.user_id = user_id
        db.add(db_record)
        db.commit()
        db.refresh(db_record)
        
        # Clean up temporary file
        os.remove(temp_file_path)
        
        return VideoAnalysisResponse(
            analysis_id=analysis_id,
            filename=file.filename,
            is_deepfake=detection_result["is_deepfake"],
            confidence_score=detection_result["confidence"],
            verification_hash=verification_hash,
            analysis_details=detection_result,
            timestamp=datetime.now(pytz.timezone('Asia/Kolkata')).isoformat()
        )
        
    except Exception as e:
        # Clean up temporary file if it exists
        if 'temp_file_path' in locals() and os.path.exists(temp_file_path):
            os.remove(temp_file_path)
        
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")

@app.get("/verification/{analysis_id}", response_model=VerificationResponse)
async def get_verification(analysis_id: str, db: Session = Depends(get_db)):
    """
    Retrieve verification record by analysis ID
    """
    record = db.query(VerificationRecord).filter(
        VerificationRecord.analysis_id == analysis_id
    ).first()
    
    if not record:
        raise HTTPException(status_code=404, detail="Verification record not found")
    
    # Verify blockchain integrity
    is_tampered = blockchain_service.verify_integrity(
        analysis_id=record.analysis_id,
        file_hash=record.file_hash,
        verification_hash=record.verification_hash,
        detection_result=record.analysis_details
    )
    
    return VerificationResponse(
        analysis_id=record.analysis_id,
        filename=record.filename,
        is_deepfake=record.is_deepfake,
        confidence_score=record.confidence_score,
        verification_hash=record.verification_hash,
        is_tampered=is_tampered,
        election_context=record.election_context,
        candidate_name=record.candidate_name,
        constituency=record.constituency,
        timestamp=record.created_at.isoformat(),
        analysis_details=record.analysis_details
    )

@app.get("/verifications", response_model=List[VerificationResponse])
async def get_all_verifications(
    limit: int = 50,
    offset: int = 0,
    constituency: Optional[str] = None,
    candidate_name: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """
    Get all verification records with optional filtering
    """
    records = get_verification_records_safe(db, limit, offset, constituency, candidate_name)
    
    return [
        VerificationResponse(
            analysis_id=record.analysis_id,
            filename=record.filename,
            is_deepfake=record.is_deepfake,
            confidence_score=record.confidence_score,
            verification_hash=record.verification_hash,
            is_tampered=False,  # Assume not tampered for list view
            election_context=record.election_context,
            candidate_name=record.candidate_name,
            constituency=record.constituency,
            timestamp=record.created_at.isoformat(),
            analysis_details=record.analysis_details
        )
        for record in records
    ]

@app.get("/statistics")
async def get_statistics(db: Session = Depends(get_db)):
    """
    Get system statistics
    """
    total_verifications = get_verification_count_safe(db)
    deepfake_count = get_deepfake_count_safe(db)
    real_count = total_verifications - deepfake_count
    
    # Get constituency statistics
    constituency_stats = get_constituency_stats_safe(db)
    
    return {
        "total_verifications": total_verifications,
        "deepfake_detected": deepfake_count,
        "real_videos": real_count,
        "deepfake_percentage": (deepfake_count / total_verifications * 100) if total_verifications > 0 else 0,
        "constituency_breakdown": [
            {
                "constituency": stat.constituency or "Unknown",
                "total_videos": stat.count,
                "deepfake_count": stat.deepfake_count
            }
            for stat in constituency_stats
        ]
    }

@app.post("/create-sample-data")
async def create_sample_data(db: Session = Depends(get_db)):
    """
    Create sample verification records for testing
    """
    import random
    from datetime import datetime, timedelta
    
    # Sample data for testing
    constituencies = ["Varanasi", "Amethi", "Gandhinagar", "Mumbai North", "Delhi", "Chennai South", "Kolkata North"]
    candidates = ["Narendra Modi", "Rahul Gandhi", "Arvind Kejriwal", "Mamata Banerjee", "Yogi Adityanath"]
    
    sample_records = []
    for i in range(15):  # Create 15 sample records
        is_deepfake = random.choice([True, False, False, False])  # 25% deepfake rate
        # More realistic confidence scores: high confidence for both deepfake and authentic
        confidence = random.uniform(0.75, 0.95) if is_deepfake else random.uniform(0.75, 0.95)
        
        record = VerificationRecord(
            analysis_id=f"sample_{i+1:03d}",
            filename=f"sample_video_{i+1:03d}.mp4",
            file_hash=hashlib.sha256(f"sample_file_{i}".encode()).hexdigest(),
            verification_hash=blockchain_service.create_verification_hash(
                analysis_id=f"sample_{i+1:03d}",
                file_hash=hashlib.sha256(f"sample_file_{i}".encode()).hexdigest(),
                detection_result={"is_deepfake": is_deepfake, "confidence": confidence},
                metadata={"sample": True}
            ),
            is_deepfake=is_deepfake,
            confidence_score=confidence,
            election_context="Sample Context",
            candidate_name=random.choice(candidates),
            constituency=random.choice(constituencies),
            analysis_details={
                "analysis_method": "sample_data",
                "faces_analyzed": random.randint(1, 5),
                "models_used": 1,
                "timestamp": (datetime.now() - timedelta(days=random.randint(0, 30))).isoformat()
            }
        )
        sample_records.append(record)
    
    # Add all records to database
    db.add_all(sample_records)
    db.commit()
    
    return {
        "message": f"Created {len(sample_records)} sample verification records",
        "deepfakes": len([r for r in sample_records if r.is_deepfake]),
        "authentic": len([r for r in sample_records if not r.is_deepfake])
    }

@app.delete("/clear-all-data")
async def clear_all_data(db: Session = Depends(get_db)):
    """
    Clear all verification records (for testing)
    """
    count = db.query(VerificationRecord).count()
    db.query(VerificationRecord).delete()
    db.commit()
    
    return {"message": f"Cleared {count} verification records"}

if __name__ == "__main__":
    port = int(os.getenv("PORT", 8000))
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=port,
        reload=False,  # Disable reload in production
        log_level="info"
    )
