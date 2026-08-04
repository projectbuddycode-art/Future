import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Camera, GraduationCap, Bot, Landmark, ShieldCheck, ArrowRight, Activity, Terminal } from 'lucide-react';
import ContactModal from '../components/ContactModal';
import GradientText from '../components/GradientText';
import DecryptedText from '../components/DecryptedText';

export default function Systems() {
  const [contactOpen, setContactOpen] = useState(false);
  const [selectedSystem, setSelectedSystem] = useState('diamond-capture');

  const systems = [
    {
      id: "diamond-capture",
      name: "Diamond Capture System",
      type: "Industrial IoT & Hardware Automation",
      icon: Camera,
      badge: "Production Hardware OS",
      tagline: "Automated 360° Diamond Imaging & Device Control Mesh",
      architecture: [
        { node: "CAMERA ARRAY", desc: "Sync high-res industrial camera capture triggers" },
        { node: "CAPTURE ENGINE", desc: "Process raw image streams & 3D mesh rendering" },
        { node: "DEVICE CONTROL", desc: "Micro-step motor positioning & lighting array" },
        { node: "LIGHTING MESH", desc: "Spectrum-calibrated LED illumination sequences" },
      ],
      details: "Engineered for high-value gemstone inspection, the Diamond Capture System integrates micro-motor device controls, multi-angle camera arrays, and real-time cloud rendering for ultra-precise automated scanning.",
    },
    {
      id: "institute-os",
      name: "InstituteOS",
      type: "Educational Enterprise Operating System",
      icon: GraduationCap,
      badge: "Enterprise Operating System",
      tagline: "Unified Multi-Campus Academic & Operational Platform",
      architecture: [
        { node: "ADMISSIONS", desc: "Automated student onboarding & fee collection" },
        { node: "ACADEMICS", desc: "Curriculum scheduling, grading & attendance telemetry" },
        { node: "FINANCE", desc: "Real-time ledger, payroll & tuition reconciliation" },
        { node: "OPERATIONS", desc: "Faculty allocation & resource utilization engine" },
      ],
      details: "InstituteOS serves as the single source of truth for educational institutions, harmonizing complex academic workflows, fee structures, and regulatory compliance into one intuitive interface.",
    },
    {
      id: "ai-receptionist",
      name: "AI Receptionist",
      type: "Autonomous Voice & Call Handling Engine",
      icon: Bot,
      badge: "Autonomous Voice & AI",
      tagline: "Zero-Latency Conversational Intelligence & CRM Dispatch",
      architecture: [
        { node: "VOICE STREAM", desc: "Real-time bi-directional audio websocket pipeline" },
        { node: "AI ENGINE", desc: "LLM intent extraction & natural dialogue response" },
        { node: "CRM DISPATCH", desc: "Instant calendar booking & customer record updates" },
        { node: "ESCALATION", desc: "Intelligent human agent hand-off with context" },
      ],
      details: "Operating 24/7 with human-like latency, AI Receptionist handles inbound telephone inquiries, books appointments directly into calendars, and updates CRM records in real-time.",
    },
    {
      id: "atlas",
      name: "ATLAS",
      type: "Financial Operations & Accounting Engine",
      icon: Landmark,
      badge: "FinTech Infrastructure",
      tagline: "Automated Invoicing, Reconciliation & Executive Cash-Flow",
      architecture: [
        { node: "TRANSACTIONS", desc: "Real-time multi-bank transaction stream ingest" },
        { node: "INVOICES", desc: "Automated recurring invoice generation & reminders" },
        { node: "RECONCILIATION", desc: "AI ledger matching for expenses & receipts" },
        { node: "REPORTING", desc: "Predictive cash-flow forecasting & tax reporting" },
      ],
      details: "ATLAS automates complex financial operations for scaling businesses, removing manual ledger entry while providing executive leadership with instant clarity on cash-flow dynamics.",
    },
  ];

  const current = systems.find(s => s.id === selectedSystem) || systems[0];
  const CurrentIcon = current.icon;

  return (
    <div className="pt-28 pb-20 relative z-10">
      
      {/* Header */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="py-16 bg-tech-grid text-center"
      >
        <div className="container-standard px-4 sm:px-6 md:px-8 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 text-white text-xs font-mono">
            <Activity className="w-3.5 h-3.5 text-[#0052FF]" />
            <span>
              <DecryptedText text="OPERATIONAL CONTROL ROOM" animateOn="view" speed={30} loop={true} loopInterval={5000} />
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-[#0B132B] tracking-tight">
            Systems built for <GradientText colors={["#0052FF", "#0A84FF", "#3B82F6", "#0052FF"]} animationSpeed={4}>real operations.</GradientText>
          </h1>
          <p className="text-slate-600 max-w-2xl mx-auto text-base sm:text-lg">
            Explore the architecture, hardware integrations, and operational pipelines powering Project Buddy's flagship enterprise systems.
          </p>
        </div>
      </motion.section>

      {/* Interactive System Control Room Interface with Motion */}
      <section className="py-12">
        <div className="container-visual px-4 sm:px-6 md:px-8">
          
          {/* Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-3 mb-10">
            {systems.map((sys) => {
              const TabIcon = sys.icon;
              const isSelected = selectedSystem === sys.id;
              return (
                <button
                  key={sys.id}
                  onClick={() => setSelectedSystem(sys.id)}
                  className={`flex items-center gap-2 px-5 py-3 rounded-full text-xs font-bold transition-all transform hover:-translate-y-0.5 ${
                    isSelected
                      ? "bg-[#0B132B] text-white shadow-lg"
                      : "bg-white text-slate-700 border border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <TabIcon className={`w-4 h-4 ${isSelected ? "text-[#0052FF]" : "text-slate-500"}`} />
                  <span>{sys.name}</span>
                </button>
              );
            })}
          </div>

          {/* Active System Showcase Panel */}
          <motion.div
            key={selectedSystem}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-2xl grid grid-cols-1 lg:grid-cols-12 gap-10 items-center"
          >
            
            <div className="lg:col-span-6 space-y-6">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-[#0052FF]/10 text-[#0052FF] text-xs font-mono font-semibold">
                  {current.badge}
                </span>
                <span className="text-xs font-mono text-slate-400">
                  {current.type}
                </span>
              </div>

              <div className="flex items-center gap-4">
                <div className="p-3.5 rounded-2xl bg-[#0052FF] text-white shadow-lg shadow-[#0052FF]/30">
                  <CurrentIcon className="w-8 h-8" />
                </div>
                <div>
                  <h2 className="text-3xl font-extrabold text-[#0B132B]">
                    {current.name}
                  </h2>
                  <p className="text-xs font-mono text-[#0052FF] mt-0.5">
                    {current.tagline}
                  </p>
                </div>
              </div>

              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                {current.details}
              </p>

              <div className="pt-2">
                <h4 className="text-xs font-mono text-slate-400 uppercase tracking-wider mb-3">System Architecture Pipeline:</h4>
                <div className="space-y-2">
                  {current.architecture.map((arch, aIdx) => (
                    <div key={aIdx} className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                      <span className="text-xs font-mono font-bold text-[#0052FF] bg-white px-2 py-0.5 rounded border border-slate-200">
                        0{aIdx+1}
                      </span>
                      <div>
                        <div className="text-xs font-bold text-[#0B132B]">{arch.node}</div>
                        <div className="text-[11px] text-slate-500">{arch.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4">
                <button
                  onClick={() => setContactOpen(true)}
                  className="px-6 py-3.5 rounded-full bg-[#0052FF] text-white font-semibold text-xs hover:bg-[#0042CC] shadow-md shadow-[#0052FF]/20 transition-all flex items-center gap-2"
                >
                  <span>Request Custom Implementation Brief</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Terminal Visualizer */}
            <div className="lg:col-span-6 bg-slate-950 rounded-2xl p-6 text-slate-200 font-mono text-xs shadow-2xl border border-slate-800 h-full min-h-[400px] flex flex-col justify-between">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-[#0A84FF]" />
                  <span className="text-slate-300 font-bold">{current.id}_control_plane.sys</span>
                </div>
                <span className="text-emerald-400 text-[10px]">HEALTH: OPTIMAL</span>
              </div>

              <div className="my-4 space-y-3">
                <div className="text-slate-500">// Real-time system pipeline status</div>
                <div className="p-3 bg-slate-900 rounded border border-slate-800 text-[11px]">
                  <span className="text-purple-400">CONNECTING TO NODE MESH...</span>
                  <div className="text-emerald-400 mt-1">✓ Node [01] {current.architecture[0]?.node} Active</div>
                  <div className="text-emerald-400">✓ Node [02] {current.architecture[1]?.node} Active</div>
                  <div className="text-emerald-400">✓ Node [03] {current.architecture[2]?.node} Active</div>
                </div>

                <div className="p-3 bg-blue-950/40 rounded border border-blue-800/40 text-[11px] text-blue-300">
                  <span>TELEMETRY: Real-time event streaming enabled.</span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-500">
                <span>PROJECT BUDDY ENGINE v2.4</span>
                <span className="text-emerald-400">PRODUCTION DEPLOYED</span>
              </div>
            </div>

          </motion.div>

        </div>
      </section>

      <ContactModal isOpen={contactOpen} onClose={() => setContactOpen(false)} />
    </div>
  );
}
