import React, { useState } from 'react';
import { Link } from 'wouter';
import { motion } from 'framer-motion';
import { ArrowRight, ShieldCheck, Layers, Terminal, Sparkles, Calendar, Mail, Linkedin, Cpu, Database, Server, Code } from 'lucide-react';
import { useCMS } from '../context/CMSContext';
import DisconnectedToSystem from '../components/DisconnectedToSystem';
import CapabilitiesShowcase from '../components/CapabilitiesShowcase';
import SystemsShowcase from '../components/SystemsShowcase';
import HowItWorksWorkflow from '../components/HowItWorksWorkflow';
import ContactModal from '../components/ContactModal';
import { LogoLoop } from '../components/LogoLoop';
import GradientText from '../components/GradientText';
import DecryptedText from '../components/DecryptedText';
import BlurText from '../components/BlurText';

export default function Home() {
  const [contactOpen, setContactOpen] = useState(false);
  const { getPage } = useCMS();

  const pageData = getPage('home', {
    heroEyebrow: "ENGINEERED FOR REAL OPERATIONS",
    heroHeadlinePart1: "We engineer the systems",
    heroHeadlinePart2: "businesses run on.",
    heroDescription: "Project Buddy designs and engineers custom software, enterprise applications and AI-enabled systems around real business operations.",
    primaryCtaLabel: "Explore Services & Platforms",
    secondaryCtaLabel: "Start a Project",
    philosophyQuote: "“Software should fit the operation. The operation shouldn't have to fit the software.”",
  });

  const techLogos = [
    { node: <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#0B132B] px-3 py-1.5 rounded-lg bg-white border border-slate-200 shadow-xs"><Code className="w-3.5 h-3.5 text-[#0052FF]" /> React 18</div>, title: "React" },
    { node: <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#0B132B] px-3 py-1.5 rounded-lg bg-white border border-slate-200 shadow-xs"><Server className="w-3.5 h-3.5 text-[#0052FF]" /> Node.js Microservices</div>, title: "Node.js" },
    { node: <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#0B132B] px-3 py-1.5 rounded-lg bg-white border border-slate-200 shadow-xs"><Database className="w-3.5 h-3.5 text-[#0052FF]" /> PostgreSQL & pgvector</div>, title: "PostgreSQL" },
    { node: <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#0B132B] px-3 py-1.5 rounded-lg bg-white border border-slate-200 shadow-xs"><Cpu className="w-3.5 h-3.5 text-[#0052FF]" /> Python / AI Pipelines</div>, title: "Python" },
    { node: <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#0B132B] px-3 py-1.5 rounded-lg bg-white border border-slate-200 shadow-xs"><Layers className="w-3.5 h-3.5 text-[#0052FF]" /> Docker & Kubernetes</div>, title: "Docker" },
    { node: <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#0B132B] px-3 py-1.5 rounded-lg bg-white border border-slate-200 shadow-xs"><Terminal className="w-3.5 h-3.5 text-[#0052FF]" /> gRPC & REST Mesh</div>, title: "gRPC" },
  ];

  const sectionVariant = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } }
  };

  return (
    <div className="relative z-10">
      
      {/* HOMEPAGE HERO */}
      <section className="relative pt-32 pb-16 md:pt-40 md:pb-24 overflow-hidden">
        
        {/* Ambient Grid & Glow Background */}
        <div className="absolute inset-0 bg-tech-grid pointer-events-none opacity-60" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[800px] h-[380px] bg-gradient-to-tr from-[#0052FF]/12 via-[#3B82F6]/6 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="container-editorial px-4 sm:px-6 relative z-20 text-center">
          
          <div className="space-y-6 max-w-3xl mx-auto">
            
            {/* Technical Eyebrow Tag with DecryptedText 5s Loop */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/95 border border-slate-200/90 shadow-xs backdrop-blur-md"
            >
              <span className="w-2 h-2 rounded-full bg-[#0052FF] animate-pulse" />
              <span className="text-xs font-mono font-bold tracking-wider text-[#0B132B] uppercase">
                <DecryptedText
                  text={pageData.heroEyebrow}
                  animateOn="view"
                  revealDirection="center"
                  speed={35}
                  maxIterations={12}
                  loop={true}
                  loopInterval={5000}
                  encryptedClassName="text-[#0052FF] font-mono"
                />
              </span>
            </motion.div>

            {/* Headline with BlurText & ReactBits GradientText */}
            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-[#0B132B] leading-[1.1]"
            >
              <BlurText
                text={pageData.heroHeadlinePart1}
                delay={100}
                animateBy="words"
                direction="top"
              />
              <br />
              <GradientText
                colors={["#0052FF", "#0A84FF", "#3B82F6", "#0052FF"]}
                animationSpeed={4}
                className="py-1"
              >
                {pageData.heroHeadlinePart2}
              </GradientText>
            </motion.h1>

            {/* Supporting Copy with BlurText Animation */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-xl mx-auto"
            >
              <BlurText
                text={pageData.heroDescription}
                delay={80}
                animateBy="words"
                direction="bottom"
              />
            </motion.div>

            {/* Hero Dual CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3"
            >
              <Link
                href="/services"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full text-xs font-semibold text-white bg-[#0B132B] hover:bg-[#0052FF] shadow-md shadow-[#0B132B]/10 hover:shadow-[#0052FF]/25 transition-all duration-300 transform hover:-translate-y-0.5"
              >
                <span>{pageData.primaryCtaLabel}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>

              <button
                onClick={() => setContactOpen(true)}
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full text-xs font-semibold text-[#0B132B] bg-white border border-slate-200 hover:border-[#0052FF] hover:text-[#0052FF] shadow-xs transition-all duration-300 transform hover:-translate-y-0.5"
              >
                <span>{pageData.secondaryCtaLabel}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </motion.div>

            {/* Trust Metadata */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="pt-4 flex items-center justify-center gap-6 text-xs text-slate-500 border-t border-slate-200/60 max-w-md mx-auto"
            >
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#0052FF]" />
                <span>Custom Software Engineering</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>Production Ready Systems</span>
              </div>
            </motion.div>

          </div>

        </div>
      </section>

      {/* TECH STACK LOGO LOOP MARQUEE WITH SCROLL ANIMATION */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        variants={sectionVariant}
        className="py-6 border-y border-slate-200/60 bg-white/80 backdrop-blur-md"
      >
        <div className="container-visual px-4 sm:px-6">
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="text-[11px] font-mono font-semibold tracking-wider text-slate-400 uppercase">
              <DecryptedText text="ENTERPRISE STACK MESH:" animateOn="view" speed={30} loop={true} loopInterval={5000} />
            </span>
          </div>
          <LogoLoop
            logos={techLogos}
            speed={80}
            direction="left"
            logoHeight={32}
            gap={24}
            hoverSpeed={0}
            scaleOnHover
            fadeOut
            fadeOutColor="#FAF9F6"
            ariaLabel="Technology stack marquee"
          />
        </div>
      </motion.section>

      {/* SECTION 02: DISCONNECTED TO WORKING SYSTEM */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-60px" }}
        variants={sectionVariant}
      >
        <DisconnectedToSystem />
      </motion.div>

      {/* CAPABILITIES */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-60px" }}
        variants={sectionVariant}
      >
        <CapabilitiesShowcase />
      </motion.div>

      {/* SELECTED SYSTEMS SHOWCASE */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-60px" }}
        variants={sectionVariant}
      >
        <SystemsShowcase />
      </motion.div>

      {/* HOW IT WORKS */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-60px" }}
        variants={sectionVariant}
      >
        <HowItWorksWorkflow />
      </motion.div>

      {/* COMPANY PHILOSOPHY WITH BLURTEXT */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-60px" }}
        variants={sectionVariant}
        className="py-24 relative z-10"
      >
        <div className="container-editorial px-4 sm:px-6 text-center space-y-6">
          <span className="text-xs font-mono font-bold tracking-wider text-[#0052FF] uppercase">
            <DecryptedText text="Engineering Philosophy" animateOn="view" speed={30} loop={true} loopInterval={5000} />
          </span>
          <blockquote className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#0B132B] leading-tight tracking-tight">
            <BlurText
              text={pageData.philosophyQuote}
              delay={120}
              animateBy="words"
              direction="top"
            />
          </blockquote>
          <div className="text-slate-600 max-w-xl mx-auto text-sm sm:text-base">
            <BlurText
              text="We don't build generic SaaS templates or agency portfolios. We engineer robust digital infrastructure designed around the specific operational reality of your business."
              delay={90}
              animateBy="words"
              direction="bottom"
            />
          </div>
        </div>
      </motion.section>

      {/* FINAL CTA */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-60px" }}
        variants={sectionVariant}
        className="py-20 relative z-10 bg-[#0B132B] text-white overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#0052FF]/20 rounded-full blur-3xl pointer-events-none" />

        <div className="container-editorial px-4 sm:px-6 text-center relative z-20 space-y-5">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0052FF]/20 text-[#0A84FF] text-xs font-mono font-semibold">
            <DecryptedText text="READY TO ENGINEER YOUR SYSTEM?" animateOn="view" speed={30} loop={true} loopInterval={5000} />
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight">
            <GradientText
              colors={["#FFFFFF", "#0A84FF", "#3B82F6", "#FFFFFF"]}
              animationSpeed={5}
            >
              Let's discuss what you're building.
            </GradientText>
          </h2>
          <p className="text-slate-300 max-w-lg mx-auto text-sm sm:text-base">
            Direct access to our senior software architects. No sales pressure, no generic forms.
          </p>

          <div className="pt-3 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => setContactOpen(true)}
              className="px-7 py-3.5 rounded-full bg-[#0052FF] hover:bg-[#0042CC] text-white font-semibold text-xs shadow-lg shadow-[#0052FF]/30 transition-all transform hover:-translate-y-0.5 flex items-center gap-2"
            >
              <span>Start a Project Discussion</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </motion.section>

      <ContactModal isOpen={contactOpen} onClose={() => setContactOpen(false)} />
    </div>
  );
}
