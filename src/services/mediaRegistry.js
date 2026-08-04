/**
 * Centralized Section Media Registry for Project Buddy
 * Defines all pages, media-capable sections, and supported slots including Homepage Hero Background.
 */

export const MEDIA_REGISTRY = {
  home: {
    name: "Home",
    sections: {
      hero: {
        name: "Hero Section",
        slots: {
          backgroundVisual: { name: "Homepage Background", defaultFit: "cover" },
          heroVisual: { name: "Main Hero Visual", defaultFit: "contain" },
          mobileVisual: { name: "Mobile Hero Visual", defaultFit: "contain" },
        }
      },
      workingSystem: {
        name: "Working System Diagram",
        slots: {
          mainVisual: { name: "Main Visual (Working System)", defaultFit: "contain" },
          mobileVisual: { name: "Mobile Visual Override", defaultFit: "contain" },
        }
      },
      capabilities: {
        name: "Capabilities Showcase",
        slots: {
          businessSoftwareVisual: { name: "Business Software Visual", defaultFit: "contain" },
          automationVisual: { name: "AI Automation Visual", defaultFit: "contain" },
          dataSystemsVisual: { name: "Data Systems Visual", defaultFit: "contain" },
          integrationVisual: { name: "API Integration Visual", defaultFit: "contain" },
        }
      },
      selectedSystems: {
        name: "Selected Systems Showcase",
        slots: {
          diamondCaptureVisual: { name: "Diamond Capture System Visual", defaultFit: "contain" },
          instituteOSVisual: { name: "InstituteOS Visual", defaultFit: "contain" },
          aiReceptionistVisual: { name: "AI Receptionist Visual", defaultFit: "contain" },
          atlasVisual: { name: "ATLAS Ledger Visual", defaultFit: "contain" },
        }
      },
      cta: {
        name: "Final CTA Section",
        slots: {
          backgroundVisual: { name: "CTA Ambient Background", defaultFit: "cover" },
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
      },
      businessSoftware: {
        name: "Business Software & Operations",
        slots: {
          mainVisual: { name: "Service Visual", defaultFit: "contain" }
        }
      },
      aiAutomation: {
        name: "AI Automation & Workflows",
        slots: {
          mainVisual: { name: "AI Automation Visual", defaultFit: "contain" }
        }
      },
      dataSystems: {
        name: "Data Systems & Intelligence",
        slots: {
          mainVisual: { name: "Data Systems Visual", defaultFit: "contain" }
        }
      },
      systemIntegration: {
        name: "API Mesh & System Integration",
        slots: {
          mainVisual: { name: "API Mesh Visual", defaultFit: "contain" }
        }
      },
      cloudArchitecture: {
        name: "Cloud Infrastructure & DevOps",
        slots: {
          mainVisual: { name: "Cloud Architecture Visual", defaultFit: "contain" }
        }
      }
    }
  },
  systems: {
    name: "Control Room Systems",
    sections: {
      controlRoom: {
        name: "Control Room Interface",
        slots: {
          diamondCaptureVisual: { name: "Diamond Capture Visual", defaultFit: "contain" },
          instituteOSVisual: { name: "InstituteOS Visual", defaultFit: "contain" },
          aiReceptionistVisual: { name: "AI Receptionist Visual", defaultFit: "contain" },
          atlasVisual: { name: "ATLAS Financial Visual", defaultFit: "contain" }
        }
      }
    }
  },
  howItWorks: {
    name: "How It Works",
    sections: {
      hero: {
        name: "Hero Section",
        slots: {
          heroVisual: { name: "Methodology Hero Visual", defaultFit: "contain" }
        }
      },
      process: {
        name: "7-Stage Workflow Process",
        slots: {
          mainVisual: { name: "Process Flow Visual", defaultFit: "contain" }
        }
      }
    }
  },
  about: {
    name: "About",
    sections: {
      hero: {
        name: "Hero Section",
        slots: {
          heroVisual: { name: "About Hero Visual", defaultFit: "contain" }
        }
      },
      philosophy: {
        name: "Engineering Philosophy",
        slots: {
          supportingVisual: { name: "Philosophy Blueprint Visual", defaultFit: "contain" }
        }
      }
    }
  },
  contact: {
    name: "Contact",
    sections: {
      hero: {
        name: "Hero Section",
        slots: {
          heroVisual: { name: "Discovery Gateway Visual", defaultFit: "contain" }
        }
      }
    }
  },
  privacy: {
    name: "Privacy Policy",
    sections: {
      hero: {
        name: "Hero Section",
        slots: {
          heroVisual: { name: "Data Security Visual", defaultFit: "contain" }
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
