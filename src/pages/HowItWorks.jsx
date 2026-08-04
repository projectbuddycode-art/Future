import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle2, RefreshCw, Terminal, Layers } from 'lucide-react';
import ContactModal from '../components/ContactModal';
import GradientText from '../components/GradientText';
import DecryptedText from '../components/DecryptedText';

export default function HowItWorks() {
  const [contactOpen, setContactOpen] = useState(false);

  const stages = [
    {
      num: "01",
      name: "UNDERSTAND",
      subtitle: "Deconstruct Operations",
      details: "We perform deep-dive discovery into your existing business process workflows, identifying manual bottlenecks, redundant data entry, and system failure points.",
      deliverable: "Operational Bottleneck Map & Requirement Specs",
    },
    {
      num: "02",
      name: "MAP",
      subtitle: "Diagram Logic Mesh",
      details: "We formalize precise data flows, user role permissions, event triggers, and state transitions required to run your operation seamlessly.",
      deliverable: "Interactive Flow Diagram & System Wireframes",
    },
    {
      num: "03",
      name: "ARCHITECT",
      subtitle: "System & API Design",
      details: "We define database schemas, microservice boundaries, API endpoints, hardware device protocols, and security models.",
      deliverable: "Complete Technical Architecture Document",
    },
    {
      num: "04",
      name: "ENGINEER",
      subtitle: "High-Performance Build",
      details: "Our engineering team develops clean, modular, and maintainable software code, AI workflow handlers, and custom user interfaces.",
      deliverable: "Production Codebase & Automated Test Suite",
    },
    {
      num: "05",
      name: "INTEGRATE",
      subtitle: "Connect Existing Stack",
      details: "We establish secure API bridges between your legacy databases, third-party software tools, and hardware equipment.",
      deliverable: "Unified API Mesh & Live Webhooks",
    },
    {
      num: "06",
      name: "DEPLOY",
      subtitle: "Cloud Infrastructure Launch",
      details: "We provision resilient cloud environments with zero-downtime deployment pipelines, SSL security, and automated database backups.",
      deliverable: "Production Infrastructure & SLA Environment",
    },
    {
      num: "07",
      name: "OPTIMIZE",
      subtitle: "Telemetry & Refinement",
      details: "We monitor real-time system performance, error logs, and user activity, iteratively refining performance for maximum efficiency.",
      deliverable: "24/7 Telemetry & Continuous Upgrades",
    },
  ];

  const cardVariant = {
    hidden: { opacity: 0, y: 28 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } }
  };

  return (
    <div className="pt-28 pb-20 relative z-10">
      
      {/* Hero */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="py-16 bg-tech-grid text-center"
      >
        <div className="container-standard px-4 sm:px-6 md:px-8 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 border border-slate-200 shadow-xs">
            <span className="text-xs font-mono font-bold tracking-wider text-[#0052FF] uppercase">
              <DecryptedText text="Engineering Methodology" animateOn="view" speed={30} loop={true} loopInterval={5000} />
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-[#0B132B] tracking-tight">
            From disconnected operation <br className="hidden sm:block" />
            <GradientText colors={["#0052FF", "#0A84FF", "#3B82F6", "#0052FF"]} animationSpeed={4}>
              to one working system.
            </GradientText>
          </h1>
          <p className="text-slate-600 max-w-2xl mx-auto text-base sm:text-lg">
            Our 7-stage operational engineering methodology ensures every line of code serves a clear business purpose.
          </p>
        </div>
      </motion.section>

      {/* 7-Stage Detailed Story with Motion Scroll Reveals */}
      <section className="py-16">
        <div className="container-editorial px-4 sm:px-6 space-y-10">
          {stages.map((stg, idx) => (
            <motion.div
              key={stg.num}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              variants={cardVariant}
              className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200 shadow-xl relative overflow-hidden group hover:border-[#0052FF] transition-all duration-300"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-mono font-bold text-white bg-[#0052FF] px-3 py-1 rounded-lg">
                    STAGE {stg.num}
                  </span>
                  <h2 className="text-2xl font-extrabold text-[#0B132B]">
                    {stg.name}
                  </h2>
                </div>
                <span className="text-xs font-mono text-slate-400 uppercase">
                  {stg.subtitle}
                </span>
              </div>

              <div className="pt-6 space-y-4">
                <p className="text-slate-600 text-base leading-relaxed">
                  {stg.details}
                </p>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between text-xs">
                  <span className="font-mono text-slate-500">STAGE DELIVERABLE:</span>
                  <span className="font-bold text-[#0052FF] flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    {stg.deliverable}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="py-16 bg-[#0B132B] text-white text-center"
      >
        <div className="container-editorial px-4 sm:px-6 space-y-6">
          <h2 className="text-3xl font-extrabold">Ready to transform your operations?</h2>
          <button
            onClick={() => setContactOpen(true)}
            className="px-8 py-4 rounded-full bg-[#0052FF] text-white font-semibold text-sm hover:bg-[#0042CC] shadow-lg transition-all inline-flex items-center gap-2 transform hover:-translate-y-0.5"
          >
            <span>Schedule Discovery Discussion</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </motion.section>

      <ContactModal isOpen={contactOpen} onClose={() => setContactOpen(false)} />
    </div>
  );
}
