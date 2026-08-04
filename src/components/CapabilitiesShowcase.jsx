import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Monitor, Cpu, BarChart3, Cloud, CheckCircle2, ArrowRight, Zap, Database, Server } from 'lucide-react';

export default function CapabilitiesShowcase() {
  const [activeTab, setActiveTab] = useState(0);

  const capabilities = [
    {
      num: "01",
      title: "Business software that performs",
      category: "CUSTOM PLATFORMS",
      description: "Custom-built internal systems engineered around how your business operates, eliminating off-the-shelf compromises.",
      tags: ["Business Software", "Internal Platforms", "Customer Portals", "Operational Tools"],
      icon: Monitor,
      visual: (
        <div className="w-full h-full bg-slate-900 text-slate-100 rounded-2xl p-5 font-mono text-xs shadow-2xl flex flex-col justify-between border border-slate-800">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-500/80" />
              <span className="w-3 h-3 rounded-full bg-yellow-500/80" />
              <span className="w-3 h-3 rounded-full bg-green-500/80" />
              <span className="ml-2 text-slate-400 text-[11px]">pb_enterprise_portal.tsx</span>
            </div>
            <span className="text-[#0A84FF]">STATUS: ONLINE</span>
          </div>
          
          <div className="my-4 space-y-2 text-slate-300">
            <p className="text-slate-500">// Real-time operational control module</p>
            <p><span className="text-purple-400">const</span> platform = <span className="text-blue-400">useOperationalSystem</span>();</p>
            <p><span className="text-purple-400">await</span> platform.<span className="text-yellow-300">syncEnterpriseWorkflows</span>({`{`}</p>
            <p className="pl-4 text-emerald-400">portalAccess: "Strict Role-Based",</p>
            <p className="pl-4 text-emerald-400">latencyMs: 12,</p>
            <p className="pl-4 text-emerald-400">realtimeDb: "ActiveSync"</p>
            <p>{`}`});</p>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800">
            <div className="bg-slate-800/80 p-2 rounded border border-slate-700">
              <div className="text-[10px] text-slate-400">SYSTEM HEALTH</div>
              <div className="text-emerald-400 font-bold">99.99% Uptime</div>
            </div>
            <div className="bg-slate-800/80 p-2 rounded border border-slate-700">
              <div className="text-[10px] text-slate-400">DISPATCH CYCLE</div>
              <div className="text-blue-400 font-bold">Instant Trigger</div>
            </div>
          </div>
        </div>
      ),
    },
    {
      num: "02",
      title: "Automation that removes friction",
      category: "AI & WORKFLOWS",
      description: "Intelligent automation engines that execute complex multi-step workflows, customer communications, and system syncs.",
      tags: ["AI Automation", "Workflow Orchestration", "CRM Automation", "Service Automation"],
      icon: Cpu,
      visual: (
        <div className="w-full h-full bg-slate-900 text-slate-100 rounded-2xl p-5 font-mono text-xs shadow-2xl flex flex-col justify-between border border-slate-800">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <span className="text-[#0052FF] font-bold">WORKFLOW ENGINE</span>
            <span className="text-emerald-400 flex items-center gap-1">
              <Zap className="w-3.5 h-3.5" /> 4 Active Pipelines
            </span>
          </div>

          <div className="my-2 space-y-3">
            <div className="flex items-center gap-2 bg-slate-800/90 p-2.5 rounded-lg border border-slate-700">
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-ping" />
              <div className="flex-1 text-[11px]">
                <div className="text-slate-300 font-bold">TRIGGER: Inbound Lead Received</div>
                <div className="text-slate-500">Source: API / Webhook</div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-500" />
            </div>

            <div className="flex items-center gap-2 bg-slate-800/90 p-2.5 rounded-lg border border-slate-700">
              <div className="flex-1 text-[11px]">
                <div className="text-purple-400 font-bold">DECISION: AI Intent Extraction</div>
                <div className="text-slate-500">Confidence Score: 98.4%</div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-500" />
            </div>

            <div className="flex items-center gap-2 bg-emerald-950/40 p-2.5 rounded-lg border border-emerald-500/40">
              <div className="flex-1 text-[11px]">
                <div className="text-emerald-400 font-bold">ACTION: CRM & Calendar Dispatched</div>
                <div className="text-emerald-300/80">Notification Sent to Operations</div>
              </div>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            </div>
          </div>
        </div>
      ),
    },
    {
      num: "03",
      title: "Data systems that inform action",
      category: "DATA INTELLIGENCE",
      description: "Unified data pipelines and executive dashboards that convert fragmented operational metrics into immediate clarity.",
      tags: ["Data Integration", "Dashboards", "Reporting Systems", "Operational Intelligence"],
      icon: BarChart3,
      visual: (
        <div className="w-full h-full bg-slate-900 text-slate-100 rounded-2xl p-5 font-mono text-xs shadow-2xl flex flex-col justify-between border border-slate-800">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <span className="text-blue-400 font-bold">DATA INTEGRATION LAYER</span>
            <span className="text-slate-400">RECS: 1.2M / SEC</span>
          </div>

          <div className="my-2 space-y-2">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-slate-400">Sources: Multi-DB Sync</span>
              <span className="text-emerald-400">Connected</span>
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <div className="bg-[#0052FF] h-full w-[88%]" />
            </div>
            
            <div className="grid grid-cols-3 gap-2 pt-3">
              <div className="bg-slate-800/90 p-2 rounded text-center border border-slate-700">
                <div className="text-[10px] text-slate-400">PIPELINE</div>
                <div className="text-white font-bold text-sm">ETL Live</div>
              </div>
              <div className="bg-slate-800/90 p-2 rounded text-center border border-slate-700">
                <div className="text-[10px] text-slate-400">LATENCY</div>
                <div className="text-blue-400 font-bold text-sm">&lt; 10ms</div>
              </div>
              <div className="bg-slate-800/90 p-2 rounded text-center border border-slate-700">
                <div className="text-[10px] text-slate-400">ACCURACY</div>
                <div className="text-emerald-400 font-bold text-sm">100%</div>
              </div>
            </div>
          </div>

          <div className="pt-2 text-[10px] text-slate-500 border-t border-slate-800">
            [ Dashboard Feed Active — Operational Metrics Streamed ]
          </div>
        </div>
      ),
    },
    {
      num: "04",
      title: "Modern systems that scale",
      category: "CLOUD ARCHITECTURE",
      description: "Re-engineering legacy architectures into cloud-native microservices, scalable APIs, and fault-tolerant infrastructure.",
      tags: ["Software Modernization", "System Integration", "API Development", "Cloud Architecture"],
      icon: Cloud,
      visual: (
        <div className="w-full h-full bg-slate-900 text-slate-100 rounded-2xl p-5 font-mono text-xs shadow-2xl flex flex-col justify-between border border-slate-800">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <span className="text-indigo-400 font-bold">CLOUD ARCHITECTURE</span>
            <span className="text-emerald-400">AUTO-SCALING</span>
          </div>

          <div className="my-3 space-y-2">
            <div className="flex items-center justify-between p-2 rounded bg-slate-800 border border-slate-700">
              <span className="text-slate-300">Legacy Architecture</span>
              <span className="text-amber-400 font-bold">→ Modernized</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded bg-slate-800 border border-slate-700">
              <span className="text-slate-300">API Mesh</span>
              <span className="text-blue-400 font-bold">REST / gRPC</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded bg-slate-800 border border-slate-700">
              <span className="text-slate-300">Infrastructure</span>
              <span className="text-emerald-400 font-bold">Kubernetes Cloud</span>
            </div>
          </div>

          <div className="text-[10px] text-slate-400 border-t border-slate-800 pt-2 flex items-center justify-between">
            <span>Security: Enterprise Zero-Trust</span>
            <span className="text-emerald-400">Passing 100% QA</span>
          </div>
        </div>
      ),
    },
  ];

  return (
    <section className="py-24 relative z-10">
      <div className="container-standard px-4 sm:px-6 md:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <span className="text-xs font-mono font-bold tracking-wider text-[#0052FF] uppercase">
              Core Capabilities
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-[#0B132B] mt-2">
              Engineering capabilities designed for scale.
            </h2>
          </div>
          <p className="text-slate-600 max-w-md text-sm sm:text-base">
            We build working systems across four primary engineering domains, tailored to your exact business workflow.
          </p>
        </div>

        {/* Desktop Sticky Visual Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Tab Selectors */}
          <div className="lg:col-span-6 space-y-4">
            {capabilities.map((item, idx) => {
              const IconComp = item.icon;
              const isActive = activeTab === idx;
              return (
                <div
                  key={idx}
                  onClick={() => setActiveTab(idx)}
                  className={`cursor-pointer p-6 rounded-2xl border transition-all duration-300 ${
                    isActive
                      ? "bg-white border-[#0052FF] shadow-lg shadow-[#0052FF]/10 scale-[1.01]"
                      : "bg-white/70 border-slate-200/80 hover:bg-white hover:border-slate-300"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-xl ${
                      isActive ? "bg-[#0052FF] text-white" : "bg-slate-100 text-[#0B132B]"
                    } transition-colors`}>
                      <IconComp className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono font-bold text-[#0052FF]">
                          {item.num} // {item.category}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-[#0B132B] mt-1">
                        {item.title}
                      </h3>
                      <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                        {item.description}
                      </p>
                      
                      <div className="flex flex-wrap gap-2 mt-4">
                        {item.tags.map((tag, tIdx) => (
                          <span
                            key={tIdx}
                            className={`px-2.5 py-1 rounded-md text-xs font-medium ${
                              isActive
                                ? "bg-[#0052FF]/10 text-[#0052FF]"
                                : "bg-slate-100 text-slate-600"
                            }`}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Live Diagram Display */}
          <div className="lg:col-span-6 sticky top-28 h-[440px]">
            <div className="relative w-full h-full p-2 rounded-3xl bg-slate-950 shadow-2xl border border-slate-800 overflow-hidden">
              {capabilities[activeTab].visual}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
