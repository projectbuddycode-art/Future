import React from 'react';

/**
 * Project Buddy Logo Component
 * Hardcodes the official logo image (/logo.jpg) which contains both the PB monogram mark
 * and brand typography.
 */
export default function ProjectBuddyLogo({ className = "" }) {
  return (
    <div className={`flex items-center ${className}`}>
      <img
        src="/logo.jpg"
        alt="Project Buddy"
        className="h-11 sm:h-12 w-auto object-contain transition-transform duration-200 group-hover:scale-105"
      />
    </div>
  );
}
