from pydantic import BaseModel
from typing import Optional, Dict, Any
from datetime import datetime

class VerificationRecordCreate(BaseModel):
    """Pydantic model for creating verification records"""
    analysis_id: str
    filename: str
    file_hash: str
    verification_hash: str
    is_deepfake: bool
    confidence_score: float
    election_context: Optional[str] = None
    candidate_name: Optional[str] = None
    constituency: Optional[str] = None
    analysis_details: Optional[Dict[str, Any]] = None

class VerificationRecordResponse(BaseModel):
    """Pydantic model for verification record responses"""
    id: int
    analysis_id: str
    filename: str
    file_hash: str
    verification_hash: str
    is_deepfake: bool
    confidence_score: float
    election_context: Optional[str] = None
    candidate_name: Optional[str] = None
    constituency: Optional[str] = None
    analysis_details: Optional[Dict[str, Any]] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
