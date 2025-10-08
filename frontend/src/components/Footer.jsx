import React from 'react';
import { Shield, Zap, Database, TrendingUp } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="glass-card border-t border-[hsl(var(--border-glow))] mt-16">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-3 mb-6">
              <div className="relative">
                <Shield className="w-8 h-8 text-cyber-cyan" />
                <div className="absolute inset-0 bg-cyber-cyan blur-xl opacity-30" />
              </div>
              <div>
                <h3 className="font-orbitron text-xl font-bold gradient-text-cyan">
                  Veritas AI
                </h3>
                <p className="text-[hsl(var(--text-secondary))] text-sm font-space">
                  Seeing Through the Illusion
                </p>
              </div>
            </div>
            <p className="text-[hsl(var(--text-secondary))] text-sm max-w-md leading-relaxed">
              Professional deepfake detection service powered by cutting-edge AI technology. 
              Secure, fast, and accurate video analysis for content verification.
            </p>
          </div>

          {/* Services Section */}
          <div>
            <h4 className="font-orbitron font-bold text-cyber-cyan mb-4">SERVICES</h4>
            <ul className="space-y-3 text-sm text-[hsl(var(--text-secondary))]">
              <li className="flex items-center gap-2">
                <span className="w-1 h-1 bg-cyber-cyan rounded-full"></span>
                Video Analysis
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1 h-1 bg-cyber-cyan rounded-full"></span>
                Deepfake Detection
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1 h-1 bg-cyber-cyan rounded-full"></span>
                History Tracking
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1 h-1 bg-cyber-cyan rounded-full"></span>
                Analytics Dashboard
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1 h-1 bg-cyber-cyan rounded-full"></span>
                Tamper-proof Verification
              </li>
            </ul>
          </div>

          {/* Features */}
          <div>
            <h4 className="font-orbitron font-bold text-cyber-purple mb-4">FEATURES</h4>
            <ul className="space-y-3 text-sm text-[hsl(var(--text-secondary))]">
              <li className="flex items-center gap-2">
                <span className="w-1 h-1 bg-cyber-purple rounded-full"></span>
                Advanced AI Models
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1 h-1 bg-cyber-purple rounded-full"></span>
                Real-time Processing
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1 h-1 bg-cyber-purple rounded-full"></span>
                Secure Storage
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1 h-1 bg-cyber-purple rounded-full"></span>
                Detailed Reports
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1 h-1 bg-cyber-purple rounded-full"></span>
                API Integration
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-[hsl(var(--border-glow))] mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-4 text-sm text-[hsl(var(--text-secondary))]">
              <span>© 2025 Veritas AI. All rights reserved.</span>
              <span className="hidden md:inline">•</span>
              <span>Built with cutting-edge AI technology</span>
            </div>
            
            <div className="flex items-center space-x-4 mt-4 md:mt-0">
              <div className="flex items-center space-x-2 text-sm">
                <span className="glass-card px-3 py-1 text-cyber-green text-xs font-space border border-cyber-green/30">
                  ✓ SECURE
                </span>
                <span className="glass-card px-3 py-1 text-cyber-cyan text-xs font-space border border-cyber-cyan/30">
                  🤖 AI-POWERED
                </span>
                <span className="glass-card px-3 py-1 text-cyber-purple text-xs font-space border border-cyber-purple/30">
                  ⚡ FAST
                </span>
              </div>
            </div>
          </div>
          
          {/* Tech Section */}
          <div className="text-center mt-8 py-6 glass-card cyber-border">
            <div className="flex items-center justify-center gap-4 mb-3">
              <Shield className="w-6 h-6 text-cyber-cyan" />
              <Zap className="w-6 h-6 text-cyber-purple" />
              <Database className="w-6 h-6 text-cyber-green" />
              <TrendingUp className="w-6 h-6 text-cyber-cyan" />
            </div>
            <p className="font-orbitron text-lg font-bold gradient-text-cyber">
              🔍 TRUTH THROUGH TECHNOLOGY
            </p>
            <p className="text-[hsl(var(--text-secondary))] text-sm mt-2 font-space">
              ADVANCED AI • SECURE PROCESSING • ACCURATE RESULTS
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
