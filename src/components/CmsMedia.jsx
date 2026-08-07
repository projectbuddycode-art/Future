import React, { useState } from 'react';
import {
  getMediaType,
  getVersionedMediaUrl
} from "../utils/cmsMedia";

/**
 * CmsMedia Component — Canonical Single Media Renderer v4.1
 * Includes play-on-hover video preview, clean error messaging, and responsive fit controls.
 */
export default function CmsMedia({
  asset,
  className = "",
  fallback = null,
  controls = false,
  interactiveHover = false
}) {
  const [loadError, setLoadError] = useState(false);

  if (!asset) return fallback;

  const type = getMediaType(asset);
  const src = getVersionedMediaUrl(asset);

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
        src={src}
        className={className}
        autoPlay
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
