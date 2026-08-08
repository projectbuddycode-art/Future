import React, { useState, useRef, useEffect } from 'react';
import {
  getMediaType,
  getVersionedMediaUrl
} from "../utils/cmsMedia";

/**
 * CmsMedia Component — Canonical Single Media Renderer v5.1
 * Pause-on-scroll IntersectionObserver video playback, hover preview controls,
 * and lazy load image handling.
 */
export default function CmsMedia({
  asset,
  className = "",
  fallback = null,
  controls = false,
  interactiveHover = false
}) {
  const [loadError, setLoadError] = useState(false);
  const videoRef = useRef(null);

  const type = getMediaType(asset);
  const src = getVersionedMediaUrl(asset);

  // IntersectionObserver to pause video playback when out of viewport
  useEffect(() => {
    if (type !== 'video' || !videoRef.current) return;

    const videoEl = videoRef.current;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (!interactiveHover) {
            videoEl.play().catch(() => {});
          }
        } else {
          videoEl.pause();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(videoEl);
    return () => observer.disconnect();
  }, [type, src, interactiveHover]);

  if (!asset) return fallback;
  if (!src) return fallback;

  if (loadError) {
    return (
      <div className="w-full h-full p-4 bg-slate-900 text-slate-300 text-[11px] font-mono rounded-xl border border-slate-800 flex flex-col items-center justify-center text-center space-y-1">
        <div className="text-amber-400 font-bold">Preview unavailable</div>
        <div className="truncate max-w-full text-slate-300">{asset.name || "Unknown asset"}</div>
        <div className="truncate max-w-full text-[10px] text-slate-500">{asset.storagePath || asset.url}</div>
      </div>
    );
  }

  if (type === "video") {
    return (
      <video
        key={src}
        ref={videoRef}
        src={src}
        className={className}
        autoPlay={!interactiveHover}
        muted
        loop
        playsInline
        preload="metadata"
        controls={controls}
        onMouseEnter={(e) => {
          if (interactiveHover) {
            e.currentTarget.play().catch(() => {});
          }
        }}
        onMouseLeave={(e) => {
          if (interactiveHover) {
            e.currentTarget.pause();
            e.currentTarget.currentTime = 0;
          }
        }}
        onError={(event) => {
          console.error("CMS VIDEO LOAD ERROR", {
            src,
            storagePath: asset?.storagePath,
            error: event.currentTarget?.error
          });
          setLoadError(true);
        }}
      />
    );
  }

  return (
    <img
      key={src}
      src={src}
      className={className}
      alt={asset.alt || asset.name || "Project Buddy Visual Asset"}
      loading="lazy"
      onError={() => {
        console.error("CMS IMAGE LOAD ERROR", {
          src,
          storagePath: asset?.storagePath
        });
        setLoadError(true);
      }}
    />
  );
}
