import React from 'react';
import { useCMS } from '../context/CMSContext';

/**
 * Official Project Buddy Logo Component
 * Renders published logo image or PB monogram logo mark & tagline.
 */
export function PBMonogramIcon({ className = "w-10 h-10", isWhite = false }) {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Outer B Loop */}
      <path
        d="M20 15 H60 C75 15, 85 25, 85 40 C85 52, 75 60, 60 60 H40 V85 H20 V15 Z"
        fill={isWhite ? "#FFFFFF" : "#0052FF"}
      />
      {/* Inner P Counter Cutout */}
      <path
        d="M40 32 H55 C62 32, 67 36, 67 43 C67 50, 62 54, 55 54 H40 V32 Z"
        fill={isWhite ? "#0B132B" : "#FFFFFF"}
      />
      {/* Bottom B Counter Loop Overlay */}
      <path
        d="M40 50 H62 C74 50, 84 58, 84 70 C84 82, 74 88, 62 88 H20 V72 H62 C67 72, 70 69, 70 65 C70 60, 67 57, 62 57 H40 V50 Z"
        fill={isWhite ? "#FFFFFF" : "#0052FF"}
      />
    </svg>
  );
}

export default function ProjectBuddyLogo({ showTagline = true, isDark = false, className = "" }) {
  let settings = {};
  try {
    const cms = useCMS();
    settings = cms.getSettings();
  } catch (e) {
    // Fallback if rendered outside CMSProvider
  }

  const customLogoUrl = settings?.logoUrl;
  const companyName = settings?.companyName || "Project Buddy";
  const tagline = settings?.logoTagline || "Turn idea into reality";

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {customLogoUrl ? (
        <img
          src={customLogoUrl}
          alt={companyName}
          className="h-10 w-auto max-w-[160px] object-contain transition-transform duration-200 group-hover:scale-105"
        />
      ) : (
        <PBMonogramIcon className="w-10 h-10 sm:w-11 sm:h-11 shrink-0 transition-transform duration-200 group-hover:scale-105" isWhite={isDark} />
      )}

      <div className="flex flex-col leading-tight">
        <span className={`font-extrabold text-xl tracking-tight ${isDark ? 'text-white' : 'text-[#0B132B]'}`}>
          {companyName}
        </span>
        {showTagline && tagline && (
          <span className="text-[11px] font-semibold text-slate-500 font-sans tracking-wide">
            {tagline}
          </span>
        )}
      </div>
    </div>
  );
}
