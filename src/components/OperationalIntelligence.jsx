import React from 'react';
import { motion } from 'framer-motion';
import { Target, Search, Map, Cpu, Zap, Brain, RefreshCw, ArrowRight } from 'lucide-react';
import DecryptedText from './DecryptedText';
import BlurText from './BlurText';

export default function OperationalIntelligence() {
  const nodes = [
    { title: "Business Goals", sub: "FOUNDATION", icon: Target },
    { title: "Operational Analysis", sub: "AUDIT", icon: Search },
    { title: "Process Architecture", sub: "BLUEPRINT", icon: Map },
    { title: "Custom Software", sub: "SYSTEM MESH", icon: Cpu },
    { title: "Automation", sub: "WORKFLOWS", icon: Zap },
    { title: "AI Decision Layer", sub: "INTELLIGENCE", icon: Brain },
    { title: "Continuous Improvement", sub: "TELEMETRY", icon: RefreshCw },
  ];

  return (
    <section className="py-24 relative z-10 bg-slate-950 text-white overflow-hidden border-y border-slate-800">
      {/* Blueprint Grid Ambient Background */}
      <div className="absolute inset-0 bg-tech-grid opacity-20 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[400px] bg-[#0052FF]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="container-visual px-4 sm:px-6 md:px-8 relative z-20 space-y-16">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0052FF]/20 border border-[#0052FF]/40 text-[#0A84FF] shadow-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-mono font-bold tracking-wider uppercase">
              <DecryptedText
                text="BLUEPRINT PIPELINE ARCHITECTURE"
                animateOn="view"
                speed={30}
                loop={true}
                loopInterval={5000}
              />
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight">
            <BlurText
              text="From Business Understanding to Operational Intelligence"
              delay={90}
              animateBy="words"
              direction="top"
            />
          </h2>

          <p className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Our architectural data and execution pipeline ensures every layer of technology builds strictly upon validated business foundations.
          </p>
        </div>

        {/* Blueprint Architecture Diagram Rail */}
        <div className="relative pt-6 overflow-x-auto pb-4 scrollbar-none">
          <div className="flex items-center justify-between min-w-[1000px] gap-2 px-4">
            {nodes.map((node, idx) => {
              const IconComp = node.icon;
              return (
                <React.Fragment key={idx}>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true, margin: "-40px" }}
                    transition={{ duration: 0.6, delay: idx * 0.08, ease: [0.16, 1, 0.3, 1] }}
                    className="bg-slate-900/90 border border-slate-800 hover:border-[#0052FF] p-4 rounded-2xl w-40 text-center font-mono space-y-2 shadow-xl shrink-0 group transition-all"
                  >
                    <div className="text-[10px] text-[#0052FF] font-bold tracking-wider">
                      {node.sub}
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-slate-800 text-white group-hover:bg-[#0052FF] flex items-center justify-center mx-auto transition-colors">
                      <IconComp className="w-5 h-5" />
                    </div>
                    <div className="text-xs font-bold text-white tracking-tight leading-snug">
                      {node.title}
                    </div>
                  </motion.div>

                  {idx < nodes.length - 1 && (
                    <motion.div
                      initial={{ opacity: 0, width: 0 }}
                      whileInView={{ opacity: 1, width: "auto" }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: idx * 0.08 + 0.04 }}
                      className="text-slate-600 shrink-0"
                    >
                      <ArrowRight className="w-4 h-4 text-[#0052FF]" />
                    </motion.div>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}
