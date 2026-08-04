import React from 'react';
import { motion } from 'framer-motion';
import { Camera, GraduationCap, Bot, Landmark, ShieldCheck, Terminal, ArrowUpRight, Activity } from 'lucide-react';
import CardSwap, { Card } from './CardSwap';

export default function HeroSpatialArchitecture() {
  const cards = [
    {
      id: "diamond-capture",
      title: "Diamond Capture System",
      category: "HARDWARE & COMPUTER VISION",
      desc: "Micro-motor device control, automated LED spectrum lighting, and 360° cloud scan engine.",
      icon: Camera,
      tag: "Industrial IoT",
      status: "PRODUCTION ACTIVE",
      nodes: ["CAMERA", "MOTOR", "CAPTURE ENGINE"],
    },
    {
      id: "institute-os",
      title: "InstituteOS Enterprise",
      category: "ENTERPRISE CAMPUS OS",
      desc: "Multi-campus student admissions, fee reconciliation ledgers, and academic scheduling.",
      icon: GraduationCap,
      tag: "Enterprise OS",
      status: "12,000+ USERS",
      nodes: ["ADMISSIONS", "FINANCE", "SCHEDULING"],
    },
    {
      id: "ai-receptionist",
      title: "AI Voice Receptionist",
      category: "AUTONOMOUS VOICE & AI",
      desc: "24/7 low-latency conversational phone stream, calendar booking, and CRM record dispatch.",
      icon: Bot,
      tag: "Voice AI",
      status: "ZERO LATENCY",
      nodes: ["VOICE STREAM", "AI ENGINE", "CRM DISPATCH"],
    },
    {
      id: "atlas",
      title: "ATLAS Financial Ledger",
      category: "FINANCIAL OPERATIONS",
      desc: "Multi-bank transaction matching, automated invoice generation, and cash-flow reporting.",
      icon: Landmark,
      tag: "FinTech Platform",
      status: "$14M+ RECONCILED",
      nodes: ["TRANSACTIONS", "INVOICES", "CASH FLOW"],
    },
  ];

  return (
    <div className="relative w-full h-[520px] md:h-[560px] rounded-3xl border border-slate-200/90 bg-gradient-to-b from-white/90 via-slate-50/80 to-blue-50/30 backdrop-blur-xl shadow-xl overflow-hidden p-6 sm:p-8 flex flex-col justify-between">
      
      {/* Background Mesh Grid */}
      <div className="absolute inset-0 bg-tech-grid opacity-30 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-[#0052FF]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header Label */}
      <div className="relative z-20 flex items-center justify-between">
        <div className="flex items-center gap-2 bg-white/90 px-3.5 py-1.5 rounded-full border border-slate-200 shadow-xs">
          <Activity className="w-3.5 h-3.5 text-[#0052FF]" />
          <span className="text-xs font-mono font-bold text-[#0B132B]">
            Spatial System Swap Mesh
          </span>
        </div>
        <span className="text-xs font-mono text-slate-400 hidden sm:inline">
          [ Layer 3: System Objects ]
        </span>
      </div>

      {/* 3D CardSwap Container Stage */}
      <div className="relative z-20 w-full h-[360px] flex items-center justify-center my-auto">
        <CardSwap
          width={400}
          height={280}
          cardDistance={50}
          verticalDistance={45}
          delay={4500}
          pauseOnHover={true}
          skewAmount={4}
          easing="elastic"
        >
          {cards.map((item) => {
            const IconComp = item.icon;
            return (
              <Card key={item.id} className="p-6 flex flex-col justify-between cursor-pointer group hover:border-[#0052FF] transition-all">
                {/* Card Top Row */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-[#0052FF] text-white shadow-md shadow-[#0052FF]/20">
                      <IconComp className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[10px] font-mono font-bold tracking-widest text-[#0052FF] uppercase">
                        {item.category}
                      </span>
                      <h4 className="text-lg font-bold text-[#0B132B] group-hover:text-[#0052FF] transition-colors leading-tight">
                        {item.title}
                      </h4>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-[#0052FF]/10 text-[#0052FF] text-[10px] font-mono font-bold">
                    {item.tag}
                  </span>
                </div>

                {/* Description */}
                <p className="text-xs text-slate-600 leading-relaxed my-2">
                  {item.desc}
                </p>

                {/* Nodes Mesh */}
                <div className="flex items-center gap-1.5 pt-2 border-t border-slate-100">
                  {item.nodes.map((node, nIdx) => (
                    <span key={nIdx} className="px-2 py-0.5 rounded bg-slate-100 text-[9px] font-mono text-slate-700 font-semibold">
                      {node}
                    </span>
                  ))}
                </div>

                {/* Status Footer */}
                <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-[10px] font-mono">
                  <span className="text-emerald-600 font-bold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    {item.status}
                  </span>
                  <span className="text-[#0052FF] font-bold flex items-center gap-0.5">
                    VIEW SYSTEM <ArrowUpRight className="w-3 h-3" />
                  </span>
                </div>
              </Card>
            );
          })}
        </CardSwap>
      </div>

      {/* Bottom Status Bar */}
      <div className="relative z-20 flex items-center justify-between text-xs text-slate-500 border-t border-slate-200/60 pt-3">
        <div className="flex items-center gap-2">
          <Terminal className="w-3.5 h-3.5 text-[#0052FF]" />
          <span className="font-mono text-[11px]">Hover to pause · Auto-swap 4.5s</span>
        </div>
        <span className="font-mono text-[11px] text-[#0052FF]">GSAP 3D Elastic Physics</span>
      </div>

    </div>
  );
}
