import cv2
import numpy as np
import torch
from torch.utils.data import Dataset, DataLoader
from torchvision import transforms
import os
from typing import List, Callable, Tuple
import pandas as pd
from tqdm import tqdm
import multiprocessing as mp
from functools import partial


class VideoReader:
    """Utility class for reading video frames."""
    
    def __init__(self):
        self.transform = transforms.Compose([
            transforms.ToPILImage(),
            transforms.Resize((380, 380)),
            transforms.ToTensor(),
            transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
        ])
    
    def read_frames(self, video_path: str, num_frames: int = 32) -> List[np.ndarray]:
        """Read frames from video file."""
        cap = cv2.VideoCapture(video_path)
        frames = []
        
        total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
        frame_indices = np.linspace(0, total_frames - 1, num_frames, dtype=int)
        
        for frame_idx in frame_indices:
            cap.set(cv2.CAP_PROP_POS_FRAMES, frame_idx)
            ret, frame = cap.read()
            if ret:
                frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
                frames.append(frame)
        
        cap.release()
        return frames


class FaceExtractor:
    """Extract faces from video frames."""
    
    def __init__(self, video_read_fn: Callable):
        self.video_read_fn = video_read_fn
        self.face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
    
    def extract_faces(self, video_path: str) -> List[np.ndarray]:
        """Extract faces from video frames."""
        frames = self.video_read_fn(video_path)
        faces = []
        
        for frame in frames:
            gray = cv2.cvtColor(frame, cv2.COLOR_RGB2GRAY)
            detected_faces = self.face_cascade.detectMultiScale(gray, 1.1, 4)
            
            if len(detected_faces) > 0:
                # Use the largest face
                largest_face = max(detected_faces, key=lambda x: x[2] * x[3])
                x, y, w, h = largest_face
                face = frame[y:y+h, x:x+w]
                face = cv2.resize(face, (380, 380))
                faces.append(face)
            else:
                # If no face detected, use the center crop of the frame
                h, w = frame.shape[:2]
                center_crop = frame[h//4:3*h//4, w//4:3*w//4]
                center_crop = cv2.resize(center_crop, (380, 380))
                faces.append(center_crop)
        
        return faces


def confident_strategy(predictions: List[float]) -> float:
    """Strategy for combining predictions from multiple models."""
    predictions = np.array(predictions)
    # Use mean of predictions as the final prediction
    return float(np.mean(predictions))


def predict_single_video(args: Tuple) -> Tuple[str, float]:
    """Predict on a single video."""
    video_path, face_extractor, models, input_size, frames_per_video, test_dir = args
    
    try:
        # Extract faces from video
        faces = face_extractor.extract_faces(os.path.join(test_dir, video_path))
        
        if len(faces) == 0:
            return video_path, 0.5  # Default prediction if no faces found
        
        # Convert faces to tensors
        face_tensors = []
        for face in faces:
            face_tensor = torch.from_numpy(face).permute(2, 0, 1).float() / 255.0
            face_tensor = transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])(face_tensor)
            face_tensors.append(face_tensor)
        
        # Stack faces into batch
        batch = torch.stack(face_tensors).unsqueeze(0)  # [1, num_faces, 3, 380, 380]
        
        # Get predictions from all models
        model_predictions = []
        for model in models:
            model.eval()
            with torch.no_grad():
                # Process each face separately and average
                face_predictions = []
                for i in range(batch.shape[1]):
                    single_face = batch[:, i:i+1]  # [1, 1, 3, 380, 380]
                    single_face = single_face.squeeze(1)  # [1, 3, 380, 380]
                    pred = model(single_face.cuda())
                    face_predictions.append(torch.sigmoid(pred).cpu().item())
                
                model_predictions.append(np.mean(face_predictions))
        
        # Combine predictions using strategy
        final_prediction = confident_strategy(model_predictions)
        return video_path, final_prediction
        
    except Exception as e:
        print(f"Error processing {video_path}: {e}")
        return video_path, 0.5  # Default prediction on error


def predict_on_video_set(face_extractor: FaceExtractor, 
                        input_size: int, 
                        models: List[torch.nn.Module], 
                        strategy: Callable, 
                        frames_per_video: int, 
                        videos: List[str], 
                        num_workers: int, 
                        test_dir: str) -> List[float]:
    """Predict on a set of videos using multiple models."""
    
    # Prepare arguments for multiprocessing
    args_list = [(video, face_extractor, models, input_size, frames_per_video, test_dir) 
                 for video in videos]
    
    # Use multiprocessing for parallel processing
    with mp.Pool(processes=num_workers) as pool:
        results = list(tqdm(pool.imap(predict_single_video, args_list), 
                           total=len(videos), 
                           desc="Processing videos"))
    
    # Sort results by video name to maintain order
    results.sort(key=lambda x: x[0])
    predictions = [result[1] for result in results]
    
    return predictions
