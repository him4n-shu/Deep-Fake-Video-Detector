import React from 'react';
import { useNavigate } from 'react-router-dom';

const AnalysisResults = ({ results, onViewChange }) => {
  const navigate = useNavigate();

  if (!results) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">No Analysis Results</h2>
          <p className="text-gray-600 mb-6">Please upload a video to see analysis results.</p>
          <button
            onClick={() => navigate('/upload')}
            className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Upload Video
          </button>
        </div>
      </div>
    );
  }

  const isDeepfake = results.is_deepfake;
  const confidence = results.confidence_score;
  const confidencePercentage = (confidence * 100).toFixed(1);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-xl shadow-lg p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            Analysis Results
          </h2>
          <p className="text-gray-600">
            Analysis completed for: <span className="font-medium">{results.filename}</span>
          </p>
        </div>

        {/* Main Result Card */}
        <div className={`rounded-xl p-6 mb-6 border-2 ${
          isDeepfake 
            ? 'bg-red-50 border-red-200' 
            : 'bg-green-50 border-green-200'
        }`}>
          <div className="flex items-center justify-center mb-4">
            <div className={`p-4 rounded-full ${
              isDeepfake ? 'bg-red-100' : 'bg-green-100'
            }`}>
              {isDeepfake ? (
                <svg className="w-12 h-12 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              ) : (
                <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
            </div>
          </div>
          
          <h3 className={`text-2xl font-bold text-center mb-2 ${
            isDeepfake ? 'text-red-800' : 'text-green-800'
          }`}>
            {isDeepfake ? 'DEEPFAKE DETECTED' : 'AUTHENTIC VIDEO'}
          </h3>
          
          <p className={`text-center text-lg ${
            isDeepfake ? 'text-red-600' : 'text-green-600'
          }`}>
            Confidence: {confidencePercentage}%
          </p>
        </div>

        {/* Confidence Bar */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">Confidence Level</span>
            <span className="text-sm text-gray-500">{confidencePercentage}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className={`h-3 rounded-full transition-all duration-500 ${
                isDeepfake ? 'bg-red-500' : 'bg-green-500'
              }`}
              style={{ width: `${confidencePercentage}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>Low</span>
            <span>High</span>
          </div>
        </div>

        {/* Analysis Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium text-gray-800 mb-3">Analysis Information</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Analysis ID:</span>
                <span className="font-mono text-xs">{results.analysis_id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Timestamp:</span>
                <span>{new Date(results.timestamp).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Method:</span>
                <span>{results.analysis_details?.analysis_method || 'Unknown'}</span>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium text-gray-800 mb-3">Verification</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Verification Hash:</span>
                <span className="font-mono text-xs break-all">
                  {results.verification_hash.substring(0, 16)}...
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Status:</span>
                <span className="text-green-600 font-medium">Verified</span>
              </div>
            </div>
          </div>
        </div>

        {/* Technical Details */}
        {results.analysis_details && (
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h4 className="font-medium text-gray-800 mb-3">Technical Details</h4>
            <div className="text-sm text-gray-600 space-y-1">
              {results.analysis_details.faces_analyzed && (
                <p>Faces analyzed: {results.analysis_details.faces_analyzed}</p>
              )}
              {results.analysis_details.models_used && (
                <p>Models used: {results.analysis_details.models_used}</p>
              )}
              {results.analysis_details.video_properties && (
                <div>
                  <p>Video duration: {results.analysis_details.video_properties.duration_seconds?.toFixed(1)}s</p>
                  <p>Frame count: {results.analysis_details.video_properties.frame_count}</p>
                  <p>FPS: {results.analysis_details.video_properties.fps?.toFixed(1)}</p>
                </div>
              )}
              {results.analysis_details.note && (
                <p className="text-yellow-600 italic">{results.analysis_details.note}</p>
              )}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => navigate('/upload')}
            className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Analyze Another Video
          </button>
          <button
            onClick={() => navigate('/history')}
            className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors"
          >
            View History
          </button>
          <button
            onClick={() => window.print()}
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
          >
            Print Report
          </button>
        </div>

        {/* Warning for Deepfakes */}
        {isDeepfake && (
          <div className="mt-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-start">
              <svg className="w-5 h-5 text-red-600 mt-0.5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <div>
                <h4 className="font-medium text-red-800">Deepfake Detected</h4>
                <p className="text-sm text-red-700 mt-1">
                  This video has been identified as containing deepfake content. 
                  Please verify the authenticity before sharing or using this content.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnalysisResults;
