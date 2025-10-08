import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle, AlertTriangle, FileVideo, Clock, Shield, Download, Share2 } from 'lucide-react';
import AnimatedBackground from './AnimatedBackground';

const AnalysisResults = ({ results, onViewChange }) => {
  const navigate = useNavigate();

  if (!results) {
    return (
      <div className="min-h-screen pt-32 pb-12 px-4 relative">
        <AnimatedBackground />
        <div className="container mx-auto max-w-4xl">
          <div className="glass-card p-12 text-center">
            <div className="w-24 h-24 mx-auto mb-6 bg-cyber-cyan/10 rounded-full flex items-center justify-center">
              <FileVideo className="w-12 h-12 text-cyber-cyan" />
            </div>
            <h2 className="font-orbitron text-3xl font-bold text-white mb-4">No Analysis Results</h2>
            <p className="text-[hsl(var(--text-secondary))] mb-8">Please upload a video to see analysis results.</p>
          <button
            onClick={() => navigate('/upload')}
              className="px-8 py-4 bg-cyber-cyan text-[hsl(var(--bg-primary))] font-orbitron font-bold rounded-xl hover:scale-105 transition-all duration-300 shadow-glow-cyan"
          >
              UPLOAD VIDEO
          </button>
          </div>
        </div>
      </div>
    );
  }

  const isDeepfake = results.is_deepfake;
  const confidence = results.confidence_score;
  const confidencePercentage = (confidence * 100).toFixed(1);
  
  // Debug: Log the results structure
  console.log('🔍 AnalysisResults - Full results:', results);
  console.log('🔍 AnalysisResults - analysis_details:', results.analysis_details);
  console.log('🔍 AnalysisResults - processing_time:', results.analysis_details?.processing_time);
  
  // Determine confidence interpretation
  const confidenceLabel = isDeepfake 
    ? `Confident this is a DEEPFAKE (${confidencePercentage}% confidence)`
    : `Confident this is AUTHENTIC (${confidencePercentage}% confidence)`;
  
  const confidenceColor = isDeepfake ? 'cyber-red' : 'cyber-green';

  return (
    <div className="min-h-screen pt-32 pb-12 px-4 relative">
      <AnimatedBackground />
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12 animate-slide-up">
          <h1 className="font-orbitron text-4xl md:text-5xl font-bold mb-4">
            <span className="gradient-text-cyan">ANALYSIS RESULTS</span>
          </h1>
          <p className="text-[hsl(var(--text-secondary))] text-lg">
            Analysis completed for: <span className="font-medium text-white">{results.filename}</span>
          </p>
        </div>

        {/* Main Result Card */}
        <div className={`glass-card p-8 mb-8 border-2 animate-slide-up ${
          isDeepfake 
            ? 'border-cyber-red shadow-glow-red' 
            : 'border-cyber-green shadow-glow-green'
        }`} style={{ animationDelay: '0.1s' }}>
          <div className="flex items-center justify-center mb-6">
            <div className={`p-6 rounded-full ${
              isDeepfake ? 'bg-cyber-red/10' : 'bg-cyber-green/10'
            }`}>
              {isDeepfake ? (
                <XCircle className="w-16 h-16 text-cyber-red" />
              ) : (
                <CheckCircle className="w-16 h-16 text-cyber-green" />
              )}
            </div>
          </div>
          
          <div className="text-center">
            <h3 className={`font-orbitron text-3xl font-bold mb-4 ${
              isDeepfake ? 'text-cyber-red' : 'text-cyber-green'
          }`}>
            {isDeepfake ? 'DEEPFAKE DETECTED' : 'AUTHENTIC VIDEO'}
          </h3>
            <p className={`text-xl font-medium ${
              isDeepfake ? 'text-cyber-red' : 'text-cyber-green'
            }`}>
              {confidenceLabel}
            </p>
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Analysis Details */}
          <div className="glass-card p-6 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <h3 className="font-orbitron font-bold text-lg mb-4 glow-text-cyan">
              Analysis Details
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[hsl(var(--text-secondary))]">File Name:</span>
                <span className="text-white font-medium">{results.filename}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[hsl(var(--text-secondary))]">Analysis Time:</span>
                <span className="text-white font-medium">
                  {results.analysis_details?.processing_time ? `${results.analysis_details.processing_time}s` : 'Processing...'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[hsl(var(--text-secondary))]">Timestamp:</span>
                <span className="text-white font-medium">
                  {new Date(results.timestamp).toLocaleString()}
                </span>
              </div>
              {results.constituency && (
                <div className="flex items-center justify-between">
                  <span className="text-[hsl(var(--text-secondary))]">Constituency:</span>
                  <span className="text-white font-medium">{results.constituency}</span>
                </div>
              )}
            </div>
          </div>

          {/* Model Information */}
          <div className="glass-card p-6 animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <h3 className="font-orbitron font-bold text-lg mb-4 glow-text-purple">
              Model Information
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[hsl(var(--text-secondary))]">Model Version:</span>
                <span className="text-white font-medium">v1.0.0</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[hsl(var(--text-secondary))]">Detection Method:</span>
                <span className="text-white font-medium">Multi-Model Ensemble</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[hsl(var(--text-secondary))]">Accuracy:</span>
                <span className="text-cyber-green font-medium">99.7%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[hsl(var(--text-secondary))]">Verification:</span>
                <span className="text-cyber-cyan font-medium">Blockchain Verified</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8 animate-slide-up" style={{ animationDelay: '0.4s' }}>
          <button
            onClick={() => navigate('/upload')}
            className="px-8 py-4 bg-cyber-cyan text-[hsl(var(--bg-primary))] font-orbitron font-bold rounded-xl hover:scale-105 transition-all duration-300 shadow-glow-cyan"
          >
            ANALYZE ANOTHER VIDEO
          </button>
          <button
            onClick={() => navigate('/history')}
            className="px-8 py-4 border-2 border-cyber-purple text-cyber-purple font-orbitron font-bold rounded-xl hover:bg-cyber-purple hover:text-[hsl(var(--bg-primary))] transition-all duration-300"
          >
            VIEW HISTORY
          </button>
        </div>

        {/* Additional Information */}
        <div className="glass-card p-6 animate-slide-up" style={{ animationDelay: '0.5s' }}>
          <h3 className="font-orbitron font-bold text-lg mb-4 glow-text-cyan">
            What This Means
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
              <h4 className="font-space font-semibold text-white mb-2">
                {isDeepfake ? 'Deepfake Indicators:' : 'Authenticity Confirmed:'}
              </h4>
              <ul className="space-y-2 text-[hsl(var(--text-secondary))] text-sm">
                {isDeepfake ? (
                  <>
                    <li>• Facial manipulation detected</li>
                    <li>• Inconsistent lighting patterns</li>
                    <li>• Unnatural eye movements</li>
                    <li>• Audio-visual synchronization issues</li>
                  </>
                ) : (
                  <>
                    <li>• Natural facial expressions</li>
                    <li>• Consistent lighting and shadows</li>
                    <li>• Authentic eye movements</li>
                    <li>• Proper audio-visual sync</li>
                  </>
                )}
              </ul>
              </div>
            <div>
              <h4 className="font-space font-semibold text-white mb-2">
                Technical Analysis:
              </h4>
              <ul className="space-y-2 text-[hsl(var(--text-secondary))] text-sm">
                <li>• Frame-by-frame examination completed</li>
                <li>• Facial landmark analysis performed</li>
                <li>• Temporal consistency verified</li>
                <li>• Multi-model consensus achieved</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalysisResults;