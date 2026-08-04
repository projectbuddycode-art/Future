import React, { useState, useEffect, useRef } from 'react';
import AdminLayout from './AdminLayout';
import { getCMSState, saveCMSState, setHomepageBackground, getHomepageBackground } from '../../services/cmsStore';
import { uploadDirectFileToSupabase } from '../../services/supabaseClient';
import UploadAndPlaceModal from '../../components/admin/UploadAndPlaceModal';
import SmartMedia from '../../components/SmartMedia';
import GradientText from '../../components/GradientText';
import DecryptedText from '../../components/DecryptedText';
import BlurText from '../../components/BlurText';
import { Save, Check, FileText, Image as ImageIcon, Sparkles, RefreshCw, Upload, Eye, Sliders, Trash2, Monitor, Tablet, Smartphone, Video, RotateCcw } from 'lucide-react';

export default function AdminPages() {
  const [state, setState] = useState(getCMSState());
  const [activePage, setActivePage] = useState('home');
  const [savedMsg, setSavedMsg] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTarget, setModalTarget] = useState({ pageId: 'home', sectionId: 'hero', slotId: 'backgroundVisual' });

  // Homepage Background Specific State
  const [bgConfig, setBgConfig] = useState(getHomepageBackground(false));
  const [bgMode, setBgMode] = useState(bgConfig.mode || 'default');
  const [focalX, setFocalX] = useState(bgConfig.focalX ?? 50);
  const [focalY, setFocalY] = useState(bgConfig.focalY ?? 50);
  const [bgOverlay, setBgOverlay] = useState(bgConfig.overlay || 'none');
  const [uploadingBg, setUploadingBg] = useState(false);
  const [previewViewport, setPreviewViewport] = useState('1440');
  const bgFileInputRef = useRef(null);

  useEffect(() => {
    const handleUpdate = () => {
      const currentState = getCMSState();
      setState(currentState);
      const conf = getHomepageBackground(false);
      setBgConfig(conf);
      setBgMode(conf.mode || 'default');
      setFocalX(conf.focalX ?? 50);
      setFocalY(conf.focalY ?? 50);
      setBgOverlay(conf.overlay || 'none');
    };
    window.addEventListener('cms-state-updated', handleUpdate);
    return () => window.removeEventListener('cms-state-updated', handleUpdate);
  }, []);

  const page = state.pages[activePage] || {};

  const handleFieldChange = (field, value) => {
    const newState = {
      ...state,
      pages: {
        ...state.pages,
        [activePage]: {
          ...page,
          [field]: value
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

  const handleSetDefaultBg = () => {
    setHomepageBackground('default', '', '', 'cover', 50, 50, 'none', 100);
    setBgMode('default');
    setSavedMsg(true);
    setTimeout(() => setSavedMsg(false), 2500);
  };

  const handleDirectBgFileUpload = async (file) => {
    if (!file) return;
    setUploadingBg(true);

    try {
      const asset = await uploadDirectFileToSupabase(file, 'home/background');
      
      // Save to CMS state assets
      const currentState = getCMSState();
      const updatedState = {
        ...currentState,
        mediaAssets: [asset, ...currentState.mediaAssets]
      };
      saveCMSState(updatedState);

      // Activate as Homepage Background
      setHomepageBackground('custom', asset.id, '', 'cover', focalX, focalY, bgOverlay, 100);
      setUploadingBg(false);
      setBgMode('custom');
      setSavedMsg(true);
      setTimeout(() => setSavedMsg(false), 2500);
    } catch (err) {
      console.error("Direct Background Upload Error:", err);
      setUploadingBg(false);
    }
  };

  const handleFocalChange = (newX, newY) => {
    setFocalX(newX);
    setFocalY(newY);
    if (bgConfig.mode === 'custom' && bgConfig.asset) {
      setHomepageBackground('custom', bgConfig.asset.id, '', 'cover', newX, newY, bgOverlay, 100);
    }
  };

  const handleActivateHistoryBg = (hist) => {
    if (hist.mode === 'default') {
      handleSetDefaultBg();
    } else if (hist.mediaId) {
      setHomepageBackground('custom', hist.mediaId, '', 'cover', focalX, focalY, bgOverlay, 100);
      setSavedMsg(true);
      setTimeout(() => setSavedMsg(false), 2500);
    }
  };

  return (
    <AdminLayout activeTab="pages">
      <div className="space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
          <div>
            <span className="text-xs font-mono font-bold text-[#0052FF] uppercase tracking-wider">
              SECTION STRUCTURED EDITOR & HOMEPAGE BACKGROUND CONTROL
            </span>
            <h1 className="text-2xl font-extrabold text-[#0B132B]">
              Website Pages & Visual Assets
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Manage copy, section visuals, and the environmental Homepage Hero Background.
            </p>
          </div>

          <button
            onClick={handleSave}
            className="px-6 py-3 rounded-xl bg-[#0052FF] hover:bg-[#0042CC] text-white font-semibold text-xs shadow-md transition-all flex items-center gap-2"
          >
            {savedMsg ? <Check className="w-4 h-4 text-emerald-300" /> : <Save className="w-4 h-4" />}
            <span>{savedMsg ? "Saved All Changes!" : "Publish Changes"}</span>
          </button>
        </div>

        {/* Page Selector Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-200 overflow-x-auto pb-2">
          {Object.keys(state.pages).map(pId => (
            <button
              key={pId}
              onClick={() => setActivePage(pId)}
              className={`px-4 py-2.5 rounded-xl text-xs font-semibold transition-all shrink-0 ${
                activePage === pId
                  ? 'bg-[#0052FF] text-white shadow-sm'
                  : 'bg-white text-slate-600 border border-slate-200 hover:border-[#0052FF] hover:text-[#0052FF]'
              }`}
            >
              {pId.toUpperCase()} PAGE
            </button>
          ))}
        </div>

        {/* HOMEPAGE SPECIFIC BACKGROUND CONTROL PANEL */}
        {activePage === 'home' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md space-y-6">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="text-xs font-mono font-bold text-[#0052FF] uppercase">
                  HOME → HERO → HOMEPAGE BACKGROUND
                </span>
                <h2 className="text-xl font-extrabold text-[#0B132B]">
                  Homepage Environmental Background Control
                </h2>
              </div>

              <div className="flex items-center gap-2">
                <span className={`px-3 py-1 rounded-full text-xs font-mono font-bold ${bgMode === 'default' ? 'bg-blue-100 text-blue-800 border border-blue-200' : 'bg-purple-100 text-purple-800 border border-purple-200'}`}>
                  STATUS: {bgMode === 'default' ? 'DEFAULT ORIGINAL ANIMATION' : 'CUSTOM BACKGROUND'}
                </span>
              </div>
            </div>

            {/* Current Active Background Box & Controls */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Left Column: Background Controls */}
              <div className="space-y-4">
                <div className="font-mono text-xs font-bold text-slate-700 uppercase">
                  BACKGROUND SOURCE SELECTOR
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    onClick={handleSetDefaultBg}
                    className={`p-4 rounded-2xl border text-left transition-all ${
                      bgMode === 'default'
                        ? 'border-[#0052FF] bg-blue-50/80 ring-2 ring-[#0052FF]/20'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-2 text-xs font-bold text-[#0B132B]">
                      <Sparkles className="w-4 h-4 text-[#0052FF]" />
                      Use Default WebGL Background
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1">
                      Original WebGL SplashCursor + ambient grid & glow (Permanent Fallback).
                    </p>
                  </button>

                  <button
                    onClick={() => bgFileInputRef.current && bgFileInputRef.current.click()}
                    disabled={uploadingBg}
                    className="p-4 rounded-2xl border border-slate-200 hover:border-[#0052FF] bg-white text-left transition-all group"
                  >
                    <div className="flex items-center gap-2 text-xs font-bold text-[#0B132B] group-hover:text-[#0052FF]">
                      <Upload className="w-4 h-4 text-[#0052FF]" />
                      Upload Video or Image
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1">
                      Direct MP4, WebM, PNG, JPG file upload to Supabase.
                    </p>
                  </button>
                </div>

                <input
                  ref={bgFileInputRef}
                  type="file"
                  accept="image/*,video/*"
                  onChange={(e) => e.target.files && handleDirectBgFileUpload(e.target.files[0])}
                  className="hidden"
                />

                {/* Focal Point Sliders (For Cover Fit Alignment) */}
                {bgMode === 'custom' && (
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3 text-xs">
                    <div className="font-mono font-bold text-slate-700 flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <Sliders className="w-4 h-4 text-[#0052FF]" />
                        BACKGROUND FOCAL POINT (COVER FIT)
                      </span>
                      <span className="text-slate-500 font-normal">X: {focalX}% | Y: {focalY}%</span>
                    </div>

                    <div>
                      <label className="block text-[11px] text-slate-500 mb-1">HORIZONTAL FOCAL POINT (X)</label>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={focalX}
                        onChange={(e) => handleFocalChange(Number(e.target.value), focalY)}
                        className="w-full accent-[#0052FF]"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] text-slate-500 mb-1">VERTICAL FOCAL POINT (Y)</label>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={focalY}
                        onChange={(e) => handleFocalChange(focalX, Number(e.target.value))}
                        className="w-full accent-[#0052FF]"
                      />
                    </div>
                  </div>
                )}

                {/* Recent Background History */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                  <div className="font-mono text-xs font-bold text-slate-700 uppercase flex items-center justify-between">
                    <span>BACKGROUND HISTORY</span>
                    <span className="text-[10px] text-slate-400 font-normal">Quick Switch</span>
                  </div>

                  <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1 text-xs font-mono">
                    <div className="p-2 rounded-xl bg-white border border-slate-200 flex items-center justify-between">
                      <span className="font-bold text-[#0B132B]">Default WebGL SplashCursor</span>
                      {bgMode === 'default' ? (
                        <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">ACTIVE</span>
                      ) : (
                        <button onClick={handleSetDefaultBg} className="text-[#0052FF] hover:underline text-[11px]">Activate</button>
                      )}
                    </div>

                    {(state.backgroundHistory || []).filter(h => h.mode !== 'default').map((h, i) => (
                      <div key={h.id || i} className="p-2 rounded-xl bg-white border border-slate-200 flex items-center justify-between">
                        <span className="truncate max-w-[180px] font-medium text-slate-700">{h.name}</span>
                        {bgConfig.asset?.id === h.mediaId && bgMode === 'custom' ? (
                          <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">ACTIVE</span>
                        ) : (
                          <button onClick={() => handleActivateHistoryBg(h)} className="text-[#0052FF] hover:underline text-[11px]">Activate</button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* Right Column: Real Hero Responsive Live Preview */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-slate-700 uppercase">
                    REAL HOMEPAGE HERO PREVIEW
                  </span>

                  <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
                    <button
                      onClick={() => setPreviewViewport('1440')}
                      className={`px-2 py-1 rounded-lg text-[10px] font-mono font-bold ${previewViewport === '1440' ? 'bg-white text-[#0052FF]' : 'text-slate-500'}`}
                    >
                      1440px
                    </button>
                    <button
                      onClick={() => setPreviewViewport('1024')}
                      className={`px-2 py-1 rounded-lg text-[10px] font-mono font-bold ${previewViewport === '1024' ? 'bg-white text-[#0052FF]' : 'text-slate-500'}`}
                    >
                      1024px
                    </button>
                    <button
                      onClick={() => setPreviewViewport('390')}
                      className={`px-2 py-1 rounded-lg text-[10px] font-mono font-bold ${previewViewport === '390' ? 'bg-white text-[#0052FF]' : 'text-slate-500'}`}
                    >
                      390px
                    </button>
                  </div>
                </div>

                {/* Hero Box Preview */}
                <div className="bg-slate-900 rounded-2xl p-4 overflow-hidden border border-slate-800 min-h-[340px] flex items-center justify-center">
                  <div style={{ width: `${previewViewport}px`, maxWidth: '100%' }} className="mx-auto text-center space-y-4 text-white relative p-6 rounded-xl overflow-hidden bg-slate-950">
                    
                    {/* Background Layer Preview */}
                    {bgMode === 'custom' && bgConfig.asset ? (
                      <div className="absolute inset-0 z-0">
                        {bgConfig.asset.type === 'video' ? (
                          <video
                            src={bgConfig.asset.url}
                            autoPlay
                            muted
                            loop
                            playsInline
                            className="w-full h-full object-cover"
                            style={{ objectPosition: `${focalX}% ${focalY}%` }}
                          />
                        ) : (
                          <img
                            src={bgConfig.asset.url}
                            alt="Background Preview"
                            className="w-full h-full object-cover"
                            style={{ objectPosition: `${focalX}% ${focalY}%` }}
                          />
                        )}
                        <div className="absolute inset-0 bg-slate-900/30" />
                      </div>
                    ) : (
                      <div className="absolute inset-0 z-0 bg-gradient-to-tr from-[#0052FF]/20 via-slate-900 to-slate-950">
                        <div className="absolute inset-0 bg-tech-grid opacity-30" />
                      </div>
                    )}

                    {/* Foreground Content */}
                    <div className="relative z-10 space-y-3 max-w-md mx-auto">
                      <div className="inline-block px-3 py-1 rounded-full bg-white/10 text-xs font-mono font-bold">
                        {page.heroEyebrow || "ENGINEERED FOR REAL OPERATIONS"}
                      </div>
                      <h3 className="text-xl font-extrabold text-white">
                        {page.heroHeadlinePart1} {page.heroHeadlinePart2}
                      </h3>
                      <p className="text-xs text-slate-300 line-clamp-2">
                        {page.heroDescription}
                      </p>
                    </div>

                  </div>
                </div>
              </div>

            </div>

          </div>
        )}

        {/* SECTION TEXT EDITORS */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <h2 className="text-lg font-extrabold text-[#0B132B] uppercase font-mono">
            {activePage.toUpperCase()} PAGE TEXT & COPYFIELDS
          </h2>

          <div className="space-y-4">
            {Object.keys(page).map((fieldKey) => (
              <div key={fieldKey} className="space-y-1">
                <label className="block text-xs font-mono font-semibold text-slate-700 uppercase">
                  {fieldKey.replace(/([A-Z])/g, ' $1')}
                </label>
                {page[fieldKey].length > 80 ? (
                  <textarea
                    rows={3}
                    value={page[fieldKey]}
                    onChange={(e) => handleFieldChange(fieldKey, e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs text-[#0B132B] outline-none focus:border-[#0052FF]"
                  />
                ) : (
                  <input
                    type="text"
                    value={page[fieldKey]}
                    onChange={(e) => handleFieldChange(fieldKey, e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs text-[#0B132B] outline-none focus:border-[#0052FF]"
                  />
                )}
              </div>
            ))}
          </div>

          <div className="pt-2 flex justify-end">
            <button
              onClick={handleSave}
              className="px-6 py-3 rounded-xl bg-[#0052FF] text-white font-semibold text-xs hover:bg-[#0042CC] shadow-md transition-all flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>Save {activePage.toUpperCase()} Page Copy</span>
            </button>
          </div>
        </div>

      </div>

      <UploadAndPlaceModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        initialPage={modalTarget.pageId}
        initialSection={modalTarget.sectionId}
        initialSlot={modalTarget.slotId}
      />
    </AdminLayout>
  );
}
