import React, { createContext, useContext, useState, useEffect } from 'react';
import { getCMSState, hydrateCMSFromCloud, updateInMemCMSState } from '../services/cmsStore';
import { subscribeToCMSRealtime } from '../services/supabaseClient';
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
    // 1. Initial Cloud Sync: Fetch fresh published state from Supabase Database on mount
    hydrateCMSFromCloud().then((cloudData) => {
      if (cloudData) {
        setCmsState(getCMSState());
      }
    });

    // 2. Realtime PostgreSQL Subscription: Instantly reflect Admin publishes across all open sessions/devices without reload
    const unsubscribeRealtime = subscribeToCMSRealtime((freshCloudState) => {
      updateInMemCMSState(freshCloudState);
      setCmsState(getCMSState());
    });

    const handleUpdate = () => {
      setCmsState(getCMSState());
    };

    // 3. Listen to local & cross-tab CMS state update events
    window.addEventListener('cms-state-updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);

    return () => {
      unsubscribeRealtime();
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
