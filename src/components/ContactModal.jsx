import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Mail, Linkedin, X, ArrowUpRight, ShieldCheck } from 'lucide-react';

export default function ContactModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const pathways = [
    {
      title: "Schedule a Project Discussion",
      description: "Book a 30-minute technical discovery call with our engineering team.",
      actionText: "Open Calendly",
      href: "https://calendly.com/projectbuddy/project-discussion",
      icon: Calendar,
      primary: true,
    },
    {
      title: "Email Project Buddy",
      description: "Direct email for RFPs, technical architecture docs, or inquiry briefs.",
      actionText: "info@projectbuddy.co.in",
      href: "mailto:info@projectbuddy.co.in",
      icon: Mail,
      primary: false,
    },
    {
      title: "Connect on LinkedIn",
      description: "Connect directly with leadership for strategic software discussions.",
      actionText: "Shivam Dubey on LinkedIn",
      href: "https://www.linkedin.com/in/shivamdubey-pb",
      icon: Linkedin,
      primary: false,
    },
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-[#0B132B]/40 backdrop-blur-md"
        />

        {/* Modal Surface */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 12 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-xl bg-white/95 rounded-2xl p-6 sm:p-8 shadow-2xl border border-slate-200/80 backdrop-blur-xl z-10 overflow-hidden"
        >
          {/* Subtle Ambient Light Wash inside modal */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#0052FF]/10 rounded-full blur-3xl pointer-events-none" />

          {/* Header */}
          <div className="flex items-start justify-between mb-6 pb-4 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2 h-2 rounded-full bg-[#0052FF] animate-pulse" />
                <span className="text-xs font-semibold tech-mono tracking-wider text-[#0052FF] uppercase">
                  Direct Pathways
                </span>
              </div>
              <h3 className="text-2xl font-bold tracking-tight text-[#0B132B]">
                Start a Project Discussion
              </h3>
              <p className="text-sm text-slate-500 mt-1">
                No lengthy forms. Connect directly with our software engineering leads.
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              aria-label="Close dialogue"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Options */}
          <div className="space-y-3">
            {pathways.map((item, idx) => {
              const IconComponent = item.icon;
              return (
                <a
                  key={idx}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`group flex items-start gap-4 p-4 rounded-xl border transition-all duration-200 ${
                    item.primary
                      ? "bg-[#0052FF]/[0.03] border-[#0052FF]/30 hover:border-[#0052FF] hover:bg-[#0052FF]/[0.07]"
                      : "bg-white border-slate-200/80 hover:border-slate-300 hover:bg-slate-50/80"
                  }`}
                >
                  <div className={`p-2.5 rounded-lg ${
                    item.primary ? "bg-[#0052FF] text-white" : "bg-slate-100 text-[#0B132B]"
                  }`}>
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="text-base font-semibold text-[#0B132B] group-hover:text-[#0052FF] transition-colors">
                        {item.title}
                      </h4>
                      <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-[#0052FF] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                      {item.description}
                    </p>
                    <span className="inline-block mt-2 text-xs font-mono font-medium text-[#0052FF]">
                      {item.actionText} →
                    </span>
                  </div>
                </a>
              );
            })}
          </div>

          {/* Footer note */}
          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#0052FF]" />
              <span>Project Buddy Engineering Office · India</span>
            </div>
            <span>NDA protected</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
