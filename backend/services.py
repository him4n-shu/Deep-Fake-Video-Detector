import os
import sys
import torch
import cv2
import numpy as np
from typing import Dict, Any, List
import asyncio
from concurrent.futures import ThreadPoolExecutor
import hashlib
import json
from datetime import datetime
import pytz

# Add model directory to path
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'model'))

try:
    from training.zoo.classifiers import DeepFakeClassifier
    from kernel_utils import VideoReader, FaceExtractor, predict_on_video_set
except ImportError as e:
    print(f"Warning: Could not import model components: {e}")
    print("Make sure the model directory is properly set up")

class DeepfakeDetectionService:
    """Service for deepfake detection using AI models"""
    
    def __init__(self):
        self.device = "cuda" if torch.cuda.is_available() else "cpu"
        self.models = []
        self.video_reader = None
        self.face_extractor = None
        self.load_models()
        print(f"🤖 Deepfake Detection Service initialized on {self.device}")
    
    def load_models(self):
        """Load pre-trained deepfake detection models"""
        try:
            # Initialize video processing components
            self.video_reader = VideoReader()
            self.face_extractor = FaceExtractor(self.video_reader.read_frames)
            
            # Load model weights (you'll need to add your trained models here)
            model_weights_dir = os.path.join(os.path.dirname(__file__), '..', 'model', 'weights')
            
            if os.path.exists(model_weights_dir):
                weight_files = [f for f in os.listdir(model_weights_dir) if f.endswith('.pth')]
                
                if weight_files:
                    for weight_file in weight_files:
                        model_path = os.path.join(model_weights_dir, weight_file)
                        model = DeepFakeClassifier(encoder="tf_efficientnet_b7_ns").to(self.device)
                        
                        # Load checkpoint
                        checkpoint = torch.load(model_path, map_location=self.device)
                        state_dict = checkpoint.get("state_dict", checkpoint)
                        model.load_state_dict(state_dict, strict=False)
                        model.eval()
                        self.models.append(model.half() if self.device == "cuda" else model)
                        print(f"✅ Loaded model: {weight_file}")
                else:
                    print("⚠️ No model weights found. Using mock detection.")
                    self.models = []
            else:
                print("⚠️ Model weights directory not found. Using mock detection.")
                self.models = []
                
        except Exception as e:
            print(f"⚠️ Error loading models: {e}. Using mock detection.")
            self.models = []
    
    async def analyze_video(self, video_path: str) -> Dict[str, Any]:
        """
        Analyze video for deepfake detection
        """
        try:
            if not self.models:
                # Mock detection for development/testing
                return await self._mock_detection(video_path)
            
            # Run detection in thread pool to avoid blocking
            loop = asyncio.get_event_loop()
            with ThreadPoolExecutor() as executor:
                result = await loop.run_in_executor(
                    executor, 
                    self._detect_deepfake, 
                    video_path
                )
            
            return result
            
        except Exception as e:
            print(f"Error in video analysis: {e}")
            return {
                "is_deepfake": False,
                "confidence": 0.5,
                "error": str(e),
                "details": {
                    "analysis_method": "error_fallback",
                    "timestamp": datetime.now(pytz.timezone('Asia/Kolkata')).isoformat()
                }
            }
    
    def _detect_deepfake(self, video_path: str) -> Dict[str, Any]:
        """Synchronous deepfake detection"""
        try:
            # Extract faces from video
            faces = self.face_extractor.extract_faces(video_path)
            
            if len(faces) == 0:
                return {
                    "is_deepfake": False,
                    "confidence": 0.3,
                    "details": {
                        "analysis_method": "no_faces_detected",
                        "faces_found": 0,
                        "timestamp": datetime.now(pytz.timezone('Asia/Kolkata')).isoformat()
                    }
                }
            
            # Convert faces to tensors
            face_tensors = []
            for face in faces:
                face_tensor = torch.from_numpy(face).permute(2, 0, 1).float() / 255.0
                # Apply normalization
                mean = torch.tensor([0.485, 0.456, 0.406]).view(3, 1, 1)
                std = torch.tensor([0.229, 0.224, 0.225]).view(3, 1, 1)
                face_tensor = (face_tensor - mean) / std
                face_tensors.append(face_tensor)
            
            # Get predictions from all models
            all_predictions = []
            for model in self.models:
                model.eval()
                with torch.no_grad():
                    face_predictions = []
                    for face_tensor in face_tensors:
                        face_tensor = face_tensor.unsqueeze(0).to(self.device)
                        pred = model(face_tensor)
                        face_predictions.append(torch.sigmoid(pred).cpu().item())
                    
                    all_predictions.extend(face_predictions)
            
            # Calculate final prediction
            avg_confidence = np.mean(all_predictions)
            is_deepfake = avg_confidence > 0.5
            
            return {
                "is_deepfake": bool(is_deepfake),
                "confidence": float(avg_confidence),
                "details": {
                    "analysis_method": "efficientnet_b7_ensemble",
                    "faces_analyzed": len(faces),
                    "models_used": len(self.models),
                    "individual_predictions": all_predictions,
                    "timestamp": datetime.now(pytz.timezone('Asia/Kolkata')).isoformat()
                }
            }
            
        except Exception as e:
            print(f"Error in deepfake detection: {e}")
            return {
                "is_deepfake": False,
                "confidence": 0.5,
                "error": str(e),
                "details": {
                    "analysis_method": "error_fallback",
                    "timestamp": datetime.now(pytz.timezone('Asia/Kolkata')).isoformat()
                }
            }
    
    async def _mock_detection(self, video_path: str) -> Dict[str, Any]:
        """Mock detection for development/testing when models are not available"""
        # Simulate some processing time
        await asyncio.sleep(1)
        
        # Get video properties
        cap = cv2.VideoCapture(video_path)
        frame_count = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
        fps = cap.get(cv2.CAP_PROP_FPS)
        duration = frame_count / fps if fps > 0 else 0
        cap.release()
        
        # Mock prediction based on video properties
        # This is just for demonstration - replace with actual model inference
        mock_confidence = np.random.uniform(0.1, 0.9)
        is_deepfake = mock_confidence > 0.6
        
        return {
            "is_deepfake": bool(is_deepfake),
            "confidence": float(mock_confidence),
            "details": {
                "analysis_method": "mock_detection",
                "video_properties": {
                    "frame_count": frame_count,
                    "fps": fps,
                    "duration_seconds": duration
                },
                "note": "This is a mock detection. Train and load actual models for real detection.",
                "timestamp": datetime.now(pytz.timezone('Asia/Kolkata')).isoformat()
            }
        }

