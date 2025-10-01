from sqlalchemy import create_engine, Column, Integer, String, Boolean, Float, DateTime, Text, JSON
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os
from datetime import datetime
import pytz

# Database configuration
DATABASE_URL = "sqlite:///./election_deepfake.db"

# Create SQLAlchemy engine
engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False}  # Needed for SQLite
)

# Create SessionLocal class
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Create Base class
Base = declarative_base()

class VerificationRecord(Base):
    """Database model for storing verification records"""
    __tablename__ = "verification_records"
    
    id = Column(Integer, primary_key=True, index=True)
    analysis_id = Column(String, unique=True, index=True, nullable=False)
    filename = Column(String, nullable=False)
    file_hash = Column(String, nullable=False)  # SHA256 hash of the file
    verification_hash = Column(String, nullable=False)  # Blockchain hash
    is_deepfake = Column(Boolean, nullable=False)
    confidence_score = Column(Float, nullable=False)
    election_context = Column(String, nullable=True)
    candidate_name = Column(String, nullable=True)
    constituency = Column(String, nullable=True)
    analysis_details = Column(JSON, nullable=True)  # Store detailed analysis results
    created_at = Column(DateTime, default=lambda: datetime.now(pytz.timezone('Asia/Kolkata')))
    updated_at = Column(DateTime, default=lambda: datetime.now(pytz.timezone('Asia/Kolkata')), onupdate=lambda: datetime.now(pytz.timezone('Asia/Kolkata')))

def get_db():
    """Dependency to get database session"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def create_tables():
    """Create all database tables"""
    Base.metadata.create_all(bind=engine)
    print("✅ Database tables created successfully")
