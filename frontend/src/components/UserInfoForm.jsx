import React, { useState } from 'react';
import { User, Mail, Phone, Building, ArrowRight, X } from 'lucide-react';
import { toast } from 'sonner';

const UserInfoForm = ({ onUserInfoSubmit, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    organization: '',
    purpose: 'general'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.name.trim()) {
      toast.error('Please enter your name');
      return;
    }
    
    if (!formData.email.trim()) {
      toast.error('Please enter your email');
      return;
    }
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Call the parent component's submit handler
      await onUserInfoSubmit(formData);
      toast.success('User information saved successfully!');
    } catch (error) {
      console.error('Error saving user info:', error);
      toast.error('Error saving user information. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="glass-card p-8 max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-orbitron text-2xl font-bold text-white">
            <span className="gradient-text-cyan">User Information</span>
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-[hsl(var(--bg-secondary))] rounded-lg transition-colors text-[hsl(var(--text-secondary))] hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-[hsl(var(--text-secondary))] text-sm mb-6">
          Please provide your information to proceed with video analysis. This helps us improve our service and provide better support.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name Field */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-white mb-2">
              Full Name *
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[hsl(var(--text-muted))]" />
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="input-cyber pl-10 w-full"
                placeholder="Enter your full name"
                required
              />
            </div>
          </div>

          {/* Email Field */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-white mb-2">
              Email Address *
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[hsl(var(--text-muted))]" />
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="input-cyber pl-10 w-full"
                placeholder="Enter your email address"
                required
              />
            </div>
          </div>

          {/* Phone Field */}
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-white mb-2">
              Phone Number
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[hsl(var(--text-muted))]" />
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="input-cyber pl-10 w-full"
                placeholder="Enter your phone number (optional)"
              />
            </div>
          </div>

          {/* Organization Field */}
          <div>
            <label htmlFor="organization" className="block text-sm font-medium text-white mb-2">
              Organization
            </label>
            <div className="relative">
              <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[hsl(var(--text-muted))]" />
              <input
                type="text"
                id="organization"
                name="organization"
                value={formData.organization}
                onChange={handleInputChange}
                className="input-cyber pl-10 w-full"
                placeholder="Enter your organization (optional)"
              />
            </div>
          </div>

          {/* Purpose Field */}
          <div>
            <label htmlFor="purpose" className="block text-sm font-medium text-white mb-2">
              Purpose of Analysis
            </label>
            <select
              id="purpose"
              name="purpose"
              value={formData.purpose}
              onChange={handleInputChange}
              className="input-cyber w-full"
            >
              <option value="general">General Verification</option>
              <option value="journalism">Journalism & Media</option>
              <option value="elections">Elections & Politics</option>
              <option value="social_media">Social Media</option>
              <option value="education">Education & Research</option>
              <option value="legal">Legal & Compliance</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full px-6 py-3 rounded-xl font-orbitron font-bold transition-all duration-300 ${
                isSubmitting
                  ? 'bg-[hsl(var(--bg-secondary))] text-[hsl(var(--text-muted))] cursor-not-allowed'
                  : 'bg-cyber-cyan text-[hsl(var(--bg-primary))] hover:scale-105 shadow-glow-cyan hover:shadow-glow-cyan'
              }`}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  SAVING...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  CONTINUE TO UPLOAD
                  <ArrowRight className="w-4 h-4" />
                </span>
              )}
            </button>
          </div>
        </form>

        {/* Privacy Notice */}
        <div className="mt-6 p-4 bg-cyber-cyan/10 rounded-lg border border-cyber-cyan/20">
          <p className="text-xs text-[hsl(var(--text-secondary))] leading-relaxed">
            <strong className="text-cyber-cyan">Privacy Notice:</strong> Your information is encrypted and stored securely. 
            We only use this data to improve our service and provide support. We never share your personal information with third parties.
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserInfoForm;
