import React, { useState, useEffect, useRef } from 'react';
import SplashCursor from './SplashCursor';
import { useCMS } from '../context/CMSContext';

/**
 * HeroBackground Component (Scoped strictly inside Hero section)
 * Manages the background for the Homepage Hero section ONLY.
 * Does NOT affect sections below the Hero.
 * 
 * Supports:
 * 1. Default Original WebGL / Ambient Tech Grid Hero Background (Permanent Fallback)
 * 2. Uploaded Custom Cinematic Hero Video (Autoplay, muted, loop, playsInline, position: absolute, object-fit: cover)
 * 3. Uploaded Custom Hero Image
 */
export default function HeroBackground() {
  const { getHomepageBg } = useCMS();
  const [bgConfig, setBgConfig] = useState(getHomepageBg(false));
  const [mediaLoaded, setMediaLoaded] = useState(false);
  const [mediaError, setMediaError] = useState(false);
  const videoRef = useRef(null);

  const prefersReducedMotion = typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  useEffect(() => {
    const config = getHomepageBg(window.innerWidth < 768);
    setBgConfig(config);
    setMediaLoaded(false);
    setMediaError(false);
  }, []);

  const isCustom = bgConfig.mode === 'custom' && bgConfig.asset && !mediaError;
  const asset = bgConfig.asset;
  const mediaSrc = asset?.url || asset?.src || '';
  const isVideo = asset?.type === 'video' || (mediaSrc && mediaSrc.match(/\.(mp4|webm|mov)$/i));

  const focalX = bgConfig.focalX ?? 50;
  const focalY = bgConfig.focalY ?? 50;

  useEffect(() => {
    if (isCustom && isVideo && videoRef.current && mediaLoaded) {
      videoRef.current.play().catch(() => {});
    }
  }, [isCustom, isVideo, mediaLoaded]);

  return (
    <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden hero-background">
      
      {/* 1. DEFAULT HERO BACKGROUND (Coded Fallback — WebGL SplashCursor + Tech Grid + Ambient Glow) */}
      <div
        className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
          isCustom && mediaLoaded ? 'opacity-0' : 'opacity-100'
        }`}
      >
        <SplashCursor
          SIM_RESOLUTION={128}
          DYE_RESOLUTION={1440}
          DENSITY_DISSIPATION={3.5}
          VELOCITY_DISSIPATION={2}
          PRESSURE={0.1}
          CURL={3}
          SPLAT_RADIUS={0.2}
          SPLAT_FORCE={6000}
          COLOR_UPDATE_SPEED={10}
        />
        <div className="absolute inset-0 bg-tech-grid opacity-60 pointer-events-none" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[800px] h-[380px] bg-gradient-to-tr from-[#0052FF]/12 via-[#3B82F6]/6 to-transparent rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* 2. CUSTOM HERO BACKGROUND (Video / Image with Cover & Focal Point — TERMINATES AT HERO BOUNDARY) */}
      {isCustom && mediaSrc && (
        <div
          className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
            mediaLoaded ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {isVideo && !prefersReducedMotion ? (
            <video
              ref={videoRef}
              src={mediaSrc}
              poster={asset.posterUrl || asset.poster}
              autoPlay
              muted
              loop
              playsInline
              onLoadedData={() => setMediaLoaded(true)}
              onError={() => setMediaError(true)}
              className="w-full h-full object-cover"
              style={{ objectPosition: `${focalX}% ${focalY}%` }}
            />
          ) : (
            <img
              src={mediaSrc}
              alt={asset.alt || 'Hero Background'}
              onLoad={() => setMediaLoaded(true)}
              onError={() => setMediaError(true)}
              className="w-full h-full object-cover"
              style={{ objectPosition: `${focalX}% ${focalY}%` }}
            />
          )}

          {/* Optional Readability Overlay */}
          {bgConfig.overlay === 'light' && (
            <div className="absolute inset-0 bg-slate-900/20 backdrop-blur-[1px]" />
          )}
          {bgConfig.overlay === 'medium' && (
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px]" />
          )}
        </div>
      )}

    </div>
  );
}
