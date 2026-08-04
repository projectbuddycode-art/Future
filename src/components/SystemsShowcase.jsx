import React from 'react';
import { Link } from 'wouter';
import { Camera, GraduationCap, Bot, Landmark, ArrowRight, ShieldCheck, ChevronRight } from 'lucide-react';

export default function SystemsShowcase() {
  const systems = [
    {
      id: "diamond-capture",
      title: "Diamond Capture System",
      category: "HARDWARE & COMPUTER VISION PLATFORM",
      description: "Automated high-precision diamond imaging, lighting array synchronization, micro-motor device control, and cloud capture engine.",
      nodes: ["CAMERA", "CAPTURE ENGINE", "DEVICE CONTROL", "MOTOR", "LIGHTING"],
      icon: Camera,
      badge: "Industrial IoT",
      metrics: "360° Automated Scan · Micro-Precision",
    },
    {
      id: "institute-os",
      title: "InstituteOS",
      category: "EDUCATIONAL ENTERPRISE OPERATING SYSTEM",
      description: "End-to-end institution management connecting student admissions, academic grading, financial ledgers, and operational scheduling.",
      nodes: ["ADMISSIONS", "ACADEMICS", "FINANCE", "SCHEDULING", "OPERATIONS"],
      icon: GraduationCap,
      badge: "Enterprise OS",
      metrics: "Unified Campus Management",
    },
    {
      id: "ai-receptionist",
      title: "AI Receptionist",
      category: "AUTONOMOUS VOICE & SERVICE AUTOMATION",
      description: "Conversational voice intelligence handling inbound client calls, calendar scheduling, CRM record sync, and real-time support escalation.",
      nodes: ["CUSTOMER", "AI RECEPTION", "CRM", "CALENDAR", "SUPPORT", "WORKFLOW"],
      icon: Bot,
      badge: "Voice & AI Workflows",
      metrics: "24/7 Zero Latency Call Handling",
    },
    {
      id: "atlas",
      title: "ATLAS",
      category: "FINANCIAL OPERATIONS & LEDGER PLATFORM",
      description: "Real-time transaction tracking, automated invoice generation, expense reconciliation, and executive cash-flow reporting engine.",
      nodes: ["TRANSACTIONS", "INVOICES", "EXPENSES", "CASH FLOW", "REPORTING"],
      icon: Landmark,
      badge: "FinTech Platform",
      metrics: "Real-time Reconciliation Engine",
    },
  ];

  return (
    <section className="py-24 relative z-10 bg-slate-900/5 backdrop-blur-sm border-y border-slate-200/60">
      <div className="container-visual px-4 sm:px-6 md:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-[#0052FF]" />
              <span className="text-xs font-mono font-bold tracking-wider text-[#0052FF] uppercase">
                Selected Systems
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-[#0B132B]">
              Engineered systems in production.
            </h2>
          </div>
          <p className="text-slate-600 max-w-md text-sm sm:text-base">
            Detailed operational software platforms designed and built by Project Buddy for real enterprise operations.
          </p>
        </div>

        {/* Alternate Showcase Composition */}
        <div className="space-y-12">
          {systems.map((sys, idx) => {
            const IconComponent = sys.icon;
            const isEven = idx % 2 === 0;

            return (
              <div
                key={sys.id}
                className={`flex flex-col ${
                  isEven ? "lg:flex-row" : "lg:flex-row-reverse"
                } gap-8 items-center bg-white rounded-3xl p-6 sm:p-8 md:p-10 border border-slate-200/90 shadow-xl hover:shadow-2xl transition-all duration-300 group`}
              >
                {/* Text Content */}
                <div className="flex-1 space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 rounded-full bg-[#0052FF]/10 text-[#0052FF] text-xs font-mono font-semibold">
                      {sys.badge}
                    </span>
                    <span className="text-xs font-mono text-slate-400">
                      {sys.category}
                    </span>
                  </div>

                  <h3 className="text-2xl sm:text-3xl font-extrabold text-[#0B132B] group-hover:text-[#0052FF] transition-colors">
                    {sys.title}
                  </h3>

                  <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                    {sys.description}
                  </p>

                  {/* Operational Nodes Mesh */}
                  <div className="pt-2">
                    <div className="text-xs font-mono text-slate-400 mb-2">SYSTEM PIPELINE NODES:</div>
                    <div className="flex flex-wrap gap-2">
                      {sys.nodes.map((node, nIdx) => (
                        <span
                          key={nIdx}
                          className="px-2.5 py-1 rounded-md bg-slate-100 border border-slate-200 text-[11px] font-mono font-semibold text-slate-700"
                        >
                          {node}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 flex items-center justify-between border-t border-slate-100">
                    <span className="text-xs font-mono text-emerald-600 font-semibold flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      {sys.metrics}
                    </span>
                    <Link
                      href="/systems"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0052FF] hover:gap-2.5 transition-all"
                    >
                      View System Details
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>

                {/* Code-Generated Software Diagram Visual */}
                <div className="w-full lg:w-[480px] h-64 sm:h-72 rounded-2xl bg-slate-950 p-5 shadow-2xl border border-slate-800 flex flex-col justify-between relative overflow-hidden font-mono">
                  {/* Subtle Node Connector Lines inside card */}
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3 text-xs">
                    <div className="flex items-center gap-2">
                      <IconComponent className="w-4 h-4 text-[#0052FF]" />
                      <span className="text-slate-200 font-bold">{sys.title} Engine</span>
                    </div>
                    <span className="text-emerald-400 text-[10px]">VERIFIED PIPELINE</span>
                  </div>

                  {/* Flow Diagram */}
                  <div className="grid grid-cols-3 gap-2 my-auto">
                    {sys.nodes.slice(0, 3).map((n, i) => (
                      <div key={i} className="bg-slate-900 border border-slate-800 p-2.5 rounded-lg text-center">
                        <div className="text-[9px] text-[#0052FF] font-bold">{`NODE_0${i+1}`}</div>
                        <div className="text-xs text-slate-200 font-semibold mt-1">{n}</div>
                      </div>
                    ))}
                  </div>

                  <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-400">
                    <span>STATUS: ACTIVE_PRODUCTION</span>
                    <span className="text-blue-400">PROJECT BUDDY ENGINE</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* View All CTA */}
        <div className="mt-12 text-center">
          <Link
            href="/systems"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white border border-slate-200 text-sm font-semibold text-[#0B132B] hover:border-[#0052FF] hover:text-[#0052FF] shadow-sm transition-all"
          >
            Explore All Production Systems →
          </Link>
        </div>
      </div>
    </section>
  );
}
