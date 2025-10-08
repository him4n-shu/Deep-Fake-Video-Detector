import React from 'react';
import { Shield, Lock, Eye, Database, UserCheck, AlertTriangle } from 'lucide-react';

const PrivacyPolicy = () => {
  return (
    <div className="max-w-4xl mx-auto p-8">
      <div className="glass-card p-8">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Shield className="w-8 h-8 text-cyber-cyan" />
            <h1 className="font-orbitron text-3xl font-bold text-white">Privacy Policy</h1>
          </div>
          <p className="text-[hsl(var(--text-secondary))]">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>

        <div className="space-y-8">
          <section>
            <h2 className="font-orbitron text-xl font-bold text-cyber-cyan mb-4 flex items-center gap-2">
              <Lock className="w-5 h-5" />
              1. Information We Collect
            </h2>
            <div className="text-[hsl(var(--text-secondary))] space-y-3">
              <p>When you use Veritas AI, we may collect the following information:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Video files you upload for analysis</li>
                <li>Analysis results and confidence scores</li>
                <li>IP address and browser information</li>
                <li>Usage patterns and interaction data</li>
                <li>Error logs and performance metrics</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="font-orbitron text-xl font-bold text-cyber-cyan mb-4 flex items-center gap-2">
              <Eye className="w-5 h-5" />
              2. How We Use Your Information
            </h2>
            <div className="text-[hsl(var(--text-secondary))] space-y-3">
              <p>We use the collected information to:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Provide deepfake detection services</li>
                <li>Improve our AI models and algorithms</li>
                <li>Ensure system security and prevent abuse</li>
                <li>Generate anonymous usage statistics</li>
                <li>Provide customer support when needed</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="font-orbitron text-xl font-bold text-cyber-cyan mb-4 flex items-center gap-2">
              <Database className="w-5 h-5" />
              3. Data Storage and Security
            </h2>
            <div className="text-[hsl(var(--text-secondary))] space-y-3">
              <p>We implement industry-standard security measures:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Encrypted data transmission (HTTPS/TLS)</li>
                <li>Secure server infrastructure</li>
                <li>Regular security audits and updates</li>
                <li>Limited access controls for authorized personnel</li>
                <li>Automatic data deletion after analysis completion</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="font-orbitron text-xl font-bold text-cyber-cyan mb-4 flex items-center gap-2">
              <UserCheck className="w-5 h-5" />
              4. Your Rights
            </h2>
            <div className="text-[hsl(var(--text-secondary))] space-y-3">
              <p>You have the right to:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Request deletion of your uploaded content</li>
                <li>Access your analysis history</li>
                <li>Opt-out of data collection for research</li>
                <li>Receive a copy of your data</li>
                <li>Contact us with privacy concerns</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="font-orbitron text-xl font-bold text-cyber-cyan mb-4 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              5. Third-Party Services
            </h2>
            <div className="text-[hsl(var(--text-secondary))] space-y-3">
              <p>We may use third-party services for:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Cloud hosting and infrastructure</li>
                <li>Analytics and performance monitoring</li>
                <li>Content delivery networks</li>
                <li>Security and fraud prevention</li>
              </ul>
              <p className="mt-4">These services have their own privacy policies and data handling practices.</p>
            </div>
          </section>

          <section>
            <h2 className="font-orbitron text-xl font-bold text-cyber-cyan mb-4">
              6. Contact Us
            </h2>
            <div className="text-[hsl(var(--text-secondary))]">
              <p>If you have questions about this Privacy Policy, please contact us at:</p>
              <div className="mt-4 p-4 glass-card rounded-lg">
                <p><strong>Email:</strong> himanshu7554@gmail.com</p>
                <p><strong>Address:</strong> Kolkata, West Bengal, India</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
