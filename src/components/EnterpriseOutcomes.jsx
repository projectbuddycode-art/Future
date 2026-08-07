import React from 'react';
import { motion } from 'framer-motion';
import { Clock, Eye, Layers, Zap, TrendingUp, ShieldCheck, DollarSign } from 'lucide-react';
import DecryptedText from './DecryptedText';
import BlurText from './BlurText';

export default function EnterpriseOutcomes() {
  const outcomes = [
    {
      metric: "85%",
      label: "REDUCED MANUAL WORK",
      icon: Clock,
      desc: "Eliminates repetitive data entry, spreadsheets, and manual hand-offs across departments."
    },
    {
      metric: "100%",
      label: "OPERATIONAL VISIBILITY",
      icon: Eye,
      desc: "Real-time telemetry and executive control room dashboards across all business functions."
    },
    {
      metric: "UNIFIED",
      label: "INTEGRATED SYSTEMS",
      icon: Layers,
      desc: "Connects isolated tools, ERPs, CRMs, and hardware into one single source of truth."
    },
    {
      metric: "REALTIME",
      label: "FASTER DECISION MAKING",
      icon: Zap,
      desc: "Instant operational data streams enable leaders to respond to issues immediately."
    },
    {
      metric: "3.4X",
      label: "HIGHER PRODUCTIVITY",
      icon: TrendingUp,
      desc: "Empowers teams to focus on customer relationships, strategy, and judgment over admin tasks."
    },
    {
      metric: "ENTERPRISE",
      label: "SCALABLE OPERATIONS",
      icon: ShieldCheck,
      desc: "Cloud-native microservices architecture designed to expand cleanly as revenue grows."
    },
    {
      metric: "MEASURABLE",
      label: "INCREASED PROFITABILITY",
      icon: DollarSign,
      desc: "Direct ROI driven by lower operational overhead, zero error rate, and faster delivery."
    }
  ];

  return (
    <section className="py-24 relative z-10 bg-slate-900 text-white overflow-hidden border-y border-slate-800">
      <div className="container-visual px-4 sm:px-6 md:px-8 space-y-16">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0052FF]/20 border border-[#0052FF]/40 text-[#0A84FF] shadow-xs">
            <span className="w-2 h-2 rounded-full bg-[#0052FF] animate-pulse" />
            <span className="text-xs font-mono font-bold tracking-wider uppercase">
              <DecryptedText
                text="MEASURABLE BUSINESS IMPACT"
                animateOn="view"
                speed={30}
                loop={true}
                loopInterval={5000}
              />
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight">
            <BlurText
              text="Enterprise Outcomes Delivered"
              delay={90}
              animateBy="words"
              direction="top"
            />
          </h2>

          <p className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            We don't measure success by lines of code written. We measure success by the operational efficiency and financial performance of your business.
          </p>
        </div>

        {/* Outcomes Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {outcomes.map((item, idx) => {
            const IconComp = item.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.6, delay: idx * 0.08, ease: [0.16, 1, 0.3, 1] }}
                className="bg-slate-900/90 rounded-3xl p-6 border border-slate-800 hover:border-[#0052FF] shadow-xl hover:shadow-2xl transition-all duration-300 space-y-4 flex flex-col justify-between group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl sm:text-3xl font-mono font-extrabold text-[#0A84FF] group-hover:text-white transition-colors">
                      {item.metric}
                    </span>
                    <div className="p-2.5 rounded-xl bg-slate-800 text-[#0052FF] group-hover:bg-[#0052FF] group-hover:text-white transition-colors">
                      <IconComp className="w-5 h-5" />
                    </div>
                  </div>

                  <h3 className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">
                    {item.label}
                  </h3>

                  <p className="text-xs text-slate-400 leading-relaxed">
                    {item.desc}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono text-emerald-400">
                  <span>VERIFIED OUTCOME</span>
                  <span>100% OPERATIONAL</span>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
