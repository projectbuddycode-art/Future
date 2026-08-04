import React from 'react';
import { ShieldCheck, Lock, FileText } from 'lucide-react';

export default function Privacy() {
  return (
    <div className="pt-28 pb-20 relative z-10">
      <section className="py-16 bg-tech-grid text-center">
        <div className="container-editorial px-4 sm:px-6 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 text-white text-xs font-mono">
            <Lock className="w-3.5 h-3.5 text-[#0052FF]" />
            <span>DATA GOVERNANCE STANDARD</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-[#0B132B] tracking-tight">
            Privacy Policy & Security Standard
          </h1>
          <p className="text-slate-600 text-sm sm:text-base">
            Project Buddy is committed to maintaining strict data privacy, enterprise confidentiality, and zero-trust security.
          </p>
        </div>
      </section>

      <section className="py-12">
        <div className="container-editorial px-4 sm:px-6 bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-lg space-y-8 text-slate-700 leading-relaxed text-sm">
          
          <div className="space-y-3">
            <h2 className="text-xl font-bold text-[#0B132B]">1. Overview & Business Intent</h2>
            <p>
              Project Buddy ("we", "our", "us") operates the website <a href="https://www.projectbuddy.co.in/" className="text-[#0052FF] underline">https://www.projectbuddy.co.in/</a>.
              As a software engineering and digital systems firm, we respect your privacy and process data solely to communicate regarding legitimate software projects and enterprise technical inquiries.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-xl font-bold text-[#0B132B]">2. Information We Collect</h2>
            <p>
              We do not track visitors with intrusive third-party advertising scripts.
              When you initiate contact via Calendly, direct email (<a href="mailto:info@projectbuddy.co.in" className="text-[#0052FF]">info@projectbuddy.co.in</a>), or LinkedIn, we process only the technical project details and contact credentials you voluntarily provide.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-xl font-bold text-[#0B132B]">3. Intellectual Property & Confidentiality</h2>
            <p>
              All technical specifications, codebase architecture, and operational workflows shared during project discussions are governed by strict non-disclosure obligations (NDA). We do not resell, share, or train AI models on client operational data without explicit authorization.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-xl font-bold text-[#0B132B]">4. Technical Security Measures</h2>
            <p>
              Our web platform uses SSL encryption (HTTPS), content security policies, and zero-trust network protocols. We continuously review our codebases to prevent cross-site scripting (XSS), SQL injection, and unauthorized data exposure.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-xl font-bold text-[#0B132B]">5. Contact & Governance Inquiries</h2>
            <p>
              For privacy or security inquiries, email our technical lead directly at <a href="mailto:info@projectbuddy.co.in" className="text-[#0052FF] font-semibold">info@projectbuddy.co.in</a>.
            </p>
          </div>

          <div className="pt-6 border-t border-slate-200 flex items-center justify-between text-xs text-slate-400 font-mono">
            <span>Last Updated: August 2026</span>
            <span>Project Buddy Engineering Office</span>
          </div>

        </div>
      </section>
    </div>
  );
}
