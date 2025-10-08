import React, { useState, useEffect } from 'react';
import { Search, Filter, Download, Copy, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';
import AnimatedBackground from './AnimatedBackground';

const VerificationHistory = ({ verifications, onRefresh }) => {
  const [filteredVerifications, setFilteredVerifications] = useState(verifications);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    setFilteredVerifications(verifications);
  }, [verifications]);

  // Filter and search logic
  useEffect(() => {
    let filtered = verifications;

    // Search by filename
    if (searchTerm) {
      filtered = filtered.filter(v => 
        v.filename && v.filename.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(v => 
        statusFilter === 'deepfake' ? v.is_deepfake : !v.is_deepfake
      );
    }

    setFilteredVerifications(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  }, [verifications, searchTerm, statusFilter]);

  // Pagination logic
  const totalPages = Math.ceil(filteredVerifications.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentVerifications = filteredVerifications.slice(startIndex, endIndex);

  const handleCopyHash = (hash) => {
    navigator.clipboard.writeText(hash);
    // You could add a toast notification here
  };

  const handleExportCSV = () => {
    try {
      // Check if there's data to export
      if (filteredVerifications.length === 0) {
        toast.error('No data to export. Please check your filters.');
        return;
      }

      // Prepare CSV data
      const csvHeaders = ['Filename', 'Status', 'Confidence (%)', 'Date/Time', 'Hash', 'Constituency', 'Candidate'];
      
      const csvData = filteredVerifications.map(verification => [
        verification.filename || '',
        verification.is_deepfake ? 'DEEPFAKE' : 'AUTHENTIC',
        (verification.confidence_score * 100).toFixed(1),
        new Date(verification.timestamp).toLocaleString(),
        verification.verification_hash || '',
        verification.constituency || '',
        verification.candidate_name || ''
      ]);

      // Combine headers and data
      const csvContent = [csvHeaders, ...csvData]
        .map(row => row.map(field => `"${field}"`).join(','))
        .join('\n');

      // Create and download file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      
      if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        
        // Generate filename with current date
        const now = new Date();
        const dateStr = now.toISOString().split('T')[0];
        const timeStr = now.toTimeString().split(' ')[0].replace(/:/g, '-');
        const filename = `verification_history_${dateStr}_${timeStr}.csv`;
        link.setAttribute('download', filename);
        
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Clean up the URL object
        URL.revokeObjectURL(url);
        
        // Show success message
        toast.success(`CSV exported successfully! ${filteredVerifications.length} records downloaded as ${filename}`);
      } else {
        toast.error('CSV download not supported in this browser.');
      }
    } catch (error) {
      console.error('Error exporting CSV:', error);
      toast.error('Failed to export CSV. Please try again.');
    }
  };

  return (
    <div className="min-h-screen pt-32 pb-12 px-4 relative">
      <AnimatedBackground />
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="text-center mb-8 animate-slide-up">
          <h1 className="font-orbitron text-4xl md:text-5xl font-bold mb-4">
            <span className="gradient-text-cyan">VERIFICATION HISTORY</span>
          </h1>
          <p className="text-[hsl(var(--text-secondary))] text-lg">
            Total Verifications: {filteredVerifications.length}
          </p>
        </div>

        {/* Search and Filter Bar */}
        <div className="glass-card p-6 mb-8 animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <div className="flex flex-col md:flex-row gap-4 items-center">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[hsl(var(--text-secondary))]" />
              <input
                type="text"
                placeholder="Search by filename..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-cyber w-full pl-10"
              />
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-cyber-cyan" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="input-cyber min-w-[120px]"
              >
                <option value="all">All Status</option>
                <option value="authentic">Authentic</option>
                <option value="deepfake">Deepfake</option>
              </select>
            </div>

            {/* Export Button */}
            <button 
              onClick={handleExportCSV}
              className="flex items-center gap-2 px-4 py-2 border border-cyber-cyan text-cyber-cyan rounded-lg hover:bg-cyber-cyan/10 transition-colors"
            >
              <Download className="w-4 h-4" />
              Export CSV
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="glass-card overflow-hidden animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[hsl(var(--bg-secondary))]">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-orbitron font-bold text-cyber-cyan uppercase tracking-wider">
                    Filename
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-orbitron font-bold text-cyber-cyan uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-orbitron font-bold text-cyber-cyan uppercase tracking-wider">
                    Confidence
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-orbitron font-bold text-cyber-cyan uppercase tracking-wider">
                    Date/Time
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-orbitron font-bold text-cyber-cyan uppercase tracking-wider">
                    Hash
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[hsl(var(--border-glow))]">
                {currentVerifications.map((verification, index) => (
                  <tr key={verification.id || index} className="hover:bg-[hsl(var(--bg-secondary))]/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-white">
                        {verification.filename}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-3 py-1 rounded-full text-xs font-bold ${
                        verification.is_deepfake 
                          ? 'bg-red-500/20 text-red-400 border border-red-500/30' 
                          : 'bg-green-500/20 text-green-400 border border-green-500/30'
                      }`}>
                        {verification.is_deepfake ? 'DEEPFAKE' : 'AUTHENTIC'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-20 bg-[hsl(var(--bg-secondary))] rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${
                              verification.is_deepfake ? 'bg-red-500' : 'bg-green-500'
                            }`}
                            style={{ width: `${verification.confidence_score * 100}%` }}
                          ></div>
                        </div>
                        <span className={`text-sm font-bold ${
                          verification.is_deepfake ? 'text-red-400' : 'text-green-400'
                        }`}>
                          {(verification.confidence_score * 100).toFixed(1)}%
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2 text-sm text-[hsl(var(--text-secondary))]">
                        <Calendar className="w-4 h-4" />
                        {new Date(verification.timestamp).toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-mono text-[hsl(var(--text-secondary))]">
                          {verification.verification_hash ? verification.verification_hash.substring(0, 8) + '...' : 'N/A'}
                        </span>
                        <button
                          onClick={() => handleCopyHash(verification.verification_hash)}
                          className="text-cyber-cyan hover:text-cyber-cyan-light transition-colors"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-8 animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="flex items-center gap-1 px-3 py-2 text-sm text-[hsl(var(--text-secondary))] hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </button>

            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }
              
              return (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`px-3 py-2 text-sm rounded-lg transition-colors ${
                    currentPage === pageNum
                      ? 'bg-cyber-cyan text-[hsl(var(--bg-primary))] border border-cyber-cyan'
                      : 'text-[hsl(var(--text-secondary))] hover:text-white hover:bg-[hsl(var(--bg-secondary))]'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}

            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="flex items-center gap-1 px-3 py-2 text-sm text-[hsl(var(--text-secondary))] hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Pagination Info */}
        <div className="text-center mt-4 text-sm text-[hsl(var(--text-secondary))]">
          Showing {startIndex + 1} to {Math.min(endIndex, filteredVerifications.length)} of {filteredVerifications.length} verifications
        </div>
      </div>
    </div>
  );
};

export default VerificationHistory;