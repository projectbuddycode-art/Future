import React from 'react';
import { motion } from 'framer-motion';
import { useCMS } from '../context/CMSContext';
import CmsMedia from './CmsMedia';
import DecryptedText from './DecryptedText';
import BlurText from './BlurText';

export default function DisconnectedToSystem() {
  const { cmsState, getPage } = useCMS();
  
  const pageData = getPage('home', {
    workingSystemTitle: "From disconnected operations to one working system.",
    workingSystemDesc: "Most businesses operate across fragmented tools, isolated spreadsheets, and manual hand-offs. Project Buddy builds the unified operational layer that connects your entire business logic into one cohesive system."
  });

  // Canonical resolution of Working System CMS media assignment
  const workingSystemMedia = cmsState?.media?.["home.workingSystem.visual"] || cmsState?.media?.["home:workingSystem:mainVisual"];

  const defaultMeshFallback = (
    <div className="w-full h-full p-8 flex flex-col items-center justify-center bg-slate-950 text-white text-center space-y-4 font-mono relative overflow-hidden aspect-video rounded-2xl border border-slate-800 shadow-xl">
      <div className="absolute inset-0 bg-tech-grid opacity-30 pointer-events-none" />
      <div className="w-16 h-16 rounded-2xl bg-[#0052FF]/20 border border-[#0052FF]/40 text-[#0052FF] flex items-center justify-center text-xl font-bold">
        PB
      </div>
      <div className="space-y-1 relative z-10">
        <div className="text-sm font-bold text-white tracking-wider">PROJECT BUDDY SYSTEM MESH</div>
        <div className="text-xs text-slate-400">Team • Customer • Process • Data • Tools • Workflow</div>
      </div>
      <div className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] border border-emerald-500/30">
        SYSTEM ENGINE READY
      </div>
    </div>
  );

  return (
    <section className="py-24 relative z-10 bg-slate-900/5 border-y border-slate-200/80">
      <div className="container-visual px-4 sm:px-6 md:px-8 space-y-12">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-slate-200 shadow-xs">
            <span className="w-2 h-2 rounded-full bg-[#0052FF]" />
            <span className="text-xs font-mono font-bold tracking-wider text-[#0052FF] uppercase">
              <DecryptedText
                text="SYSTEM ALIGNMENT"
                animateOn="view"
                speed={30}
                loop={true}
                loopInterval={5000}
              />
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#0B132B] tracking-tight">
            <BlurText
              text={pageData.workingSystemTitle}
              delay={100}
              animateBy="words"
              direction="top"
            />
          </h2>

          <div className="text-slate-600 text-base sm:text-lg max-w-2xl mx-auto">
            <BlurText
              text={pageData.workingSystemDesc}
              delay={70}
              animateBy="words"
              direction="bottom"
            />
          </div>
        </div>

        {/* Dynamic CMS Media Container */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-5xl mx-auto overflow-hidden rounded-2xl border border-slate-200/90 bg-[#0B132B] shadow-xl backdrop-blur-md aspect-video relative"
        >
          {workingSystemMedia ? (
            <CmsMedia
              asset={workingSystemMedia}
              className="w-full h-full object-contain"
              fallback={defaultMeshFallback}
            />
          ) : defaultMeshFallback}
        </motion.div>

      </div>
    </section>
  );
}
