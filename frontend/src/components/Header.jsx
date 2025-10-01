import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Header = ({ currentView, onViewChange, statistics }) => {
  const location = useLocation();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', path: '/' },
    { id: 'upload', label: 'Upload Video', path: '/upload' },
    { id: 'history', label: 'Verification History', path: '/history' },
    { id: 'statistics', label: 'Statistics', path: '/statistics' }
  ];

  return (
    <header className="bg-white/95 backdrop-blur-sm shadow-lg border-b border-gray-200 sticky top-0 z-50 fade-in-scale">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo and Title */}
          <div className="flex items-center space-x-4 slide-in-left">
            <div className="bg-gradient-to-br from-blue-600 to-green-600 text-white p-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 float-animation">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800 flex items-center">
                <span className="gradient-text">Deepfake</span>
                <span className="text-green-600 ml-1">Detector</span>
                <span className="text-xs ml-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-3 py-1 rounded-full shadow-md pulse-animation">
                  AI-Powered
                </span>
              </h1>
              <p className="text-sm text-gray-600 hover:text-gray-800 transition-colors duration-300">
                Advanced AI-powered deepfake detection for video verification
              </p>
            </div>
          </div>

          {/* Statistics Summary */}
          {statistics && (
            <div className="hidden md:flex items-center space-x-6 text-sm glass rounded-xl px-6 py-3 shadow-lg fade-in-up">
              <div className="text-center group cursor-pointer">
                <div className="font-bold text-2xl text-blue-600 group-hover:scale-110 transition-transform duration-300">{statistics.total_verifications}</div>
                <div className="text-gray-600 text-xs font-medium">Total Videos</div>
              </div>
              <div className="w-px h-8 bg-gray-300"></div>
              <div className="text-center group cursor-pointer">
                <div className="font-bold text-2xl text-red-600 group-hover:scale-110 transition-transform duration-300">{statistics.deepfake_detected}</div>
                <div className="text-gray-600 text-xs font-medium">Deepfakes Found</div>
              </div>
              <div className="w-px h-8 bg-gray-300"></div>
              <div className="text-center group cursor-pointer">
                <div className="font-bold text-2xl text-green-600 group-hover:scale-110 transition-transform duration-300">{statistics.deepfake_percentage.toFixed(1)}%</div>
                <div className="text-gray-600 text-xs font-medium">Detection Rate</div>
              </div>
            </div>
          )}

          {/* Navigation - Modern Style */}
          <nav className="hidden md:flex space-x-3 fade-in-up" style={{animationDelay: '0.2s'}}>
            {navItems.map((item, index) => (
              <Link
                key={item.id}
                to={item.path}
                className={`modern-nav-btn text-sm ${
                  location.pathname === item.path
                    ? 'active'
                    : 'text-gray-700 hover:text-blue-600'
                }`}
                style={{animationDelay: `${index * 0.1}s`}}
              >
                <span className="relative z-10">{item.label}</span>
              </Link>
            ))}
          </nav>

          {/* Mobile menu button */}
          <button className="md:hidden p-2 rounded-lg hover:bg-gray-100 text-gray-700">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden mt-4 pt-4 border-t border-gray-200">
          <nav className="flex flex-wrap gap-2">
            {navItems.map((item) => (
              <Link
                key={item.id}
                to={item.path}
                className={`px-3 py-2 rounded-lg text-sm transition-colors duration-200 font-medium ${
                  location.pathname === item.path
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
