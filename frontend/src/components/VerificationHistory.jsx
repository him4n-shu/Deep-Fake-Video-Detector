import React, { useState, useEffect } from 'react';

const VerificationHistory = ({ verifications, onRefresh }) => {
  const [filteredVerifications, setFilteredVerifications] = useState(verifications);
  const [filters, setFilters] = useState({
    constituency: '',
    candidate: '',
    result: 'all'
  });

  useEffect(() => {
    setFilteredVerifications(verifications);
  }, [verifications]);

  const handleFilterChange = (filterType, value) => {
    const newFilters = { ...filters, [filterType]: value };
    setFilters(newFilters);

    let filtered = verifications;

    if (newFilters.constituency) {
      filtered = filtered.filter(v => 
        v.constituency && v.constituency.toLowerCase().includes(newFilters.constituency.toLowerCase())
      );
    }

    if (newFilters.candidate) {
      filtered = filtered.filter(v => 
        v.candidate_name && v.candidate_name.toLowerCase().includes(newFilters.candidate.toLowerCase())
      );
    }

    if (newFilters.result !== 'all') {
      filtered = filtered.filter(v => 
        newFilters.result === 'deepfake' ? v.is_deepfake : !v.is_deepfake
      );
    }

    setFilteredVerifications(filtered);
  };

  const VerificationCard = ({ verification }) => (
    <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-indigo-500">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-800 mb-1">{verification.filename}</h3>
          <p className="text-sm text-gray-600">
            Analysis ID: <span className="font-mono text-xs">{verification.analysis_id}</span>
          </p>
        </div>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
          verification.is_deepfake 
            ? 'bg-red-100 text-red-800' 
            : 'bg-green-100 text-green-800'
        }`}>
          {verification.is_deepfake ? 'Deepfake' : 'Authentic'}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-sm text-gray-600">
            <span className="font-medium">Confidence:</span> {(verification.confidence_score * 100).toFixed(1)}%
          </p>
          <p className="text-sm text-gray-600">
            <span className="font-medium">Timestamp:</span> {new Date(verification.timestamp).toLocaleString()}
          </p>
        </div>
        <div>
          {verification.constituency && (
            <p className="text-sm text-gray-600">
              <span className="font-medium">Constituency:</span> {verification.constituency}
            </p>
          )}
          {verification.candidate_name && (
            <p className="text-sm text-gray-600">
              <span className="font-medium">Candidate:</span> {verification.candidate_name}
            </p>
          )}
        </div>
      </div>

      <div className="bg-gray-50 rounded-lg p-3">
        <p className="text-xs text-gray-500 mb-1">Verification Hash:</p>
        <p className="font-mono text-xs text-gray-700 break-all">
          {verification.verification_hash}
        </p>
      </div>

      {verification.is_tampered && (
        <div className="mt-3 bg-red-50 border border-red-200 rounded-lg p-3">
          <div className="flex items-center">
            <svg className="w-4 h-4 text-red-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <span className="text-sm text-red-800 font-medium">Tampering Detected</span>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto">
      <div className="bg-white rounded-xl shadow-lg p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              Verification History
            </h2>
            <p className="text-gray-600">
              View all video analysis results and verification records
            </p>
          </div>
          <button
            onClick={onRefresh}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh
          </button>
        </div>

        {/* Filters */}
        <div className="bg-gray-50 rounded-lg p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Filters</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Constituency
              </label>
              <input
                type="text"
                value={filters.constituency}
                onChange={(e) => handleFilterChange('constituency', e.target.value)}
                placeholder="Filter by constituency..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Candidate Name
              </label>
              <input
                type="text"
                value={filters.candidate}
                onChange={(e) => handleFilterChange('candidate', e.target.value)}
                placeholder="Filter by candidate..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Result
              </label>
              <select
                value={filters.result}
                onChange={(e) => handleFilterChange('result', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="all">All Results</option>
                <option value="deepfake">Deepfakes Only</option>
                <option value="authentic">Authentic Only</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Summary */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-600">
            Showing {filteredVerifications.length} of {verifications.length} verifications
          </p>
          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
              <span>Deepfakes ({verifications.filter(v => v.is_deepfake).length})</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
              <span>Authentic ({verifications.filter(v => !v.is_deepfake).length})</span>
            </div>
          </div>
        </div>

        {/* Verification Cards */}
        {filteredVerifications.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredVerifications.map((verification, index) => (
              <VerificationCard key={index} verification={verification} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="text-lg font-medium text-gray-800 mb-2">No verifications found</h3>
            <p className="text-gray-600">
              {verifications.length === 0 
                ? "No videos have been analyzed yet. Upload a video to get started."
                : "No verifications match your current filters. Try adjusting your search criteria."
              }
            </p>
          </div>
        )}

        {/* Export Options */}
        {filteredVerifications.length > 0 && (
          <div className="mt-8 pt-6 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Export Data</h3>
            <div className="flex space-x-4">
              <button
                onClick={() => {
                  const csv = [
                    ['Filename', 'Analysis ID', 'Result', 'Confidence', 'Constituency', 'Candidate', 'Timestamp'],
                    ...filteredVerifications.map(v => [
                      v.filename,
                      v.analysis_id,
                      v.is_deepfake ? 'Deepfake' : 'Authentic',
                      (v.confidence_score * 100).toFixed(1) + '%',
                      v.constituency || '',
                      v.candidate_name || '',
                      new Date(v.timestamp).toLocaleString()
                    ])
                  ].map(row => row.join(',')).join('\n');
                  
                  const blob = new Blob([csv], { type: 'text/csv' });
                  const url = window.URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = 'verification_history.csv';
                  a.click();
                  window.URL.revokeObjectURL(url);
                }}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                Export as CSV
              </button>
              <button
                onClick={() => window.print()}
                className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
              >
                Print Report
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerificationHistory;
