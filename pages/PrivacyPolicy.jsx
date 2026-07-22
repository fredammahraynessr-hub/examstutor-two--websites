import React from "react";
import { Link } from "react-router-dom";
import StarField from "@/components/examstutor/StarField";

export default function PrivacyPolicy() {
  return (
    <div className="relative min-h-screen w-full bg-black font-body text-white">
      <StarField />
      <main className="relative z-10 mx-auto max-w-3xl px-6 py-20">
        <h1 className="font-heading text-4xl font-black text-white">
          Privacy <span className="text-[#00CFFF]">Policy</span>
        </h1>
        <p className="mt-2 text-sm text-white/50">Last updated: July 8, 2026</p>

        <div className="mt-8 space-y-6 text-sm leading-relaxed text-white/80">
          <section>
            <h2 className="text-lg font-bold text-[#FFD700]">1. Information We Collect</h2>
            <p className="mt-2">
              Examstutor2 collects the email address you provide at registration, your practice answers and scores,
              and subscription status. We do not collect biometric data, government identification numbers, or precise location.
            </p>
          </section>
          <section>
            <h2 className="text-lg font-bold text-[#FFD700]">2. How We Use Your Data</h2>
            <p className="mt-2">
              Your data is used to deliver practice questions, track your progress, detect weak areas, manage your
              subscription, and display anonymized analytics. We do not sell your personal data to third parties.
            </p>
          </section>
          <section>
            <h2 className="text-lg font-bold text-[#FFD700]">3. Data Security</h2>
            <p className="mt-2">
              All data is transmitted over encrypted HTTPS connections and stored securely. Access is restricted to
              authorized administrators. Privacy guardrails automatically detect and block personally identifiable
              information (PII) from being stored in practice content.
            </p>
          </section>
          <section>
            <h2 className="text-lg font-bold text-[#FFD700]">4. Advertising</h2>
            <p className="mt-2">
              Free-tier users may see advertisements. Advertisers do not receive your personal data. Impressions and
              clicks are tracked in aggregate only.
            </p>
          </section>
          <section>
            <h2 className="text-lg font-bold text-[#FFD700]">5. Your Rights</h2>
            <p className="mt-2">
              You may request access to, correction of, or deletion of your personal data at any time by contacting
              support. Subscription cancellation is available within the app.
            </p>
          </section>
          <section>
            <h2 className="text-lg font-bold text-[#FFD700]">6. Children's Privacy</h2>
            <p className="mt-2">
              Examstutor2 is designed for students preparing for WAEC examinations. We do not knowingly collect data
              from children under 13 without parental consent.
            </p>
          </section>
        </div>

        <div className="mt-12">
          <Link to="/" className="text-sm font-semibold text-[#00CFFF] hover:text-[#FFD700]">
            ← Back to Home
          </Link>
        </div>
      </main>
    </div>
  );
}