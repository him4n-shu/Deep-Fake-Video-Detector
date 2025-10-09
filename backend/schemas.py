from pydantic import BaseModel, EmailStr
from typing import Optional, Dict, Any, List
from datetime import datetime

class UserCreate(BaseModel):
    """Schema for creating a new user"""
    name: str
    email: EmailStr
    phone: Optional[str] = None
    organization: Optional[str] = None
    purpose: Optional[str] = 'general'

class UserResponse(BaseModel):
    """Schema for user response"""
    id: int
    name: str
    email: str
    phone: Optional[str] = None
    organization: Optional[str] = None
    purpose: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True

class VideoAnalysisRequest(BaseModel):
    """Request schema for video analysis"""
    election_context: Optional[str] = None
    candidate_name: Optional[str] = None
    constituency: Optional[str] = None

class VideoAnalysisResponse(BaseModel):
    """Response schema for video analysis"""
    analysis_id: str
    filename: str
    is_deepfake: bool
    confidence_score: float
    verification_hash: str
    analysis_details: Dict[str, Any]
    timestamp: str

class VerificationResponse(BaseModel):
    """Response schema for verification records"""
    analysis_id: str
    filename: str
    is_deepfake: bool
    confidence_score: float
    verification_hash: str
    is_tampered: bool
    election_context: Optional[str] = None
    candidate_name: Optional[str] = None
    constituency: Optional[str] = None
    timestamp: str
    analysis_details: Dict[str, Any]

class StatisticsResponse(BaseModel):
    """Response schema for system statistics"""
    total_verifications: int
    deepfake_detected: int
    real_videos: int
    deepfake_percentage: float
    constituency_breakdown: List[Dict[str, Any]]

class HealthCheckResponse(BaseModel):
    """Response schema for health check"""
    status: str
    timestamp: str
    services: Dict[str, str]