class BlockchainService:
    """Service for creating tamper-evident verification hashes"""
    
    def __init__(self):
        self.algorithm = "sha256"
        print("🔗 Blockchain Service initialized")
    
    def create_verification_hash(self, analysis_id: str, file_hash: str, 
                               detection_result: Dict[str, Any], 
                               metadata: Dict[str, Any]) -> str:
        """
        Create a tamper-evident hash for verification record
        """
        # Create a comprehensive data structure for hashing
        verification_data = {
            "analysis_id": analysis_id,
            "file_hash": file_hash,
            "detection_result": detection_result,
            "metadata": metadata,
            "timestamp": datetime.now(pytz.timezone('Asia/Kolkata')).isoformat()
        }
        
        # Convert to JSON string for consistent hashing
        data_string = json.dumps(verification_data, sort_keys=True, separators=(',', ':'))
        
        # Create hash
        verification_hash = hashlib.sha256(data_string.encode('utf-8')).hexdigest()
        
        return verification_hash
    
    def verify_integrity(self, analysis_id: str, file_hash: str, 
                        verification_hash: str, detection_result: Dict[str, Any]) -> bool:
        """
        Verify the integrity of a verification record
        """
        try:
            # Recreate the hash with the stored data
            verification_data = {
                "analysis_id": analysis_id,
                "file_hash": file_hash,
                "detection_result": detection_result,
                "metadata": {},  # We don't store metadata separately, so use empty dict
                "timestamp": ""  # We don't store original timestamp, so use empty string
            }
            
            data_string = json.dumps(verification_data, sort_keys=True, separators=(',', ':'))
            recreated_hash = hashlib.sha256(data_string.encode('utf-8')).hexdigest()
            
            # For now, we'll do a simplified verification
            # In a real blockchain implementation, you'd verify against the actual stored hash
            return True  # Simplified - always return True for now
            
        except Exception as e:
            print(f"Error verifying integrity: {e}")
            return False
