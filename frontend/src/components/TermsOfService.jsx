import React from 'react';
import { FileText, Scale, AlertCircle, Shield, Users, Gavel } from 'lucide-react';

const TermsOfService = () => {
  return (
    <div className="max-w-4xl mx-auto p-8">
      <div className="glass-card p-8">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <FileText className="w-8 h-8 text-cyber-cyan" />
            <h1 className="font-orbitron text-3xl font-bold text-white">Terms of Service</h1>
          </div>
          <p className="text-[hsl(var(--text-secondary))]">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>

        <div className="space-y-8">
          <section>
            <h2 className="font-orbitron text-xl font-bold text-cyber-cyan mb-4 flex items-center gap-2">
              <Scale className="w-5 h-5" />
              1. Acceptance of Terms
            </h2>
            <div className="text-[hsl(var(--text-secondary))] space-y-3">
              <p>By accessing and using Veritas AI, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.</p>
            </div>
          </section>

          <section>
            <h2 className="font-orbitron text-xl font-bold text-cyber-cyan mb-4 flex items-center gap-2">
              <Users className="w-5 h-5" />
              2. Use License
            </h2>
            <div className="text-[hsl(var(--text-secondary))] space-y-3">
              <p>Permission is granted to temporarily use Veritas AI for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Modify or copy the materials</li>
                <li>Use the materials for any commercial purpose or for any public display</li>
                <li>Attempt to reverse engineer any software contained on the website</li>
                <li>Remove any copyright or other proprietary notations from the materials</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="font-orbitron text-xl font-bold text-cyber-cyan mb-4 flex items-center gap-2">
              <Shield className="w-5 h-5" />
              3. Service Availability
            </h2>
            <div className="text-[hsl(var(--text-secondary))] space-y-3">
              <p>We strive to provide reliable service, but we cannot guarantee:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>100% uptime or availability</li>
                <li>Perfect accuracy of deepfake detection</li>
                <li>Compatibility with all video formats</li>
                <li>Processing time guarantees</li>
              </ul>
              <p className="mt-4">The service is provided "as is" without warranties of any kind.</p>
            </div>
          </section>

          <section>
            <h2 className="font-orbitron text-xl font-bold text-cyber-cyan mb-4 flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              4. User Responsibilities
            </h2>
            <div className="text-[hsl(var(--text-secondary))] space-y-3">
              <p>Users are responsible for:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Ensuring they have rights to upload content</li>
                <li>Not uploading illegal, harmful, or inappropriate content</li>
                <li>Respecting intellectual property rights</li>
                <li>Using the service in compliance with applicable laws</li>
                <li>Not attempting to circumvent security measures</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="font-orbitron text-xl font-bold text-cyber-cyan mb-4 flex items-center gap-2">
              <Gavel className="w-5 h-5" />
              5. Limitation of Liability
            </h2>
            <div className="text-[hsl(var(--text-secondary))] space-y-3">
              <p>In no event shall Veritas AI or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the service, even if Veritas AI or an authorized representative has been notified orally or in writing of the possibility of such damage.</p>
            </div>
          </section>

          <section>
            <h2 className="font-orbitron text-xl font-bold text-cyber-cyan mb-4">
              6. Privacy and Data Protection
            </h2>
            <div className="text-[hsl(var(--text-secondary))] space-y-3">
              <p>Your privacy is important to us. Please review our Privacy Policy, which also governs your use of the service, to understand our practices.</p>
            </div>
          </section>

          <section>
            <h2 className="font-orbitron text-xl font-bold text-cyber-cyan mb-4">
              7. Modifications
            </h2>
            <div className="text-[hsl(var(--text-secondary))] space-y-3">
              <p>Veritas AI may revise these terms of service at any time without notice. By using this service, you are agreeing to be bound by the then current version of these terms of service.</p>
            </div>
          </section>

          <section>
            <h2 className="font-orbitron text-xl font-bold text-cyber-cyan mb-4">
              8. Contact Information
            </h2>
            <div className="text-[hsl(var(--text-secondary))]">
              <p>If you have any questions about these Terms of Service, please contact us at:</p>
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

export default TermsOfService;
