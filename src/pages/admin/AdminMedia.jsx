import React, { useState, useEffect } from 'react';
import AdminLayout from './AdminLayout';
import { getCMSState, saveCMSState, getAssetPlacements, removeMediaFromSlot, setHomepageBackground } from '../../services/cmsStore';
import { MEDIA_REGISTRY, getPlacementLabel } from '../../services/mediaRegistry';
import UploadAndPlaceModal from '../../components/admin/UploadAndPlaceModal';
import SmartMedia from '../../components/SmartMedia';
import { Upload, ImageIcon, FileVideo, Check, Trash2, Edit3, Link2, Eye, Map, Layers, Plus, Filter, Search, AlertCircle, Sparkles } from 'lucide-react';

export default function AdminMedia() {
  const [state, setState] = useState(getCMSState());
  const [activeTab, setActiveTab] = useState('catalog'); // 'catalog' | 'map'
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all'); // 'all' | 'image' | 'video'
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [modalInitial, setModalInitial] = useState({ pageId: 'home', sectionId: 'hero', slotId: 'backgroundVisual', assetToAssign: null });
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [copiedId, setCopiedId] = useState(null);

  useEffect(() => {
    const handleUpdate = () => setState(getCMSState());
    window.addEventListener('cms-state-updated', handleUpdate);
    return () => window.removeEventListener('cms-state-updated', handleUpdate);
  }, []);

  const mediaAssets = state.mediaAssets || [];

  const filteredAssets = mediaAssets.filter(asset => {
    const matchesSearch = asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (asset.alt && asset.alt.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesType = filterType === 'all' || asset.type === filterType;
    return matchesSearch && matchesType;
  });

  const handleCopyUrl = (url, id) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDeleteAsset = async (assetId) => {
    const placements = getAssetPlacements(assetId);
    if (placements.length > 0) {
      alert(`Cannot delete asset because it is currently assigned to ${placements.length} placement slot(s). Please unassign it first.`);
      return;
    }

    const updatedAssets = mediaAssets.filter(m => m.id !== assetId);
    const newState = {
      ...state,
      mediaAssets: updatedAssets
    };
    try {
      await saveCMSState(newState);
      setDeleteConfirmId(null);
    } catch (err) {
      console.error("Delete asset error:", err);
      alert(err.message || "Failed to delete asset from database.");
    }
  };

  const handleOpenPlaceModal = (pageId = 'home', sectionId = 'hero', slotId = 'backgroundVisual', assetToAssign = null) => {
    setModalInitial({ pageId, sectionId, slotId, assetToAssign });
    setUploadModalOpen(true);
  };

  return (
    <AdminLayout activeTab="media">
      <div className="space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
          <div>
            <span className="text-xs font-mono font-bold text-[#0052FF] uppercase tracking-wider">
              SMARTMEDIA ASSET ENGINE & WEBSITE VISUAL MAP
            </span>
            <h1 className="text-2xl font-extrabold text-[#0B132B]">
              Media Library & Slot Placements
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Upload Google Flow videos and UI images. Assign directly to page sections and the Homepage Hero Background.
            </p>
          </div>

          <button
            onClick={() => handleOpenPlaceModal('home', 'hero', 'backgroundVisual')}
            className="px-6 py-3 rounded-xl bg-[#0052FF] hover:bg-[#0042CC] text-white font-semibold text-xs shadow-md transition-all flex items-center gap-2"
          >
            <Upload className="w-4 h-4" />
            <span>Upload & Place Media</span>
          </button>
        </div>

        {/* View Toggle Tabs */}
        <div className="flex items-center gap-3 border-b border-slate-200 pb-3">
          <button
            onClick={() => setActiveTab('catalog')}
            className={`px-5 py-2.5 rounded-xl font-semibold text-xs transition-all flex items-center gap-2 ${
              activeTab === 'catalog'
                ? 'bg-[#0B132B] text-white shadow-sm'
                : 'bg-white text-slate-600 border border-slate-200 hover:border-[#0052FF]'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Media Catalog ({mediaAssets.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('map')}
            className={`px-5 py-2.5 rounded-xl font-semibold text-xs transition-all flex items-center gap-2 ${
              activeTab === 'map'
                ? 'bg-[#0B132B] text-white shadow-sm'
                : 'bg-white text-slate-600 border border-slate-200 hover:border-[#0052FF]'
            }`}
          >
            <Map className="w-4 h-4" />
            <span>Website Visual Section Map</span>
          </button>
        </div>

        {/* TAB 1: MEDIA CATALOG */}
        {activeTab === 'catalog' && (
          <div className="space-y-6">
            
            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search filename or alt text..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-xs outline-none focus:border-[#0052FF]"
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Filter className="w-4 h-4 text-slate-400" />
                <button
                  onClick={() => setFilterType('all')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold ${filterType === 'all' ? 'bg-[#0052FF] text-white' : 'bg-slate-100 text-slate-600'}`}
                >
                  ALL
                </button>
                <button
                  onClick={() => setFilterType('image')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold ${filterType === 'image' ? 'bg-[#0052FF] text-white' : 'bg-slate-100 text-slate-600'}`}
                >
                  IMAGES
                </button>
                <button
                  onClick={() => setFilterType('video')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold ${filterType === 'video' ? 'bg-[#0052FF] text-white' : 'bg-slate-100 text-slate-600'}`}
                >
                  VIDEOS
                </button>
              </div>
            </div>

            {/* Asset Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {filteredAssets.map((asset) => {
                const placements = getAssetPlacements(asset.id);
                const isAssigned = placements.length > 0;

                return (
                  <div key={asset.id} className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-3 flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="h-44 rounded-xl overflow-hidden bg-slate-900 border border-slate-100 relative">
                        <SmartMedia media={asset} className="h-full w-full" />
                        <span className="absolute top-2 right-2 px-2.5 py-1 rounded-md bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-mono font-bold uppercase">
                          {asset.type}
                        </span>
                      </div>

                      <div>
                        <h4 className="text-xs font-bold text-[#0B132B] truncate">{asset.name}</h4>
                        <div className="text-[11px] font-mono text-slate-400 mt-0.5 flex items-center justify-between">
                          <span>{asset.aspectRatio || '16/9'} • {asset.fileSize || 'Asset'}</span>
                        </div>
                      </div>

                      {/* Placement Status Badge */}
                      <div className="pt-1">
                        {isAssigned ? (
                          <div className="p-2 rounded-xl bg-blue-50 border border-blue-100 text-[11px] font-mono text-[#0052FF] flex items-center justify-between">
                            <span className="truncate">
                              {getPlacementLabel(placements[0].pageId, placements[0].sectionId, placements[0].slotId)}
                            </span>
                            <button
                              onClick={() => removeMediaFromSlot(placements[0].pageId, placements[0].sectionId, placements[0].slotId)}
                              className="text-xs font-bold text-slate-400 hover:text-red-500 ml-2"
                            >
                              Remove
                            </button>
                          </div>
                        ) : (
                          <div className="p-2 rounded-xl bg-slate-100 text-[11px] font-mono text-slate-500 text-center font-bold">
                            UNASSIGNED (LIBRARY ONLY)
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                      <button
                        onClick={() => handleOpenPlaceModal('home', 'hero', 'backgroundVisual', asset)}
                        className="px-3 py-1.5 rounded-lg bg-[#0B132B] text-white font-semibold text-xs hover:bg-[#0052FF] transition-colors"
                      >
                        {isAssigned ? 'Change Placement' : 'Assign'}
                      </button>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleCopyUrl(asset.url, asset.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 transition-colors"
                          title="Copy Direct URL"
                        >
                          {copiedId === asset.id ? <Check className="w-4 h-4 text-emerald-600" /> : <Link2 className="w-4 h-4" />}
                        </button>
                        <button
                          onClick={() => handleDeleteAsset(asset.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                          title="Delete Asset"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>
        )}

        {/* TAB 2: WEBSITE VISUAL SECTION MAP */}
        {activeTab === 'map' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 border border-slate-200 space-y-6">
              <h3 className="text-base font-extrabold text-[#0B132B] uppercase font-mono">
                ALL MEDIA-ENABLED WEBSITE LOCATIONS
              </h3>

              <div className="space-y-8">
                {Object.keys(MEDIA_REGISTRY).map((pageId) => {
                  const pageDef = MEDIA_REGISTRY[pageId];
                  return (
                    <div key={pageId} className="space-y-4 border-b border-slate-100 pb-6 last:border-0">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#0052FF]" />
                        <h4 className="text-sm font-extrabold text-[#0B132B] uppercase font-mono">
                          {pageDef.name.toUpperCase()} PAGE
                        </h4>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {Object.keys(pageDef.sections).map((sectionId) => {
                          const sectionDef = pageDef.sections[sectionId];
                          return (
                            <div key={sectionId} className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                              <div className="text-xs font-mono font-bold text-slate-700">
                                {sectionDef.name}
                              </div>

                              <div className="space-y-2">
                                {Object.keys(sectionDef.slots).map((slotId) => {
                                  const slotDef = sectionDef.slots[slotId];
                                  const key = `${pageId}:${sectionId}:${slotId}`;
                                  const assignment = state.sectionMedia?.[key];
                                  const assignedAsset = assignment?.desktopMediaId ? state.mediaAssets.find(m => m.id === assignment.desktopMediaId) : null;

                                  return (
                                    <div key={slotId} className="p-3 bg-white rounded-lg border border-slate-200 text-xs space-y-2">
                                      <div className="flex items-center justify-between">
                                        <span className="font-semibold text-[#0B132B] truncate">{slotDef.name}</span>
                                        {assignedAsset ? (
                                          <span className="text-[10px] font-mono text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                                            CUSTOM
                                          </span>
                                        ) : (
                                          <span className="text-[10px] font-mono text-slate-500 font-bold bg-slate-100 px-2 py-0.5 rounded">
                                            DEFAULT
                                          </span>
                                        )}
                                      </div>

                                      {assignedAsset ? (
                                        <div className="flex items-center gap-3 pt-1">
                                          <div className="w-12 h-8 rounded bg-slate-900 overflow-hidden shrink-0">
                                            <SmartMedia media={assignedAsset} className="w-full h-full" />
                                          </div>
                                          <div className="truncate text-[11px]">
                                            <div className="font-bold text-[#0B132B] truncate">{assignedAsset.name}</div>
                                            <button
                                              onClick={() => handleOpenPlaceModal(pageId, sectionId, slotId, assignedAsset)}
                                              className="text-[#0052FF] hover:underline text-[10px] font-semibold"
                                            >
                                              Replace Media
                                            </button>
                                          </div>
                                        </div>
                                      ) : (
                                        <button
                                          onClick={() => handleOpenPlaceModal(pageId, sectionId, slotId)}
                                          className="w-full py-1.5 rounded bg-blue-50 text-[#0052FF] text-[11px] font-semibold hover:bg-blue-100 transition-colors"
                                        >
                                          + Assign Custom Media
                                        </button>
                                      )}
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

      </div>

      <UploadAndPlaceModal
        isOpen={uploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
        initialPage={modalInitial.pageId}
        initialSection={modalInitial.sectionId}
        initialSlot={modalInitial.slotId}
        assetToAssign={modalInitial.assetToAssign}
      />
    </AdminLayout>
  );
}
