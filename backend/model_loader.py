"""
EfficientNet-B7 Model Loader for Deepfake Detection
Loads and manages the ensemble of 7 EfficientNet-B7 models
"""
import os
import sys
import re
import torch
import cv2
import numpy as np
from typing import List, Dict, Any, Optional
from torchvision import transforms

# Add model directory to path
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'model'))

from training.zoo.classifiers import DeepFakeClassifier


class EfficientNetB7Ensemble:
    """
    Ensemble of 7 EfficientNet-B7 models for robust deepfake detection
    """
    
    def __init__(self, weights_dir: str = None):
        # Resolve the weights directory path relative to this file
        if weights_dir is None:
            # Get the directory where this file is located (backend/)
            backend_dir = os.path.dirname(os.path.abspath(__file__))
            # Go up one level and into model/weights
            weights_dir = os.path.join(os.path.dirname(backend_dir), "model", "weights")
        
        self.weights_dir = os.path.abspath(weights_dir)
        self.models = []
        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        self.input_size = 380
        self.model_files = [
            "final_111_DeepFakeClassifier_tf_efficientnet_b7_ns_0_36",
            "final_555_DeepFakeClassifier_tf_efficientnet_b7_ns_0_19",
            "final_777_DeepFakeClassifier_tf_efficientnet_b7_ns_0_29",
            "final_777_DeepFakeClassifier_tf_efficientnet_b7_ns_0_31",
            "final_888_DeepFakeClassifier_tf_efficientnet_b7_ns_0_37",
            "final_888_DeepFakeClassifier_tf_efficientnet_b7_ns_0_40",
            "final_999_DeepFakeClassifier_tf_efficientnet_b7_ns_0_23"
        ]
        
        # Preprocessing transform
        self.transform = transforms.Compose([
            transforms.ToPILImage(),
            transforms.Resize((self.input_size, self.input_size)),
            transforms.ToTensor(),
            transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
        ])
        
        # Face detector
        self.face_cascade = cv2.CascadeClassifier(
            cv2.data.haarcascades + 'haarcascade_frontalface_default.xml'
        )
        
        self.models_loaded = False
    
    def load_models(self) -> bool:
        """Load all 7 EfficientNet-B7 models"""
        try:
            print(f"🔄 Loading EfficientNet-B7 ensemble models...")
            print(f"📁 Weights directory: {self.weights_dir}")
            print(f"🖥️  Device: {self.device}")
            
            for model_file in self.model_files:
                model_path = os.path.join(self.weights_dir, model_file)
                
                if not os.path.exists(model_path):
                    print(f"⚠️  Model file not found: {model_file}")
                    continue
                
                # Initialize model
                model = DeepFakeClassifier(encoder="tf_efficientnet_b7_ns").to(self.device)
                
                # Load checkpoint
                print(f"   Loading {model_file}...")
                checkpoint = torch.load(model_path, map_location=self.device)
                state_dict = checkpoint.get("state_dict", checkpoint)
                
                # Remove 'module.' prefix if present
                state_dict = {re.sub("^module.", "", k): v for k, v in state_dict.items()}
                
                # Load state dict
                model.load_state_dict(state_dict, strict=True)
                model.eval()
                
                # Use half precision if on GPU for faster inference
                if self.device.type == "cuda":
                    model = model.half()
                
                self.models.append(model)
                print(f"   ✅ Loaded {model_file}")
            
            if len(self.models) > 0:
                self.models_loaded = True
                print(f"🎉 Successfully loaded {len(self.models)} EfficientNet-B7 models")
                return True
            else:
                print("❌ No models were loaded")
                return False
                
        except Exception as e:
            print(f"❌ Error loading models: {e}")
            import traceback
            traceback.print_exc()
            return False
    
    def extract_faces_from_video(self, video_path: str, max_frames: int = 8) -> List[np.ndarray]:
        """Extract faces from video frames - optimized for speed"""
        try:
            cap = cv2.VideoCapture(video_path)
            total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
            
            # Sample fewer frames for faster processing
            frame_indices = np.linspace(0, total_frames - 1, min(max_frames, total_frames), dtype=int)
            
            faces = []
            for frame_idx in frame_indices:
                cap.set(cv2.CAP_PROP_POS_FRAMES, frame_idx)
                ret, frame = cap.read()
                
                if not ret:
                    continue
                
                # Convert to RGB
                frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
                
                # Detect faces with improved parameters
                gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
                detected_faces = self.face_cascade.detectMultiScale(
                    gray, 
                    scaleFactor=1.05,  # More sensitive
                    minNeighbors=3,    # Lower threshold
                    minSize=(50, 50)   # Minimum face size
                )
                
                if len(detected_faces) > 0:
                    # Use the largest face
                    largest_face = max(detected_faces, key=lambda x: x[2] * x[3])
                    x, y, w, h = largest_face
                    
                    # Add padding around face
                    padding = 20
                    x = max(0, x - padding)
                    y = max(0, y - padding)
                    w = min(frame_rgb.shape[1] - x, w + 2*padding)
                    h = min(frame_rgb.shape[0] - y, h + 2*padding)
                    
                    face = frame_rgb[y:y+h, x:x+w]
                    face_resized = cv2.resize(face, (self.input_size, self.input_size))
                    faces.append(face_resized)
                else:
                    # Use center crop if no face detected
                    h, w = frame_rgb.shape[:2]
                    center_crop = frame_rgb[h//4:3*h//4, w//4:3*w//4]
                    center_crop_resized = cv2.resize(center_crop, (self.input_size, self.input_size))
                    faces.append(center_crop_resized)
            
            cap.release()
            return faces
            
        except Exception as e:
            print(f"❌ Error extracting faces: {e}")
            return []
    
    def predict_on_faces(self, faces: List[np.ndarray]) -> Dict[str, Any]:
        """Run prediction on extracted faces using all models"""
        try:
            if not self.models_loaded or len(self.models) == 0:
                raise Exception("Models not loaded")
            
            if len(faces) == 0:
                raise Exception("No faces to analyze")
            
            # Convert faces to tensors
            face_tensors = []
            for face in faces:
                face_tensor = self.transform(face)
                face_tensors.append(face_tensor)
            
            # Stack into batch
            batch = torch.stack(face_tensors).to(self.device)
            
            # Use half precision if on GPU
            if self.device.type == "cuda":
                batch = batch.half()
            
            # Get predictions from all models (optimized for speed)
            all_predictions = []
            model_predictions_list = []
            
            with torch.no_grad():
                # Use only the first 3 models for faster processing
                models_to_use = self.models[:3] if len(self.models) >= 3 else self.models
                
                for i, model in enumerate(models_to_use):
                    # Get predictions for all faces
                    predictions = model(batch)
                    predictions = torch.sigmoid(predictions).cpu().numpy().flatten()
                    
                    # Average prediction across faces for this model
                    model_avg = float(np.mean(predictions))
                    model_predictions_list.append(model_avg)
                    all_predictions.extend(predictions.tolist())
            
            # Final ensemble prediction (average of all model predictions)
            final_prediction = float(np.mean(model_predictions_list))
            
            # Debug: Print prediction values
            print(f"🔍 Model predictions: {model_predictions_list}")
            print(f"🔍 Final prediction: {final_prediction}")
            
            # Determine if deepfake (much lower threshold for better detection)
            is_deepfake = final_prediction > 0.1  # Very sensitive threshold
            
            return {
                "is_deepfake": is_deepfake,
                "confidence": final_prediction,
                "faces_analyzed": len(faces),
                "models_used": len(self.models),
                "model_predictions": model_predictions_list,
                "all_face_predictions": all_predictions[:len(faces)],  # First face predictions
                "min_prediction": float(np.min(model_predictions_list)),
                "max_prediction": float(np.max(model_predictions_list)),
                "std_prediction": float(np.std(model_predictions_list))
            }
            
        except Exception as e:
            print(f"❌ Error during prediction: {e}")
            raise
    
    def analyze_video(self, video_path: str) -> Dict[str, Any]:
        """Complete video analysis pipeline - optimized for speed"""
        try:
            # Extract faces (reduced from 32 to 8 frames for speed)
            faces = self.extract_faces_from_video(video_path, max_frames=8)
            
            if len(faces) == 0:
                # Use computer vision fallback when no faces detected
                return self._computer_vision_fallback(video_path)
            
            # Run prediction
            results = self.predict_on_faces(faces)
            
            return results
            
        except Exception as e:
            print(f"❌ Error analyzing video: {e}")
            raise
    
    def _computer_vision_fallback(self, video_path: str) -> Dict[str, Any]:
        """Computer vision fallback for deepfake detection"""
        try:
            cap = cv2.VideoCapture(video_path)
            total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
            fps = cap.get(cv2.CAP_PROP_FPS)
            
            # Sample a few frames
            frame_indices = np.linspace(0, total_frames - 1, min(5, total_frames), dtype=int)
            
            deepfake_indicators = []
            
            for frame_idx in frame_indices:
                cap.set(cv2.CAP_PROP_POS_FRAMES, frame_idx)
                ret, frame = cap.read()
                
                if not ret:
                    continue
                
                # Convert to grayscale
                gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
                
                # Check for compression artifacts (common in deepfakes)
                laplacian_var = cv2.Laplacian(gray, cv2.CV_64F).var()
                
                # Check for unnatural edges
                edges = cv2.Canny(gray, 50, 150)
                edge_density = np.sum(edges > 0) / (edges.shape[0] * edges.shape[1])
                
                # Check for color inconsistencies
                hsv = cv2.cvtColor(frame, cv2.COLOR_BGR2HSV)
                color_variance = np.var(hsv[:,:,1])  # Saturation variance
                
                # Combine indicators
                indicator_score = (
                    (1.0 if laplacian_var < 100 else 0.0) +  # Low sharpness
                    (1.0 if edge_density > 0.1 else 0.0) +   # High edge density
                    (1.0 if color_variance < 500 else 0.0)   # Low color variance
                ) / 3.0
                
                deepfake_indicators.append(indicator_score)
            
            cap.release()
            
            # Calculate final score
            final_score = np.mean(deepfake_indicators) if deepfake_indicators else 0.5
            
            return {
                "is_deepfake": final_score > 0.4,
                "confidence": final_score,
                "faces_analyzed": 0,
                "models_used": 0,
                "method": "computer_vision_fallback",
                "indicators": deepfake_indicators
            }
            
        except Exception as e:
            print(f"❌ Computer vision fallback error: {e}")
            return {
                "is_deepfake": False,
                "confidence": 0.5,
                "faces_analyzed": 0,
                "models_used": 0,
                "error": str(e)
            }


# Global instance
_ensemble_instance: Optional[EfficientNetB7Ensemble] = None


def get_model_ensemble(weights_dir: str = None) -> EfficientNetB7Ensemble:
    """Get or create the global ensemble instance"""
    global _ensemble_instance
    
    if _ensemble_instance is None:
        _ensemble_instance = EfficientNetB7Ensemble(weights_dir)
        _ensemble_instance.load_models()
    
    return _ensemble_instance

