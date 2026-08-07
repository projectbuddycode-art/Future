/**
 * Centralized Section Media Registry for Project Buddy v4.3
 * Defines all pages, media-capable sections, and canonical slot mappings.
 */

export const MEDIA_REGISTRY = {
  home: {
    name: "Home",
    sections: {
      hero: {
        name: "01 Hero Section",
        slots: {
          backgroundVisual: { name: "Hero Background Media", defaultFit: "cover" },
          heroVisual: { name: "Main Hero Visual", defaultFit: "contain" },
        }
      },
      workingSystem: {
        name: "02 Working System Diagram",
        slots: {
          mainVisual: { name: "Main Visual (Working System)", defaultFit: "contain" },
        }
      },
      capabilities: {
        name: "03 Engineering Capabilities",
        slots: {
          businessSoftware: { name: "Business Software Visual", defaultFit: "contain" },
          internalPlatforms: { name: "Internal Platforms Visual", defaultFit: "contain" },
          customerPortals: { name: "Customer Portals Visual", defaultFit: "contain" },
          operationalTools: { name: "Operational Tools Visual", defaultFit: "contain" },
        }
      },
      selectedSystems: {
        name: "04 Systems in Production",
        slots: {
          diamondCapture: { name: "Diamond Capture System Visual", defaultFit: "cover" },
          instituteOS: { name: "InstituteOS Visual", defaultFit: "cover" },
          aiReceptionist: { name: "AI Receptionist Visual", defaultFit: "cover" },
          atlas: { name: "ATLAS Ledger Visual", defaultFit: "cover" },
        }
      }
    }
  },
  services: {
    name: "Services",
    sections: {
      hero: {
        name: "Hero Section",
        slots: {
          heroVisual: { name: "Services Hero Visual", defaultFit: "contain" }
        }
      }
    }
  },
  systems: {
    name: "Systems Control Room",
    sections: {
      controlRoom: {
        name: "Control Room Systems",
        slots: {
          diamondCapture: { name: "Diamond Capture Visual", defaultFit: "cover" },
          instituteOS: { name: "InstituteOS Visual", defaultFit: "cover" },
          aiReceptionist: { name: "AI Receptionist Visual", defaultFit: "cover" },
          atlas: { name: "ATLAS Financial Visual", defaultFit: "cover" }
        }
      }
    }
  }
};

export function getRegisteredPages() {
  return Object.keys(MEDIA_REGISTRY).map(pageId => ({
    id: pageId,
    name: MEDIA_REGISTRY[pageId].name
  }));
}

export function getRegisteredSections(pageId) {
  if (!MEDIA_REGISTRY[pageId]) return [];
  return Object.keys(MEDIA_REGISTRY[pageId].sections).map(sectionId => ({
    id: sectionId,
    name: MEDIA_REGISTRY[pageId].sections[sectionId].name
  }));
}

export function getRegisteredSlots(pageId, sectionId) {
  if (!MEDIA_REGISTRY[pageId] || !MEDIA_REGISTRY[pageId].sections[sectionId]) return [];
  const slotsObj = MEDIA_REGISTRY[pageId].sections[sectionId].slots;
  return Object.keys(slotsObj).map(slotId => ({
    id: slotId,
    name: slotsObj[slotId].name,
    defaultFit: slotsObj[slotId].defaultFit
  }));
}

export function getPlacementLabel(pageId, sectionId, slotId) {
  const pageName = MEDIA_REGISTRY[pageId]?.name || pageId;
  const sectionName = MEDIA_REGISTRY[pageId]?.sections[sectionId]?.name || sectionId;
  const slotName = MEDIA_REGISTRY[pageId]?.sections[sectionId]?.slots[slotId]?.name || slotId;
  return `${pageName} → ${sectionName} → ${slotName}`;
}
