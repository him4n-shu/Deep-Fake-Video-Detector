# 🇮🇳 Indian Election Deepfake Detection System

A comprehensive AI-powered system to detect and verify deepfake videos in Indian election campaigns with tamper-proof verification and local storage.

## 🎯 Features

- **🤖 AI-Powered Detection**: Advanced deep learning models for deepfake detection
- **🔒 Tamper-Proof Verification**: Blockchain-based verification hashes
- **💾 Local Storage**: Secure local database for verification results
- **🌐 User-Friendly Interface**: Modern React web interface
- **⚡ Real-Time Analysis**: Fast video processing and analysis
- **📊 Comprehensive Statistics**: Detailed analytics and reporting
- **🏛️ Election Context**: Support for constituency and candidate tracking

## 🏗️ System Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React Frontend │    │  FastAPI Backend │    │  AI Model Core  │
│   (User Interface)│◄──►│  (API & Logic)  │◄──►│  (Deepfake Det.)│
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       ▼                       │
         │              ┌─────────────────┐              │
         │              │ Local Database  │              │
         │              │ (Verification)  │              │
         │              └─────────────────┘              │
         │                       │                       │
         └───────────────────────▼───────────────────────┘
                        ┌─────────────────┐
                        │ Blockchain Hash │
                        │ (Tamper Proof)  │
                        └─────────────────┘
```

## 🚀 Quick Start

### Prerequisites
- Python 3.10+
- Node.js 16+
- Conda/Miniconda
- NVIDIA GPU (recommended for faster processing)

### 1. Backend Setup

```bash
# Activate conda environment
conda activate deepfake

# Install backend dependencies
cd backend
pip install -r requirements.txt

# Start the backend server
python main.py
```

The backend will be available at `http://localhost:8000`

### 2. Frontend Setup

```bash
# Install frontend dependencies
cd frontend
npm install

# Start the development server
npm run dev
```

The frontend will be available at `http://localhost:5173`

### 3. Model Setup

```bash
# Ensure you're in the model directory with the conda environment activated
cd model

# The AI models should be placed in the weights/ directory
# For now, the system uses mock detection for demonstration
```

## 📁 Project Structure

```
deepfake_video_dector_dev/
├── backend/                 # FastAPI backend
│   ├── main.py             # Main API server
│   ├── database.py         # Database models and connection
│   ├── models.py           # Pydantic models
│   ├── schemas.py          # API schemas
│   ├── services.py         # Business logic services
│   └── requirements.txt    # Python dependencies
├── frontend/               # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   │   ├── Header.jsx
│   │   │   ├── VideoUpload.jsx
│   │   │   ├── AnalysisResults.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── VerificationHistory.jsx
│   │   │   └── Statistics.jsx
│   │   └── App.jsx         # Main app component
│   └── package.json        # Node.js dependencies
├── model/                  # AI model core
│   ├── training/           # Model training code
│   ├── preprocessing/      # Data preprocessing
│   ├── weights/            # Trained model weights
│   ├── kernel_utils.py     # Video processing utilities
│   └── predict_folder.py   # Prediction script
└── dataset/                # Sample videos for testing
    ├── test_videos/        # Test video files
    └── train_videos/       # Training video files
```

## 🔧 API Endpoints

### Core Endpoints

- `POST /analyze-video` - Upload and analyze video for deepfakes
- `GET /verification/{analysis_id}` - Get verification record by ID
- `GET /verifications` - Get all verification records with filtering
- `GET /statistics` - Get system statistics and analytics
- `GET /health` - Health check endpoint

### Example Usage

```bash
# Analyze a video
curl -X POST "http://localhost:8000/analyze-video" \
  -F "file=@video.mp4" \
  -F "election_context=2024 General Elections" \
  -F "candidate_name=Narendra Modi" \
  -F "constituency=Varanasi"

# Get statistics
curl "http://localhost:8000/statistics"
```

## 🎮 Usage Guide

### 1. Upload Video
- Navigate to the Upload Video page
- Drag and drop or select a video file
- Optionally add election context (constituency, candidate name)
- Click "Analyze Video"

