import React from "react";
import { Link } from "react-router-dom";
import StarField from "@/components/examstutor/StarField";

export default function TermsOfService() {
  return (
    <div className="relative min-h-screen w-full bg-black font-body text-white">
      <StarField />
      <main className="relative z-10 mx-auto max-w-3xl px-6 py-20">
        <h1 className="font-heading text-4xl font-black text-white">
          Terms of <span className="text-[#00CFFF]">Service</span>
        </h1>
        <p className="mt-2 text-sm text-white/50">Last updated: July 8, 2026</p>

        <div className="mt-8 space-y-6 text-sm leading-relaxed text-white/80">
          <section>
            <h2 className="text-lg font-bold text-[#FFD700]">1. Acceptance of Terms</h2>
            <p className="mt-2">
              By accessing Examstutor2, you agree to these Terms of Service. If you do not agree, please discontinue use.
            </p>
          </section>
          <section>
            <h2 className="text-lg font-bold text-[#FFD700]">2. Independent Platform</h2>
            <p className="mt-2">
              Examstutor2 is an independent educational tool and is not affiliated with, endorsed by, or connected to
              the West African Examinations Council (WAEC). Content is for practice purposes only and does not guarantee
              examination success.
            </p>
          </section>
          <section>
            <h2 className="text-lg font-bold text-[#FFD700]">3. Subscriptions & Payments</h2>
            <p className="mt-2">
              Paid subscriptions (Basic and Premium) are billed monthly via Base44 Payments and auto-renew until
              cancelled. Free-tier users are limited to 25 questions. You may cancel at any time; access continues until
              the end of the current billing cycle.
            </p>
          </section>
          <section>
            <h2 className="text-lg font-bold text-[#FFD700]">4. Refunds</h2>
            <p className="mt-2">
              Subscription cancellations take effect at the end of the current paid billing cycle. Refunds for
              one-time charges are handled on a case-by-case basis by contacting support.
            </p>
          </section>
          <section>
            <h2 className="text-lg font-bold text-[#FFD700]">5. Acceptable Use</h2>
            <p className="mt-2">
              You agree not to misuse the platform, attempt to circumvent question limits, submit offensive content, or
              reverse-engineer the application. Violations may result in account termination without refund.
            </p>
          </section>
          <section>
            <h2 className="text-lg font-bold text-[#FFD700]">6. Intellectual Property</h2>
            <p className="mt-2">
              All platform content, branding, and software are owned by Examstutor2. Trademarks referenced belong to
              their respective owners.
            </p>
          </section>
          <section>
            <h2 className="text-lg font-bold text-[#FFD700]">7. Limitation of Liability</h2>
            <p className="mt-2">
              Examstutor2 is provided "as is" without warranties. We are not liable for any indirect or consequential
              damages arising from use of the platform.
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