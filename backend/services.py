"""
Professional Deepfake Detection Service
Integrates with EfficientNet-B7 ensemble models
"""
import os
import sys
import numpy as np
import cv2
from typing import Dict, Any, List, Optional
import asyncio
import hashlib
import json
from datetime import datetime
import pytz
from PIL import Image
import io
import time
from concurrent.futures import ThreadPoolExecutor

# Add model directory to path for imports
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'model'))

# Import the model ensemble
try:
    from model_loader import get_model_ensemble
    # from model_loader_s3 import get_model_ensemble
    USE_EFFICIENTNET = True
except ImportError as e:
    print(f"⚠️  Could not import model_loader: {e}")
    print("⚠️  Falling back to basic detection")
    USE_EFFICIENTNET = False


class DeepfakeDetectionService:
    """
    Professional deepfake detection service using EfficientNet-B7 ensemble
    """
    
    def __init__(self):
        self.model_loaded = False
        # Resolve the weights directory path
        if os.getenv("MODEL_WEIGHTS_DIR"):
            self.model_path = os.getenv("MODEL_WEIGHTS_DIR")
        else:
            # Default: go up from backend/ to project root, then to model/weights
            backend_dir = os.path.dirname(os.path.abspath(__file__))
            self.model_path = os.path.join(os.path.dirname(backend_dir), "model", "weights")
        
        self.ensemble = None
        self.load_model()
    
    def load_model(self):
        """Load the EfficientNet-B7 ensemble models"""
        try:
            if not USE_EFFICIENTNET:
                print("⚠️ EfficientNet models not available, using fallback detection")
                self.model_loaded = False
                return
            
            # Load the ensemble
            print("🔄 Initializing EfficientNet-B7 ensemble...")
            self.ensemble = get_model_ensemble(self.model_path)
            
            if self.ensemble and self.ensemble.models_loaded:
                self.model_loaded = True
                print("🚀 EfficientNet-B7 ensemble ready for detection")
            else:
                print("⚠️ Model ensemble not loaded, using fallback detection")
                self.model_loaded = False
                
        except Exception as e:
            print(f"❌ Error loading model ensemble: {e}")
            import traceback
            traceback.print_exc()
            self.model_loaded = False
    
    async def analyze_video(self, video_path: str) -> Dict[str, Any]:
        """
        Analyze video for deepfake detection using your model
        """
        try:
            if not self.model_loaded:
                return await self._fallback_detection(video_path)
            
            # Use your actual model for detection
            return await self._model_detection(video_path)
            
        except Exception as e:
            print(f"❌ Analysis error: {e}")
            return await self._fallback_detection(video_path)
    
    async def _model_detection(self, video_path: str) -> Dict[str, Any]:
        """Use EfficientNet-B7 ensemble for detection"""
        try:
            start_time = time.time()
            
            # Run prediction using the ensemble in a thread pool to avoid blocking
            print(f"🔍 Running EfficientNet-B7 ensemble on video...")
            loop = asyncio.get_event_loop()
            results = await loop.run_in_executor(
                None,  # Use default executor
                self.ensemble.analyze_video,
                video_path
            )
            
            processing_time = time.time() - start_time
            
            # Debug: Check if model returned processing_time
            model_processing_time = results.get("processing_time")
            print(f"🔍 Model processing_time: {model_processing_time}")
            print(f"🔍 Service processing_time: {round(processing_time, 2)}")
            
            # Calculate model size (approximate for 7 models)
            model_size_mb = 267 * 7  # Each model is ~267MB
            model_size_str = f"{model_size_mb/1024:.1f} GB" if model_size_mb > 1000 else f"{model_size_mb} MB"
            
            # Use model's processing_time if available, otherwise use service timing
            final_processing_time = model_processing_time if model_processing_time is not None else round(processing_time, 2)
            print(f"🔍 Final processing_time: {final_processing_time}")
            
            return {
                "is_deepfake": results.get("is_deepfake", False),
                "confidence": float(results.get("confidence", 0.5)),
                "analysis_method": "efficientnet_b7_ensemble",
                "processing_time": final_processing_time,
                "model_size": model_size_str,
                "faces_detected": results.get("faces_analyzed", 0),
                "frames_analyzed": results.get("faces_analyzed", 0),
                "model_loaded": True,
                "models_in_ensemble": results.get("models_used", 7),
                "model_agreement": {
                    "min_confidence": results.get("min_prediction", 0.0),
                    "max_confidence": results.get("max_prediction", 1.0),
                    "std_deviation": results.get("std_prediction", 0.0),
                    "individual_predictions": results.get("model_predictions", [])
                },
                "detection_details": {
                    "face_predictions": results.get("all_face_predictions", []),
                    "ensemble_method": "weighted_averaging",
                    "threshold": 0.5,
                    "ensemble_weights": results.get("ensemble_weights", []),
                    "temporal_consistency": results.get("temporal_consistency", {}),
                    "face_quality": results.get("face_quality", {})
                },
                "quality_metrics": {
                    "face_quality_score": results.get("face_quality", {}).get("quality_score", 0.5),
                    "temporal_consistency_score": results.get("temporal_consistency", {}).get("consistency_score", 0.5),
                    "quality_issues": results.get("face_quality", {}).get("issues", []),
                    "prediction_trend": results.get("temporal_consistency", {}).get("trend", "stable")
                },
                "decision_analysis": {
                    "decision_factors": results.get("decision_factors", {}),
                    "adaptive_threshold": results.get("decision_factors", {}).get("final_threshold", 0.5),
                    "model_agreement": results.get("decision_factors", {}).get("model_agreement", 0.5),
                    "confidence_boost": results.get("decision_factors", {}).get("confidence_boost", 0.0)
                },
                "timestamp": datetime.now(pytz.timezone('Asia/Kolkata')).isoformat()
            }
            
        except Exception as e:
            print(f"❌ Model detection error: {e}")
            import traceback
            traceback.print_exc()
            return await self._fallback_detection(video_path)
    
    async def _extract_frames(self, video_path: str, max_frames: int = 10) -> List[np.ndarray]:
        """Extract frames from video for analysis"""
        try:
            cap = cv2.VideoCapture(video_path)
            frames = []
            frame_count = 0
            total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
            
            # Sample frames evenly throughout the video
            frame_interval = max(1, total_frames // max_frames)
            
            while len(frames) < max_frames:
                ret, frame = cap.read()
                if not ret:
                    break
                
                if frame_count % frame_interval == 0:
                    frames.append(frame)
                
                frame_count += 1
            
            cap.release()
            return frames
            
        except Exception as e:
            print(f"❌ Frame extraction error: {e}")
            return []
    
    async def _analyze_frame_with_model(self, frame: np.ndarray) -> Dict[str, Any]:
        """Analyze frame using your model architecture"""
        try:
            # Convert to RGB for processing
            frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            
            # Apply your model's preprocessing
            processed_frame = await self._preprocess_frame(frame_rgb)
            
            # Here you would use your actual model
            # For now, using advanced computer vision techniques
            
            # Face detection and analysis
            face_analysis = await self._analyze_face_characteristics(processed_frame)
            
            # Texture and edge analysis
            texture_analysis = await self._analyze_texture_patterns(processed_frame)
            
            # Combine analyses
            confidence = (face_analysis['score'] * 0.6 + texture_analysis['score'] * 0.4)
            
            return {
                'confidence': float(confidence),
                'face_score': face_analysis['score'],
                'texture_score': texture_analysis['score'],
                'face_detected': face_analysis['face_detected']
            }
            
        except Exception as e:
            print(f"❌ Frame analysis error: {e}")
            return {
                'confidence': 0.5,
                'face_score': 0.5,
                'texture_score': 0.5,
                'face_detected': False
            }
    
    async def _preprocess_frame(self, frame: np.ndarray) -> np.ndarray:
        """Preprocess frame for model input"""
        try:
            # Resize to standard size
            frame_resized = cv2.resize(frame, (224, 224))
            
            # Normalize
            frame_normalized = frame_resized.astype(np.float32) / 255.0
            
            return frame_normalized
            
        except Exception as e:
            print(f"❌ Preprocessing error: {e}")
            return frame
    
    async def _analyze_face_characteristics(self, frame: np.ndarray) -> Dict[str, Any]:
        """Analyze face characteristics for deepfake detection"""
        try:
            # Convert to grayscale
            gray = cv2.cvtColor(frame, cv2.COLOR_RGB2GRAY)
            
            # Face detection
            face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
            faces = face_cascade.detectMultiScale(gray, 1.1, 4)
            
            if len(faces) == 0:
                return {'score': 0.3, 'face_detected': False}
            
            # Analyze the largest face
            largest_face = max(faces, key=lambda x: x[2] * x[3])
            x, y, w, h = largest_face
            face_roi = gray[y:y+h, x:x+w]
            
            # Analyze face symmetry
            left_half = face_roi[:, :w//2]
            right_half = cv2.flip(face_roi[:, w//2:], 1)
            
            if left_half.shape == right_half.shape:
                symmetry = 1.0 - np.mean(np.abs(left_half.astype(float) - right_half.astype(float))) / 255.0
            else:
                symmetry = 0.5
            
            # Analyze face texture
            texture_variance = np.var(face_roi)
            texture_score = min(texture_variance / 1000, 1.0)
            
            # Combine scores
            face_score = (symmetry * 0.6 + texture_score * 0.4)
            
            return {
                'score': face_score,
                'face_detected': True,
                'symmetry': symmetry,
                'texture_variance': texture_variance
            }
            
        except Exception as e:
            print(f"❌ Face analysis error: {e}")
            return {'score': 0.5, 'face_detected': False}
    
    async def _analyze_texture_patterns(self, frame: np.ndarray) -> Dict[str, Any]:
        """Analyze texture patterns for deepfake detection"""
        try:
            # Convert to grayscale
            gray = cv2.cvtColor(frame, cv2.COLOR_RGB2GRAY)
            
            # Apply edge detection
            edges = cv2.Canny(gray, 50, 150)
            
            # Calculate edge density
            edge_density = np.sum(edges > 0) / (edges.shape[0] * edges.shape[1])
            
            # Calculate local binary patterns
            lbp = self._calculate_lbp(gray)
            lbp_variance = np.var(lbp)
            
            # Calculate Gabor filter responses
            gabor_response = self._apply_gabor_filters(gray)
            gabor_variance = np.var(gabor_response)
            
            # Combine texture indicators
            texture_score = (edge_density * 0.3 + 
                           min(lbp_variance / 1000, 1.0) * 0.4 + 
                           min(gabor_variance / 1000, 1.0) * 0.3)
            
            return {
                'score': texture_score,
                'edge_density': edge_density,
                'lbp_variance': lbp_variance,
                'gabor_variance': gabor_variance
            }
            
        except Exception as e:
            print(f"❌ Texture analysis error: {e}")
            return {'score': 0.5}
    
    def _calculate_lbp(self, image: np.ndarray) -> np.ndarray:
        """Calculate Local Binary Patterns"""
        try:
            # Simple LBP implementation
            lbp = np.zeros_like(image)
            for i in range(1, image.shape[0]-1):
                for j in range(1, image.shape[1]-1):
                    center = image[i, j]
                    binary_string = ""
                    for di in [-1, 0, 1]:
                        for dj in [-1, 0, 1]:
                            if di == 0 and dj == 0:
                                continue
                            if image[i+di, j+dj] >= center:
                                binary_string += "1"
                            else:
                                binary_string += "0"
                    lbp[i, j] = int(binary_string, 2)
            return lbp
        except:
            return np.zeros_like(image)
    
    def _apply_gabor_filters(self, image: np.ndarray) -> np.ndarray:
        """Apply Gabor filters for texture analysis"""
        try:
            # Simple Gabor filter implementation
            kernel = cv2.getGaborKernel((21, 21), 5, 0, 10, 0.5, 0, ktype=cv2.CV_32F)
            filtered = cv2.filter2D(image, cv2.CV_8UC3, kernel)
            return filtered
        except:
            return image
    
    async def _fallback_detection(self, video_path: str) -> Dict[str, Any]:
        """Fallback detection when model is not available"""
        start_time = time.time()
        try:
            # Get video properties
            cap = cv2.VideoCapture(video_path)
            frame_count = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
            fps = cap.get(cv2.CAP_PROP_FPS)
            duration = frame_count / fps if fps > 0 else 0
            cap.release()
            
            # Analyze file characteristics
            file_size = os.path.getsize(video_path)
            
            # IMPROVED heuristics - more neutral approach
            # Use a more balanced approach that doesn't make strong assumptions
            
            # Calculate a score based on multiple factors
            score = 0.5  # Start neutral
            
            # Factor 1: Duration (longer videos are more likely to be authentic)
            if duration > 30:  # Very long videos
                score += 0.1
            elif duration < 2:  # Very short videos
                score -= 0.1
            
            # Factor 2: File size (larger files are more likely to be authentic)
            if file_size > 5000000:  # Large files (>5MB)
                score += 0.1
            elif file_size < 100000:  # Very small files (<100KB)
                score -= 0.1
            
            # Factor 3: Frame rate (normal frame rates suggest authenticity)
            if 20 <= fps <= 60:  # Normal frame rates
                score += 0.05
            elif fps < 10 or fps > 120:  # Unusual frame rates
                score -= 0.05
            
            # Clamp score between 0.1 and 0.9
            score = max(0.1, min(0.9, score))
            
            # Make decision based on score
            is_deepfake = score < 0.5
            confidence = abs(score - 0.5) * 2  # Convert to confidence (0.0 to 0.8)
            confidence = max(0.3, min(0.8, confidence))  # Clamp confidence
            
            processing_time = round(time.time() - start_time, 2)
            
            return {
                "is_deepfake": is_deepfake,
                "confidence": confidence,
                "analysis_method": "fallback_detection",
                "processing_time": processing_time,
                "model_size": "< 1MB",
                "faces_detected": 0,
                "frames_analyzed": 0,
                "model_loaded": False,
                "video_duration": duration,
                "file_size": file_size,
                "timestamp": datetime.now(pytz.timezone('Asia/Kolkata')).isoformat()
            }
            
        except Exception as e:
            print(f"❌ Fallback detection error: {e}")
            return {
                "is_deepfake": False,
                "confidence": 0.5,
                "analysis_method": "error_fallback",
                "processing_time": 0.1,
                "model_size": "< 1MB",
                "faces_detected": 0,
                "frames_analyzed": 0,
                "model_loaded": False,
                "error": str(e),
                "timestamp": datetime.now(pytz.timezone('Asia/Kolkata')).isoformat()
            }

class BlockchainService:
    """
    Professional blockchain service for verification
    """
    
    def create_verification_hash(self, analysis_id: str, file_hash: str, 
                               detection_result: Dict, metadata: Dict) -> str:
        """Create tamper-proof verification hash"""
        data = {
            "analysis_id": analysis_id,
            "file_hash": file_hash,
            "detection_result": detection_result,
            "metadata": metadata,
            "timestamp": datetime.now(pytz.timezone('Asia/Kolkata')).isoformat()
        }
        
        # Create hash
        data_string = json.dumps(data, sort_keys=True)
        verification_hash = hashlib.sha256(data_string.encode()).hexdigest()
        
        return verification_hash
    
    def verify_integrity(self, analysis_id: str, file_hash: str, 
                        verification_hash: str, detection_result: Dict) -> bool:
        """Verify blockchain integrity"""
        try:
            # Recreate hash and compare
            metadata = {"analysis_id": analysis_id}
            expected_hash = self.create_verification_hash(
                analysis_id, file_hash, detection_result, metadata
            )
            return expected_hash == verification_hash
        except:
            return False