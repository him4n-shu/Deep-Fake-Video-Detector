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

from database import get_db, create_tables, VerificationRecord
from models import VerificationRecordCreate
from services import DeepfakeDetectionService, BlockchainService
from schemas import VideoAnalysisRequest, VideoAnalysisResponse, VerificationResponse

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

@app.on_event("startup")
async def startup_event():
    """Initialize database and services on startup"""
    create_tables()
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

@app.post("/analyze-video", response_model=VideoAnalysisResponse)
async def analyze_video(
    file: UploadFile = File(...),
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
    query = db.query(VerificationRecord)
    
    if constituency:
        query = query.filter(VerificationRecord.constituency == constituency)
    if candidate_name:
        query = query.filter(VerificationRecord.candidate_name == candidate_name)
    
    records = query.order_by(VerificationRecord.created_at.desc()).offset(offset).limit(limit).all()
    
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
    total_verifications = db.query(VerificationRecord).count()
    deepfake_count = db.query(VerificationRecord).filter(
        VerificationRecord.is_deepfake == True
    ).count()
    real_count = total_verifications - deepfake_count
    
    # Get constituency statistics
    constituency_stats = db.query(
        VerificationRecord.constituency,
        func.count(VerificationRecord.id).label('count'),
        func.sum(case((VerificationRecord.is_deepfake == True, 1), else_=0)).label('deepfake_count')
    ).group_by(VerificationRecord.constituency).all()
    
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
