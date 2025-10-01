import React from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = ({ statistics, recentVerifications, onViewChange }) => {
  const navigate = useNavigate();

  const StatCard = ({ title, value, subtitle, color, icon, delay = 0 }) => (
    <div className="glass rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-all duration-500 hover:scale-105 group cursor-pointer fade-in-up" style={{animationDelay: `${delay}s`}}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-semibold text-gray-600 mb-2 group-hover:text-gray-800 transition-colors">{title}</p>
          <p className="text-4xl font-bold text-gray-900 mb-1 group-hover:scale-110 transition-transform duration-300">{value}</p>
          {subtitle && <p className="text-sm text-gray-500 group-hover:text-gray-600 transition-colors">{subtitle}</p>}
        </div>
        <div className={`p-4 rounded-2xl ${color} group-hover:scale-110 transition-transform duration-300`}>
          {icon}
        </div>
      </div>
      <div className="mt-4 h-1 bg-gradient-to-r from-blue-500 to-green-500 rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
    </div>
  );

  const VerificationCard = ({ verification }) => (
    <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-indigo-500">
      <div className="flex items-center justify-between mb-2">
        <h4 className="font-medium text-gray-800 truncate">{verification.filename}</h4>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          verification.is_deepfake 
            ? 'bg-red-100 text-red-800' 
            : 'bg-green-100 text-green-800'
        }`}>
          {verification.is_deepfake ? 'Deepfake' : 'Authentic'}
        </span>
      </div>
      <div className="text-sm text-gray-600">
        <p>Confidence: {(verification.confidence_score * 100).toFixed(1)}%</p>
        <p>Time: {new Date(verification.timestamp).toLocaleString()}</p>
        {verification.constituency && (
          <p>Constituency: {verification.constituency}</p>
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-12">
      {/* Welcome Section */}
      <div className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 rounded-2xl shadow-2xl p-12 text-white text-center overflow-hidden fade-in-scale">
        <div className="absolute inset-0 bg-black/10 backdrop-blur-sm"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-center mb-6 slide-in-left">
            <h1 className="text-5xl font-bold">
              <span className="text-white drop-shadow-lg">Deepfake</span>
              <span className="text-blue-100 ml-2 drop-shadow-lg">Detector</span>
            </h1>
            <span className="ml-6 text-4xl float-animation">🔍</span>
          </div>
          <h2 className="text-2xl font-semibold text-blue-100 mb-4 fade-in-up" style={{animationDelay: '0.2s'}}>
            Advanced AI Detection System
          </h2>
          <p className="text-blue-50 mb-8 max-w-3xl mx-auto text-lg leading-relaxed fade-in-up" style={{animationDelay: '0.4s'}}>
            Detect deepfake videos with cutting-edge AI technology. Upload your videos for instant analysis 
            and get detailed verification reports with tamper-proof results.
            <br />
            <span className="text-sm font-medium text-blue-200 inline-flex items-center mt-2 space-x-4">
              <span className="flex items-center"><span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>Secure</span>
              <span className="flex items-center"><span className="w-2 h-2 bg-yellow-400 rounded-full mr-2"></span>Fast</span>
              <span className="flex items-center"><span className="w-2 h-2 bg-blue-400 rounded-full mr-2"></span>Accurate</span>
            </span>
          </p>
          <button
            onClick={() => navigate('/upload')}
            className="bg-white text-blue-600 px-10 py-4 rounded-xl font-bold hover:bg-blue-50 transition-all shadow-2xl text-xl transform hover:scale-105 fade-in-up"
            style={{animationDelay: '0.6s'}}
          >
            <span className="flex items-center space-x-3">
              <span>Upload Video</span>
              <span className="text-2xl">📹</span>
            </span>
          </button>
        </div>
        
        {/* Floating particles */}
        <div className="absolute top-10 left-10 w-4 h-4 bg-white/20 rounded-full float-animation"></div>
        <div className="absolute top-20 right-20 w-3 h-3 bg-white/30 rounded-full float-animation" style={{animationDelay: '1s'}}></div>
        <div className="absolute bottom-20 left-20 w-2 h-2 bg-white/40 rounded-full float-animation" style={{animationDelay: '2s'}}></div>
      </div>

      {/* Statistics Cards */}
      {statistics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <StatCard
            title="Total Videos"
            value={statistics.total_verifications}
            subtitle="Analyzed"
            color="bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg"
            delay={0.1}
            icon={
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            }
          />
          <StatCard
            title="Deepfakes Detected"
            value={statistics.deepfake_detected}
            subtitle="Found"
            color="bg-gradient-to-br from-red-500 to-red-600 text-white shadow-lg"
            delay={0.2}
            icon={
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            }
          />
          <StatCard
            title="Authentic Videos"
            value={statistics.real_videos}
            subtitle="Verified"
            color="bg-gradient-to-br from-green-500 to-green-600 text-white shadow-lg"
            delay={0.3}
            icon={
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
          />
          <StatCard
            title="Detection Rate"
            value={`${statistics.deepfake_percentage.toFixed(1)}%`}
            subtitle="Accuracy"
            color="bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-lg"
            delay={0.4}
            icon={
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            }
          />
        </div>
      )}

      {/* Feature Cards */}
      <div className="mb-12 fade-in-up" style={{animationDelay: '0.5s'}}>
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 gradient-text">
            🚀 Powerful Features
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Everything you need for comprehensive deepfake detection and analysis
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Video Analysis Service */}
          <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-blue-500 hover:shadow-xl transition-shadow service-card">
            <div className="flex items-center mb-4">
              <div className="bg-blue-100 p-3 rounded-lg mr-4">
                <span className="text-2xl">📹</span>
              </div>
              <div>
                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full font-medium">Most Popular</span>
                <h3 className="text-lg font-bold text-gray-800 mt-1">Video Analysis</h3>
              </div>
            </div>
            <p className="text-gray-600 text-sm mb-4">
              AI-powered deepfake detection with advanced machine learning algorithms. Upload and get instant results.
            </p>
            <div className="text-xs text-blue-700 font-medium mb-4">
              BONUS: Includes tamper-proof verification
            </div>
            <button
              onClick={() => navigate('/upload')}
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Try Now
            </button>
          </div>

          {/* History Tracking Service */}
          <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-green-500 hover:shadow-xl transition-shadow service-card">
            <div className="flex items-center mb-4">
              <div className="bg-green-100 p-3 rounded-lg mr-4">
                <span className="text-2xl">📊</span>
              </div>
              <div>
                <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-medium">Time Saver</span>
                <h3 className="text-lg font-bold text-gray-800 mt-1">History Tracking</h3>
              </div>
            </div>
            <p className="text-gray-600 text-sm mb-4">
              View all your previous verification records with complete analysis history and results.
            </p>
            <div className="text-xs text-green-700 font-medium mb-4">
              BONUS: Advanced filtering options
            </div>
            <button
              onClick={() => navigate('/history')}
              className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors font-medium"
            >
              Try Now
            </button>
          </div>

          {/* Analytics Dashboard */}
          <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-purple-500 hover:shadow-xl transition-shadow service-card">
            <div className="flex items-center mb-4">
              <div className="bg-purple-100 p-3 rounded-lg mr-4">
                <span className="text-2xl">📈</span>
              </div>
              <div>
                <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full font-medium">Analytics</span>
                <h3 className="text-lg font-bold text-gray-800 mt-1">Analytics Dashboard</h3>
              </div>
            </div>
            <p className="text-gray-600 text-sm mb-4">
              Detailed statistics and comprehensive breakdowns of all your detection results.
            </p>
            <div className="text-xs text-purple-700 font-medium mb-4">
              BONUS: Real-time data updates
            </div>
            <button
              onClick={() => navigate('/statistics')}
              className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition-colors font-medium"
            >
              Try Now
            </button>
          </div>
        </div>
      </div>

      {/* Recent Verifications */}
      {recentVerifications && recentVerifications.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Recent Verifications</h3>
            <button
              onClick={() => navigate('/history')}
              className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
            >
              View All
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recentVerifications.map((verification, index) => (
              <VerificationCard key={index} verification={verification} />
            ))}
          </div>
        </div>
      )}

      {/* Constituency Breakdown */}
      {statistics && statistics.constituency_breakdown && statistics.constituency_breakdown.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Constituency Breakdown</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Constituency
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Videos
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Deepfakes
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rate
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {statistics.constituency_breakdown.map((item, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {item.constituency}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.total_videos}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.deepfake_count}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.total_videos > 0 ? ((item.deepfake_count / item.total_videos) * 100).toFixed(1) : 0}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
