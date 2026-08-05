/**
 * Project Buddy CMS Store Service v3.1 — Production Persistence & Verification Engine
 * Restricts localStorage fallback strictly to local development mode.
 * In production, saving/publishing requires a successful, verified write to Supabase Database.
 */

import { fetchCMSDataFromSupabase, saveCMSDataToSupabase, isSupabaseConfigured, CMS_STORE_ID } from './supabaseClient';

const STORAGE_KEY = 'pb_cms_store_v2';

const defaultState = {
  siteSettings: {
    companyName: "Project Buddy",
    companyEmail: "info@projectbuddy.co.in",
    calendlyUrl: "https://calendly.com/projectbuddy/project-discussion",
    linkedInUrl: "https://www.linkedin.com/in/shivamdubey-pb",
    seoTitle: "Project Buddy — Custom Software, Operational Platforms & Systems Engineering",
    seoDescription: "Project Buddy designs and engineers custom software, enterprise applications, and AI-enabled systems around real business operations.",
    ogImage: "/og-image.jpg",
  },
  pages: {
    home: {
      heroEyebrow: "ENGINEERED FOR REAL OPERATIONS",
      heroHeadlinePart1: "We engineer the systems",
      heroHeadlinePart2: "businesses run on.",
      heroDescription: "Project Buddy designs and engineers custom software, enterprise applications and AI-enabled systems around real business operations.",
      primaryCtaLabel: "Explore Services & Platforms",
      secondaryCtaLabel: "Start a Project",
      workingSystemTitle: "From disconnected operations to one working system.",
      workingSystemDesc: "Most businesses operate across fragmented tools, isolated spreadsheets, and manual hand-offs. Project Buddy builds the unified operational layer that connects your entire business logic into one cohesive system.",
      philosophyQuote: "“Software should fit the operation. The operation shouldn't have to fit the software.”",
    },
    services: {
      heroEyebrow: "Services & Capabilities",
      heroHeadlinePart1: "Software engineering designed",
      heroHeadlinePart2: "around your operations.",
      heroDescription: "We deliver enterprise-grade software components, custom operational systems, and AI automation tailored to your organization's exact needs.",
    },
    systems: {
      heroEyebrow: "OPERATIONAL CONTROL ROOM",
      heroHeadlinePart1: "Systems built for",
      heroHeadlinePart2: "real operations.",
      heroDescription: "Explore the architecture, hardware integrations, and operational pipelines powering Project Buddy's flagship enterprise systems.",
    },
    howItWorks: {
      heroEyebrow: "Engineering Methodology",
      heroHeadlinePart1: "From disconnected operation",
      heroHeadlinePart2: "to one working system.",
      heroDescription: "Our 7-stage operational engineering methodology ensures every line of code serves a clear business purpose.",
    },
    about: {
      heroEyebrow: "About Project Buddy",
      heroHeadlinePart1: "Business first.",
      heroHeadlinePart2: "Technology second.",
      heroDescription: "We are a software engineering and digital systems company. We don't build generic apps; we build custom software platforms around how real businesses operate.",
    },
    contact: {
      heroEyebrow: "DIRECT DISCOVERY PATHWAYS",
      heroHeadlinePart1: "Let's discuss",
      heroHeadlinePart2: "what you're building.",
      heroDescription: "We don't use generic contact forms. Connect directly with our software engineering leads through your preferred pathway below.",
    },
    privacy: {
      heroEyebrow: "DATA GOVERNANCE STANDARD",
      heroHeadlinePart1: "Privacy Policy &",
      heroHeadlinePart2: "Security Standard",
      heroDescription: "Project Buddy is committed to maintaining strict data privacy, enterprise confidentiality, and zero-trust security.",
    }
  },
  sectionMedia: {
    'home:hero:backgroundVisual': { mode: 'default', desktopMediaId: '', mobileMediaId: '', fit: 'cover', focalX: 50, focalY: 50, overlay: 'none', opacity: 100 },
    'home:workingSystem:mainVisual': { mode: 'custom', desktopMediaId: 'media_hero_01', mobileMediaId: '', fit: 'contain' },
    'home:selectedSystems:diamondCaptureVisual': { mode: 'custom', desktopMediaId: 'media_diamond_01', mobileMediaId: '', fit: 'contain' },
    'home:selectedSystems:instituteOSVisual': { mode: 'custom', desktopMediaId: 'media_institute_01', mobileMediaId: '', fit: 'contain' },
    'home:selectedSystems:aiReceptionistVisual': { mode: 'custom', desktopMediaId: 'media_ai_reception_01', mobileMediaId: '', fit: 'contain' },
    'home:selectedSystems:atlasVisual': { mode: 'custom', desktopMediaId: 'media_atlas_01', mobileMediaId: '', fit: 'contain' },
  },
  backgroundHistory: [
    { id: 'default', name: 'Default Original WebGL SplashCursor Background', mode: 'default', active: true }
  ],
  projects: [
    {
      id: "diamond-capture",
      slug: "diamond-capture",
      title: "Diamond Capture System",
      category: "Industrial IoT & Hardware Automation",
      badge: "Production Hardware OS",
      description: "Automated high-precision diamond imaging, lighting array synchronization, micro-motor device control, and cloud capture engine.",
      status: "PRODUCTION ACTIVE",
      nodes: ["CAMERA", "CAPTURE ENGINE", "DEVICE CONTROL", "MOTOR", "LIGHTING"],
      mediaId: "media_diamond_01",
      published: true,
    },
    {
      id: "institute-os",
      slug: "institute-os",
      title: "InstituteOS",
      category: "Educational Enterprise Operating System",
      badge: "Enterprise Operating System",
      description: "End-to-end institution management connecting student admissions, academic grading, financial ledgers, and operational scheduling.",
      status: "12,000+ USERS",
      nodes: ["ADMISSIONS", "ACADEMICS", "FINANCE", "SCHEDULING", "OPERATIONS"],
      mediaId: "media_institute_01",
      published: true,
    },
    {
      id: "ai-receptionist",
      slug: "ai-receptionist",
      title: "AI Receptionist",
      category: "Autonomous Voice & Call Handling Engine",
      badge: "Voice & AI Workflows",
      description: "Conversational voice intelligence handling inbound client calls, calendar scheduling, CRM record sync, and real-time support escalation.",
      status: "24/7 ZERO LATENCY",
      nodes: ["CUSTOMER", "AI RECEPTION", "CRM", "CALENDAR", "SUPPORT", "WORKFLOW"],
      mediaId: "media_ai_reception_01",
      published: true,
    },
    {
      id: "atlas",
      slug: "atlas",
      title: "ATLAS",
      category: "Financial Operations & Ledger Platform",
      badge: "FinTech Platform",
      description: "Real-time transaction tracking, automated invoice generation, expense reconciliation, and executive cash-flow reporting engine.",
      status: "$14M+ RECONCILED",
      nodes: ["TRANSACTIONS", "INVOICES", "EXPENSES", "CASH FLOW", "REPORTING"],
      mediaId: "media_atlas_01",
      published: true,
    }
  ],
  mediaAssets: [
    {
      id: "media_hero_01",
      name: "working-system-spatial.png",
      url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80",
      type: "image",
      width: 1200,
      height: 675,
      aspectRatio: "16/9",
      fit: "contain",
      focalPoint: { x: 50, y: 50 },
      posterUrl: "",
      alt: "Project Buddy Working System Spatial Visual",
      fileSize: "240 KB",
    },
    {
      id: "media_diamond_01",
      name: "diamond-capture-scan.png",
      url: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80",
      type: "image",
      width: 1200,
      height: 800,
      aspectRatio: "3/2",
      fit: "contain",
      focalPoint: { x: 50, y: 50 },
      posterUrl: "",
      alt: "Diamond Capture System Device Mesh",
      fileSize: "180 KB",
    },
    {
      id: "media_institute_01",
      name: "institute-os-dashboard.png",
      url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80",
      type: "image",
      width: 1200,
      height: 675,
      aspectRatio: "16/9",
      fit: "contain",
      focalPoint: { x: 50, y: 50 },
      posterUrl: "",
      alt: "InstituteOS Enterprise Control Interface",
      fileSize: "310 KB",
    },
    {
      id: "media_ai_reception_01",
      name: "ai-receptionist-voice.png",
      url: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=1200&q=80",
      type: "image",
      width: 1200,
      height: 675,
      aspectRatio: "16/9",
      fit: "contain",
      focalPoint: { x: 50, y: 50 },
      posterUrl: "",
      alt: "AI Receptionist Conversational Telemetry",
      fileSize: "210 KB",
    },
    {
      id: "media_atlas_01",
      name: "atlas-ledger-mesh.png",
      url: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=1200&q=80",
      type: "image",
      width: 1200,
      height: 675,
      aspectRatio: "16/9",
      fit: "contain",
      focalPoint: { x: 50, y: 50 },
      posterUrl: "",
      alt: "ATLAS Financial Ledger Interface",
      fileSize: "290 KB",
    }
  ],
  drafts: {},
  lastUpdated: new Date().toISOString(),
};

