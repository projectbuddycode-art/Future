import React, { createContext, useContext, useState, useEffect } from 'react';
import { getCMSState, hydrateCMSFromCloud } from '../services/cmsStore';
import {
  getPublishedPageContent,
  getPublishedSectionMedia,
  getPublishedHomepageBackground,
  getPublishedSiteSettings,
  getPublishedProjects
} from '../services/cmsClient';

const CMSContext = createContext(null);

export function CMSProvider({ children }) {
  const [cmsState, setCmsState] = useState(getCMSState());

  useEffect(() => {
    // 1. Initial Cloud Sync: Hydrate published state from Supabase Database for cross-tab & cross-device Vercel visitors
    hydrateCMSFromCloud().then(() => {
      setCmsState(getCMSState());
    });

    const handleUpdate = () => {
      setCmsState(getCMSState());
    };

    // 2. Listen to local & cross-tab CMS state update events
    window.addEventListener('cms-state-updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);

    return () => {
      window.removeEventListener('cms-state-updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  const getPage = (pageId, fallback = {}) => getPublishedPageContent(pageId, fallback);
  const getMedia = (pageId, sectionId, slotId, isMobile = false, fallback = null) =>
    getPublishedSectionMedia(pageId, sectionId, slotId, isMobile, fallback);
  const getHomepageBg = (isMobile = false) => getPublishedHomepageBackground(isMobile);
  const getSettings = (fallback = {}) => getPublishedSiteSettings(fallback);
  const getProjects = (fallback = []) => getPublishedProjects(fallback);

  return (
    <CMSContext.Provider value={{ cmsState, getPage, getMedia, getHomepageBg, getSettings, getProjects }}>
      {children}
    </CMSContext.Provider>
  );
}

export function useCMS() {
  const context = useContext(CMSContext);
  if (!context) {
    throw new Error('useCMS must be used within a CMSProvider');
  }
  return context;
}
