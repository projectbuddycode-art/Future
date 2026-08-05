import React, { useRef, useEffect, useState } from 'react';

/**
 * SmartMedia Component — Project Buddy Smart Media System
 * Renders Images & Videos with intrinsic aspect ratio calculation,
 * default object-fit: contain (no cropping), lazy viewport loading,
 * and continuous infinite video looping.
 */
export default function SmartMedia({
  media,
  src,
  type,
  width,
  height,
  aspectRatio,
  fit = 'contain',
  focalPoint = { x: 50, y: 50 },
  poster = '',
  alt = 'Project Buddy Visual Asset',
  className = '',
  style = {},
  mobileMedia,
}) {
  const containerRef = useRef(null);
  const videoRef = useRef(null);
  const [hasError, setHasError] = useState(false);
  const [calculatedRatio, setCalculatedRatio] = useState(aspectRatio || '16/9');

  const activeMedia = media || {
    src: src || '',
    url: src || '',
    type: type || 'image',
    width: width || 1200,
    height: height || 675,
    aspectRatio: aspectRatio || '16/9',
    fit: fit || 'contain',
    focalPoint: focalPoint || { x: 50, y: 50 },
    poster: poster || '',
    alt: alt || 'Project Buddy Visual',
  };

  const mediaSrc = activeMedia.src || activeMedia.url || '';
  const rawType = activeMedia.type || type;
  const isVideo = rawType === 'video' || (mediaSrc && Boolean(mediaSrc.match(/\.(mp4|webm|mov|m4v)($|\?)/i)));

  useEffect(() => {
    setHasError(false);
  }, [mediaSrc]);

  // Video autoplay & continuous loop handler
  useEffect(() => {
    if (isVideo && videoRef.current && mediaSrc && !hasError) {
      videoRef.current.loop = true;
      videoRef.current.muted = true;
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(err => {
          console.warn("Video playback deferred/handled:", err);
        });
      }
    }
  }, [isVideo, mediaSrc, hasError]);

  const handleImageLoad = (e) => {
    const naturalWidth = e.target.naturalWidth;
    const naturalHeight = e.target.naturalHeight;
    if (naturalWidth && naturalHeight) {
      const ratio = `${naturalWidth}/${naturalHeight}`;
      setCalculatedRatio(ratio);
    }
  };

  const handleVideoError = (e) => {
    if (mediaSrc) {
      console.error("WORKING SYSTEM VIDEO ERROR", {
        src: mediaSrc,
        error: e.target?.error
      });
      setHasError(true);
    }
  };

  const finalFitClass = activeMedia.fit === 'cover' ? 'object-cover' : 'object-contain';
  const focalStyle = activeMedia.fit === 'cover' ? { objectPosition: `${activeMedia.focalPoint?.x ?? 50}% ${activeMedia.focalPoint?.y ?? 50}%` } : {};

  return (
    <div
      ref={containerRef}
      className={`relative w-full overflow-hidden rounded-2xl border border-slate-200/90 bg-[#0B132B] shadow-xl backdrop-blur-md transition-all duration-300 ${className}`}
      style={{
        aspectRatio: activeMedia.aspectRatio || calculatedRatio,
        maxWidth: '100%',
        marginInline: 'auto',
        ...style,
      }}
    >
      {hasError || !mediaSrc ? (
        <div className="w-full h-full p-8 flex flex-col items-center justify-center bg-slate-950 text-white text-center space-y-4 font-mono relative overflow-hidden">
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
      ) : isVideo ? (
        <video
          key={mediaSrc}
          ref={videoRef}
          src={mediaSrc}
          poster={activeMedia.poster || activeMedia.posterUrl}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          onError={handleVideoError}
          className={`w-full h-full ${finalFitClass} pointer-events-none`}
          style={focalStyle}
        />
      ) : (
        <img
          key={mediaSrc}
          src={mediaSrc}
          alt={activeMedia.alt || 'Project Buddy Visual'}
          loading="lazy"
          onLoad={handleImageLoad}
          onError={() => setHasError(true)}
          className={`w-full h-full ${finalFitClass} transition-opacity duration-500`}
          style={focalStyle}
        />
      )}
    </div>
  );
}
