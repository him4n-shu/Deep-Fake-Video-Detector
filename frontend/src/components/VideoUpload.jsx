import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, X, CheckCircle, FileVideo, Loader2, AlertCircle, User } from 'lucide-react';
import { buildApiUrl, API_ENDPOINTS } from '../config/api';
import { toast } from 'sonner';
import AnimatedBackground from './AnimatedBackground';
import UserInfoForm from './UserInfoForm';
import { saveUserInfo, loadUserInfo, clearUserInfo } from '../utils/userStorage';

const VideoUpload = ({ onAnalysisComplete, onViewChange }) => {
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showUserForm, setShowUserForm] = useState(false);
  const [userInfo, setUserInfo] = useState(() => {
    // Load user info from localStorage on component mount
    return loadUserInfo();
  });
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  // Ensure user info is loaded on component mount
  useEffect(() => {
    if (!userInfo) {
      const loadedUserInfo = loadUserInfo();
      if (loadedUserInfo) {
        setUserInfo(loadedUserInfo);
      }
    }
  }, [userInfo]);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };
  
  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type.startsWith('video/')) {
      setFile(droppedFile);
      toast.success('Video uploaded successfully!');
    } else {
      toast.error('Please upload a valid video file');
    }
  };
  
  const handleFileSelect = (e) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      toast.success('Video uploaded successfully!');
    }
  };
  
  const handleRemoveFile = () => {
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleUserInfoSubmit = async (userData) => {
    try {
      const response = await fetch(buildApiUrl(API_ENDPOINTS.USERS), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const user = await response.json();
      setUserInfo(user);
      
      // Save user info to localStorage for persistence
      saveUserInfo(user);
      
      setShowUserForm(false);
      return user;
    } catch (error) {
      console.error('Error saving user info:', error);
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!file) {
      toast.error('Please select a video file');
      return;
    }

    // If no user info, show the form first
    if (!userInfo) {
      setShowUserForm(true);
      return;
    }

    setIsAnalyzing(true);
    toast.loading('Analyzing video...');

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('user_id', userInfo.id);

      const response = await fetch(buildApiUrl(API_ENDPOINTS.ANALYZE_VIDEO), {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      // Debug: Log the API response
      console.log('🔍 VideoUpload - API Response:', result);
      console.log('🔍 VideoUpload - analysis_details:', result.analysis_details);
      console.log('🔍 VideoUpload - processing_time:', result.analysis_details?.processing_time);
      
      toast.dismiss();
      toast.success('Analysis complete!');
      onAnalysisComplete(result);
      navigate('/results');
      
    } catch (error) {
      console.error('Error analyzing video:', error);
      toast.dismiss();
      toast.error('Error analyzing video. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };
  
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div className="min-h-screen pt-32 pb-12 px-4 relative">
      <AnimatedBackground />
      
      {/* User Info Form Modal */}
      {showUserForm && (
        <UserInfoForm
          onUserInfoSubmit={handleUserInfoSubmit}
          onClose={() => setShowUserForm(false)}
        />
      )}
      
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12 animate-slide-up">
          <h1 className="font-orbitron text-4xl md:text-5xl font-bold mb-4">
            <span className="gradient-text-cyan">VIDEO ANALYSIS</span>
          </h1>
          <p className="text-[hsl(var(--text-secondary))] text-lg">
            Upload your video for instant deepfake detection
          </p>
          
          {/* User Info Display */}
          {userInfo && (
            <div className="mt-6 inline-flex items-center gap-3 px-4 py-2 glass-card rounded-lg">
              <div className="w-8 h-8 bg-cyber-cyan/20 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-cyber-cyan" />
              </div>
              <div className="text-left">
                <p className="text-white text-sm font-medium">{userInfo.name}</p>
                <p className="text-[hsl(var(--text-muted))] text-xs">{userInfo.email}</p>
              </div>
              <button
                onClick={() => {
                  clearUserInfo();
                  setUserInfo(null);
                  setShowUserForm(true);
                }}
                className="text-[hsl(var(--text-muted))] hover:text-cyber-cyan text-xs transition-colors"
                title="Update user information"
              >
                Update
              </button>
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Upload Zone */}
          <div className="mb-8 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            {!file ? (
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`glass-card p-12 text-center cursor-pointer transition-all duration-300 ${
                  isDragging
                    ? 'border-cyber-cyan border-2 shadow-glow-cyan'
                    : 'border-[hsl(var(--border-glow))] border-2 border-dashed hover:border-cyber-cyan'
                }`}
              >
                <Upload className={`w-16 h-16 mx-auto mb-4 ${isDragging ? 'text-cyber-cyan' : 'text-[hsl(var(--text-secondary))]'}`} />
                <h3 className="font-orbitron text-xl font-bold mb-2 text-white">
                  Drop your video here
                </h3>
                <p className="text-[hsl(var(--text-secondary))] mb-4">
                  or click to browse
                </p>
                <p className="text-[hsl(var(--text-muted))] text-sm">
                  Supported formats: MP4, AVI, MOV, MKV • Max size: 500MB
                </p>
            <input
              ref={fileInputRef}
              type="file"
              accept="video/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </div>
            ) : (
              <div className="glass-card p-8">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 bg-cyber-green/10 rounded-xl flex items-center justify-center">
                      <FileVideo className="w-8 h-8 text-cyber-green" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div>
                        <h3 className="font-space font-semibold text-white truncate">
                          {file.name}
                        </h3>
                        <p className="text-[hsl(var(--text-muted))] text-sm">
                          {formatFileSize(file.size)}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={handleRemoveFile}
                        className="p-2 hover:bg-[hsl(var(--bg-secondary))] rounded-lg transition-colors text-cyber-red"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                    <div className="flex items-center gap-2 text-cyber-green text-sm">
                      <CheckCircle className="w-4 h-4" />
                      <span>Ready for analysis</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>


          {/* Analyze Button */}
          <div className="text-center mb-16 animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <button
              type="submit"
              disabled={!file || isAnalyzing}
              className={`px-12 py-4 rounded-xl font-orbitron font-bold text-lg transition-all duration-300 ${
                file && !isAnalyzing
                  ? 'bg-cyber-cyan text-[hsl(var(--bg-primary))] hover:scale-105 shadow-glow-cyan cursor-pointer'
                  : 'bg-[hsl(var(--bg-secondary))] text-[hsl(var(--text-muted))] cursor-not-allowed'
              }`}
            >
              {isAnalyzing ? (
                <span className="flex items-center gap-3">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  ANALYZING VIDEO...
                </span>
              ) : (
                'START ANALYSIS'
              )}
            </button>
          </div>
        </form>

        {/* Info Panel */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-slide-up mt-8" style={{ animationDelay: '0.4s' }}>
          <div className="glass-card p-6">
            <h3 className="font-orbitron font-bold text-lg mb-4 glow-text-cyan">
              Detection Features
          </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-cyber-green flex-shrink-0 mt-0.5" />
                <span className="text-[hsl(var(--text-secondary))] text-sm">
                  Multi-model AI analysis
                </span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-cyber-green flex-shrink-0 mt-0.5" />
                <span className="text-[hsl(var(--text-secondary))] text-sm">
                  Frame-by-frame examination
                </span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-cyber-green flex-shrink-0 mt-0.5" />
                <span className="text-[hsl(var(--text-secondary))] text-sm">
                  Facial and voice verification
                </span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-cyber-green flex-shrink-0 mt-0.5" />
                <span className="text-[hsl(var(--text-secondary))] text-sm">
                  Blockchain-verified results
                </span>
              </li>
            </ul>
          </div>
          
          <div className="glass-card p-6">
            <h3 className="font-orbitron font-bold text-lg mb-4 glow-text-purple">
              Processing Info
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-cyber-purple flex-shrink-0 mt-0.5" />
                <span className="text-[hsl(var(--text-secondary))] text-sm">
                  Average processing time: 30-90 seconds
                </span>
              </li>
              <li className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-cyber-purple flex-shrink-0 mt-0.5" />
                <span className="text-[hsl(var(--text-secondary))] text-sm">
                  All uploads are encrypted and secure
                </span>
              </li>
              <li className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-cyber-purple flex-shrink-0 mt-0.5" />
                <span className="text-[hsl(var(--text-secondary))] text-sm">
                  Videos are automatically deleted after 24 hours
                </span>
              </li>
              <li className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-cyber-purple flex-shrink-0 mt-0.5" />
                <span className="text-[hsl(var(--text-secondary))] text-sm">
                  Results stored in your history dashboard
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoUpload;
