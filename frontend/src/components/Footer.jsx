import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white mt-16">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <div className="bg-gradient-to-br from-blue-600 to-green-600 text-white p-3 rounded-lg shadow-lg">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold">
                  <span className="text-blue-400">Deepfake</span>
                  <span className="text-green-400 ml-1">Detector</span>
                </h3>
                <p className="text-sm text-gray-400">
                  Advanced AI Detection System
                </p>
              </div>
            </div>
            <p className="text-gray-300 text-sm max-w-md">
              Professional deepfake detection service powered by cutting-edge AI technology. 
              Secure, fast, and accurate video analysis for content verification.
            </p>
          </div>

          {/* Services Section */}
          <div>
            <h4 className="font-semibold text-gray-200 mb-4">Services</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>• Video Analysis</li>
              <li>• Deepfake Detection</li>
              <li>• History Tracking</li>
              <li>• Analytics Dashboard</li>
              <li>• Tamper-proof Verification</li>
            </ul>
          </div>

          {/* Features */}
          <div>
            <h4 className="font-semibold text-gray-200 mb-4">Features</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>• Advanced AI Models</li>
              <li>• Real-time Processing</li>
              <li>• Secure Storage</li>
              <li>• Detailed Reports</li>
              <li>• API Integration</li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-700 mt-8 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-4 text-sm text-gray-400">
              <span>© 2025 Deepfake Detector. All rights reserved.</span>
              <span className="hidden md:inline">•</span>
              <span>Built with cutting-edge AI technology</span>
            </div>
            
            <div className="flex items-center space-x-6 mt-4 md:mt-0">
              <div className="flex items-center space-x-2 text-sm">
                <span className="bg-green-600 text-white px-2 py-1 rounded-full font-medium">
                  ✓ Secure
                </span>
                <span className="bg-blue-600 text-white px-2 py-1 rounded-full font-medium">
                  🤖 AI-Powered
                </span>
                <span className="bg-purple-600 text-white px-2 py-1 rounded-full font-medium">
                  ⚡ Fast
                </span>
              </div>
            </div>
          </div>
          
          {/* Tech Section */}
          <div className="text-center mt-6 py-4 bg-gray-800 rounded-lg">
            <p className="text-lg font-bold text-gray-200">
              🔍 Truth Through Technology
            </p>
            <p className="text-sm text-gray-400 mt-1">
              Advanced AI • Secure Processing • Accurate Results
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
