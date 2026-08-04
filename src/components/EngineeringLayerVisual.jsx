import React from 'react';
import { Layers, ArrowDown, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function EngineeringLayerVisual() {
  const layers = [
    { level: "01", title: "BUSINESS REQUIREMENT", desc: "Strategy, operational logic & business process mapping", color: "border-slate-300 bg-white" },
    { level: "02", title: "APPLICATION LAYER", desc: "Custom web, desktop & mobile user interfaces", color: "border-blue-200 bg-blue-50/30" },
    { level: "03", title: "AUTOMATION ENGINE", desc: "AI workflows, event triggers & autonomous agents", color: "border-indigo-200 bg-indigo-50/30" },
    { level: "04", title: "DATA PIPELINE", desc: "PostgreSQL, Redis, vector databases & data models", color: "border-emerald-200 bg-emerald-50/30" },
    { level: "05", title: "INTEGRATION MESH", desc: "REST APIs, Webhooks, gRPC & microservice communication", color: "border-cyan-200 bg-cyan-50/30" },
    { level: "06", title: "INFRASTRUCTURE", desc: "Docker containers, AWS/GCP cloud & auto-scaling clusters", color: "border-slate-300 bg-slate-50" },
    { level: "07", title: "PRODUCTION", desc: "Continuous deployment, zero-downtime monitoring & security", color: "border-[#0052FF] bg-[#0052FF]/10 text-[#0052FF]" },
  ];

  return (
    <section className="py-24 relative z-10">
      <div className="container-standard px-4 sm:px-6 md:px-8">
        
        <div className="max-w-3xl mx-auto text-center mb-16 space-y-4">
          <span className="text-xs font-mono font-bold tracking-wider text-[#0052FF] uppercase">
            Engineering Architecture
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-[#0B132B]">
            Engineering the layer between strategy and operation.
          </h2>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            We build software as a full-stack technical hierarchy, bridging high-level strategic requirements directly into reliable production cloud infrastructure.
          </p>
        </div>

        {/* Layered Stack Visual */}
        <div className="max-w-3xl mx-auto space-y-3">
          {layers.map((layer, idx) => (
            <div key={idx} className="relative group">
              <div className={`p-4 sm:p-5 rounded-2xl border transition-all duration-300 shadow-sm flex items-center justify-between ${layer.color} hover:shadow-md`}>
                <div className="flex items-center gap-4">
                  <span className="text-xs font-mono font-bold text-[#0052FF] px-2.5 py-1 rounded bg-white shadow-xs">
                    L{layer.level}
                  </span>
                  <div>
                    <h3 className="text-base font-bold text-[#0B132B]">
                      {layer.title}
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {layer.desc}
                    </p>
                  </div>
                </div>

                <div className="hidden sm:flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span className="text-xs font-mono text-slate-400">ENGINEERED</span>
                </div>
              </div>

              {idx < layers.length - 1 && (
                <div className="flex justify-center -my-1.5 relative z-10">
                  <div className="w-6 h-6 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400">
                    <ArrowDown className="w-3 h-3" />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
