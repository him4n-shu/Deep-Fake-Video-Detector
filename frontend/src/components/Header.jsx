import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Shield, Menu, X } from 'lucide-react';

const Header = ({ currentView, onViewChange, statistics }) => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/upload', label: 'Analyze' },
    { path: '/history', label: 'History' },
    { path: '/statistics', label: 'Statistics' },
  ];
  
  const isActive = (path) => location.pathname === path;
  
  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-card border-b border-[hsl(var(--border-glow))]">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative">
              <Shield className="w-8 h-8 text-cyber-cyan group-hover:animate-pulse-glow transition-all" />
              <div className="absolute inset-0 bg-cyber-cyan blur-xl opacity-0 group-hover:opacity-50 transition-opacity" />
            </div>
            <div className="flex flex-col">
              <span className="font-orbitron font-bold text-xl gradient-text-cyan">
                Veritas AI
              </span>
              <span className="font-inter text-xs text-[hsl(var(--text-secondary))] -mt-1">
                Seeing Through the Illusion
              </span>
            </div>
          </Link>
          
          {/* Statistics Summary */}
          {statistics && (
            <div className="hidden lg:flex items-center space-x-6 text-sm glass-card rounded-xl px-6 py-3">
              <div className="text-center group cursor-pointer">
                <div className="font-bold text-2xl text-cyber-cyan group-hover:scale-110 transition-transform duration-300">{statistics.total_verifications}</div>
                <div className="text-[hsl(var(--text-secondary))] text-xs font-medium">Total Videos</div>
              </div>
              <div className="w-px h-8 bg-[hsl(var(--border-glow))]"></div>
              <div className="text-center group cursor-pointer">
                <div className="font-bold text-2xl text-cyber-red group-hover:scale-110 transition-transform duration-300">{statistics.deepfake_detected}</div>
                <div className="text-[hsl(var(--text-secondary))] text-xs font-medium">Deepfakes Found</div>
              </div>
              <div className="w-px h-8 bg-[hsl(var(--border-glow))]"></div>
              <div className="text-center group cursor-pointer">
                <div className="font-bold text-2xl text-cyber-green group-hover:scale-110 transition-transform duration-300">{statistics.deepfake_percentage.toFixed(1)}%</div>
                <div className="text-[hsl(var(--text-secondary))] text-xs font-medium">Detection Rate</div>
              </div>
            </div>
          )}
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`relative font-space font-medium transition-all duration-300 ${
                  isActive(link.path)
                    ? 'text-cyber-cyan'
                    : 'text-[hsl(var(--text-secondary))] hover:text-cyber-cyan'
                }`}
              >
                {link.label}
                {isActive(link.path) && (
                  <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-cyber-cyan shadow-glow-cyan" />
                )}
              </Link>
            ))}
          </div>
          
          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-cyber-cyan hover:bg-[hsl(var(--bg-secondary))] rounded-lg transition-colors"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
        
        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pt-4 border-t border-[hsl(var(--border-glow))] animate-slide-up">
            <div className="flex flex-col gap-3">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-4 py-2 rounded-lg font-space font-medium transition-all duration-300 ${
                    isActive(link.path)
                      ? 'bg-[hsl(var(--bg-secondary))] text-cyber-cyan border border-cyber-cyan'
                      : 'text-[hsl(var(--text-secondary))] hover:text-cyber-cyan hover:bg-[hsl(var(--bg-secondary))]'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