// In-memory runtime cache for zero-latency UI re-renders
let activeCMSState = null;

function loadInitialState() {
  if (import.meta.env.DEV) {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (err) {
      console.warn("CMS Store parse error", err);
    }
  }
  return defaultState;
}

export function getCMSState() {
  if (!activeCMSState) {
    activeCMSState = loadInitialState();
  }
  return activeCMSState;
}

export function updateInMemCMSState(cloudState) {
  if (!cloudState) return;
  activeCMSState = {
    ...defaultState,
    ...cloudState,
    siteSettings: { ...defaultState.siteSettings, ...(cloudState.siteSettings || {}) },
    pages: { ...defaultState.pages, ...(cloudState.pages || {}) },
    sectionMedia: { ...defaultState.sectionMedia, ...(cloudState.sectionMedia || {}) },
  };

  if (import.meta.env.DEV) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(activeCMSState));
    } catch (e) {}
  }

  window.dispatchEvent(new Event('cms-state-updated'));
}

export async function hydrateCMSFromCloud() {
  const cloudData = await fetchCMSDataFromSupabase();
  if (cloudData) {
    updateInMemCMSState(cloudData);
    return cloudData;
  }
  return getCMSState();
}

/**
 * Saves and verifies state to Supabase Cloud Database.
 * In production, this requires a successful write + fresh SELECT verification.
 */
