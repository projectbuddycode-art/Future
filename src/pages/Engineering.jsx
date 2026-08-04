import React, { useState } from 'react';
import { Layers, Cpu, Cloud, Terminal, ShieldCheck, ArrowRight, Database, Code, Server } from 'lucide-react';
import ContactModal from '../components/ContactModal';

export default function Engineering() {
  const [contactOpen, setContactOpen] = useState(false);

  const stack = [
    { name: "Frontend & Mobile", tech: ["React 18", "React Native", "TypeScript", "Tailwind CSS", "Framer Motion", "WebGL Canvas"] },
    { name: "Backend & Microservices", tech: ["Node.js / Express", "Python / FastAPI", "Go Microservices", "gRPC Protocol", "REST API Mesh"] },
    { name: "Databases & Storage", tech: ["PostgreSQL", "Redis Cache", "Vector DBs (pgvector)", "S3 Object Storage", "Time-Series DBs"] },
    { name: "AI & Workflow Engines", tech: ["LLM Integration", "Autonomous Agents", "Whisper / Voice Streams", "Celery Task Queue"] },
    { name: "Cloud & Infrastructure", tech: ["Docker Containers", "Kubernetes Mesh", "AWS / GCP Infrastructure", "Nginx Reverse Proxy", "CI/CD Pipelines"] },
  ];

  return (
    <div className="pt-28 pb-20 relative z-10">
      <section className="py-16 bg-tech-grid text-center">
        <div className="container-standard px-4 sm:px-6 md:px-8 space-y-4">
          <span className="text-xs font-mono font-bold tracking-wider text-[#0052FF] uppercase">
            Engineering & Technology Standards
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-[#0B132B] tracking-tight">
            From architecture <span className="text-[#0052FF]">to production.</span>
          </h1>
          <p className="text-slate-600 max-w-2xl mx-auto text-base sm:text-lg">
            We adhere to rigorous software engineering principles, zero-trust security standards, and high-performance cloud architecture.
          </p>
        </div>
      </section>

      {/* Tech Stack Grid */}
      <section className="py-16">
        <div className="container-standard px-4 sm:px-6 md:px-8 space-y-8">
          <h2 className="text-2xl font-bold text-[#0B132B]">Verified Technology Stack</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stack.map((cat, idx) => (
              <div key={idx} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-md space-y-4">
                <h3 className="text-lg font-bold text-[#0052FF]">{cat.name}</h3>
                <div className="flex flex-wrap gap-2">
                  {cat.tech.map((t, tIdx) => (
                    <span key={tIdx} className="px-3 py-1 rounded-lg bg-slate-100 text-xs font-mono font-medium text-slate-700">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="pt-8 text-center">
            <button
              onClick={() => setContactOpen(true)}
              className="px-8 py-3.5 rounded-full bg-[#0052FF] text-white font-semibold text-sm hover:bg-[#0042CC] shadow-md transition-all inline-flex items-center gap-2"
            >
              <span>Request Architectural Evaluation</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      <ContactModal isOpen={contactOpen} onClose={() => setContactOpen(false)} />
    </div>
  );
}
