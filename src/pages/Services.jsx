import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Monitor, Cpu, BarChart3, Cloud, Layers, ArrowRight, CheckCircle2 } from 'lucide-react';
import ContactModal from '../components/ContactModal';
import GradientText from '../components/GradientText';
import DecryptedText from '../components/DecryptedText';
import BlurText from '../components/BlurText';

export default function Services() {
  const [contactOpen, setContactOpen] = useState(false);

  const services = [
    {
      id: "business-software",
      title: "Business Software & Operations Platforms",
      category: "CUSTOM SOFTWARE",
      description: "Tailored internal tools, customer portals, ERP components, and dispatch platforms built specifically around your operating model.",
      deliverables: ["Internal Control Dashboards", "Customer Self-Service Portals", "Custom ERP & CRM Modules", "Workflow Automation Apps"],
      icon: Monitor,
    },
    {
      id: "ai-automation",
      title: "AI Automation & Autonomous Workflows",
      category: "AI ENGINEERING",
      description: "Deploy autonomous voice receptionists, intelligent document extraction, automated lead qualification, and LLM-powered support pipelines.",
      deliverables: ["Autonomous Voice & Chat AI", "Document Extraction Engines", "Multi-App Workflow Sync", "Predictive Task Routing"],
      icon: Cpu,
    },
    {
      id: "data-systems",
      title: "Data Systems & Operational Intelligence",
      category: "DATA ENGINEERING",
      description: "Unify fragmented data sources into real-time ETL pipelines, executive reporting suites, and high-frequency analytical databases.",
      deliverables: ["Real-time Data Pipelines", "Executive Analytics Suites", "PostgreSQL & Vector Stores", "Automated Compliance Logs"],
      icon: BarChart3,
    },
    {
      id: "system-integration",
      title: "API Mesh & System Integration",
      category: "INTEGRATION ARCHITECTURE",
      description: "Seamlessly connect legacy databases, third-party SaaS APIs, hardware sensors, and cloud services into one harmonious ecosystem.",
      deliverables: ["Custom REST & gRPC APIs", "Hardware Device Gateways", "Webhook Orchestration", "Zero-Data-Loss Queues"],
      icon: Layers,
    },
    {
      id: "cloud-architecture",
      title: "Cloud Infrastructure & DevOps",
      category: "INFRASTRUCTURE",
      description: "Resilient cloud infrastructure setup, containerized microservices, automated CI/CD pipelines, and 99.99% uptime SLA environments.",
      deliverables: ["AWS / GCP Cloud Provisioning", "Docker & Kubernetes Mesh", "Zero-Downtime Rollouts", "Zero-Trust Security Mesh"],
      icon: Cloud,
    },
  ];

  const cardVariant = {
    hidden: { opacity: 0, y: 28 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } }
  };

  return (
    <div className="pt-28 pb-20 relative z-10">
      
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="py-16 bg-tech-grid text-center"
      >
        <div className="container-standard px-4 sm:px-6 md:px-8 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 border border-slate-200 shadow-xs">
            <span className="text-xs font-mono font-bold tracking-wider text-[#0052FF] uppercase">
              <DecryptedText text="Services & Capabilities" animateOn="view" speed={30} loop={true} loopInterval={5000} />
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#0B132B] tracking-tight">
            <BlurText text="Software engineering designed" delay={100} animateBy="words" direction="top" />
            <br />
            <GradientText colors={["#0052FF", "#0A84FF", "#3B82F6", "#0052FF"]} animationSpeed={4}>
              around your operations.
            </GradientText>
          </h1>
          <div className="text-slate-600 max-w-2xl mx-auto text-base sm:text-lg">
            <BlurText text="We deliver enterprise-grade software components, custom operational systems, and AI automation tailored to your organization's exact needs." delay={80} animateBy="words" direction="bottom" />
          </div>
        </div>
      </motion.section>

      {/* Services List with Staggered Scroll Transitions */}
      <section className="py-16">
        <div className="container-standard px-4 sm:px-6 md:px-8 space-y-12">
          {services.map((srv, idx) => {
            const IconComp = srv.icon;
            return (
              <motion.div
                key={srv.id}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-60px" }}
                variants={cardVariant}
                className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/90 shadow-lg hover:shadow-xl transition-all duration-300 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
              >
                <div className="lg:col-span-7 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-xl bg-[#0052FF]/10 text-[#0052FF]">
                      <IconComp className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-mono font-bold text-[#0052FF] tracking-wider uppercase">
                      {srv.category}
                    </span>
                  </div>

                  <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0B132B]">
                    {srv.title}
                  </h2>

                  <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                    {srv.description}
                  </p>

                  <div className="pt-2">
                    <div className="text-xs font-mono text-slate-400 uppercase tracking-wider mb-2">Key Deliverables:</div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {srv.deliverables.map((item, dIdx) => (
                        <div key={dIdx} className="flex items-center gap-2 text-xs font-medium text-slate-700">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-5 bg-slate-900 text-white rounded-2xl p-6 font-mono text-xs shadow-xl border border-slate-800 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <span className="text-[#0A84FF]">ENGINEERING MODULE</span>
                    <span className="text-emerald-400">READY</span>
                  </div>
                  <div className="space-y-1.5 text-slate-300 text-[11px]">
                    <p className="text-slate-500">// {srv.title}</p>
                    <p>import {`{ SystemEngine }`} from "@projectbuddy/core";</p>
                    <p>const system = new SystemEngine("{srv.id}");</p>
                    <p>system.deployWorkflow();</p>
                  </div>
                  <button
                    onClick={() => setContactOpen(true)}
                    className="w-full py-2.5 rounded-lg bg-[#0052FF] text-white font-sans font-semibold text-xs hover:bg-[#0042CC] transition-colors flex items-center justify-center gap-2"
                  >
                    <span>Discuss This Service</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      <ContactModal isOpen={contactOpen} onClose={() => setContactOpen(false)} />
    </div>
  );
}
