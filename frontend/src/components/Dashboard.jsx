import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { 
  Shield, 
  Zap, 
  Database, 
  TrendingUp, 
  Video, 
  CheckCircle, 
  AlertTriangle, 
  Rocket, 
  FileText, 
  Scale, 
  Mail,
  Upload,
  Brain,
  Eye,
  Globe,
  Lock,
  Users,
  Newspaper,
  Vote,
  GraduationCap,
  MessageSquare,
  ArrowRight,
  Play,
  Star,
  Clock,
  Target,
  User
} from 'lucide-react';
import AnimatedBackground from './AnimatedBackground';
import PrivacyPolicy from './PrivacyPolicy';
import TermsOfService from './TermsOfService';
import ContactDeveloper from './ContactDeveloper';
import { loadUserInfo, clearUserInfo } from '../utils/userStorage';

const Dashboard = ({ statistics, recentVerifications, onViewChange }) => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState(null);
  const [userInfo, setUserInfo] = useState(() => {
    // Load user info from localStorage on component mount
    return loadUserInfo();
  });

  // Ensure user info is loaded on component mount
  useEffect(() => {
    if (!userInfo) {
      const loadedUserInfo = loadUserInfo();
      if (loadedUserInfo) {
        setUserInfo(loadedUserInfo);
      }
    }
  }, [userInfo]);

  const stats = [
    { icon: Video, label: 'Videos Analyzed', value: statistics?.total_verifications || 0, color: 'cyan' },
    { icon: AlertTriangle, label: 'Deepfakes Detected', value: statistics?.deepfake_detected || 0, color: 'red' },
    { icon: CheckCircle, label: 'Authentic Videos', value: statistics?.real_videos || 0, color: 'green' },
    { icon: TrendingUp, label: 'Detection Accuracy', value: `${statistics?.deepfake_percentage?.toFixed(1) || 0}%`, color: 'purple' },
  ];
  
  const howItWorksSteps = [
    {
      icon: Upload,
      title: 'Upload Video',
      description: 'Simply drag and drop or select your video file. We support all major video formats.',
      color: 'cyan'
    },
    {
      icon: Brain,
      title: 'AI Analysis',
      description: 'Our advanced neural networks analyze facial features, voice patterns, and behavioral cues.',
      color: 'purple'
    },
    {
      icon: Target,
      title: 'Multi-Model Detection',
      description: 'Multiple AI models work together to cross-verify and ensure maximum accuracy.',
      color: 'green'
    },
    {
      icon: CheckCircle,
      title: 'Get Results',
      description: 'Receive instant authenticity score with detailed confidence metrics and analysis.',
      color: 'cyan'
    }
  ];

  const useCases = [
    {
      icon: Newspaper,
      title: 'Journalism & Media',
      description: 'Verify video content before publication. Ensure news integrity and combat misinformation.',
      color: 'cyan',
      examples: ['Breaking news verification', 'Interview authenticity', 'Social media fact-checking']
    },
    {
      icon: Vote,
      title: 'Elections & Politics',
      description: 'Detect manipulated political content and protect democratic processes from deepfake interference.',
      color: 'purple',
      examples: ['Campaign video verification', 'Political speech analysis', 'Election security']
    },
    {
      icon: MessageSquare,
      title: 'Social Media',
      description: 'Platforms can automatically flag suspicious content and protect users from manipulated media.',
      color: 'green',
      examples: ['Content moderation', 'User safety', 'Platform integrity']
    },
    {
      icon: GraduationCap,
      title: 'Education & Research',
      description: 'Educate students about deepfakes and conduct research on AI-generated content detection.',
      color: 'cyan',
      examples: ['Digital literacy training', 'Academic research', 'Media education']
    }
  ];

  const roadmapFeatures = [
    {
      icon: Clock,
      title: 'Real-Time Detection',
      description: 'Live video stream analysis for instant deepfake detection during video calls and broadcasts.',
      status: 'In Development',
      timeline: 'Q2 2026'
    },
    {
      icon: Globe,
      title: 'Multilingual UI',
      description: 'Support for multiple languages to make deepfake detection accessible worldwide.',
      status: 'Planned',
      timeline: 'Q3 2026'
    },
    {
      icon: Lock,
      title: 'Blockchain Verification',
      description: 'Immutable verification records stored on blockchain for tamper-proof authenticity certificates.',
      status: 'Research Phase',
      timeline: 'Q4 2026'
    },
    {
      icon: Users,
      title: 'API Integration',
      description: 'Developer-friendly APIs for seamless integration into existing platforms and workflows.',
      status: 'Planned',
      timeline: 'Q3 2026'
    }
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
          
          {/* Main Tagline */}
          <p className="text-2xl md:text-3xl font-bold text-white mb-6 max-w-4xl mx-auto animate-slide-up" style={{ animationDelay: '0.2s' }}>
            Detect deepfake videos instantly with Veritas AI
          </p>
          
          {/* Description */}
          <p className="text-[hsl(var(--text-secondary))] text-lg md:text-xl mb-8 max-w-2xl mx-auto animate-slide-up leading-relaxed" style={{ animationDelay: '0.3s' }}>
            Advanced neural networks detect AI-generated content with 99.7% accuracy. 
            <span className="text-cyber-cyan"> Verify authenticity instantly.</span>
          </p>
          
          {/* Feature Badges */}
          <div className="flex flex-wrap justify-center gap-4 mb-12 animate-slide-up" style={{ animationDelay: '0.4s' }}>
            <span className="px-4 py-2 glass-card text-cyber-cyan text-sm font-space">
              • AI POWERED
            </span>
            <span className="px-4 py-2 glass-card text-cyber-cyan text-sm font-space">
              • MULTI-SPECTRUM ANALYSIS
            </span>
            <span className="px-4 py-2 glass-card text-cyber-cyan text-sm font-space">
              • 99.7% ACCURACY
            </span>
            <span className="px-4 py-2 glass-card text-cyber-cyan text-sm font-space">
              • INSTANT RESULTS
            </span>
          </div>
        
          {/* CTA Button */}
          <div className="flex flex-col items-center gap-4 animate-slide-up" style={{ animationDelay: '0.5s' }}>
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
            
            {/* User Info Display */}
            {userInfo && (
              <div className="flex items-center gap-3 px-4 py-2 glass-card rounded-lg">
                <div className="w-8 h-8 bg-cyber-cyan/20 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-cyber-cyan" />
                </div>
                <div className="text-left">
                  <p className="text-white text-sm font-medium">{userInfo.name}</p>
                  <p className="text-[hsl(var(--text-muted))] text-xs">{userInfo.email}</p>
                </div>
                <button
                  onClick={() => {
                    clearUserInfo();
                    setUserInfo(null);
                    toast.success('User information cleared. You can update it when you start analysis.');
                  }}
                  className="text-[hsl(var(--text-muted))] hover:text-cyber-cyan text-xs transition-colors"
                  title="Clear user information"
                >
                  Clear
                </button>
              </div>
            )}
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

      {/* How It Works Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-orbitron text-4xl md:text-5xl font-bold mb-4">
              <span className="gradient-text-cyan">HOW IT WORKS</span>
            </h2>
            <p className="text-[hsl(var(--text-secondary))] text-lg max-w-2xl mx-auto">
              Our detection pipeline uses state-of-the-art AI to analyze videos through multiple verification stages
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {howItWorksSteps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.title}
                  className="glass-card-hover p-8 text-center animate-slide-up relative"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className={`w-16 h-16 mx-auto mb-6 rounded-xl bg-cyber-${step.color}/10 flex items-center justify-center shadow-glow-${step.color}`}>
                    <Icon className={`w-8 h-8 text-cyber-${step.color}`} />
                  </div>
                  <h3 className="font-orbitron text-xl font-bold mb-3 text-white">
                    {step.title}
                  </h3>
                  <p className="text-[hsl(var(--text-secondary))] leading-relaxed">
                    {step.description}
                  </p>
                  {index < howItWorksSteps.length - 1 && (
                    <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                      <ArrowRight className="w-6 h-6 text-cyber-cyan" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-orbitron text-4xl md:text-5xl font-bold mb-4">
              <span className="gradient-text-cyan">USE CASES</span>
            </h2>
            <p className="text-[hsl(var(--text-secondary))] text-lg max-w-2xl mx-auto">
              Veritas AI serves critical needs across multiple industries and applications
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {useCases.map((useCase, index) => {
              const Icon = useCase.icon;
              return (
                <div
                  key={useCase.title}
                  className="glass-card-hover p-8 animate-slide-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className={`w-16 h-16 mb-6 rounded-xl bg-cyber-${useCase.color}/10 flex items-center justify-center shadow-glow-${useCase.color}`}>
                    <Icon className={`w-8 h-8 text-cyber-${useCase.color}`} />
                  </div>
                  <h3 className="font-orbitron text-xl font-bold mb-3 text-white">
                    {useCase.title}
                  </h3>
                  <p className="text-[hsl(var(--text-secondary))] mb-4 leading-relaxed">
                    {useCase.description}
                  </p>
                  <div className="space-y-2">
                    {useCase.examples.map((example, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-sm text-cyber-cyan">
                        <Star className="w-3 h-3" />
                        <span>{example}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Roadmap Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-orbitron text-4xl md:text-5xl font-bold mb-4">
              <span className="gradient-text-cyan">ROADMAP & FUTURE FEATURES</span>
            </h2>
            <p className="text-[hsl(var(--text-secondary))] text-lg max-w-2xl mx-auto">
              Exciting developments coming to enhance deepfake detection capabilities
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {roadmapFeatures.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className="glass-card-hover p-8 animate-slide-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-cyber-cyan/10 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-6 h-6 text-cyber-cyan" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-orbitron text-lg font-bold text-white">
                          {feature.title}
                        </h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          feature.status === 'In Development' 
                            ? 'bg-cyber-green/20 text-cyber-green border border-cyber-green/30'
                            : feature.status === 'Planned'
                            ? 'bg-cyber-cyan/20 text-cyber-cyan border border-cyber-cyan/30'
                            : 'bg-cyber-purple/20 text-cyber-purple border border-cyber-purple/30'
                        }`}>
                          {feature.status}
                        </span>
                      </div>
                      <p className="text-[hsl(var(--text-secondary))] mb-3 leading-relaxed">
                        {feature.description}
                      </p>
                      <div className="flex items-center gap-2 text-sm text-cyber-cyan">
                        <Clock className="w-3 h-3" />
                        <span>Expected: {feature.timeline}</span>
                      </div>
                    </div>
                  </div>
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
