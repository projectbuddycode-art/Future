import React from 'react';
import { Link } from 'wouter';
import { CheckCircle2, ArrowRight } from 'lucide-react';

export default function HowItWorksWorkflow() {
  const steps = [
    { num: "01", title: "UNDERSTAND", desc: "Deconstruct operational bottlenecks and define strict technical requirements." },
    { num: "02", title: "MAP", desc: "Diagram business process workflows, data models, and user permissions." },
    { num: "03", title: "ARCHITECT", desc: "Design system boundaries, API contracts, and database schemas." },
    { num: "04", title: "ENGINEER", desc: "Develop clean, high-performance software code and automated workflows." },
    { num: "05", title: "INTEGRATE", desc: "Connect existing third-party platforms, hardware devices, and legacy systems." },
    { num: "06", title: "DEPLOY", desc: "Provision resilient cloud infrastructure with zero-downtime rollouts." },
    { num: "07", title: "OPTIMIZE", desc: "Continuous performance monitoring, telemetry, and iterative refinement." },
  ];

  return (
    <section className="py-24 relative z-10 bg-slate-900/5 backdrop-blur-sm border-y border-slate-200/60">
      <div className="container-standard px-4 sm:px-6 md:px-8">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <span className="text-xs font-mono font-bold tracking-wider text-[#0052FF] uppercase">
              Engineering Process
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-[#0B132B] mt-2">
              7-Stage Operational Engineering.
            </h2>
          </div>
          <Link
            href="/how-it-works"
            className="inline-flex items-center gap-2 text-sm font-bold text-[#0052FF] hover:gap-3 transition-all"
          >
            See Full Interactive Transformation →
          </Link>
        </div>

        {/* 7 Stage Process Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {steps.map((step, idx) => (
            <div
              key={idx}
              className={`p-6 rounded-2xl border bg-white backdrop-blur-md shadow-sm hover:shadow-md transition-all duration-200 ${
                idx === 6 ? "border-[#0052FF] bg-[#0052FF]/[0.02]" : "border-slate-200/90"
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-mono font-bold text-[#0052FF] px-2.5 py-1 rounded bg-slate-100">
                  {step.num}
                </span>
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              </div>
              <h3 className="text-lg font-bold text-[#0B132B]">
                {step.title}
              </h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                {step.desc}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
