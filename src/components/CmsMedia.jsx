import React from 'react';
import {
  getMediaType,
  getVersionedMediaUrl
} from "../utils/cmsMedia";

/**
 * CmsMedia Component — Canonical Single Media Renderer
 * Used across Admin Media Library, Upload Preview, and Public Website
 */
export default function CmsMedia({
  asset,
  className = "",
  fallback = null,
  controls = false
}) {
  if (!asset) return fallback;

  const type = getMediaType(asset);
  const src = getVersionedMediaUrl(asset);

  if (!src) return fallback;

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
        onError={(event) => {
          console.error("CMS VIDEO LOAD ERROR", {
            src,
            storagePath: asset?.storagePath,
            error: event.currentTarget?.error
          });
        }}
      />
    );
  }

  return (
    <img
      key={src}
      src={src}
      className={className}
      alt={asset.alt || "Project Buddy Visual Asset"}
      loading="lazy"
      onError={() => {
        console.error("CMS IMAGE LOAD ERROR", {
          src,
          storagePath: asset?.storagePath
        });
      }}
    />
  );
}
