import React from 'react';
import { motion } from 'framer-motion';
import { useCMS } from '../context/CMSContext';
import { resolveCmsMedia } from '../utils/cmsMedia';
import CmsMedia from './CmsMedia';
import { Monitor, Server, Users, Wrench, ArrowUpRight } from 'lucide-react';

export default function CapabilitiesShowcase() {
  const { cmsState } = useCMS();

  // Resolve CMS Media assets for each of the 4 capability slots
  const media01 = resolveCmsMedia(cmsState, 'home.capabilities.businessSoftware');
  const media02 = resolveCmsMedia(cmsState, 'home.capabilities.internalPlatforms');
  const media03 = resolveCmsMedia(cmsState, 'home.capabilities.customerPortals');
  const media04 = resolveCmsMedia(cmsState, 'home.capabilities.operationalTools');

  // Fallback Code-Generated Interactive Visuals when CMS asset is unassigned
  const fallback01 = (
    <div className="w-full h-full bg-slate-950 text-slate-100 rounded-2xl p-6 font-mono text-xs shadow-2xl flex flex-col justify-between border border-slate-800/80 relative overflow-hidden">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
          <span className="ml-2 text-slate-400 text-[11px]">pb_enterprise_control.tsx</span>
        </div>
        <span className="text-[#0052FF] font-bold">PRODUCTION ACTIVE</span>
      </div>
      <div className="my-4 space-y-2 text-slate-300">
        <p className="text-slate-500">// Business operations control module</p>
        <p><span className="text-purple-400">const</span> system = <span className="text-blue-400">useOperationalArchitecture</span>();</p>
        <p><span className="text-purple-400">await</span> system.<span className="text-yellow-300">orchestrateEnterpriseWorkflows</span>({`{`}</p>
        <p className="pl-4 text-emerald-400">authProtocol: "Zero-Trust OAuth2",</p>
        <p className="pl-4 text-emerald-400">latencyMs: 8,</p>
        <p className="pl-4 text-emerald-400">syncPipeline: "Postgres Realtime"</p>
        <p>{`}`});</p>
      </div>
      <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-800/80">
        <div className="bg-slate-900/90 p-2.5 rounded-xl border border-slate-800">
          <div className="text-[10px] text-slate-400">SYSTEM AVAILABILITY</div>
          <div className="text-emerald-400 font-bold text-xs mt-0.5">99.99% Enterprise Uptime</div>
        </div>
        <div className="bg-slate-900/90 p-2.5 rounded-xl border border-slate-800">
          <div className="text-[10px] text-slate-400">DISPATCH CYCLE</div>
          <div className="text-blue-400 font-bold text-xs mt-0.5">Real-Time Event Mesh</div>
        </div>
      </div>
    </div>
  );

  const fallback02 = (
    <div className="w-full h-full bg-slate-950 p-5 rounded-2xl border border-slate-800 text-xs font-mono space-y-3 flex flex-col justify-between">
      <div className="flex items-center justify-between text-slate-400 border-b border-slate-800 pb-2">
        <span className="text-[#0052FF] font-bold">INTERNAL PLATFORMS</span>
        <span className="text-emerald-400 text-[10px]">CONNECTED</span>
      </div>
      <div className="space-y-2">
        <div className="bg-slate-900 p-2 rounded border border-slate-800 flex justify-between text-[11px]">
          <span className="text-slate-300">Teams & Operations</span>
          <span className="text-emerald-400">Synchronized</span>
        </div>
        <div className="bg-slate-900 p-2 rounded border border-slate-800 flex justify-between text-[11px]">
          <span className="text-slate-300">Data Mesh</span>
          <span className="text-blue-400">Postgres + pgvector</span>
        </div>
      </div>
      <div className="text-[10px] text-slate-500 border-t border-slate-800 pt-2">
        [ Unified Operational Architecture ]
      </div>
    </div>
  );

  const fallback03 = (
    <div className="w-full h-full bg-slate-950 p-5 rounded-2xl border border-slate-800 text-xs font-mono space-y-3 flex flex-col justify-between">
      <div className="flex items-center justify-between text-slate-400 border-b border-slate-800 pb-2">
        <span className="text-[#0052FF] font-bold">CUSTOMER PORTALS</span>
        <span className="text-blue-400 text-[10px]">ROLE-BASED</span>
      </div>
      <div className="space-y-2">
        <div className="bg-slate-900 p-2 rounded border border-slate-800 flex justify-between text-[11px]">
          <span className="text-slate-300">Client Access</span>
          <span className="text-emerald-400">Encrypted</span>
        </div>
        <div className="bg-slate-900 p-2 rounded border border-slate-800 flex justify-between text-[11px]">
          <span className="text-slate-300">Self-Service Workflows</span>
          <span className="text-blue-400">Active</span>
        </div>
      </div>
      <div className="text-[10px] text-slate-500 border-t border-slate-800 pt-2">
        [ Client Account Dashboard ]
      </div>
    </div>
  );

  const fallback04 = (
    <div className="w-full h-full bg-slate-950 p-5 rounded-2xl border border-slate-800 text-xs font-mono space-y-3 flex flex-col justify-between">
      <div className="flex items-center justify-between text-slate-400 border-b border-slate-800 pb-2">
        <span className="text-[#0052FF] font-bold">OPERATIONAL TOOLS</span>
        <span className="text-emerald-400 text-[10px]">AUTOMATED</span>
      </div>
      <div className="space-y-2">
        <div className="bg-slate-900 p-2 rounded border border-slate-800 flex justify-between text-[11px]">
          <span className="text-slate-300">Process Monitoring</span>
          <span className="text-emerald-400">0ms Latency</span>
        </div>
        <div className="bg-slate-900 p-2 rounded border border-slate-800 flex justify-between text-[11px]">
          <span className="text-slate-300">API Gateway</span>
          <span className="text-blue-400">gRPC Mesh</span>
        </div>
      </div>
      <div className="text-[10px] text-slate-500 border-t border-slate-800 pt-2">
        [ Workflow Orchestration ]
      </div>
    </div>
  );

  return (
    <section className="py-24 relative z-10 bg-slate-900/5 border-y border-slate-200/80">
      <div className="container-visual px-4 sm:px-6 md:px-8 space-y-12">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <span className="text-xs font-mono font-bold tracking-wider text-[#0052FF] uppercase">
              02 // ENGINEERING CAPABILITIES
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-[#0B132B]">
              Engineering capabilities designed for scale.
            </h2>
          </div>
          <p className="text-slate-600 max-w-md text-sm sm:text-base leading-relaxed">
            We build working systems across four primary engineering domains, tailored to your exact business workflow.
          </p>
        </div>

        {/* Asymmetric Capability Matrix Composition */}
        <div className="space-y-8">
          
          {/* TOP FEATURED PANEL: CAPABILITY 01 — BUSINESS SOFTWARE (55–60% Visual Width) */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="bg-white rounded-3xl p-6 sm:p-8 md:p-10 border border-slate-200/90 shadow-xl hover:border-[#0052FF]/40 hover:shadow-2xl transition-all duration-300 group grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
          >
            {/* Text & Capability Details (lg:col-span-5) */}
            <div className="lg:col-span-5 space-y-4">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-[#0052FF]/10 text-[#0052FF] text-xs font-mono font-bold">
                  01 // FEATURED CAPABILITY
                </span>
                <Monitor className="w-4 h-4 text-[#0052FF]" />
              </div>

              <h3 className="text-2xl sm:text-3xl font-extrabold text-[#0B132B] group-hover:text-[#0052FF] transition-colors">
                Business Software
              </h3>

              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                Custom-built internal systems engineered around how your business operates, eliminating off-the-shelf compromises and fragmented manual hand-offs.
              </p>

              <div className="flex flex-wrap gap-2 pt-2">
                {["Enterprise Platforms", "Custom Operations", "Role-Based Control", "Postgres Mesh"].map((tag, tIdx) => (
                  <span key={tIdx} className="px-3 py-1 rounded-lg bg-slate-100 border border-slate-200 text-xs font-mono font-semibold text-slate-700">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Large Visual Container (lg:col-span-7 — ~58% width) */}
            <div className="lg:col-span-7 h-72 sm:h-80 md:h-96 rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden relative shadow-2xl">
              <CmsMedia
                asset={media01}
                className="w-full h-full object-contain"
                fallback={fallback01}
                interactiveHover
              />
            </div>
          </motion.div>

          {/* BOTTOM ROW: 3-COLUMN SUB-GRID FOR CAPABILITIES 02, 03 & 04 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            
            {/* CAPABILITY 02 — INTERNAL PLATFORMS */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-lg hover:border-[#0052FF]/40 hover:shadow-xl transition-all duration-300 group space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-[#0052FF]">02 // PLATFORMS</span>
                  <Server className="w-4 h-4 text-[#0052FF]" />
                </div>

                <h3 className="text-xl font-extrabold text-[#0B132B] group-hover:text-[#0052FF] transition-colors">
                  Internal Platforms
                </h3>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Unified operational infrastructure connecting teams, data, processes, and internal tools into one cohesive engine.
                </p>
              </div>

              <div className="h-48 rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden relative shadow-inner">
                <CmsMedia
                  asset={media02}
                  className="w-full h-full object-contain"
                  fallback={fallback02}
                  interactiveHover
                />
              </div>
            </motion.div>

            {/* CAPABILITY 03 — CUSTOMER PORTALS */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-lg hover:border-[#0052FF]/40 hover:shadow-xl transition-all duration-300 group space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-[#0052FF]">03 // PORTALS</span>
                  <Users className="w-4 h-4 text-[#0052FF]" />
                </div>

                <h3 className="text-xl font-extrabold text-[#0B132B] group-hover:text-[#0052FF] transition-colors">
                  Customer Portals
                </h3>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  High-end client account interfaces and self-service portals built with zero-trust security and real-time status telemetry.
                </p>
              </div>

              <div className="h-48 rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden relative shadow-inner">
                <CmsMedia
                  asset={media03}
                  className="w-full h-full object-contain"
                  fallback={fallback03}
                  interactiveHover
                />
              </div>
            </motion.div>

            {/* CAPABILITY 04 — OPERATIONAL TOOLS */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.7, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-lg hover:border-[#0052FF]/40 hover:shadow-xl transition-all duration-300 group space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-[#0052FF]">04 // TOOLS</span>
                  <Wrench className="w-4 h-4 text-[#0052FF]" />
                </div>

                <h3 className="text-xl font-extrabold text-[#0B132B] group-hover:text-[#0052FF] transition-colors">
                  Operational Tools
                </h3>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Custom workflow orchestration, process monitoring dashboards, and API mesh connectors engineered around your team.
                </p>
              </div>

              <div className="h-48 rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden relative shadow-inner">
                <CmsMedia
                  asset={media04}
                  className="w-full h-full object-contain"
                  fallback={fallback04}
                  interactiveHover
                />
              </div>
            </motion.div>

          </div>

        </div>

      </div>
    </section>
  );
}
