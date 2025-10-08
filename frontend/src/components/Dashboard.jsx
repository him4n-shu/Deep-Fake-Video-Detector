import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, Zap, Database, TrendingUp, Video, CheckCircle, AlertTriangle, Rocket, FileText, Scale, Mail } from 'lucide-react';
import AnimatedBackground from './AnimatedBackground';
import PrivacyPolicy from './PrivacyPolicy';
import TermsOfService from './TermsOfService';
import ContactDeveloper from './ContactDeveloper';

const Dashboard = ({ statistics, recentVerifications, onViewChange }) => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState(null);

  const stats = [
    { icon: Video, label: 'Videos Analyzed', value: statistics?.total_verifications || 0, color: 'cyan' },
    { icon: AlertTriangle, label: 'Deepfakes Detected', value: statistics?.deepfake_detected || 0, color: 'red' },
    { icon: CheckCircle, label: 'Authentic Videos', value: statistics?.real_videos || 0, color: 'green' },
    { icon: TrendingUp, label: 'Detection Accuracy', value: `${statistics?.deepfake_percentage?.toFixed(1) || 0}%`, color: 'purple' },
  ];
  
  const features = [
    {
      icon: Shield,
      title: 'AI-Powered Detection',
      description: 'Advanced neural networks trained on millions of videos to identify even the most sophisticated deepfakes.',
      color: 'cyan',
    },
    {
      icon: Database,
      title: 'Multi-Spectrum Analysis',
      description: 'Combines facial recognition, voice analysis, and behavioral patterns for comprehensive verification.',
      color: 'purple',
    },
    {
      icon: Zap,
      title: 'Real-Time Processing',
      description: 'Get instant results with our optimized detection pipeline that processes videos in seconds.',
      color: 'green',
    },
  ];

  const VerificationCard = ({ verification }) => (
    <div className="glass-card p-4 border-l-4 border-cyber-cyan">
      <div className="flex items-center justify-between mb-2">
        <h4 className="font-medium text-white truncate">{verification.filename}</h4>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          verification.is_deepfake 
            ? 'bg-cyber-red/20 text-cyber-red border border-cyber-red/30' 
            : 'bg-cyber-green/20 text-cyber-green border border-cyber-green/30'
        }`}>
          {verification.is_deepfake ? 'Deepfake' : 'Authentic'}
        </span>
      </div>
      <div className="text-sm text-[hsl(var(--text-secondary))]">
        <p>Detection Confidence: {(verification.confidence_score * 100).toFixed(1)}%</p>
        <p>Time: {new Date(verification.timestamp).toLocaleString()}</p>
        {verification.constituency && (
          <p>Constituency: {verification.constituency}</p>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen relative">
      <AnimatedBackground />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4">
        <div className="container mx-auto text-center">
          {/* Logo/Icon */}
          <div className="relative inline-block mb-8 animate-float">
            <div className="w-32 h-32 mx-auto bg-gradient-to-br from-cyber-cyan to-cyber-purple rounded-full p-1 animate-pulse-glow">
              <div className="w-full h-full bg-[hsl(var(--bg-primary))] rounded-full flex items-center justify-center">
                <Shield className="w-16 h-16 text-cyber-cyan" />
              </div>
            </div>
            <div className="absolute inset-0 bg-cyber-cyan blur-3xl opacity-30 animate-pulse-glow" />
          </div>
          
          {/* Main Title */}
          <h1 className="font-orbitron text-5xl md:text-7xl font-bold mb-6 animate-slide-up">
            <span className="gradient-text-cyan">
              Veritas AI
            </span>
          </h1>
          
          <p className="text-cyber-cyan text-lg md:text-xl mb-4 max-w-2xl mx-auto animate-slide-up font-medium" style={{ animationDelay: '0.1s' }}>
            Seeing Through the Illusion
          </p>
          
              <p className="text-[hsl(var(--text-secondary))] text-lg md:text-xl mb-4 max-w-2xl mx-auto animate-slide-up" style={{ animationDelay: '0.1s' }}>
                Advanced AI-powered deepfake detection for content verification
              </p>
          
          {/* Feature Badges */}
          <div className="flex flex-wrap justify-center gap-4 mb-12 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <span className="px-4 py-2 glass-card text-cyber-cyan text-sm font-space">
              • AI POWERED
            </span>
            <span className="px-4 py-2 glass-card text-cyber-cyan text-sm font-space">
              • MULTI-SPECTRUM ANALYSIS
            </span>
            <span className="px-4 py-2 glass-card text-cyber-cyan text-sm font-space">
              • 99.7% ACCURACY
            </span>
        </div>
        
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <Link
              to="/upload"
              className="group relative px-8 py-4 bg-cyber-cyan text-[hsl(var(--bg-primary))] font-orbitron font-bold rounded-xl overflow-hidden transition-all duration-300 hover:scale-105 shadow-glow-cyan hover:shadow-glow-cyan"
            >
              <span className="relative z-10 flex items-center gap-2">
                BEGIN ANALYSIS
                <Rocket className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-cyber-cyan to-cyber-cyan-light opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
            
            <Link
              to="/statistics"
              className="px-8 py-4 border-2 border-cyber-cyan text-cyber-cyan font-orbitron font-bold rounded-xl hover:bg-cyber-cyan hover:text-[hsl(var(--bg-primary))] transition-all duration-300"
            >
              LEARN MORE
            </Link>
        </div>
        </div>
      </section>
      
      {/* Statistics Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div
                  key={stat.label}
                  className="glass-card-hover p-6 text-center animate-slide-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className={`w-14 h-14 mx-auto mb-4 rounded-full bg-cyber-${stat.color}/10 flex items-center justify-center`}>
                    <Icon className={`w-7 h-7 text-cyber-${stat.color}`} />
              </div>
                  <h3 className="text-4xl font-orbitron font-bold mb-2 text-white">
                    {stat.value}
                  </h3>
                  <p className="text-[hsl(var(--text-secondary))] text-sm font-space">
                    {stat.label}
                  </p>
            </div>
              );
            })}
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-orbitron text-4xl md:text-5xl font-bold mb-4">
              <span className="gradient-text-cyan">MULTI-JUDGE SYSTEM</span>
            </h2>
            <p className="text-[hsl(var(--text-secondary))] text-lg max-w-2xl mx-auto">
              Our advanced detection system employs multiple AI models working in harmony to ensure maximum accuracy
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className="glass-card-hover p-8 animate-slide-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className={`w-16 h-16 mb-6 rounded-xl bg-cyber-${feature.color}/10 flex items-center justify-center shadow-glow-${feature.color}`}>
                    <Icon className={`w-8 h-8 text-cyber-${feature.color}`} />
              </div>
                  <h3 className="font-orbitron text-xl font-bold mb-3 text-white">
                    {feature.title}
                  </h3>
                  <p className="text-[hsl(var(--text-secondary))] mb-6 leading-relaxed">
                    {feature.description}
                  </p>
                  <Link
                    to="/upload"
                    className={`inline-flex items-center gap-2 text-cyber-${feature.color} hover:text-cyber-${feature.color}-light font-space text-sm font-medium transition-colors`}
            >
              Try Now
                    <span className="text-lg">→</span>
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Recent Verifications */}
      {recentVerifications && recentVerifications.length > 0 && (
        <section className="py-16 px-4">
          <div className="container mx-auto">
            <div className="glass-card p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-orbitron text-2xl font-bold text-white">Recent Verifications</h3>
                <Link
                  to="/history"
                  className="text-cyber-cyan hover:text-cyber-cyan-light text-sm font-medium transition-colors"
            >
              View All
                </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recentVerifications.map((verification, index) => (
              <VerificationCard key={index} verification={verification} />
            ))}
          </div>
        </div>
          </div>
        </section>
      )}

      
      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="glass-card p-12 text-center cyber-border">
            <h2 className="font-orbitron text-3xl md:text-4xl font-bold mb-6">
              <span className="gradient-text-cyber">Ready to Verify Your Videos?</span>
            </h2>
            <p className="text-[hsl(var(--text-secondary))] text-lg mb-8 max-w-2xl mx-auto">
              Upload your video and get instant, accurate deepfake detection results powered by state-of-the-art AI technology.
            </p>
            <Link
              to="/upload"
              className="inline-flex items-center gap-2 px-8 py-4 bg-cyber-cyan text-[hsl(var(--bg-primary))] font-orbitron font-bold rounded-xl hover:scale-105 transition-all duration-300 shadow-glow-cyan"
            >
              START ANALYZING
              <Rocket className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Legal and Contact Sections */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-orbitron text-3xl font-bold text-white mb-4">
              <span className="gradient-text-cyan">Legal & Contact</span>
            </h2>
            <p className="text-[hsl(var(--text-secondary))] text-lg">
              Important information and ways to get in touch
            </p>
          </div>

          {/* Section Navigation */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <button
              onClick={() => setActiveSection(activeSection === 'privacy' ? null : 'privacy')}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-all duration-300 ${
                activeSection === 'privacy'
                  ? 'bg-cyber-cyan text-[hsl(var(--bg-primary))]'
                  : 'glass-card text-cyber-cyan hover:bg-cyber-cyan/10'
              }`}
            >
              <Shield className="w-4 h-4" />
              Privacy Policy
            </button>
            <button
              onClick={() => setActiveSection(activeSection === 'terms' ? null : 'terms')}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-all duration-300 ${
                activeSection === 'terms'
                  ? 'bg-cyber-cyan text-[hsl(var(--bg-primary))]'
                  : 'glass-card text-cyber-cyan hover:bg-cyber-cyan/10'
              }`}
            >
              <FileText className="w-4 h-4" />
              Terms of Service
            </button>
            <button
              onClick={() => setActiveSection(activeSection === 'contact' ? null : 'contact')}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-all duration-300 ${
                activeSection === 'contact'
                  ? 'bg-cyber-cyan text-[hsl(var(--bg-primary))]'
                  : 'glass-card text-cyber-cyan hover:bg-cyber-cyan/10'
              }`}
            >
              <Mail className="w-4 h-4" />
              Contact Developer
            </button>
          </div>

          {/* Dynamic Content */}
          {activeSection === 'privacy' && (
            <div className="animate-slide-up">
              <PrivacyPolicy />
            </div>
          )}
          
          {activeSection === 'terms' && (
            <div className="animate-slide-up">
              <TermsOfService />
            </div>
          )}
          
          {activeSection === 'contact' && (
            <div className="animate-slide-up">
              <ContactDeveloper />
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
