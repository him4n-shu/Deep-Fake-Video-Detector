import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { buildApiUrl, API_ENDPOINTS } from '../config/api';

const VideoUpload = ({ onAnalysisComplete, onViewChange }) => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [electionContext, setElectionContext] = useState('');
  const [candidateName, setCandidateName] = useState('');
  const [constituency, setConstituency] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const handleFileSelect = (selectedFile) => {
    if (selectedFile && selectedFile.type.startsWith('video/')) {
      setFile(selectedFile);
    } else {
      alert('Please select a valid video file (MP4, AVI, MOV, etc.)');
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!file) {
      alert('Please select a video file');
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);
      if (electionContext) formData.append('election_context', electionContext);
      if (candidateName) formData.append('candidate_name', candidateName);
      if (constituency) formData.append('constituency', constituency);

      const response = await fetch(buildApiUrl(API_ENDPOINTS.ANALYZE_VIDEO), {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      onAnalysisComplete(result);
      navigate('/results');
      
    } catch (error) {
      console.error('Error analyzing video:', error);
      alert('Error analyzing video. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const resetForm = () => {
    setFile(null);
    setElectionContext('');
    setCandidateName('');
    setConstituency('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="max-w-5xl mx-auto fade-in-scale">
      <div className="glass rounded-2xl shadow-2xl p-10 border border-white/20">
        <div className="text-center mb-10 slide-in-left">
          <h2 className="text-5xl font-bold mb-4">
            <span className="gradient-text">Video</span>
            <span className="text-green-600 ml-2">Analysis</span>
            <span className="ml-4 text-4xl float-animation">📹</span>
          </h2>
          <p className="text-xl text-gray-600 mb-6 max-w-2xl mx-auto">
            Upload your video for advanced deepfake detection and analysis
          </p>
          <div className="flex items-center justify-center space-x-4 text-sm fade-in-up" style={{animationDelay: '0.3s'}}>
            <span className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-full font-medium shadow-lg hover:shadow-xl transition-shadow pulse-animation">
              AI-Powered
            </span>
            <span className="bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 rounded-full font-medium shadow-lg hover:shadow-xl transition-shadow pulse-animation" style={{animationDelay: '0.5s'}}>
              Secure
            </span>
            <span className="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-4 py-2 rounded-full font-medium shadow-lg hover:shadow-xl transition-shadow pulse-animation" style={{animationDelay: '1s'}}>
              Fast Results
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* File Upload Area */}
          <div
            className={`relative border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-500 group fade-in-up ${
              dragActive
                ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-purple-50 scale-105'
                : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50/50 hover:scale-102'
            }`}
            style={{animationDelay: '0.4s'}}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="video/*"
              onChange={(e) => handleFileSelect(e.target.files[0])}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            
            {file ? (
              <div className="space-y-2">
                <div className="text-green-600">
                  <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-lg font-medium text-gray-800">{file.name}</p>
                <p className="text-sm text-gray-500">
                  {(file.size / (1024 * 1024)).toFixed(2)} MB
                </p>
                <button
                  type="button"
                  onClick={resetForm}
                  className="text-red-600 hover:text-red-800 text-sm"
                >
                  Remove file
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="text-gray-400">
                  <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                </div>
                <p className="text-lg font-medium text-gray-600">
                  Drop your video here or click to browse
                </p>
                <p className="text-sm text-gray-500">
                  Supports MP4, AVI, MOV, and other video formats
                </p>
              </div>
            )}
          </div>

          {/* Additional Details */}
          <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <span className="mr-2">📋</span>
              Additional Details (Optional)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Election Context
                </label>
                <input
                  type="text"
                  value={electionContext}
                  onChange={(e) => setElectionContext(e.target.value)}
                  placeholder="e.g., 2024 General Elections"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Candidate Name
                    </label>
                    <input
                      type="text"
                      value={candidateName}
                      onChange={(e) => setCandidateName(e.target.value)}
                      placeholder="e.g., Narendra Modi"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Constituency
                </label>
                <input
                  type="text"
                  value={constituency}
                  onChange={(e) => setConstituency(e.target.value)}
                  placeholder="e.g., District 1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-center fade-in-up" style={{animationDelay: '0.8s'}}>
            <button
              type="submit"
              disabled={!file || uploading}
              className={`px-12 py-5 rounded-2xl font-bold text-xl transition-all shadow-2xl relative overflow-hidden group ${
                !file || uploading
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-white text-blue-600 border-2 border-blue-600 hover:bg-blue-50 hover:shadow-3xl transform hover:scale-105'
              }`}
            >
              {uploading ? (
                <div className="flex items-center space-x-4 text-blue-600">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                  <span className="text-blue-600">Analyzing Video... 🔍</span>
                </div>
              ) : (
                <span className="flex items-center space-x-3 relative z-10 text-blue-600">
                  <span className="text-blue-600">Analyze Video</span>
                  <span className="text-2xl group-hover:scale-110 transition-transform">🚀</span>
                </span>
              )}
            </button>
          </div>
        </form>

        {/* Information Panel */}
        <div className="mt-8 bg-gray-50 border border-gray-200 rounded-lg p-6">
          <h3 className="font-bold text-gray-800 mb-3 flex items-center">
            <span className="mr-2">ℹ️</span>
            Analysis Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
            <ul className="space-y-2">
              <li className="flex items-center">
                <span className="text-blue-600 mr-2">✓</span>
                Videos are analyzed using advanced AI models
              </li>
              <li className="flex items-center">
                <span className="text-blue-600 mr-2">✓</span>
                Results stored with tamper-proof verification
              </li>
            </ul>
            <ul className="space-y-2">
              <li className="flex items-center">
                <span className="text-blue-600 mr-2">✓</span>
                Analysis typically takes 30-60 seconds
              </li>
              <li className="flex items-center">
                <span className="text-blue-600 mr-2">✓</span>
                All data processed locally for privacy
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoUpload;
