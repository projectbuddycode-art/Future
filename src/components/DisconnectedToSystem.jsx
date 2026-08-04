import React from 'react';
import { motion } from 'framer-motion';
import { useCMS } from '../context/CMSContext';
import SmartMedia from './SmartMedia';
import DecryptedText from './DecryptedText';
import BlurText from './BlurText';

export default function DisconnectedToSystem() {
  const { getPage, getMedia } = useCMS();
  
  const pageData = getPage('home', {
    workingSystemTitle: "From disconnected operations to one working system.",
    workingSystemDesc: "Most businesses operate across fragmented tools, isolated spreadsheets, and manual hand-offs. Project Buddy builds the unified operational layer that connects your entire business logic into one cohesive system."
  });

  const defaultWorkingSystemVisual = {
    src: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80",
    type: "image",
    aspectRatio: "16/9",
    fit: "contain",
    alt: "Project Buddy Working System Spatial Visual"
  };

  // Published CMS Media ALWAYS takes priority over local fallback
  const assignedMedia = getMedia('home', 'workingSystem', 'mainVisual', false, defaultWorkingSystemVisual);

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

        {/* Dynamic SmartMedia Visual Slot (Contain fit by default — preserves Google Flow MP4 / Image) */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-5xl mx-auto"
        >
          <SmartMedia media={assignedMedia} />
        </motion.div>

      </div>
    </section>
  );
}
