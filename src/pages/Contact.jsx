import React from 'react';
import { Calendar, Mail, Linkedin, ArrowUpRight, ShieldCheck, Layers, GitMerge } from 'lucide-react';

export default function Contact() {
  const pathways = [
    {
      num: "01",
      title: "Schedule a Project Discussion",
      desc: "Book a 30-minute technical discovery call directly with our engineering lead.",
      href: "https://calendly.com/projectbuddy/project-discussion",
      action: "Open Calendly Schedule",
      icon: Calendar,
      primary: true,
    },
    {
      num: "02",
      title: "Email Project Buddy",
      desc: "Send your technical requirements, RFP documents, or inquiry brief to our team.",
      href: "mailto:info@projectbuddy.co.in",
      action: "info@projectbuddy.co.in",
      icon: Mail,
      primary: false,
    },
    {
      num: "03",
      title: "Connect on LinkedIn",
      desc: "Connect directly with leadership for strategic software engineering discussions.",
      href: "https://www.linkedin.com/in/shivamdubey-pb",
      action: "Shivam Dubey on LinkedIn",
      icon: Linkedin,
      primary: false,
    },
  ];

  return (
    <div className="pt-28 pb-20 relative z-10">
      
      {/* Hero */}
      <section className="py-16 bg-tech-grid text-center">
        <div className="container-editorial px-4 sm:px-6 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0052FF]/10 text-[#0052FF] text-xs font-mono font-semibold">
            <span>DIRECT DISCOVERY PATHWAYS</span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-[#0B132B] tracking-tight">
            Let's discuss <br className="hidden sm:block" />
            <span className="text-[#0052FF]">what you're building.</span>
          </h1>
          <p className="text-slate-600 max-w-xl mx-auto text-base sm:text-lg">
            We don't use generic contact forms. Connect directly with our software engineering leads through your preferred pathway below.
          </p>
        </div>
      </section>

      {/* Central Spatial Node Connection Visualizer */}
      <section className="py-12">
        <div className="container-standard px-4 sm:px-6 md:px-8">
          <div className="bg-slate-950 text-white rounded-3xl p-8 sm:p-12 border border-slate-800 shadow-2xl relative overflow-hidden flex flex-col items-center justify-center min-h-[300px]">
            {/* SVG Connecting Wires */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-40">
              <line x1="50%" y1="50%" x2="20%" y2="25%" stroke="#0052FF" strokeWidth="2" strokeDasharray="4 4" />
              <line x1="50%" y1="50%" x2="50%" y2="25%" stroke="#0052FF" strokeWidth="2" strokeDasharray="4 4" />
              <line x1="50%" y1="50%" x2="80%" y2="25%" stroke="#0052FF" strokeWidth="2" strokeDasharray="4 4" />
            </svg>

            {/* Central Node */}
            <div className="relative z-10 p-5 rounded-2xl bg-[#0052FF] text-white shadow-2xl shadow-[#0052FF]/50 text-center flex flex-col items-center max-w-xs">
              <GitMerge className="w-8 h-8 mb-2" />
              <span className="text-[10px] font-mono tracking-widest uppercase">CENTRAL GATEWAY</span>
              <h3 className="text-lg font-bold">PROJECT DISCUSSION</h3>
            </div>
          </div>
        </div>
      </section>

      {/* 3 Premium Pathways Grid */}
      <section className="py-12">
        <div className="container-standard px-4 sm:px-6 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pathways.map((item, idx) => {
              const IconComp = item.icon;
              return (
                <a
                  key={idx}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`group p-8 rounded-3xl border transition-all duration-300 flex flex-col justify-between ${
                    item.primary
                      ? "bg-white border-[#0052FF] shadow-xl hover:shadow-2xl hover:scale-[1.02]"
                      : "bg-white/80 border-slate-200 shadow-md hover:bg-white hover:border-slate-300"
                  }`}
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-[#0052FF]">
                        PATHWAY {item.num}
                      </span>
                      <div className={`p-3 rounded-xl ${
                        item.primary ? "bg-[#0052FF] text-white" : "bg-slate-100 text-[#0B132B]"
                      }`}>
                        <IconComp className="w-5 h-5" />
                      </div>
                    </div>

                    <h3 className="text-xl font-bold text-[#0B132B] group-hover:text-[#0052FF] transition-colors flex items-center gap-2">
                      {item.title}
                      <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-[#0052FF] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </h3>

                    <p className="text-xs text-slate-600 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>

                  <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between text-xs font-mono font-semibold text-[#0052FF]">
                    <span>{item.action}</span>
                    <span>→</span>
                  </div>
                </a>
              );
            })}
          </div>
        </div>
      </section>

      {/* NDA Security Guarantee */}
      <section className="py-12 text-center">
        <div className="container-editorial px-4 sm:px-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 border border-slate-200 text-xs text-slate-600">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>Strict NDA Guarantee · Direct Engineering Consultation · No Sales Pressure</span>
          </div>
        </div>
      </section>

    </div>
  );
}
