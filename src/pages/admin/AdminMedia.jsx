import React, { useState, useEffect } from 'react';
import AdminLayout from './AdminLayout';
import { getCMSState, saveCMSState, hydrateCMSFromCloud, deleteMediaAsset, getAssetPlacements, removeMediaFromSlot } from '../../services/cmsStore';
import { getSupabaseStatus, CMS_STORE_ID, SUPABASE_HOSTNAME } from '../../services/supabaseClient';
import { MEDIA_REGISTRY, getPlacementLabel } from '../../services/mediaRegistry';
import UploadAndPlaceModal from '../../components/admin/UploadAndPlaceModal';
import CmsMedia from '../../components/CmsMedia';
import { isSameAsset } from '../../utils/cmsMedia';
import { Upload, Check, Trash2, Link2, Map, Layers, Filter, Search, RefreshCw, Terminal, Loader2 } from 'lucide-react';

export default function AdminMedia() {
  const [state, setState] = useState(getCMSState());
  const [status, setStatus] = useState(null);
  const [loadingCloud, setLoadingCloud] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [activeTab, setActiveTab] = useState('catalog'); // 'catalog' | 'map'
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all'); // 'all' | 'image' | 'video'
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [modalInitial, setModalInitial] = useState({ pageId: 'home', sectionId: 'workingSystem', slotId: 'mainVisual', assetToAssign: null });
  const [copiedId, setCopiedId] = useState(null);

  const refreshLibrary = async () => {
    setLoadingCloud(true);
    try {
      const st = await getSupabaseStatus();
      setStatus(st);
      const freshState = await hydrateCMSFromCloud();
      setState(freshState);
    } catch (err) {
      console.warn("Library refresh warning:", err);
    } finally {
      setLoadingCloud(false);
    }
  };

  useEffect(() => {
    refreshLibrary();

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

  const handleDeleteAsset = async (asset) => {
    const isManual = asset.source === 'manual-url' || !asset.storagePath;
    const confirmMsg = isManual
      ? `Remove manual URL reference (${asset.name}) from CMS?`
      : `Delete media asset (${asset.name}) permanently from Supabase Storage?`;

    if (!window.confirm(confirmMsg)) {
      return;
    }

    setDeletingId(asset.id);
    try {
      const res = await deleteMediaAsset(asset);
      setDeletingId(null);
      await refreshLibrary();
      alert(res.message || "Asset deleted.");
    } catch (err) {
      console.error("Delete asset error:", err);
      alert(err.message || "Failed to delete asset.");
      setDeletingId(null);
    }
  };

  const handleOpenPlaceModal = (pageId = 'home', sectionId = 'workingSystem', slotId = 'mainVisual', assetToAssign = null) => {
    setModalInitial({ pageId, sectionId, slotId, assetToAssign });
    setUploadModalOpen(true);
  };

  // Determine currently live Working System asset
  const liveWorkingAsset = state.media?.["home.workingSystem.visual"] || state.media?.["home:workingSystem:mainVisual"];

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
              Discovers files directly from Supabase Storage bucket <code className="font-mono text-[#0052FF]">website-media</code> and supports manual Media URLs.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={refreshLibrary}
              disabled={loadingCloud}
              className="px-4 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-all flex items-center gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${loadingCloud ? 'animate-spin' : ''}`} />
              <span>Refresh Library</span>
            </button>

            <button
              onClick={() => handleOpenPlaceModal('home', 'workingSystem', 'mainVisual')}
              className="px-6 py-3 rounded-xl bg-[#0052FF] hover:bg-[#0042CC] text-white font-semibold text-xs shadow-md transition-all flex items-center gap-2"
            >
              <Upload className="w-4 h-4" />
              <span>Upload & Place Media</span>
            </button>
          </div>
        </div>

        {/* CONNECTION & STORAGE DIAGNOSTIC PANEL (Requirement 15) */}
        <div className="bg-slate-900 text-white rounded-2xl p-5 border border-slate-800 space-y-3 font-mono text-xs shadow-lg">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="font-bold text-[#0052FF] flex items-center gap-2">
              <Terminal className="w-4 h-4" />
              SUPABASE STORAGE CONNECTION DIAGNOSTIC
            </span>
            <span className="text-[10px] text-slate-400">ROW: {CMS_STORE_ID}</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div>
              <div className="text-slate-400 text-[10px]">CONFIGURED PROJECT HOSTNAME:</div>
              <div className="text-white font-bold truncate">{status?.hostname || SUPABASE_HOSTNAME}</div>
            </div>

            <div>
              <div className="text-slate-400 text-[10px]">STORAGE BUCKET:</div>
              <div className="text-white font-bold">website-media</div>
            </div>

            <div>
              <div className="text-slate-400 text-[10px]">BUCKET STATUS:</div>
              <div className={status?.bucketFound ? "text-emerald-400 font-bold" : "text-red-400 font-bold"}>
                {status?.bucketFound ? "CONNECTED ✓" : "BUCKET NOT FOUND"}
              </div>
            </div>

            <div>
              <div className="text-slate-400 text-[10px]">WORKING SYSTEM SLOT:</div>
              <div className="text-blue-400 font-bold truncate">
                {liveWorkingAsset?.url ? (liveWorkingAsset.source === 'manual-url' ? "MANUAL URL SET" : "STORAGE ASSET SET") : "DEFAULT FALLBACK"}
              </div>
            </div>
          </div>
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

                // Strictly calculate CURRENTLY LIVE using isSameAsset helper
                const isLiveInWorkingSystem = isSameAsset(asset, liveWorkingAsset);

                return (
                  <div key={asset.id} className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-3 flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="h-44 rounded-xl overflow-hidden bg-slate-900 border border-slate-100 relative">
                        <CmsMedia asset={asset} className="h-full w-full object-contain" />
                        <span className="absolute top-2 right-2 px-2.5 py-1 rounded-md bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-mono font-bold uppercase">
                          {asset.type}
                        </span>
                      </div>

                      <div>
                        <h4 className="text-xs font-bold text-[#0B132B] truncate">{asset.name}</h4>
                        <div className="text-[11px] font-mono text-slate-400 mt-0.5 flex items-center justify-between">
                          <span>{asset.source === 'manual-url' ? 'MANUAL URL' : 'SUPABASE STORAGE'}</span>
                        </div>
                      </div>

                      {/* Placement & Live Status Badge */}
                      <div className="pt-1 space-y-1.5">
                        {isLiveInWorkingSystem ? (
                          <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-[11px] font-mono text-emerald-700 font-extrabold flex items-center justify-between shadow-xs">
                            <span className="flex items-center gap-1.5 truncate">
                              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                              CURRENTLY LIVE (Working System)
                            </span>
                          </div>
                        ) : isAssigned ? (
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
                            MEDIA ASSET (READY TO PLACE)
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                      <button
                        onClick={() => handleOpenPlaceModal('home', 'workingSystem', 'mainVisual', asset)}
                        className="px-3 py-1.5 rounded-lg bg-[#0B132B] text-white font-semibold text-xs hover:bg-[#0052FF] transition-colors"
                      >
                        {isLiveInWorkingSystem ? 'Re-Publish Placement' : (isAssigned ? 'Change Placement' : 'Assign to Slot')}
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
                          disabled={deletingId === asset.id}
                          onClick={() => handleDeleteAsset(asset)}
                          className="p-1.5 rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-600 transition-colors disabled:opacity-50"
                          title="Delete Asset"
                        >
                          {deletingId === asset.id ? <Loader2 className="w-4 h-4 animate-spin text-red-600" /> : <Trash2 className="w-4 h-4" />}
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
                      <h4 className="text-sm font-bold text-[#0052FF] uppercase font-mono">{pageDef.name}</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {pageDef.sections.map((sec) => (
                          <div key={sec.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                            <div className="text-xs font-bold text-[#0B132B]">{sec.name}</div>
                            <div className="text-[11px] font-mono text-slate-500">
                              Slots: {sec.slots.map(s => s.name).join(', ')}
                            </div>
                            <button
                              onClick={() => handleOpenPlaceModal(pageId, sec.id, sec.slots[0]?.id || '')}
                              className="mt-2 text-xs font-semibold text-[#0052FF] hover:underline"
                            >
                              Assign Media →
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Upload and Place Modal */}
        {uploadModalOpen && (
          <UploadAndPlaceModal
            isOpen={uploadModalOpen}
            onClose={() => {
              setUploadModalOpen(false);
              refreshLibrary();
            }}
            initialPage={modalInitial.pageId}
            initialSection={modalInitial.sectionId}
            initialSlot={modalInitial.slotId}
            assetToAssign={modalInitial.assetToAssign}
            mode={modalInitial.assetToAssign ? 'place' : 'place'}
          />
        )}

      </div>
    </AdminLayout>
  );
}
