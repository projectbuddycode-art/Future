import React from 'react';
import { motion } from 'framer-motion';
import { Search, Layers, Compass, Code, Bot, TrendingUp, CheckCircle2 } from 'lucide-react';
import DecryptedText from './DecryptedText';
import BlurText from './BlurText';

export default function TransformationFramework() {
  const phases = [
    {
      num: "01",
      title: "Business Discovery",
      icon: Search,
      badge: "PHASE 01 // AUDIT",
      items: ["Stakeholder interviews", "Operational analysis", "Business objectives", "Current systems evaluation"]
    },
    {
      num: "02",
      title: "Process Architecture",
      icon: Layers,
      badge: "PHASE 02 // BLUEPRINT",
      items: ["Workflow mapping", "Bottleneck identification", "Responsibility mapping", "Operational blueprint"]
    },
    {
      num: "03",
      title: "System Design",
      icon: Compass,
      badge: "PHASE 03 // ARCHITECTURE",
      items: ["Platform architecture", "Integration strategy", "Data flow modeling", "User journeys & UI UX"]
    },
    {
      num: "04",
      title: "Engineering",
      icon: Code,
      badge: "PHASE 04 // SOFTWARE BUILD",
      items: ["Custom software development", "Internal platforms & dashboards", "gRPC / REST integrations", "Mobile applications"]
    },
    {
      num: "05",
      title: "Automation & AI",
      icon: Bot,
      badge: "PHASE 05 // INTELLIGENCE LAYER",
      items: ["AI assistants & knowledge copilots", "CRM intelligence & workflow automation", "Document processing & predictive insights", "Customer communication engines"],
      note: "AI removes repetitive work so your people focus on judgement, relationships, and strategic decisions."
    },
    {
      num: "06",
      title: "Continuous Optimisation",
      icon: TrendingUp,
      badge: "PHASE 06 // ENTERPRISE SCALE",
      items: ["Usage & telemetry monitoring", "Operational insights stream", "Performance & security hardening", "Continuous feature evolution"]
    }
  ];

  return (
    <section className="py-24 relative z-10 bg-white border-y border-slate-200/80">
      <div className="container-visual px-4 sm:px-6 md:px-8 space-y-16">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 shadow-xs">
            <span className="w-2 h-2 rounded-full bg-[#0052FF]" />
            <span className="text-xs font-mono font-bold tracking-wider text-[#0052FF] uppercase">
              <DecryptedText
                text="ENTERPRISE METHODOLOGY"
                animateOn="view"
                speed={30}
                loop={true}
                loopInterval={5000}
              />
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#0B132B] tracking-tight">
            <BlurText
              text="Our Transformation Framework"
              delay={90}
              animateBy="words"
              direction="top"
            />
          </h2>

          <p className="text-slate-600 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            A 6-phase engineering consultancy methodology designed to transform disconnected business operations into one unified enterprise system.
          </p>
        </div>

        {/* Vertical Timeline Phase Map */}
        <div className="relative max-w-4xl mx-auto space-y-8">
          {/* Vertical Connecting Line */}
          <div className="absolute left-6 sm:left-8 top-6 bottom-6 w-0.5 bg-slate-200 hidden sm:block" />

          {phases.map((phase, idx) => {
            const IconComp = phase.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.7, delay: idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="relative pl-0 sm:pl-16 group"
              >
                {/* Numbered Step Marker */}
                <div className="hidden sm:flex absolute left-0 top-2 w-12 h-12 rounded-2xl bg-white border-2 border-slate-200 group-hover:border-[#0052FF] text-[#0B132B] group-hover:text-[#0052FF] items-center justify-center font-mono font-extrabold text-sm shadow-md transition-colors z-10">
                  {phase.num}
                </div>

                {/* Phase Content Box */}
                <div className="bg-slate-50/90 rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-lg group-hover:border-[#0052FF]/40 group-hover:bg-white transition-all duration-300 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/70 pb-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-xl bg-[#0052FF]/10 text-[#0052FF]">
                        <IconComp className="w-5 h-5" />
                      </div>
                      <h3 className="text-xl font-extrabold text-[#0B132B] group-hover:text-[#0052FF] transition-colors">
                        {phase.title}
                      </h3>
                    </div>
                    <span className="text-xs font-mono font-bold text-[#0052FF]">
                      {phase.badge}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    {phase.items.map((item, iIdx) => (
                      <div key={iIdx} className="flex items-center gap-2 text-xs font-mono font-medium text-slate-700">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>

                  {phase.note && (
                    <div className="p-3 rounded-xl bg-blue-50/80 border border-blue-200 text-xs font-mono text-[#0052FF] font-semibold">
                      💡 {phase.note}
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
