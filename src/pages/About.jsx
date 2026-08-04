import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Layers, CheckCircle2, ArrowRight, ShieldCheck, Target, Users } from 'lucide-react';
import ContactModal from '../components/ContactModal';
import GradientText from '../components/GradientText';
import DecryptedText from '../components/DecryptedText';

export default function About() {
  const [contactOpen, setContactOpen] = useState(false);

  const cardVariant = {
    hidden: { opacity: 0, y: 24 },
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
        <div className="container-editorial px-4 sm:px-6 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 border border-slate-200 shadow-xs">
            <span className="text-xs font-mono font-bold tracking-wider text-[#0052FF] uppercase">
              <DecryptedText text="About Project Buddy" animateOn="view" speed={30} loop={true} loopInterval={5000} />
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-[#0B132B] tracking-tight">
            Business first. <br className="hidden sm:block" />
            <GradientText colors={["#0052FF", "#0A84FF", "#3B82F6", "#0052FF"]} animationSpeed={4}>
              Technology second.
            </GradientText>
          </h1>
          <p className="text-slate-600 max-w-xl mx-auto text-base sm:text-lg">
            We are a software engineering and digital systems company. We don't build generic apps; we build custom software platforms around how real businesses operate.
          </p>
        </div>
      </motion.section>

      {/* Visual Blueprint Mesh */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-60px" }}
        variants={cardVariant}
        className="py-12"
      >
        <div className="container-standard px-4 sm:px-6 md:px-8">
          <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-xl grid grid-cols-1 md:grid-cols-3 gap-6 text-center relative">
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200">
              <span className="text-xs font-mono font-bold text-[#0052FF]">LAYER 01</span>
              <h3 className="text-xl font-bold text-[#0B132B] mt-2">BUSINESS REALITY</h3>
              <p className="text-xs text-slate-500 mt-2">Operational workflows, financial margins, customer hand-offs</p>
            </div>
            
            <div className="p-6 rounded-2xl bg-[#0052FF]/10 border border-[#0052FF]/30 text-[#0052FF]">
              <span className="text-xs font-mono font-bold">CORE BRIDGE</span>
              <h3 className="text-xl font-bold text-[#0B132B] mt-2">PROJECT BUDDY</h3>
              <p className="text-xs text-slate-600 mt-2">System Design & Architectural Alignment</p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200">
              <span className="text-xs font-mono font-bold text-[#0052FF]">LAYER 02</span>
              <h3 className="text-xl font-bold text-[#0B132B] mt-2">ENGINEERING</h3>
              <p className="text-xs text-slate-500 mt-2">Custom software, AI automation, databases & APIs</p>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Editorial Statement */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-60px" }}
        variants={cardVariant}
        className="py-16"
      >
        <div className="container-editorial px-4 sm:px-6 text-center space-y-6">
          <blockquote className="text-3xl sm:text-4xl font-extrabold text-[#0B132B] leading-tight">
            “Software should fit the operation. <br className="hidden sm:block" />
            The operation shouldn't have to fit the software.”
          </blockquote>
          <p className="text-slate-600 leading-relaxed text-base">
            Off-the-shelf software forces businesses to change their processes to fit rigid SaaS paradigms.
            At Project Buddy, we flip this approach. We build software systems engineered specifically around your established business processes.
          </p>
        </div>
      </motion.section>

      {/* Principles */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-60px" }}
        variants={cardVariant}
        className="py-16 bg-slate-900/5 backdrop-blur-sm border-y border-slate-200"
      >
        <div className="container-standard px-4 sm:px-6 md:px-8 space-y-8">
          <h2 className="text-2xl font-bold text-[#0B132B] text-center">Our Core Engineering Principles</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-2">
              <span className="text-xs font-mono font-bold text-[#0052FF]">PRINCIPLE 01</span>
              <h3 className="text-lg font-bold text-[#0B132B]">No Fake Workarounds</h3>
              <p className="text-xs text-slate-600">We solve underlying operational root causes instead of applying superficial visual patches.</p>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-2">
              <span className="text-xs font-mono font-bold text-[#0052FF]">PRINCIPLE 02</span>
              <h3 className="text-lg font-bold text-[#0B132B]">Production Reliability</h3>
              <p className="text-xs text-slate-600">Every system is tested against real-world scale, security edge cases, and high-concurrency loads.</p>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-2">
              <span className="text-xs font-mono font-bold text-[#0052FF]">PRINCIPLE 03</span>
              <h3 className="text-lg font-bold text-[#0B132B]">Clear Ownership</h3>
              <p className="text-xs text-slate-600">You own your custom software systems, IP, and data structures completely without vendor lock-in.</p>
            </div>
          </div>
        </div>
      </motion.section>

      <section className="py-16 text-center">
        <button
          onClick={() => setContactOpen(true)}
          className="px-8 py-3.5 rounded-full bg-[#0052FF] text-white font-semibold text-sm hover:bg-[#0042CC] shadow-md transition-all inline-flex items-center gap-2 transform hover:-translate-y-0.5"
        >
          <span>Connect With Leadership</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </section>

      <ContactModal isOpen={contactOpen} onClose={() => setContactOpen(false)} />
    </div>
  );
}
