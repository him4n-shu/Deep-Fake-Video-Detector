import React, { useState } from 'react';
import { Mail, Phone, MapPin, Github, Linkedin, Facebook, Instagram, Send, User, MessageSquare, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import emailjs from '@emailjs/browser';

const ContactDeveloper = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.name || !formData.email || !formData.message) {
      toast.error('Please fill in all required fields');
      return;
    }

    // EmailJS configuration
    const serviceId = 'service_223wexg'; 
    const templateId = 'template_ze0jqvb'; 
    const publicKey = 'kXx-F1fn8qUueTUfn'; 

    // Prepare template parameters
    const templateParams = {
      from_name: formData.name,
      from_email: formData.email,
      subject: formData.subject || 'Contact from Veritas AI',
      message: formData.message,
      to_name: 'Himanshu Kumar',
      reply_to: formData.email,
    };

    // Send email using EmailJS
    emailjs.send(serviceId, templateId, templateParams, publicKey)
      .then((response) => {
        console.log('Email sent successfully:', response);
        toast.success('Message sent successfully! We\'ll get back to you soon.');
        
        // Reset form
        setFormData({
          name: '',
          email: '',
          subject: '',
          message: ''
        });
      })
      .catch((error) => {
        console.error('Email sending failed:', error);
        toast.error('Failed to send message. Please try again or contact us directly.');
      });
  };

  return (
    <div className="max-w-6xl mx-auto p-8">
      <div className="text-center mb-12">
        <h1 className="font-orbitron text-4xl font-bold text-white mb-4">
          <span className="gradient-text-cyan">Contact the Developer</span>
        </h1>
        <p className="text-[hsl(var(--text-secondary))] text-lg">
          Get in touch with the Veritas AI development team
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Contact Information */}
        <div className="space-y-6">
          <div className="glass-card p-6">
            <h2 className="font-orbitron text-xl font-bold text-cyber-cyan mb-6">
              Get in Touch
            </h2>
            
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-cyber-cyan/10 rounded-lg">
                  <Mail className="w-5 h-5 text-cyber-cyan" />
                </div>
                <div>
                  <h3 className="font-medium text-white">Email</h3>
                  <p className="text-[hsl(var(--text-secondary))] text-sm">himanshu7554@gmail.com</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="p-3 bg-cyber-cyan/10 rounded-lg">
                  <Phone className="w-5 h-5 text-cyber-cyan" />
                </div>
                <div>
                  <h3 className="font-medium text-white">Phone</h3>
                  <p className="text-[hsl(var(--text-secondary))] text-sm">+91 7070464508</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="p-3 bg-cyber-cyan/10 rounded-lg">
                  <MapPin className="w-5 h-5 text-cyber-cyan" />
                </div>
                <div>
                  <h3 className="font-medium text-white">Location</h3>
                  <p className="text-[hsl(var(--text-secondary))] text-sm">Kolkata, West Bengal, India</p>
                </div>
              </div>
            </div>
          </div>

          {/* Social Links */}
          <div className="glass-card p-6">
            <h2 className="font-orbitron text-xl font-bold text-cyber-cyan mb-6">
              Follow Us
            </h2>
            
            <div className="flex gap-4">
              <a 
                href="https://github.com/him4n-shu" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-3 bg-cyber-cyan/10 rounded-lg hover:bg-cyber-cyan/20 transition-colors"
                title="GitHub Profile"
              >
                <Github className="w-5 h-5 text-cyber-cyan" />
              </a>
              <a 
                href="https://www.linkedin.com/in/himanshu-kumar-b4b799208" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-3 bg-cyber-cyan/10 rounded-lg hover:bg-cyber-cyan/20 transition-colors"
                title="LinkedIn Profile"
              >
                <Linkedin className="w-5 h-5 text-cyber-cyan" />
              </a>
              <a 
                href="https://www.facebook.com/himanshu.kumar.253551/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-3 bg-cyber-cyan/10 rounded-lg hover:bg-cyber-cyan/20 transition-colors"
                title="Facebook Profile"
              >
                <Facebook className="w-5 h-5 text-cyber-cyan" />
              </a>
              <a 
                href="https://www.instagram.com/him4n_shu/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-3 bg-cyber-cyan/10 rounded-lg hover:bg-cyber-cyan/20 transition-colors"
                title="Instagram Profile"
              >
                <Instagram className="w-5 h-5 text-cyber-cyan" />
              </a>
            </div>
          </div>

          {/* Response Time */}
          <div className="glass-card p-6">
            <div className="flex items-center gap-3 mb-4">
              <AlertCircle className="w-5 h-5 text-cyber-cyan" />
              <h3 className="font-medium text-white">Response Time</h3>
            </div>
            <p className="text-[hsl(var(--text-secondary))] text-sm">
              We typically respond to inquiries within 24-48 hours during business days.
            </p>
          </div>
        </div>

        {/* Contact Form */}
        <div className="glass-card p-6">
          <h2 className="font-orbitron text-xl font-bold text-cyber-cyan mb-6">
            Send us a Message
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[hsl(var(--text-secondary))] mb-2">
                <User className="w-4 h-4 inline mr-2" />
                Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="input-cyber w-full"
                placeholder="Your full name"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[hsl(var(--text-secondary))] mb-2">
                <Mail className="w-4 h-4 inline mr-2" />
                Email *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="input-cyber w-full"
                placeholder="your.email@example.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[hsl(var(--text-secondary))] mb-2">
                Subject
              </label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleInputChange}
                className="input-cyber w-full"
                placeholder="What's this about?"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[hsl(var(--text-secondary))] mb-2">
                <MessageSquare className="w-4 h-4 inline mr-2" />
                Message *
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                rows={5}
                className="input-cyber w-full resize-none"
                placeholder="Tell us how we can help you..."
                required
              />
            </div>

            <button
              type="submit"
              className="w-full cyber-button bg-cyber-cyan text-white hover:bg-cyber-cyan-light flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              Send Message
            </button>
          </form>
        </div>
      </div>

      {/* About Me Section */}
      <div className="mt-12 glass-card p-6 cyber-border">
        <h2 className="font-orbitron text-xl font-bold text-cyber-cyan mb-6 glow-text-cyan">
          🚀 ABOUT THE DEVELOPER
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Column - Personal Info */}
          <div className="space-y-4">
            <div className="glass-card p-4 border-l-4 border-cyber-cyan">
              <h3 className="font-orbitron font-bold text-cyber-purple mb-2">👨‍💻 WHO AM I?</h3>
              <p className="text-[hsl(var(--text-secondary))] text-sm">
                Hey there! I'm <span className="text-cyber-cyan font-bold">Himanshu Kumar</span>, 
                a code-wielding wizard from the cyber streets of Kolkata! 🏙️
              </p>
            </div>
            
            <div className="glass-card p-4 border-l-4 border-cyber-purple">
              <h3 className="font-orbitron font-bold text-cyber-purple mb-2">🎓 EDUCATION</h3>
              <p className="text-[hsl(var(--text-secondary))] text-sm">
                B.Tech in Computer Science with AI & ML specialization<br/>
                <span className="text-cyber-cyan">(Basically, I speak fluent Python and JavaScript!)</span>
              </p>
            </div>
            
            <div className="glass-card p-4 border-l-4 border-cyber-green">
              <h3 className="font-orbitron font-bold text-cyber-purple mb-2">🎯 MISSION</h3>
              <p className="text-[hsl(var(--text-secondary))] text-sm">
                Fighting deepfakes one neural network at a time! 
                <span className="text-cyber-green">Because the world needs more truth and fewer fake videos.</span>
              </p>
            </div>
          </div>
          
          {/* Right Column - Skills & Fun Facts */}
          <div className="space-y-4">
            <div className="glass-card p-4 border-l-4 border-cyber-red">
              <h3 className="font-orbitron font-bold text-cyber-purple mb-2">⚡ SUPERPOWERS</h3>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-cyber-cyan rounded-full animate-pulse"></div>
                  <span className="text-[hsl(var(--text-secondary))]">MERN Stack</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-cyber-purple rounded-full animate-pulse"></div>
                  <span className="text-[hsl(var(--text-secondary))]">AI/ML Python</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-cyber-green rounded-full animate-pulse"></div>
                  <span className="text-[hsl(var(--text-secondary))]">Deep Learning</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-cyber-red rounded-full animate-pulse"></div>
                  <span className="text-[hsl(var(--text-secondary))]">Computer Vision</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-cyber-cyan rounded-full animate-pulse"></div>
                  <span className="text-[hsl(var(--text-secondary))]">Full-Stack Dev</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-cyber-purple rounded-full animate-pulse"></div>
                  <span className="text-[hsl(var(--text-secondary))]">Cyberpunk UI</span>
                </div>
              </div>
            </div>
            
            <div className="glass-card p-4 border-l-4 border-cyber-cyan">
              <h3 className="font-orbitron font-bold text-cyber-purple mb-2">🤖 FUN FACTS</h3>
              <ul className="text-[hsl(var(--text-secondary))] text-sm space-y-1">
                <li>• I can debug code while eating biryani 🍛</li>
                <li>• My coffee consumption rivals my code output ☕</li>
                <li>• I believe every bug is just a feature in disguise 🐛</li>
                <li>• I speak fluent JavaScript and broken English 😄</li>
              </ul>
            </div>
            
            <div className="glass-card p-4 border-l-4 border-cyber-green">
              <h3 className="font-orbitron font-bold text-cyber-purple mb-2">🎮 CURRENTLY</h3>
              <p className="text-[hsl(var(--text-secondary))] text-sm">
                Building the next generation of AI-powered deepfake detection systems 
                while trying to figure out why my code works on my machine but not in production! 🤷‍♂️
              </p>
            </div>
          </div>
        </div>
        
        {/* Bottom Quote */}
        <div className="mt-6 text-center">
          <div className="glass-card p-4 border border-cyber-cyan/30">
            <p className="text-cyber-cyan font-orbitron text-sm italic">
              "Code is poetry, bugs are haikus, and deployment is performance art." 
              <span className="block text-xs text-[hsl(var(--text-secondary))] mt-1">
                - Himanshu Kumar, probably while debugging at 3 AM
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactDeveloper;
