import React from 'react';
import { Link } from 'wouter';
import { ArrowUpRight, ShieldCheck, Mail, Linkedin, ExternalLink } from 'lucide-react';
import ProjectBuddyLogo from './ProjectBuddyLogo';

export default function Footer() {
  return (
    <footer className="relative z-10 border-t border-slate-200/80 bg-white/80 backdrop-blur-md pt-16 pb-12">
      <div className="container-standard px-4 sm:px-6 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-slate-200/60">
          
          {/* Brand Column */}
          <div className="md:col-span-5 space-y-4">
            <Link href="/">
              <ProjectBuddyLogo showTagline={true} />
            </Link>
            <p className="text-sm text-slate-600 leading-relaxed max-w-md">
              Project Buddy is a software engineering and digital systems company.
              We design and engineer custom software, operational platforms, AI automation, and integrated enterprise systems.
            </p>
            <div className="pt-2 flex items-center gap-3">
              <a
                href="mailto:info@projectbuddy.co.in"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 text-xs font-medium text-slate-700 hover:text-[#0052FF] hover:bg-[#0052FF]/10 transition-colors"
              >
                <Mail className="w-3.5 h-3.5" />
                info@projectbuddy.co.in
              </a>
              <a
                href="https://www.linkedin.com/in/shivamdubey-pb"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 text-xs font-medium text-slate-700 hover:text-[#0052FF] hover:bg-[#0052FF]/10 transition-colors"
              >
                <Linkedin className="w-3.5 h-3.5" />
                LinkedIn
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-mono font-semibold tracking-wider text-slate-400 uppercase">
              Engineering & Systems
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/services" className="text-slate-600 hover:text-[#0052FF] transition-colors">
                  Custom Software & Services
                </Link>
              </li>
              <li>
                <Link href="/systems" className="text-slate-600 hover:text-[#0052FF] transition-colors">
                  Operational Control Systems
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" className="text-slate-600 hover:text-[#0052FF] transition-colors">
                  7-Stage Engineering Process
                </Link>
              </li>
            </ul>
          </div>

          {/* Company Links */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="text-xs font-mono font-semibold tracking-wider text-slate-400 uppercase">
              Company & Direct Contact
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="text-slate-600 hover:text-[#0052FF] transition-colors">
                  About Project Buddy
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-slate-600 hover:text-[#0052FF] transition-colors">
                  Project Discussion Pathways
                </Link>
              </li>
              <li>
                <a
                  href="https://calendly.com/projectbuddy/project-discussion"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-600 hover:text-[#0052FF] transition-colors flex items-center gap-1"
                >
                  Schedule Technical Call
                  <ArrowUpRight className="w-3.5 h-3.5 text-slate-400" />
                </a>
              </li>
              <li>
                <Link href="/privacy" className="text-slate-600 hover:text-[#0052FF] transition-colors">
                  Privacy Policy & Data Security
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Absolute Bottom Bar with Subtle Admin Link */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#0052FF]" />
            <span>© {new Date().getFullYear()} Project Buddy. Turn idea into reality.</span>
          </div>

          {/* Subtle Privacy & Admin Footer Links */}
          <div className="flex items-center gap-4 text-slate-400">
            <Link href="/privacy" className="hover:text-slate-600 transition-colors">
              Privacy
            </Link>
            <span>•</span>
            <Link href="/admin" className="hover:text-slate-600 transition-colors opacity-70 hover:opacity-100">
              Admin
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
