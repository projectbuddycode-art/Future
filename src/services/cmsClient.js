/**
 * Project Buddy Central CMS Content & Resolver API
 * Ensures published CMS records ALWAYS take precedence over local coded fallbacks.
 */

import { getCMSState, getSectionMedia } from './cmsStore';
import { supabase, isSupabaseConfigured } from './supabaseClient';

/**
 * Fetch Published Page Content with Fallback
 */
export function getPublishedPageContent(pageId, fallbackObj = {}) {
  const state = getCMSState();
  const pageData = state.pages?.[pageId] || {};

  return {
    ...fallbackObj,
    ...pageData,
  };
}

/**
 * Fetch Published Section Media Assignment
 */
export function getPublishedSectionMedia(pageId, sectionId, slotId, isMobile = false, fallbackMedia = null) {
  const cmsMedia = getSectionMedia(pageId, sectionId, slotId, isMobile);

  // Published CMS Media ALWAYS overrides local fallback
  if (cmsMedia && cmsMedia.url) {
    return cmsMedia;
  }

  return fallbackMedia;
}

/**
 * Fetch Published Site Settings
 */
export function getPublishedSiteSettings(fallbackSettings = {}) {
  const state = getCMSState();
  const settings = state.siteSettings || {};

  return {
    ...fallbackSettings,
    ...settings,
  };
}

/**
 * Fetch Published Projects
 */
export function getPublishedProjects(fallbackProjects = []) {
  const state = getCMSState();
  if (state.projects && state.projects.length > 0) {
    return state.projects.filter(p => p.published !== false);
  }
  return fallbackProjects;
}
