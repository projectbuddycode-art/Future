import React from 'react';
import { Link } from 'wouter';
import { motion } from 'framer-motion';
import { useCMS } from '../context/CMSContext';
import { resolveCmsMedia } from '../utils/cmsMedia';
import CmsMedia from './CmsMedia';
import { Camera, GraduationCap, Bot, Landmark, ArrowRight, ShieldCheck, ChevronRight } from 'lucide-react';

export default function SystemsShowcase() {
  const { cmsState } = useCMS();

  // Resolve CMS Media assets for each system slot
  const cmsDiamond = resolveCmsMedia(cmsState, 'home.systems.diamondCapture');
  const cmsInstitute = resolveCmsMedia(cmsState, 'home.systems.instituteOS');
  const cmsAiReception = resolveCmsMedia(cmsState, 'home.systems.aiReceptionist');
  const cmsAtlas = resolveCmsMedia(cmsState, 'home.systems.atlas');

  const systems = [
    {
      id: "diamond-capture",
      slotId: "home.systems.diamondCapture",
      num: "01",
      title: "Diamond Capture System",
      category: "HARDWARE × SOFTWARE × AUTOMATION",
      badge: "Industrial IoT OS",
      description: "Automated high-precision diamond imaging, lighting array synchronization, micro-motor device control, and cloud capture engine.",
      nodes: ["CAMERA", "CAPTURE ENGINE", "DEVICE CONTROL", "MOTOR", "LIGHTING"],
      icon: Camera,
      metrics: "360° Automated Scan · Micro-Precision",
      cmsMedia: cmsDiamond,
    },
    {
      id: "institute-os",
      slotId: "home.systems.instituteOS",
      num: "02",
      title: "InstituteOS",
      category: "EDUCATION OPERATIONS PLATFORM",
      badge: "Enterprise Operating System",
      description: "End-to-end institution management connecting student admissions, academic grading, financial ledgers, and operational scheduling.",
      nodes: ["ADMISSIONS", "ACADEMICS", "FINANCE", "SCHEDULING", "OPERATIONS"],
      icon: GraduationCap,
      metrics: "12,000+ Active Users · Unified Campus Management",
      cmsMedia: cmsInstitute,
    },
    {
      id: "ai-receptionist",
      slotId: "home.systems.aiReceptionist",
      num: "03",
      title: "AI Receptionist",
      category: "AI × CRM × WORKFLOW AUTOMATION",
      badge: "Autonomous Voice Engine",
      description: "Conversational voice intelligence handling inbound client calls, calendar scheduling, CRM record sync, and real-time support escalation.",
      nodes: ["CUSTOMER", "AI RECEPTION", "CRM", "CALENDAR", "SUPPORT"],
      icon: Bot,
      metrics: "24/7 Zero-Latency Call Dispatch",
      cmsMedia: cmsAiReception,
    },
    {
      id: "atlas",
      slotId: "home.systems.atlas",
      num: "04",
      title: "ATLAS",
      category: "FINANCIAL OPERATIONS & LEDGER PLATFORM",
      badge: "FinTech Platform",
      description: "Real-time transaction tracking, automated invoice generation, expense reconciliation, and executive cash-flow reporting engine.",
      nodes: ["TRANSACTIONS", "INVOICES", "EXPENSES", "CASH FLOW", "REPORTING"],
      icon: Landmark,
      metrics: "$14M+ Reconciled Transactions",
      cmsMedia: cmsAtlas,
    },
  ];

  return (
    <section className="py-24 relative z-10 bg-slate-900/5 backdrop-blur-sm border-y border-slate-200/60">
      <div className="container-visual px-4 sm:px-6 md:px-8 space-y-16">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <span className="text-xs font-mono font-bold tracking-wider text-[#0052FF] uppercase">
              03 // SELECTED SYSTEMS
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-[#0B132B]">
              Engineered systems in production.
            </h2>
          </div>
          <p className="text-slate-600 max-w-md text-sm sm:text-base leading-relaxed">
            Detailed operational software platforms designed and built by Project Buddy for real enterprise operations.
          </p>
        </div>

        {/* Alternate Case-Study Rail Composition */}
        <div className="space-y-12 sm:space-y-16">
          {systems.map((sys, idx) => {
            const IconComponent = sys.icon;
            const isEven = idx % 2 === 0;

            const defaultDiagramFallback = (
              <div className="w-full h-full bg-slate-950 p-6 shadow-2xl border border-slate-800 flex flex-col justify-between relative overflow-hidden font-mono text-xs">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <IconComponent className="w-4 h-4 text-[#0052FF]" />
                    <span className="text-slate-200 font-bold">{sys.title} Engine</span>
                  </div>
                  <span className="text-emerald-400 text-[10px]">VERIFIED PIPELINE</span>
                </div>

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
                  <span className="text-blue-400">PROJECT BUDDY OS</span>
                </div>
              </div>
            );

            return (
              <motion.div
                key={sys.id}
                initial={{ opacity: 0, scale: 0.97, y: 32 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                className={`flex flex-col ${
                  isEven ? "lg:flex-row" : "lg:flex-row-reverse"
                } gap-8 items-center bg-white rounded-3xl p-6 sm:p-8 md:p-10 border border-slate-200/90 shadow-xl hover:shadow-2xl transition-all duration-300 group`}
              >
                {/* Text & Case-Study Content */}
                <div className="flex-1 space-y-4 w-full">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl sm:text-3xl font-mono font-extrabold text-[#0052FF]">
                      {sys.num}
                    </span>
                    <span className="px-3 py-1 rounded-full bg-[#0052FF]/10 text-[#0052FF] text-xs font-mono font-bold">
                      {sys.badge}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <div className="text-xs font-mono text-slate-400 font-bold uppercase tracking-wider">
                      {sys.category}
                    </div>
                    <h3 className="text-2xl sm:text-3xl font-extrabold text-[#0B132B] group-hover:text-[#0052FF] transition-colors">
                      {sys.title}
                    </h3>
                  </div>

                  <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                    {sys.description}
                  </p>

                  {/* System Nodes Pipeline */}
                  <div className="pt-2">
                    <div className="text-[11px] font-mono text-slate-400 mb-2 font-bold">SYSTEM NODES PIPELINE:</div>
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
                    <span className="text-xs font-mono text-emerald-600 font-semibold flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4" />
                      {sys.metrics}
                    </span>
                    <Link
                      href="/systems"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0052FF] hover:gap-2.5 transition-all"
                    >
                      <span>Explore System</span>
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>

                {/* System Visual Showcase Surface (Aspect Ratio ~16/10) */}
                <div className="w-full lg:w-[500px] h-64 sm:h-72 md:h-80 rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden relative shadow-2xl shrink-0">
                  <CmsMedia
                    asset={sys.cmsMedia}
                    className="w-full h-full object-cover"
                    fallback={defaultDiagramFallback}
                    interactiveHover
                  />
                </div>

              </motion.div>
            );
          })}
        </div>

        {/* View All Systems CTA */}
        <div className="text-center pt-4">
          <Link
            href="/systems"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-white border border-slate-200 text-xs font-semibold text-[#0B132B] hover:border-[#0052FF] hover:text-[#0052FF] shadow-sm transition-all transform hover:-translate-y-0.5"
          >
            <span>Explore All Production Systems</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </section>
  );
}
