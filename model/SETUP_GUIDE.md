# Deepfake Video Detector - Setup Guide

## 🎯 Project Overview
This is a deepfake video detection system using PyTorch and EfficientNet models. The project is designed for long-term use with modern, supported libraries.

## 🚀 Environment Setup

### Prerequisites
- Windows 10/11
- Anaconda/Miniconda
- NVIDIA GPU with CUDA support (recommended)

### Installation Steps

1. **Create and activate conda environment:**
   ```bash
   conda create -n deepfake python=3.10 -y
   conda activate deepfake
   ```

2. **Install PyTorch with CUDA support:**
   ```bash
   pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu118
   ```

3. **Install other dependencies:**
   ```bash
   pip install tensorflow==2.10.0 keras==2.10.0 opencv-python numpy pandas tqdm scikit-learn matplotlib ffmpeg-python h5py timm
   ```

## 📁 Project Structure
```
model/
├── configs/                 # Model configuration files
├── preprocessing/           # Data preprocessing scripts
├── training/               # Training pipeline
│   ├── datasets/          # Dataset classes
│   ├── pipelines/         # Training pipelines
│   ├── tools/             # Utility tools
│   ├── transforms/        # Data transformations
│   └── zoo/               # Model architectures
├── weights/               # Model checkpoints
├── predict_folder.py      # Main prediction script
├── kernel_utils.py        # Utility functions (created)
└── requirements.txt       # Dependencies
```

## 🔧 Key Components

### 1. Model Architectures (`training/zoo/classifiers.py`)
- **DeepFakeClassifier**: Standard EfficientNet-based classifier
- **DeepFakeClassifierSRM**: With SRM (Spatial Rich Model) noise analysis
- **DeepFakeClassifierGWAP**: With Global Weighted Average Pooling

### 2. Utility Functions (`kernel_utils.py`)
- **VideoReader**: Reads and processes video frames
- **FaceExtractor**: Extracts faces from video frames
- **predict_on_video_set**: Batch prediction on multiple videos

### 3. Prediction Script (`predict_folder.py`)
Main script for running inference on test videos.

## 🎮 Usage

### Basic Prediction
```bash
python predict_folder.py --models model1.pth model2.pth --test-dir ../dataset/test_videos --output results.csv
```

### Training (if needed)
```bash
bash train.sh /path/to/data 1  # 1 GPU
```

### Preprocessing
```bash
bash preprocess_data.sh /path/to/data
```

## 🔄 Migration Notes

### What Changed
1. **Environment**: Upgraded from Python 3.7 to Python 3.10
2. **PyTorch**: Using modern PyTorch 2.6.0 with CUDA 11.8 support
3. **Dependencies**: All packages updated to latest compatible versions
4. **Added**: `kernel_utils.py` with modern video processing utilities

### Compatibility
- ✅ **PyTorch 2.6.0**: Modern, actively supported
- ✅ **Python 3.10**: Long-term support version
- ✅ **CUDA 11.8**: Compatible with modern GPUs
- ✅ **All dependencies**: Latest stable versions

## 🚨 Troubleshooting

### Common Issues

1. **CUDA not available:**
   ```bash
   python -c "import torch; print(torch.cuda.is_available())"
   ```
   If False, reinstall PyTorch with CUDA support.

2. **Import errors:**
   Make sure you're in the correct conda environment:
   ```bash
   conda activate deepfake
   ```

3. **Memory issues:**
   Reduce batch size or use CPU-only mode for testing.

### Performance Tips
- Use GPU for faster inference
- Adjust `num_workers` in prediction based on your CPU cores
- Use half precision (`model.half()`) for memory efficiency

## 📊 Model Performance
- **Architecture**: EfficientNet-B7 with custom modifications
- **Input Size**: 380x380 pixels
- **Frames per Video**: 32 (configurable)
- **Supported Formats**: MP4 videos

## 🔮 Future Maintenance
This setup is designed for long-term use:
- All packages are actively maintained
- Compatible with modern hardware
- Easy to update dependencies
- Well-documented code structure

## 📝 Notes
- The project uses PyTorch, not TensorFlow (despite the old requirements.txt)
- All video processing is handled by OpenCV
- Face detection uses Haar cascades (can be upgraded to MTCNN for better accuracy)
- Model weights should be placed in the `weights/` directory

## 🆘 Support
For issues or questions:
1. Check this documentation first
2. Verify your environment setup
3. Test with a simple video first
4. Check GPU memory usage during processing
