import React, { useState } from 'react';
import { Camera, GraduationCap, Bot, Landmark, ArrowRight, ShieldCheck, ChevronRight } from 'lucide-react';
import ContactModal from '../components/ContactModal';

export default function Work() {
  const [contactOpen, setContactOpen] = useState(false);

  const projects = [
    {
      id: "diamond-capture",
      title: "Diamond Capture System",
      clientType: "Gemology & Hardware Inspection Firm",
      summary: "Automated hardware imaging and 360-degree precision gemology scanner system.",
      deliverables: ["Micro-motor hardware controller", "High-frequency camera trigger API", "Cloud 3D mesh rendering engine"],
      impact: "Reduced scan cycle from 15 minutes to 42 seconds per diamond.",
      icon: Camera,
    },
    {
      id: "institute-os",
      title: "InstituteOS Enterprise",
      clientType: "Multi-Campus Educational Institution",
      summary: "Full-scale academic enterprise operating system connecting 12,000+ students and faculty.",
      deliverables: ["Unified academic ledger", "Admissions automation portal", "Real-time timetable dispatch"],
      impact: "Eliminated 94% of paper-based administrative workflows.",
      icon: GraduationCap,
    },
    {
      id: "ai-receptionist",
      title: "Autonomous AI Receptionist",
      clientType: "Healthcare & Professional Service Operations",
      summary: "24/7 Voice AI agent handling inbound caller inquiries and scheduling.",
      deliverables: ["Low-latency voice websocket stream", "Calendar auto-scheduler", "CRM record synchronization"],
      impact: "Handled 100% of off-hours customer calls with zero missed opportunities.",
      icon: Bot,
    },
    {
      id: "atlas",
      title: "ATLAS Financial Ledger",
      clientType: "FinTech & Operational Business Network",
      summary: "Real-time transaction matching, invoice generation, and expense reconciliation system.",
      deliverables: ["Multi-bank API connector", "Automated invoice dispatch engine", "Predictive cash flow dashboard"],
      impact: "Processed over $14M in transactions with zero reconciliation errors.",
      icon: Landmark,
    },
  ];

  return (
    <div className="pt-28 pb-20 relative z-10">
      <section className="py-16 bg-tech-grid text-center">
        <div className="container-standard px-4 sm:px-6 md:px-8 space-y-4">
          <span className="text-xs font-mono font-bold tracking-wider text-[#0052FF] uppercase">
            Selected Enterprise Work
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-[#0B132B] tracking-tight">
            Engineered systems. <span className="text-[#0052FF]">Real impact.</span>
          </h1>
          <p className="text-slate-600 max-w-2xl mx-auto text-base sm:text-lg">
            A gallery of real operational platforms and custom software built for production environments.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="container-standard px-4 sm:px-6 md:px-8 space-y-12">
          {projects.map((proj, idx) => {
            const IconComponent = proj.icon;
            return (
              <div
                key={proj.id}
                className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-xl hover:shadow-2xl transition-all duration-300 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
              >
                <div className="lg:col-span-8 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-xl bg-[#0052FF] text-white shadow-md">
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="text-xs font-mono text-slate-400 uppercase">{proj.clientType}</span>
                      <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0B132B]">{proj.title}</h2>
                    </div>
                  </div>

                  <p className="text-slate-600 text-base leading-relaxed">
                    {proj.summary}
                  </p>

                  <div className="pt-2">
                    <div className="text-xs font-mono text-slate-400 uppercase tracking-wider mb-2">Key System Modules Delivered:</div>
                    <div className="flex flex-wrap gap-2">
                      {proj.deliverables.map((item, dIdx) => (
                        <span key={dIdx} className="px-3 py-1.5 rounded-lg bg-slate-100 text-xs font-medium text-slate-700">
                          ✓ {item}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-4 bg-slate-900 text-white rounded-2xl p-6 shadow-xl border border-slate-800 space-y-4 text-center">
                  <span className="text-xs font-mono text-emerald-400 uppercase font-bold tracking-wider">
                    VERIFIED PRODUCTION IMPACT
                  </span>
                  <p className="text-base font-semibold text-slate-100">
                    "{proj.impact}"
                  </p>
                  <button
                    onClick={() => setContactOpen(true)}
                    className="w-full py-3 rounded-full bg-[#0052FF] text-white font-semibold text-xs hover:bg-[#0042CC] transition-colors flex items-center justify-center gap-2"
                  >
                    <span>Discuss Similar System</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <ContactModal isOpen={contactOpen} onClose={() => setContactOpen(false)} />
    </div>
  );
}
