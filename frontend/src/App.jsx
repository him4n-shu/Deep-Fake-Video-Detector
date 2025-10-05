import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import VideoUpload from './components/VideoUpload';
import AnalysisResults from './components/AnalysisResults';
import VerificationHistory from './components/VerificationHistory';
import Statistics from './components/Statistics';
import Dashboard from './components/Dashboard';
import Footer from './components/Footer';
import { buildApiUrl, API_ENDPOINTS } from './config/api';
import './index.css';

function App() {
  const [currentView, setCurrentView] = useState('dashboard');
  const [analysisResults, setAnalysisResults] = useState(null);
  const [verificationHistory, setVerificationHistory] = useState([]);
  const [statistics, setStatistics] = useState(null);

  // Fetch statistics on component mount
  useEffect(() => {
    fetchStatistics();
    fetchVerificationHistory();
  }, []);

  const fetchStatistics = async () => {
    try {
      const response = await fetch(buildApiUrl(API_ENDPOINTS.STATISTICS));
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setStatistics(data);
    } catch (error) {
      console.error('Error fetching statistics:', error);
      // Set default statistics if fetch fails
      setStatistics({
        total_verifications: 0,
        deepfake_detected: 0,
        real_videos: 0,
        deepfake_percentage: 0,
        constituency_breakdown: []
      });
    }
  };

  const fetchVerificationHistory = async () => {
    try {
      const response = await fetch(buildApiUrl(API_ENDPOINTS.VERIFICATIONS) + '?limit=20');
      const data = await response.json();
      setVerificationHistory(data);
    } catch (error) {
      console.error('Error fetching verification history:', error);
    }
  };

  const handleAnalysisComplete = (results) => {
    setAnalysisResults(results);
    setCurrentView('results');
    // Refresh statistics and history
    fetchStatistics();
    fetchVerificationHistory();
  };

  const handleViewChange = (view) => {
    setCurrentView(view);
  };

  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse" style={{animationDelay: '2s'}}></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-green-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse" style={{animationDelay: '4s'}}></div>
        </div>
        
        <div className="relative z-10">
          <Header 
            currentView={currentView} 
            onViewChange={handleViewChange}
            statistics={statistics}
          />
          
          <main className="container mx-auto px-4 py-12">
          <Routes>
            <Route path="/" element={
              <Dashboard 
                statistics={statistics}
                recentVerifications={verificationHistory.slice(0, 5)}
                onViewChange={handleViewChange}
              />
            } />
            <Route path="/upload" element={
              <VideoUpload 
                onAnalysisComplete={handleAnalysisComplete}
                onViewChange={handleViewChange}
              />
            } />
            <Route path="/results" element={
              <AnalysisResults 
                results={analysisResults}
                onViewChange={handleViewChange}
              />
            } />
            <Route path="/history" element={
              <VerificationHistory 
                verifications={verificationHistory}
                onRefresh={fetchVerificationHistory}
              />
            } />
            <Route path="/statistics" element={
              <Statistics 
                statistics={statistics}
                onRefresh={fetchStatistics}
              />
            } />
          </Routes>
          </main>
          <Footer />
        </div>
      </div>
    </Router>
  );
}

export default App;