### 2. View Results
- See real-time analysis results
- View confidence scores and technical details
- Access tamper-proof verification hash
- Print or export results

### 3. Track History
- View all previous verifications
- Filter by constituency, candidate, or result type
- Export data as CSV
- Monitor system performance

### 4. Analytics Dashboard
- View comprehensive statistics
- Track deepfake detection rates
- Monitor constituency-wise analysis
- Assess risk levels

## 🔒 Security Features

### Tamper-Proof Verification
- Each analysis generates a unique blockchain hash
- Verification records are cryptographically secured
- Integrity can be verified at any time
- Prevents data tampering and manipulation

### Local Storage
- All data stored locally in SQLite database
- No external data transmission
- Complete privacy and control
- GDPR compliant

## 🤖 AI Model Details

### Current Implementation
- **Architecture**: EfficientNet-B7 based classifier
- **Input**: 380x380 pixel face crops
- **Processing**: 32 frames per video
- **Output**: Binary classification with confidence score

### Model Training
```bash
# Train new models (when training data is available)
cd model
bash train.sh /path/to/data 1  # 1 GPU
```

### Adding New Models
1. Place trained model weights in `model/weights/`
2. Update model loading in `backend/services.py`
3. Restart the backend server

## 📊 Database Schema

### VerificationRecord
- `analysis_id`: Unique identifier
- `filename`: Original video filename
- `file_hash`: SHA256 hash of video file
- `verification_hash`: Blockchain verification hash
- `is_deepfake`: Boolean detection result
- `confidence_score`: Detection confidence (0-1)
- `election_context`: Election context metadata
- `candidate_name`: Candidate name
- `constituency`: Constituency name
- `analysis_details`: Detailed analysis results (JSON)
- `created_at`: Timestamp
- `updated_at`: Last updated timestamp

## 🚀 Deployment

### Production Setup

1. **Backend Deployment**:
   ```bash
   # Install production dependencies
   pip install gunicorn
   
   # Run with Gunicorn
   gunicorn -w 4 -k uvicorn.workers.UvicornWorker main:app
   ```

2. **Frontend Deployment**:
   ```bash
   # Build for production
   npm run build
   
   # Serve with nginx or similar
   ```

3. **Database**:
   - SQLite for development
   - PostgreSQL for production (recommended)

### Docker Deployment
```dockerfile
# Backend Dockerfile
FROM python:3.10-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

## 🔧 Configuration

### Environment Variables
```bash
# Backend configuration
DATABASE_URL=sqlite:///./election_deepfake.db
SECRET_KEY=your-secret-key
DEBUG=False

# Model configuration
MODEL_WEIGHTS_DIR=../model/weights
CUDA_AVAILABLE=True
```

## 🧪 Testing

### Backend Testing
```bash
cd backend
python -m pytest tests/
```

### Frontend Testing
```bash
cd frontend
npm test
```

### Integration Testing
```bash
# Test video upload and analysis
curl -X POST "http://localhost:8000/analyze-video" \
  -F "file=@../dataset/test_videos/sample.mp4"
```

## 📈 Performance Optimization

### Backend Optimization
- Use GPU acceleration for model inference
- Implement caching for repeated analyses
- Optimize database queries
- Use connection pooling

### Frontend Optimization
- Implement lazy loading
- Use React.memo for components
- Optimize bundle size
- Implement service workers

## 🐛 Troubleshooting

### Common Issues

1. **CUDA not available**:
   ```bash
   python -c "import torch; print(torch.cuda.is_available())"
   ```

2. **Model loading errors**:
   - Check if model weights exist in `model/weights/`
   - Verify model architecture compatibility

3. **Database connection issues**:
   - Check SQLite file permissions
   - Verify database path in configuration

4. **Frontend build errors**:
   ```bash
   npm install --force
   npm run build
   ```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- EfficientNet architecture by Google Research
- PyTorch and FastAPI communities
- React and Tailwind CSS teams
- Indian election commission for inspiration

## 📞 Support

For support and questions:
- Create an issue on GitHub
- Check the documentation
- Review the troubleshooting guide

---

**Built with ❤️ for Indian Democracy**
