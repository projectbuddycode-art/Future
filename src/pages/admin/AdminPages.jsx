import React, { useState } from 'react';
import AdminLayout from './AdminLayout';
import { getCMSState, saveCMSState, getSectionMedia, removeMediaFromSlot } from '../../services/cmsStore';
import { MEDIA_REGISTRY, getRegisteredPages, getRegisteredSections, getRegisteredSlots } from '../../services/mediaRegistry';
import SmartMedia from '../../components/SmartMedia';
import UploadAndPlaceModal from '../../components/admin/UploadAndPlaceModal';
import { Save, Check, ChevronDown, ChevronUp, Image as ImageIcon, Eye, RefreshCw, Trash2, Plus } from 'lucide-react';

export default function AdminPages() {
  const [state, setState] = useState(getCMSState());
  const [activePage, setActivePage] = useState('home');
  const [expandedSection, setExpandedSection] = useState('hero');
  const [savedMsg, setSavedMsg] = useState(false);

  // Modal for inline section media change
  const [mediaModalOpen, setMediaModalOpen] = useState(false);
  const [modalTarget, setModalTarget] = useState({ sectionId: '', slotId: '' });

  const currentPageData = state.pages[activePage] || {};

  const handleFieldChange = (field, val) => {
    const newState = {
      ...state,
      pages: {
        ...state.pages,
        [activePage]: {
          ...currentPageData,
          [field]: val,
        }
      }
    };
    setState(newState);
  };

  const handleSave = () => {
    saveCMSState(state);
    setSavedMsg(true);
    setTimeout(() => setSavedMsg(false), 2500);
  };

  const handleRemoveSectionMedia = (secId, slotId) => {
    const newState = removeMediaFromSlot(activePage, secId, slotId);
    setState(newState);
  };

  const handleOpenSectionMediaModal = (secId, slotId) => {
    setModalTarget({ sectionId: secId, slotId });
    setMediaModalOpen(true);
  };

  const pagesList = getRegisteredPages();
  const currentRegPage = MEDIA_REGISTRY[activePage];

  return (
    <AdminLayout activeTab="pages">
      <div className="space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
          <div>
            <span className="text-xs font-mono font-bold text-[#0052FF] uppercase tracking-wider">
              PAGE STRUCTURED SECTION EDITOR
            </span>
            <h1 className="text-2xl font-extrabold text-[#0B132B]">
              Edit Page Copy & Visual Media
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Inline section controls for headings, copy paragraphs, button labels, and assigned SmartMedia visuals.
            </p>
          </div>

          <button
            onClick={handleSave}
            className="px-6 py-3 rounded-xl bg-[#0052FF] hover:bg-[#0042CC] text-white font-semibold text-xs shadow-md transition-all flex items-center gap-2"
          >
            {savedMsg ? <Check className="w-4 h-4 text-emerald-300" /> : <Save className="w-4 h-4" />}
            <span>{savedMsg ? "Changes Saved!" : "Save Changes"}</span>
          </button>
        </div>

        {/* Page Switcher Tabs */}
        <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-3">
          {pagesList.map((p) => (
            <button
              key={p.id}
              onClick={() => {
                setActivePage(p.id);
                setExpandedSection(Object.keys(MEDIA_REGISTRY[p.id]?.sections || {})[0] || '');
              }}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activePage === p.id
                  ? 'bg-[#0B132B] text-white shadow-sm'
                  : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300'
              }`}
            >
              {p.name}
            </button>
          ))}
        </div>

        {/* Section Editor List */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <h2 className="text-lg font-extrabold text-[#0B132B] uppercase font-mono">
              {activePage.toUpperCase()} SECTION EDITORS
            </h2>
            <span className="text-xs font-mono text-slate-400">
              No Raw HTML Exposed • Component Safe
            </span>
          </div>

          {currentRegPage && Object.keys(currentRegPage.sections).map((secId) => {
            const section = currentRegPage.sections[secId];
            const isExpanded = expandedSection === secId;

            return (
              <div key={secId} className="border border-slate-200 rounded-xl overflow-hidden">
                
                {/* Accordion Trigger */}
                <button
                  onClick={() => setExpandedSection(isExpanded ? '' : secId)}
                  className="w-full px-5 py-4 bg-slate-50 hover:bg-slate-100/80 flex items-center justify-between font-bold text-xs text-[#0B132B] transition-colors"
                >
                  <span className="uppercase">{section.name}</span>
                  {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>

                {/* Accordion Body */}
                {isExpanded && (
                  <div className="p-6 space-y-6 bg-white">
                    
                    {/* Text Fields */}
                    {secId === 'hero' && (
                      <div className="space-y-4">
                        <div>
                          <label className="block text-xs font-mono font-semibold text-slate-700 mb-1">
                            TECHNICAL EYEBROW BADGE
                          </label>
                          <input
                            type="text"
                            value={currentPageData.heroEyebrow || ''}
                            onChange={(e) => handleFieldChange('heroEyebrow', e.target.value)}
                            className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-xs text-[#0B132B] outline-none focus:border-[#0052FF]"
                          />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-mono font-semibold text-slate-700 mb-1">
                              HEADLINE (LINE 1 - BLURTEXT)
                            </label>
                            <input
                              type="text"
                              value={currentPageData.heroHeadlinePart1 || ''}
                              onChange={(e) => handleFieldChange('heroHeadlinePart1', e.target.value)}
                              className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-xs text-[#0B132B] outline-none focus:border-[#0052FF]"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-mono font-semibold text-slate-700 mb-1">
                              HEADLINE (LINE 2 - GRADIENTTEXT)
                            </label>
                            <input
                              type="text"
                              value={currentPageData.heroHeadlinePart2 || ''}
                              onChange={(e) => handleFieldChange('heroHeadlinePart2', e.target.value)}
                              className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-xs text-[#0B132B] outline-none focus:border-[#0052FF]"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-mono font-semibold text-slate-700 mb-1">
                            HERO SUPPORTING DESCRIPTION
                          </label>
                          <textarea
                            rows={3}
                            value={currentPageData.heroDescription || ''}
                            onChange={(e) => handleFieldChange('heroDescription', e.target.value)}
                            className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-xs text-[#0B132B] outline-none focus:border-[#0052FF]"
                          />
                        </div>
                      </div>
                    )}

                    {secId === 'workingSystem' && (
                      <div className="space-y-4">
                        <div>
                          <label className="block text-xs font-mono font-semibold text-slate-700 mb-1">
                            SECTION TITLE
                          </label>
                          <input
                            type="text"
                            value={currentPageData.workingSystemTitle || ''}
                            onChange={(e) => handleFieldChange('workingSystemTitle', e.target.value)}
                            className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-xs text-[#0B132B] outline-none focus:border-[#0052FF]"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-mono font-semibold text-slate-700 mb-1">
                            SECTION DESCRIPTION
                          </label>
                          <textarea
                            rows={3}
                            value={currentPageData.workingSystemDesc || ''}
                            onChange={(e) => handleFieldChange('workingSystemDesc', e.target.value)}
                            className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-xs text-[#0B132B] outline-none focus:border-[#0052FF]"
                          />
                        </div>
                      </div>
                    )}

                    {/* Section Media Slots Controls */}
                    <div className="pt-4 border-t border-slate-100 space-y-4">
                      <h4 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
                        SECTION VISUAL MEDIA SLOTS
                      </h4>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {Object.keys(section.slots).map(slotId => {
                          const slot = section.slots[slotId];
                          const assignedAsset = getSectionMedia(activePage, secId, slotId);

                          return (
                            <div key={slotId} className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-3">
                              <div className="flex items-center justify-between text-xs font-bold text-[#0B132B]">
                                <span>{slot.name}</span>
                                <span className="text-[10px] font-mono text-slate-400">FIT: {slot.defaultFit.toUpperCase()}</span>
                              </div>

                              {assignedAsset ? (
                                <div className="space-y-2">
                                  <SmartMedia src={assignedAsset.url} type={assignedAsset.type} fit={assignedAsset.fit} className="h-32" />
                                  <div className="text-[11px] font-mono text-slate-500 truncate">{assignedAsset.name}</div>
                                </div>
                              ) : (
                                <div className="h-32 rounded-xl bg-slate-200/50 border border-dashed border-slate-300 flex items-center justify-center text-xs font-mono text-slate-400">
                                  NO VISUAL ASSIGNED
                                </div>
                              )}

                              <div className="flex items-center justify-between gap-2 pt-1">
                                <button
                                  onClick={() => handleOpenSectionMediaModal(secId, slotId)}
                                  className="px-3 py-1.5 rounded-lg bg-[#0052FF] text-white text-xs font-semibold hover:bg-[#0042CC] transition-colors"
                                >
                                  {assignedAsset ? "Replace Visual" : "Choose / Upload Visual"}
                                </button>

                                {assignedAsset && (
                                  <button
                                    onClick={() => handleRemoveSectionMedia(secId, slotId)}
                                    className="p-1.5 rounded-lg bg-slate-200 text-slate-600 hover:text-red-500 hover:bg-red-50 transition-colors"
                                    title="Remove assignment"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                  </div>
                )}
              </div>
            );
          })}

          <div className="pt-4 flex justify-end">
            <button
              onClick={handleSave}
              className="px-6 py-3 rounded-xl bg-[#0052FF] text-white font-semibold text-xs hover:bg-[#0042CC] shadow-md transition-all flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>Save Page Changes</span>
            </button>
          </div>

        </div>

        {/* Upload & Place Modal for Section Controls */}
        <UploadAndPlaceModal
          isOpen={mediaModalOpen}
          onClose={() => {
            setMediaModalOpen(false);
            setState(getCMSState());
          }}
          initialPage={activePage}
          initialSection={modalTarget.sectionId}
          initialSlot={modalTarget.slotId}
          mode="place"
        />

      </div>
    </AdminLayout>
  );
}
