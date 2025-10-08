"""
EfficientNet-B7 Model Loader for Deepfake Detection
Loads and manages the ensemble of 7 EfficientNet-B7 models
"""
import os
import sys
import re
import time
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
        self.input_size = 224
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
            print(f"📋 Model files to load: {self.model_files}")
            
            loaded_count = 0
            for model_file in self.model_files:
                model_path = os.path.join(self.weights_dir, model_file)
                print(f"🔍 Checking model: {model_file}")
                print(f"🔍 Full path: {model_path}")
                
                if not os.path.exists(model_path):
                    print(f"⚠️  Model file not found: {model_file}")
                    continue
                
                print(f"✅ Model file exists, loading...")
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
                loaded_count += 1
                print(f"   ✅ Loaded {model_file} (Model {loaded_count})")
            
            if len(self.models) > 0:
                self.models_loaded = True
                print(f"🎉 Successfully loaded {len(self.models)} EfficientNet-B7 models")
                print(f"🔍 DEBUG: Models loaded: {[f'Model_{i+1}' for i in range(len(self.models))]}")
                
                # Test models with dummy input
                print(f"🧪 Testing models with dummy input...")
                try:
                    dummy_input = torch.randn(1, 3, self.input_size, self.input_size).to(self.device)
                    if self.device.type == "cuda":
                        dummy_input = dummy_input.half()
                    
                    for i, model in enumerate(self.models):
                        with torch.no_grad():
                            test_output = model(dummy_input)
                            test_pred = torch.sigmoid(test_output).cpu().numpy().flatten()[0]
                            print(f"   Model {i+1} test prediction: {test_pred:.3f}")
                    
                    print(f"✅ All models are working correctly!")
                except Exception as e:
                    print(f"❌ Error testing models: {e}")
                
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
            
            print(f"🔍 DEBUG: Video opened successfully")
            print(f"🔍 DEBUG: Total frames: {total_frames}")
            print(f"🔍 DEBUG: Face cascade loaded: {self.face_cascade is not None}")
            
            # Sample fewer frames for faster processing
            frame_indices = np.linspace(0, total_frames - 1, min(max_frames, total_frames), dtype=int)
            
            print(f"🔍 DEBUG: Frame indices: {frame_indices}")
            
            faces = []
            faces_detected_count = 0
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
                
                print(f"🔍 DEBUG: Frame {frame_idx}: {len(detected_faces)} faces detected")
                
                if len(detected_faces) > 0:
                    faces_detected_count += 1
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
            print(f"🔍 DEBUG: Face extraction complete")
            print(f"🔍 DEBUG: Total faces extracted: {len(faces)}")
            print(f"🔍 DEBUG: Frames with faces detected: {faces_detected_count}/{len(frame_indices)}")
            return faces
            
        except Exception as e:
            print(f"❌ Error extracting faces: {e}")
            import traceback
            traceback.print_exc()
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
            
            # SIMPLIFIED APPROACH: Direct weighted ensemble with proper thresholds
            all_predictions = []
            model_predictions_list = []
            
            with torch.no_grad():
                # Use all 7 models for better accuracy
                models_to_use = self.models
                
                print(f"🔍 DEBUG: Using {len(models_to_use)} models")
                print(f"🔍 DEBUG: Batch shape: {batch.shape}")
                print(f"🔍 DEBUG: Batch device: {batch.device}")
                
                for i, model in enumerate(models_to_use):
                    print(f"🔍 DEBUG: Processing model {i+1}/{len(models_to_use)}")
                    
                    # Get predictions for all faces
                    predictions = model(batch)
                    print(f"🔍 DEBUG: Raw predictions shape: {predictions.shape}")
                    print(f"🔍 DEBUG: Raw predictions range: {predictions.min().item():.3f} - {predictions.max().item():.3f}")
                    
                    predictions = torch.sigmoid(predictions).cpu().numpy().flatten()
                    print(f"🔍 DEBUG: Sigmoid predictions: {predictions}")
                    
                    # Calculate average across faces for this model
                    model_avg = float(np.mean(predictions))
                    model_predictions_list.append(model_avg)
                    all_predictions.extend(predictions.tolist())
                    
                    print(f"🔍 DEBUG: Model {i+1} average: {model_avg:.3f}")
            
            # SIMPLE WEIGHTED AVERAGE - This is more reliable
            # Use equal weights for all models
            final_prediction = float(np.mean(model_predictions_list))
            
            # Calculate statistics for debugging
            mean_pred = final_prediction
            std_pred = float(np.std(model_predictions_list))
            min_pred = float(np.min(model_predictions_list))
            max_pred = float(np.max(model_predictions_list))
            
            # Add temporal consistency analysis
            temporal_consistency = self._analyze_temporal_consistency(all_predictions, len(faces))
            
            # Add quality assessment
            face_quality = self._assess_face_quality(faces)
            
            # Debug: Print prediction values
            print(f"🔍 Model predictions: {model_predictions_list}")
            print(f"🔍 Final prediction (mean): {final_prediction:.3f}")
            print(f"🔍 Prediction range: {min_pred:.3f} - {max_pred:.3f}")
            print(f"🔍 Prediction std: {std_pred:.3f}")
            print(f"🔍 Models above 0.5: {sum(1 for p in model_predictions_list if p > 0.5)}/{len(model_predictions_list)}")
            print(f"🔍 Models below 0.5: {sum(1 for p in model_predictions_list if p <= 0.5)}/{len(model_predictions_list)}")
            
            # Advanced decision making with multiple validation layers
            decision_result = self._make_robust_decision(
                final_prediction, 
                model_predictions_list, 
                temporal_consistency, 
                face_quality
            )
            
            is_deepfake = decision_result["is_deepfake"]
            confidence = decision_result["confidence"]
            decision_factors = decision_result["factors"]
            
            return {
                "is_deepfake": is_deepfake,
                "confidence": confidence,
                "faces_analyzed": len(faces),
                "models_used": len(self.models),
                "model_predictions": model_predictions_list,
                "all_face_predictions": all_predictions[:len(faces)],  # First face predictions
                "min_prediction": float(np.min(model_predictions_list)),
                "max_prediction": float(np.max(model_predictions_list)),
                "std_prediction": float(np.std(model_predictions_list)),
                "temporal_consistency": temporal_consistency,
                "face_quality": face_quality,
                "ensemble_weights": [1.0/len(model_predictions_list)] * len(model_predictions_list),
                "decision_factors": decision_factors
            }
            
        except Exception as e:
            print(f"❌ Error during prediction: {e}")
            raise
    
    def _analyze_temporal_consistency(self, predictions: List[float], num_faces: int) -> Dict[str, Any]:
        """Analyze temporal consistency across frames"""
        try:
            if num_faces == 0:
                return {"consistency_score": 0.5, "variance": 0.0, "trend": "stable"}
            
            # Group predictions by frame (assuming predictions are ordered by frame)
            frame_predictions = []
            for i in range(0, len(predictions), len(predictions) // num_faces):
                frame_preds = predictions[i:i + len(predictions) // num_faces]
                if frame_preds:
                    frame_predictions.append(np.mean(frame_preds))
            
            if len(frame_predictions) < 2:
                return {"consistency_score": 0.5, "variance": 0.0, "trend": "stable"}
            
            # Calculate variance and trend
            variance = float(np.var(frame_predictions))
            consistency_score = max(0.0, 1.0 - variance)  # Lower variance = higher consistency
            
            # Determine trend
            if len(frame_predictions) >= 3:
                first_half = np.mean(frame_predictions[:len(frame_predictions)//2])
                second_half = np.mean(frame_predictions[len(frame_predictions)//2:])
                if second_half > first_half + 0.1:
                    trend = "increasing"
                elif second_half < first_half - 0.1:
                    trend = "decreasing"
                else:
                    trend = "stable"
            else:
                trend = "stable"
            
            return {
                "consistency_score": consistency_score,
                "variance": variance,
                "trend": trend,
                "frame_predictions": frame_predictions
            }
            
        except Exception as e:
            print(f"❌ Error in temporal analysis: {e}")
            return {"consistency_score": 0.5, "variance": 0.0, "trend": "stable"}
    
    def _assess_face_quality(self, faces: List[np.ndarray]) -> Dict[str, Any]:
        """Assess the quality of detected faces with deepfake artifact detection"""
        try:
            if not faces:
                return {"quality_score": 0.0, "issues": ["no_faces"]}
            
            quality_scores = []
            issues = []
            deepfake_indicators = []
            
            for face in faces:
                # Convert to grayscale for analysis
                gray = cv2.cvtColor(face, cv2.COLOR_RGB2GRAY)
                
                # Check brightness
                brightness = np.mean(gray)
                if brightness < 50:
                    issues.append("low_brightness")
                elif brightness > 200:
                    issues.append("high_brightness")
                
                # Check contrast
                contrast = np.std(gray)
                if contrast < 20:
                    issues.append("low_contrast")
                
                # Check blur (using Laplacian variance)
                blur_score = cv2.Laplacian(gray, cv2.CV_64F).var()
                if blur_score < 100:
                    issues.append("blurry")
                
                # Check face size
                face_area = face.shape[0] * face.shape[1]
                if face_area < 10000:  # Less than 100x100 pixels
                    issues.append("small_face")
                
                # DEEPFAKE-SPECIFIC ARTIFACT DETECTION
                
                # 1. Check for unnatural sharpness (deepfakes often have inconsistent sharpness)
                sharpness_variance = cv2.Laplacian(gray, cv2.CV_64F).var()
                if sharpness_variance > 2000:  # Unusually sharp
                    deepfake_indicators.append("unnatural_sharpness")
                
                # 2. Check for color inconsistencies (deepfakes often have color artifacts)
                # Convert to different color spaces and check for inconsistencies
                hsv = cv2.cvtColor(face, cv2.COLOR_RGB2HSV)
                lab = cv2.cvtColor(face, cv2.COLOR_RGB2LAB)
                
                # Check for unusual color distributions
                hsv_std = np.std(hsv, axis=(0,1))
                lab_std = np.std(lab, axis=(0,1))
                
                if hsv_std[1] > 80 or lab_std[1] > 80:  # High saturation variance
                    deepfake_indicators.append("color_inconsistency")
                
                # 3. Check for edge artifacts (deepfakes often have unnatural edges)
                edges = cv2.Canny(gray, 50, 150)
                edge_density = np.sum(edges > 0) / (edges.shape[0] * edges.shape[1])
                
                if edge_density > 0.3:  # Too many edges (artificial)
                    deepfake_indicators.append("unnatural_edges")
                elif edge_density < 0.05:  # Too few edges (over-smoothed)
                    deepfake_indicators.append("over_smoothed")
                
                # 4. Check for frequency domain artifacts
                # Deepfakes often have unusual frequency patterns
                f_transform = np.fft.fft2(gray)
                f_shift = np.fft.fftshift(f_transform)
                magnitude_spectrum = np.log(np.abs(f_shift) + 1)
                
                # Check for unusual high-frequency content
                high_freq_energy = np.sum(magnitude_spectrum[gray.shape[0]//4:3*gray.shape[0]//4, 
                                                          gray.shape[1]//4:3*gray.shape[1]//4])
                total_energy = np.sum(magnitude_spectrum)
                
                if high_freq_energy / total_energy > 0.4:  # Unusually high high-frequency content
                    deepfake_indicators.append("frequency_artifacts")
                
                # 5. Check for texture inconsistencies
                # Deepfakes often have inconsistent texture patterns
                texture_variance = np.var(gray)
                if texture_variance < 200:  # Too uniform (artificial)
                    deepfake_indicators.append("uniform_texture")
                elif texture_variance > 2000:  # Too varied (artificial)
                    deepfake_indicators.append("inconsistent_texture")
                
                # Calculate overall quality score with deepfake penalty
                base_quality = min(1.0, (brightness / 128) * (contrast / 50) * (blur_score / 500))
                
                # Apply deepfake penalty
                deepfake_penalty = len(deepfake_indicators) * 0.1
                quality = max(0.0, base_quality - deepfake_penalty)
                quality_scores.append(quality)
            
            avg_quality = float(np.mean(quality_scores))
            unique_issues = list(set(issues))
            unique_deepfake_indicators = list(set(deepfake_indicators))
            
            # Calculate deepfake suspicion score
            deepfake_suspicion = len(unique_deepfake_indicators) / 5.0  # Normalize to 0-1
            
            print(f"🔍 Face quality analysis:")
            print(f"   Quality score: {avg_quality:.3f}")
            print(f"   Issues: {unique_issues}")
            print(f"   Deepfake indicators: {unique_deepfake_indicators}")
            print(f"   Deepfake suspicion: {deepfake_suspicion:.3f}")
            
            return {
                "quality_score": avg_quality,
                "issues": unique_issues,
                "face_count": len(faces),
                "deepfake_indicators": unique_deepfake_indicators,
                "deepfake_suspicion": deepfake_suspicion
            }
            
        except Exception as e:
            print(f"❌ Error in quality assessment: {e}")
            return {"quality_score": 0.5, "issues": ["assessment_error"]}
    
    def _make_robust_decision(self, final_prediction: float, model_predictions: List[float], 
                            temporal_consistency: Dict, face_quality: Dict) -> Dict[str, Any]:
        """Make a simple, reliable decision using basic threshold logic"""
        try:
            factors = {
                "base_prediction": final_prediction,
                "model_agreement": 0.0,
                "temporal_consistency": 0.0,
                "face_quality": 0.0,
                "deepfake_suspicion": 0.0,
                "confidence_boost": 0.0,
                "final_confidence": 0.0
            }
            
            # 1. Model Agreement Analysis
            votes = [1 if p > 0.5 else 0 for p in model_predictions]
            deepfake_votes = sum(votes)
            total_votes = len(votes)
            
            # Agreement score based on vote consistency
            if deepfake_votes == 0 or deepfake_votes == total_votes:
                agreement_score = 1.0  # Perfect agreement
            else:
                # Calculate how close to unanimous the vote is
                max_votes = max(deepfake_votes, total_votes - deepfake_votes)
                agreement_score = max_votes / total_votes
            
            factors["model_agreement"] = agreement_score
            
            # 2. Temporal Consistency Factor
            consistency_score = temporal_consistency.get("consistency_score", 0.5)
            factors["temporal_consistency"] = consistency_score
            
            # 3. Face Quality Factor
            quality_score = face_quality.get("quality_score", 0.5)
            deepfake_suspicion = face_quality.get("deepfake_suspicion", 0.0)
            factors["face_quality"] = quality_score
            factors["deepfake_suspicion"] = deepfake_suspicion
            
            # 4. HYBRID DECISION - Combine model prediction with heuristic analysis
            # Check if heuristic analysis suggests deepfake despite low model prediction
            deepfake_indicators = face_quality.get("deepfake_indicators", [])
            heuristic_evidence = len(deepfake_indicators)
            
            # If we have strong heuristic evidence, override model decision
            print(f"🎯 DECISION LOGIC DEBUG:")
            print(f"🎯 Heuristic evidence: {heuristic_evidence}")
            print(f"🎯 Deepfake suspicion: {deepfake_suspicion:.3f}")
            print(f"🎯 Condition 1 (>=3 and >0.5): {heuristic_evidence >= 3 and deepfake_suspicion > 0.5}")
            print(f"🎯 Condition 2 (>=2 and >0.4): {heuristic_evidence >= 2 and deepfake_suspicion > 0.4}")
            
            if heuristic_evidence >= 3 and deepfake_suspicion > 0.5:  # Strong heuristic evidence
                is_deepfake = True
                print(f"🎯 HEURISTIC OVERRIDE: Strong deepfake artifacts detected!")
                print(f"🎯 Artifacts found: {deepfake_indicators}")
                print(f"🎯 Suspicion score: {deepfake_suspicion:.3f}")
                # Dynamic confidence based on actual suspicion level
                base_confidence = 0.6 + (deepfake_suspicion * 0.3)  # 60-90% based on suspicion
            elif heuristic_evidence >= 2 and deepfake_suspicion > 0.4:  # Moderate heuristic evidence
                # Weighted combination: 70% heuristic, 30% model
                heuristic_score = deepfake_suspicion
                combined_score = (heuristic_score * 0.7) + (final_prediction * 0.3)
                is_deepfake = combined_score > 0.5
                print(f"🎯 WEIGHTED DECISION: Heuristic + Model combination")
                print(f"🎯 Combined score: {combined_score:.3f}")
                base_confidence = combined_score if is_deepfake else 1.0 - combined_score
            else:
                # Use model decision
                is_deepfake = final_prediction > 0.5
                base_confidence = final_prediction if is_deepfake else 1.0 - final_prediction
                print(f"🎯 MODEL DECISION: Using model prediction only")
            
            # 6. DYNAMIC CONFIDENCE BOOST based on video characteristics
            confidence_boost = 0.0
            
            # Boost confidence for strong agreement (more nuanced)
            if agreement_score > 0.9:  # 90%+ agreement
                confidence_boost += 0.15
            elif agreement_score > 0.8:  # 80%+ agreement
                confidence_boost += 0.10
            elif agreement_score > 0.6:  # 60%+ agreement
                confidence_boost += 0.05
            
            # Boost confidence for high quality (but not too much)
            if quality_score > 0.8:
                confidence_boost += 0.08
            elif quality_score > 0.6:
                confidence_boost += 0.04
            
            # Boost confidence for temporal consistency
            if consistency_score > 0.8:
                confidence_boost += 0.08
            elif consistency_score > 0.6:
                confidence_boost += 0.04
            
            # CRITICAL: Boost confidence if deepfake suspicion supports the decision
            if is_deepfake and deepfake_suspicion > 0.3:  # Deepfake detected + artifacts found
                confidence_boost += 0.15  # Strong boost for deepfake with artifacts
                print(f"🎯 DEEPFAKE ARTIFACTS DETECTED! Suspicion: {deepfake_suspicion:.3f}")
            elif not is_deepfake and deepfake_suspicion < 0.2:  # Authentic + no artifacts
                confidence_boost += 0.1  # Boost for authentic with no artifacts
            
            # Special boost for heuristic-based decisions
            if heuristic_evidence >= 3:
                confidence_boost += 0.1  # Extra boost for strong heuristic evidence
                print(f"🎯 HEURISTIC EVIDENCE BOOST: {heuristic_evidence} artifacts detected")
            
            # Reduce confidence for very poor quality (more nuanced)
            if quality_score < 0.2:
                confidence_boost -= 0.10
            elif quality_score < 0.3:
                confidence_boost -= 0.05
            elif quality_score < 0.4:
                confidence_boost -= 0.02
            
            # Reduce confidence if deepfake suspicion contradicts the decision
            if is_deepfake and deepfake_suspicion < 0.1:  # Deepfake detected but no artifacts
                confidence_boost -= 0.08
                print(f"⚠️  WARNING: Deepfake detected but no artifacts found!")
            elif not is_deepfake and deepfake_suspicion > 0.5:  # Authentic but strong artifacts
                confidence_boost -= 0.15
                print(f"⚠️  WARNING: Authentic detected but strong artifacts found!")
                print(f"⚠️  Consider manual review - artifacts suggest potential deepfake")
            elif not is_deepfake and deepfake_suspicion > 0.3:  # Authentic but moderate artifacts
                confidence_boost -= 0.08
                print(f"⚠️  WARNING: Authentic detected but artifacts found!")
            
            factors["confidence_boost"] = confidence_boost
            # Dynamic confidence cap based on evidence strength
            max_confidence = 0.99 if heuristic_evidence >= 3 else 0.95
            final_confidence = max(0.1, min(max_confidence, base_confidence + confidence_boost))
            factors["final_confidence"] = final_confidence
            
            print(f"🎯 CONFIDENCE DEBUG:")
            print(f"🎯 Base confidence: {base_confidence:.3f}")
            print(f"🎯 Confidence boost: {confidence_boost:.3f}")
            print(f"🎯 Heuristic evidence: {heuristic_evidence}")
            print(f"🎯 Max confidence cap: {max_confidence}")
            print(f"🎯 Final confidence: {final_confidence:.3f}")
            print(f"🎯 Decision factors: {factors}")
            print(f"🎯 Vote agreement: {agreement_score:.3f} ({deepfake_votes}/{total_votes} deepfake)")
            print(f"🎯 Final decision: {'DEEPFAKE' if is_deepfake else 'AUTHENTIC'} (confidence: {final_confidence:.3f})")
            print(f"🎯 Prediction: {final_prediction:.3f}")
            
            return {
                "is_deepfake": is_deepfake,
                "confidence": final_confidence,
                "factors": factors
            }
            
        except Exception as e:
            print(f"❌ Error in simple decision making: {e}")
            # Fallback to basic decision
            is_deepfake = final_prediction > 0.5
            confidence = final_prediction if is_deepfake else 1.0 - final_prediction
            return {
                "is_deepfake": is_deepfake,
                "confidence": confidence,
                "factors": {"error": str(e), "fallback": True}
            }
    
    def analyze_video(self, video_path: str) -> Dict[str, Any]:
        """Complete video analysis pipeline - optimized for speed"""
        start_time = time.time()
        try:
            # Extract faces with MORE frames for better deepfake detection
            faces = self.extract_faces_from_video(video_path, max_frames=32)
            
            if len(faces) == 0:
                # Use computer vision fallback when no faces detected
                fallback_result = self._computer_vision_fallback(video_path)
                fallback_result["processing_time"] = round(time.time() - start_time, 2)
                return fallback_result
            
            # Run prediction
            results = self.predict_on_faces(faces)
            processing_time = round(time.time() - start_time, 2)
            results["processing_time"] = processing_time
            
            print(f"🔍 Model loader processing_time: {processing_time}")
            print(f"🔍 Results keys: {list(results.keys())}")
            
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