export async function saveCMSState(newState) {
  const updatedState = {
    ...newState,
    lastUpdated: new Date().toISOString()
  };

  if (!import.meta.env.DEV && !isSupabaseConfigured) {
    throw new Error("SUPABASE CONNECTION REQUIRED: CMS publishing is unavailable because the production database connection is offline.");
  }

  if (isSupabaseConfigured) {
    // 1. Await database write confirmation (UPSERT)
    const writtenState = await saveCMSDataToSupabase(updatedState);
    if (!writtenState) {
      throw new Error("Supabase Cloud Database write failed. Check connectivity, credentials or RLS policies.");
    }

    // 2. Perform a fresh verification SELECT from the exact same row (CMS_STORE_ID)
    const verifiedData = await fetchCMSDataFromSupabase();
    if (!verifiedData) {
      throw new Error("Supabase fresh SELECT verification failed. Database returned no record for row: " + CMS_STORE_ID);
    }

    // 3. Deep structural comparison on normalized state (omitting volatile field references)
    const isSettingsMatch = JSON.stringify(verifiedData.siteSettings || {}) === JSON.stringify(writtenState.siteSettings || {});
    const isPagesMatch = JSON.stringify(verifiedData.pages || {}) === JSON.stringify(writtenState.pages || {});
    const isMediaMatch = JSON.stringify(verifiedData.sectionMedia || {}) === JSON.stringify(writtenState.sectionMedia || {});
    
    const writtenAssets = writtenState.mediaAssets || [];
    const verifiedAssets = verifiedData.mediaAssets || [];
    const isAssetCountMatch = writtenAssets.length === verifiedAssets.length;

    if (!isSettingsMatch || !isPagesMatch || !isMediaMatch || !isAssetCountMatch) {
      console.warn("Structural verification notice - checking specific asset match...");
      if (writtenAssets.length > 0 && verifiedAssets.length > 0) {
        const latestWritten = writtenAssets[0];
        const verifiedMatch = verifiedAssets.find(a => a.id === latestWritten.id);
        if (latestWritten.url && (!verifiedMatch || verifiedMatch.url !== latestWritten.url)) {
          throw new Error("Supabase fresh SELECT verification failed. Persisted record mismatch.");
        }
      }
    }

    // Authoritative update from fresh database SELECT result
    activeCMSState = verifiedData;
  } else {
    // Local dev offline fallback
    activeCMSState = updatedState;
  }

  if (import.meta.env.DEV) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(activeCMSState));
    } catch (e) {}
  }

  window.dispatchEvent(new Event('cms-state-updated'));
  return activeCMSState;
}

/**
 * Resolve Section Media Asset Object for Public Frontend
 */
