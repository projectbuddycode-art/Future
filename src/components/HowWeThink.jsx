import React from 'react';
import { motion } from 'framer-motion';
import { Building2, Search, Map, Cpu, Zap, BarChart2, TrendingUp, ArrowRight } from 'lucide-react';
import DecryptedText from './DecryptedText';
import BlurText from './BlurText';

export default function HowWeThink() {
  const steps = [
    {
      num: "01",
      title: "Business",
      sub: "People & Operations",
      icon: Building2,
      desc: "Analyze existing team workflows, customer touchpoints, and business goals."
    },
    {
      num: "02",
      title: "Understand",
      sub: "Deep Operational Audit",
      icon: Search,
      desc: "Identify manual friction, data silos, bottlenecks, and growth constraints."
    },
    {
      num: "03",
      title: "Map",
      sub: "Process Blueprint",
      icon: Map,
      desc: "Architect the connected operational blueprint fitting your exact reality."
    },
    {
      num: "04",
      title: "Engineer",
      sub: "Custom Software",
      icon: Cpu,
      desc: "Build robust internal platforms, enterprise software, and system mesh."
    },
    {
      num: "05",
      title: "Automate",
      sub: "AI & Workflow Engines",
      icon: Zap,
      desc: "Deploy intelligent automation to eliminate repetitive operational work."
    },
    {
      num: "06",
      title: "Measure",
      sub: "Telemetry & Dashboards",
      icon: BarChart2,
      desc: "Track real-time performance, system accuracy, and operational efficiency."
    },
    {
      num: "07",
      title: "Improve",
      sub: "Continuous Growth",
      icon: TrendingUp,
      desc: "Iteratively refine systems as your enterprise expands and scales."
    }
  ];

  return (
    <section className="py-24 relative z-10 bg-slate-900/5 border-y border-slate-200/80">
      <div className="container-visual px-4 sm:px-6 md:px-8 space-y-16">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-slate-200 shadow-xs">
            <span className="w-2 h-2 rounded-full bg-[#0052FF]" />
            <span className="text-xs font-mono font-bold tracking-wider text-[#0052FF] uppercase">
              <DecryptedText
                text="ENGINEERING METHODOLOGY"
                animateOn="view"
                speed={30}
                loop={true}
                loopInterval={5000}
              />
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#0B132B] tracking-tight leading-tight">
            <BlurText
              text="We don't start with AI. We start with understanding your business."
              delay={90}
              animateBy="words"
              direction="top"
            />
          </h2>

          <p className="text-slate-600 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Every successful company already has people, workflows, customers, data, operations and decision-making processes. Before technology is introduced, we understand how your business actually operates. Only then do we engineer software, automation and AI around your organisation—not the other way around.
          </p>
        </div>

        {/* Animated Horizontal Progressive Workflow Mesh */}
        <div className="relative pt-4">
          <div className="grid grid-cols-1 md:grid-cols-7 gap-4 relative">
            {steps.map((step, idx) => {
              const IconComp = step.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.6, delay: idx * 0.08, ease: [0.16, 1, 0.3, 1] }}
                  className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-md hover:border-[#0052FF]/40 hover:shadow-xl transition-all duration-300 group relative flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-[#0052FF]">{step.num}</span>
                      <div className="p-2 rounded-xl bg-slate-100 group-hover:bg-[#0052FF] text-[#0B132B] group-hover:text-white transition-colors">
                        <IconComp className="w-4 h-4" />
                      </div>
                    </div>

                    <div>
                      <h3 className="text-sm font-extrabold text-[#0B132B] group-hover:text-[#0052FF] transition-colors">
                        {step.title}
                      </h3>
                      <div className="text-[10px] font-mono text-slate-400 font-bold uppercase mt-0.5">
                        {step.sub}
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed">
                      {step.desc}
                    </p>
                  </div>

                  {idx < steps.length - 1 && (
                    <div className="hidden md:block absolute -right-3 top-1/2 -translate-y-1/2 z-20 text-slate-300">
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}
