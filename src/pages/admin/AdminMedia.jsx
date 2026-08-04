import React, { useState } from 'react';
import AdminLayout from './AdminLayout';
import { getCMSState, saveCMSState, getAssetPlacements, removeMediaFromSlot } from '../../services/cmsStore';
import { MEDIA_REGISTRY, getRegisteredPages, getPlacementLabel } from '../../services/mediaRegistry';
import SmartMedia from '../../components/SmartMedia';
import UploadAndPlaceModal from '../../components/admin/UploadAndPlaceModal';
import { Upload, Trash2, Eye, RefreshCw, Check, AlertCircle, Monitor, Tablet, Smartphone, Filter, Search, Map, Layers, Plus } from 'lucide-react';

export default function AdminMedia() {
  const [state, setState] = useState(getCMSState());
  const [activeTab, setActiveTab] = useState('catalog'); // 'catalog' | 'map'
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [uploadModalMode, setUploadModalMode] = useState('place'); // 'place' | 'library'
  const [assignAsset, setAssignAsset] = useState(null);
  
  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all'); // 'all' | 'image' | 'video' | 'assigned' | 'unassigned'
  const [pageFilter, setPageFilter] = useState('all');

  const [previewMedia, setPreviewMedia] = useState(null);
  const [previewViewport, setPreviewViewport] = useState('1440');
  const [deleteError, setDeleteError] = useState('');
  const [msg, setMsg] = useState('');

  const handleSaveState = (newState) => {
    saveCMSState(newState);
    setState(newState);
  };

  const handleOpenUpload = (mode = 'place') => {
    setUploadModalMode(mode);
    setAssignAsset(null);
    setUploadModalOpen(true);
  };

  const handleOpenAssign = (asset) => {
    setAssignAsset(asset);
    setUploadModalMode('place');
    setUploadModalOpen(true);
  };

  const handleDelete = (asset) => {
    setDeleteError('');
    const placements = getAssetPlacements(asset.id);

    if (placements.length > 0) {
      const placementText = placements.map(p => getPlacementLabel(p.pageId, p.sectionId, p.slotId)).join(', ');
      setDeleteError(`THIS MEDIA IS CURRENTLY USED in: ${placementText}. Deleting it will remove content from the website.`);
      return;
    }

    const newState = {
      ...state,
      mediaAssets: state.mediaAssets.filter(m => m.id !== asset.id)
    };
    handleSaveState(newState);
    setMsg(`Deleted ${asset.name}`);
    setTimeout(() => setMsg(''), 2500);
  };

  const handleUnassign = (pageId, sectionId, slotId) => {
    const newState = removeMediaFromSlot(pageId, sectionId, slotId);
    setState(newState);
    setMsg(`Placement removed from ${getPlacementLabel(pageId, sectionId, slotId)}`);
    setTimeout(() => setMsg(''), 2500);
  };

  // Filtered Assets
  const filteredAssets = state.mediaAssets.filter(asset => {
    const placements = getAssetPlacements(asset.id);
    const isAssigned = placements.length > 0;

    if (searchQuery && !asset.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }

    if (typeFilter === 'image' && asset.type !== 'image') return false;
    if (typeFilter === 'video' && asset.type !== 'video') return false;
    if (typeFilter === 'assigned' && !isAssigned) return false;
    if (typeFilter === 'unassigned' && isAssigned) return false;

    if (pageFilter !== 'all') {
      const isUsedOnPage = placements.some(p => p.pageId === pageFilter);
      if (!isUsedOnPage) return false;
    }

    return true;
  });

  return (
    <AdminLayout activeTab="media">
      <div className="space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
          <div>
            <span className="text-xs font-mono font-bold text-[#0052FF] uppercase tracking-wider">
              SMART MEDIA SYSTEM & PLACEMENT ENGINE
            </span>
            <h1 className="text-2xl font-extrabold text-[#0B132B]">
              Media Library & Website Placement Map
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Upload Google Flow videos and UI images. Assign to specific page sections or map visuals visually.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => handleOpenUpload('library')}
              className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 font-semibold text-xs hover:bg-slate-50 shadow-xs transition-all flex items-center gap-2"
            >
              <Upload className="w-4 h-4 text-slate-500" />
              <span>Upload to Library</span>
            </button>

            <button
              onClick={() => handleOpenUpload('place')}
              className="px-5 py-2.5 rounded-xl bg-[#0052FF] hover:bg-[#0042CC] text-white font-semibold text-xs shadow-md transition-all flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Upload & Place Visual</span>
            </button>
          </div>
        </div>

        {/* Message / Error Alerts */}
        {msg && (
          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-center gap-2">
            <Check className="w-4 h-4" />
            <span>{msg}</span>
          </div>
        )}
        {deleteError && (
          <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{deleteError}</span>
          </div>
        )}

        {/* View Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
          <button
            onClick={() => setActiveTab('catalog')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'catalog' ? 'bg-[#0B132B] text-white shadow-sm' : 'bg-white text-slate-600 border border-slate-200'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Media Catalog ({state.mediaAssets.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('map')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'map' ? 'bg-[#0B132B] text-white shadow-sm' : 'bg-white text-slate-600 border border-slate-200'
            }`}
          >
            <Map className="w-4 h-4 text-[#0052FF]" />
            <span>Website Visual Section Map</span>
          </button>
        </div>

        {/* TAB 1: MEDIA CATALOG */}
        {activeTab === 'catalog' && (
          <div className="space-y-6">
            
            {/* Filter & Search Bar */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search filename..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs outline-none focus:border-[#0052FF]"
                />
              </div>

              <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="px-3 py-2 rounded-xl border border-slate-200 text-xs outline-none focus:border-[#0052FF]"
                >
                  <option value="all">All Media Types</option>
                  <option value="image">Images Only</option>
                  <option value="video">Videos Only</option>
                  <option value="assigned">Assigned Only</option>
                  <option value="unassigned">Unassigned Only</option>
                </select>

                <select
                  value={pageFilter}
                  onChange={(e) => setPageFilter(e.target.value)}
                  className="px-3 py-2 rounded-xl border border-slate-200 text-xs outline-none focus:border-[#0052FF]"
                >
                  <option value="all">All Pages</option>
                  {getRegisteredPages().map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Media Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAssets.map((asset) => {
                const placements = getAssetPlacements(asset.id);
                const isAssigned = placements.length > 0;

                return (
                  <div key={asset.id} className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-3 flex flex-col justify-between">
                    
                    {/* Media Thumbnail */}
                    <div className="relative">
                      <SmartMedia
                        src={asset.url}
                        type={asset.type}
                        aspectRatio={asset.aspectRatio}
                        fit={asset.fit}
                        poster={asset.posterUrl}
                        className="h-44"
                      />
                      <div className="absolute top-2 right-2 px-2 py-1 rounded-md bg-[#0B132B]/80 text-white text-[10px] font-mono font-bold backdrop-blur-md">
                        {asset.type.toUpperCase()}
                      </div>
                    </div>

                    {/* Metadata & Status */}
                    <div className="space-y-2 text-xs">
                      <div className="font-bold text-[#0B132B] truncate" title={asset.name}>
                        {asset.name}
                      </div>

                      {/* Placement Status Indicator */}
                      {isAssigned ? (
                        <div className="space-y-1">
                          {placements.map((plc, idx) => (
                            <div key={idx} className="p-2 rounded-lg bg-blue-50 border border-blue-100 text-[11px] text-[#0052FF] font-medium flex items-center justify-between">
                              <span className="truncate max-w-[200px]" title={getPlacementLabel(plc.pageId, plc.sectionId, plc.slotId)}>
                                {getPlacementLabel(plc.pageId, plc.sectionId, plc.slotId)}
                              </span>
                              <button
                                onClick={() => handleUnassign(plc.pageId, plc.sectionId, plc.slotId)}
                                className="text-[10px] text-slate-400 hover:text-red-500 underline shrink-0 ml-1"
                              >
                                Remove
                              </button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-500 text-[10px] font-mono font-bold inline-block">
                          UNASSIGNED
                        </div>
                      )}
                    </div>

                    {/* Action Bar */}
                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                      <button
                        onClick={() => handleOpenAssign(asset)}
                        className="px-3 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-semibold hover:bg-[#0052FF] transition-colors"
                      >
                        {isAssigned ? "Change Placement" : "Assign"}
                      </button>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => setPreviewMedia(asset)}
                          className="p-1.5 rounded-lg bg-slate-100 text-slate-700 hover:text-[#0052FF] hover:bg-[#0052FF]/10 transition-colors"
                          title="Responsive Preview"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(asset)}
                          className="p-1.5 rounded-lg bg-slate-100 text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                          title="Delete media"
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
          <div className="space-y-8">
            {getRegisteredPages().map(page => {
              const regPage = MEDIA_REGISTRY[page.id];
              return (
                <div key={page.id} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
                  <h3 className="text-base font-extrabold text-[#0B132B] font-mono uppercase border-b border-slate-100 pb-3 flex items-center gap-2">
                    <Layers className="w-4 h-4 text-[#0052FF]" />
                    {page.name} Page Visual Sections
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Object.keys(regPage.sections).map(secId => {
                      const sec = regPage.sections[secId];
                      return Object.keys(sec.slots).map(slotId => {
                        const slot = sec.slots[slotId];
                        const key = `${page.id}:${secId}:${slotId}`;
                        const assignment = state.sectionMedia?.[key];
                        const assignedAsset = assignment ? state.mediaAssets.find(m => m.id === assignment.desktopMediaId) : null;

                        return (
                          <div key={slotId} className="p-4 rounded-xl border border-slate-200/80 bg-slate-50 space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-[#0B132B]">{sec.name}</span>
                              <span className="text-[10px] font-mono text-slate-400 uppercase">{slot.name}</span>
                            </div>

                            {assignedAsset ? (
                              <SmartMedia src={assignedAsset.url} type={assignedAsset.type} fit={assignment.fit} className="h-32" />
                            ) : (
                              <div className="h-32 rounded-xl bg-slate-200/60 flex items-center justify-center text-xs font-mono text-slate-400">
                                NO VISUAL ASSIGNED
                              </div>
                            )}

                            <button
                              onClick={() => {
                                setAssignAsset(assignedAsset);
                                setUploadModalMode('place');
                                setUploadModalOpen(true);
                              }}
                              className="w-full py-2 rounded-lg bg-white border border-slate-200 text-xs font-semibold text-[#0B132B] hover:border-[#0052FF] hover:text-[#0052FF] transition-colors"
                            >
                              {assignedAsset ? "Click to Replace / Change" : "Assign Visual"}
                            </button>
                          </div>
                        );
                      });
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Upload & Place Modal */}
        <UploadAndPlaceModal
          isOpen={uploadModalOpen}
          onClose={() => {
            setUploadModalOpen(false);
            setState(getCMSState());
          }}
          mode={uploadModalMode}
          assetToAssign={assignAsset}
        />

        {/* Responsive Preview Modal */}
        {previewMedia && (
          <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-6 max-w-4xl w-full shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <span className="font-bold text-base text-[#0B132B]">Responsive Preview: {previewMedia.name}</span>
                <button onClick={() => setPreviewMedia(null)} className="px-4 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs">
                  Close Preview
                </button>
              </div>

              <div className="bg-slate-900 p-6 rounded-2xl flex items-center justify-center min-h-[350px]">
                <div style={{ width: `${previewViewport}px`, maxWidth: '100%' }} className="mx-auto">
                  <SmartMedia src={previewMedia.url} type={previewMedia.type} fit={previewMedia.fit} />
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </AdminLayout>
  );
}