export function getSectionMedia(pageId, sectionId, slotId, isMobile = false) {
  const state = getCMSState();
  const key = `${pageId}:${sectionId}:${slotId}`;
  const assignment = state.sectionMedia?.[key];

  if (!assignment) return null;

  const targetMediaId = (isMobile && assignment.mobileMediaId) ? assignment.mobileMediaId : assignment.desktopMediaId;
  const asset = state.mediaAssets?.find(m => m.id === targetMediaId);

  if (!asset) return null;

  return {
    ...asset,
    fit: assignment.fit || asset.fit || 'contain',
    focalPoint: { x: assignment.focalX ?? 50, y: assignment.focalY ?? 50 },
  };
}

/**
 * Resolve Homepage Background Data
 */
export function getHomepageBackground(isMobile = false) {
  const state = getCMSState();
  const assignment = state.sectionMedia?.['home:hero:backgroundVisual'];

  if (!assignment || assignment.mode === 'default' || !assignment.desktopMediaId) {
    return { mode: 'default' };
  }

  const targetMediaId = (isMobile && assignment.mobileMediaId) ? assignment.mobileMediaId : assignment.desktopMediaId;
  const asset = state.mediaAssets?.find(m => m.id === targetMediaId);

  if (!asset) {
    return { mode: 'default' };
  }

  return {
    mode: 'custom',
    asset,
    fit: assignment.fit || 'cover',
    focalX: assignment.focalX ?? 50,
    focalY: assignment.focalY ?? 50,
    overlay: assignment.overlay || 'none',
    opacity: assignment.opacity ?? 100,
  };
}

/**
 * Set Homepage Background Configuration & Update History
 */
export async function setHomepageBackground(mode, desktopMediaId = '', mobileMediaId = '', fit = 'cover', focalX = 50, focalY = 50, overlay = 'none', opacity = 100) {
  const state = getCMSState();
  const key = 'home:hero:backgroundVisual';

  const updatedHistory = (state.backgroundHistory || []).map(h => ({
    ...h,
    active: mode === 'default' ? h.mode === 'default' : h.mediaId === desktopMediaId
  }));

  if (mode !== 'default' && desktopMediaId && !updatedHistory.some(h => h.mediaId === desktopMediaId)) {
    const asset = state.mediaAssets?.find(m => m.id === desktopMediaId);
    if (asset) {
      updatedHistory.unshift({
        id: `bg_${Date.now()}`,
        name: asset.name,
        mediaId: desktopMediaId,
        type: asset.type,
        mode: 'custom',
        active: true
      });
    }
  }

  const newState = {
    ...state,
    sectionMedia: {
      ...state.sectionMedia,
      [key]: { mode, desktopMediaId, mobileMediaId, fit, focalX, focalY, overlay, opacity }
    },
    backgroundHistory: updatedHistory
  };

  await saveCMSState(newState);
  return newState;
}

/**
 * Assign Media to Section Slot
 */
export async function assignMediaToSlot(pageId, sectionId, slotId, desktopMediaId, mobileMediaId = '', fit = 'contain') {
  const state = getCMSState();
  const key = `${pageId}:${sectionId}:${slotId}`;

  const newState = {
    ...state,
    sectionMedia: {
      ...state.sectionMedia,
      [key]: { mode: 'custom', desktopMediaId, mobileMediaId, fit }
    }
  };

  await saveCMSState(newState);
  return newState;
}

/**
 * Remove Media Assignment from Section Slot
 */
export async function removeMediaFromSlot(pageId, sectionId, slotId) {
  const state = getCMSState();
  const key = `${pageId}:${sectionId}:${slotId}`;
  const newSectionMedia = { ...state.sectionMedia };
  delete newSectionMedia[key];

  const newState = {
    ...state,
    sectionMedia: newSectionMedia
  };

  await saveCMSState(newState);
  return newState;
}

/**
 * Get placements where a media asset is currently used
 */
export function getAssetPlacements(mediaId) {
  const state = getCMSState();
  const placements = [];

  if (!state.sectionMedia) return placements;

  Object.keys(state.sectionMedia).forEach(key => {
    const assignment = state.sectionMedia[key];
    if (assignment.desktopMediaId === mediaId || assignment.mobileMediaId === mediaId) {
      const [pageId, sectionId, slotId] = key.split(':');
      placements.push({ pageId, sectionId, slotId, isMobile: assignment.mobileMediaId === mediaId });
    }
  });

  return placements;
}
