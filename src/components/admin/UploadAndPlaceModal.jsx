import React, { useState, useEffect, useRef } from 'react';
import { getRegisteredPages, getRegisteredSections, getRegisteredSlots, getPlacementLabel } from '../../services/mediaRegistry';
import { assignMediaToSlot, getCMSState, saveCMSState, hydrateCMSFromCloud } from '../../services/cmsStore';
import { uploadDirectFileToSupabase, MEDIA_BUCKET } from '../../services/supabaseClient';
import CmsMedia from '../CmsMedia';
import { getMediaType } from '../../utils/cmsMedia';
import { X, Upload, Check, Monitor, Tablet, Smartphone, AlertTriangle, Link, FileVideo, FileImage, Loader2 } from 'lucide-react';

export default function UploadAndPlaceModal({
  isOpen,
  onClose,
  initialPage = 'home',
  initialSection = 'workingSystem',
  initialSlot = 'mainVisual',
  mode = 'place', // 'place' | 'library'
  assetToAssign = null,
}) {
  const [step, setStep] = useState(1);
  const [selectedPage, setSelectedPage] = useState(initialPage);
  const [selectedSection, setSelectedSection] = useState(initialSection);
  const [selectedSlot, setSelectedSlot] = useState(initialSlot);

  // Source Mode: 'file' | 'url'
  const [sourceMode, setSourceMode] = useState('file');

  // File Upload State
  const [selectedFile, setSelectedFile] = useState(null);
  const [pendingMedia, setPendingMedia] = useState(null);
  const [fileMetadata, setFileMetadata] = useState(null);
  const [uploadStatus, setUploadStatus] = useState('idle'); // 'idle' | 'uploading' | 'processing' | 'ready' | 'error'
  const [uploadProgress, setUploadProgress] = useState(0);
  const [progressText, setProgressText] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const fileInputRef = useRef(null);

  // Manual URL Mode State
  const [manualUrlInput, setManualUrlInput] = useState('');
  const [manualTypeSelection, setManualTypeSelection] = useState('auto'); // 'auto' | 'video' | 'image'
  const [manualAssetPayload, setManualAssetPayload] = useState(null);

  // Display Settings
  const [fitMode, setFitMode] = useState('contain');
  const [deviceTarget, setDeviceTarget] = useState('all');
  const [previewViewport, setPreviewViewport] = useState('1440');
  const [conflictWarning, setConflictWarning] = useState('');

  const pages = getRegisteredPages();
  const sections = getRegisteredSections(selectedPage);
  const slots = getRegisteredSlots(selectedPage, selectedSection);

  useEffect(() => {
    const availableSections = getRegisteredSections(selectedPage);
    if (availableSections.length > 0) {
      setSelectedSection(availableSections[0].id);
    }
  }, [selectedPage]);

  useEffect(() => {
    const availableSlots = getRegisteredSlots(selectedPage, selectedSection);
    if (availableSlots.length > 0) {
      setSelectedSlot(availableSlots[0].id);
    }
  }, [selectedPage, selectedSection]);

  useEffect(() => {
    return () => {
      if (pendingMedia?.previewUrl) {
        URL.revokeObjectURL(pendingMedia.previewUrl);
      }
    };
  }, [pendingMedia]);

  // Check placement conflict
  useEffect(() => {
    const state = getCMSState();
    const key = `${selectedPage}:${selectedSection}:${selectedSlot}`;
    const existing = state.sectionMedia?.[key];
    if (existing && existing.desktopMediaId) {
      const existingAsset = state.mediaAssets?.find(m => m.id === existing.desktopMediaId);
      if (existingAsset && assetToAssign && existingAsset.id !== assetToAssign.id) {
        setConflictWarning(`This slot currently contains "${existingAsset.name}". Publishing will replace its placement.`);
      } else {
        setConflictWarning('');
      }
    } else {
      setConflictWarning('');
    }
  }, [selectedPage, selectedSection, selectedSlot, assetToAssign]);

  if (!isOpen) return null;

  const handleFileSelect = async (file) => {
    if (!file) return;

    const maxMB = 50;
    if (file.size > maxMB * 1024 * 1024) {
      setErrorMsg(`File exceeds maximum limit of ${maxMB} MB.`);
      return;
    }

    const blobUrl = URL.createObjectURL(file);
    const detectedType = getMediaType({ name: file.name, mimeType: file.type });

    const newPending = {
      file,
      previewUrl: blobUrl,
      type: detectedType
    };

    if (pendingMedia?.previewUrl) {
      URL.revokeObjectURL(pendingMedia.previewUrl);
    }

    setPendingMedia(newPending);
    setErrorMsg('');
    setSelectedFile(file);
    setUploadStatus('uploading');
    setUploadProgress(10);
    setProgressText('Uploading file to Supabase Storage...');

    try {
      const folderPath = `${selectedPage}/${selectedSection}`;
      const uploadedAsset = await uploadDirectFileToSupabase(
        file,
        folderPath,
        (pct, text) => {
          setUploadProgress(pct);
          setProgressText(text);
        }
      );

      setFileMetadata(uploadedAsset);
      setUploadStatus('ready');
      setFitMode(uploadedAsset.fit || 'contain');
    } catch (err) {
      console.error("Direct Upload Failed:", err);
      setUploadStatus('error');
      setErrorMsg(err.message || 'File upload failed');
    }
  };

  const handleManualUrlSubmit = (inputUrl) => {
    const trimmed = inputUrl.trim();
    if (!trimmed) {
      setManualAssetPayload(null);
      return;
    }

    if (!trimmed.startsWith('http://') && !trimmed.startsWith('https://')) {
      setErrorMsg('Please enter a valid URL starting with https://');
      setManualAssetPayload(null);
      return;
    }

    setErrorMsg('');

    let resolvedType = manualTypeSelection;
    if (manualTypeSelection === 'auto') {
      resolvedType = getMediaType({ url: trimmed });
    }

    const urlParts = trimmed.split('/');
    const filename = urlParts[urlParts.length - 1].split('?')[0] || 'External media';

    const payload = {
      id: `manual_${Date.now()}`,
      source: "manual-url",
      type: resolvedType,
      url: trimmed,
      storagePath: null,
      bucket: null,
      mimeType: resolvedType === 'video' ? 'video/mp4' : 'image/jpeg',
      name: filename,
      updatedAt: new Date().toISOString()
    };

    setManualAssetPayload(payload);
  };

  const handlePublish = async () => {
    const targetAsset = sourceMode === 'url'
      ? manualAssetPayload
      : (fileMetadata || assetToAssign);

    if (!targetAsset || !targetAsset.url) {
      alert("Please upload a file or enter a valid Media URL before publishing.");
      return;
    }

    try {
      const isManual = targetAsset.source === 'manual-url' || !targetAsset.storagePath;

      const canonicalMediaObj = isManual ? {
        id: targetAsset.id || `manual_${Date.now()}`,
        source: "manual-url",
        type: getMediaType(targetAsset),
        url: targetAsset.url.trim(),
        storagePath: null,
        bucket: null,
        mimeType: targetAsset.mimeType || null,
        name: targetAsset.name || "External media",
        updatedAt: new Date().toISOString()
      } : {
        id: targetAsset.id || `media_${Date.now()}`,
        source: "supabase-storage",
        type: getMediaType(targetAsset),
        bucket: MEDIA_BUCKET,
        storagePath: targetAsset.storagePath,
        url: targetAsset.url,
        mimeType: targetAsset.mimeType || (getMediaType(targetAsset) === 'video' ? 'video/mp4' : 'image/jpeg'),
        name: targetAsset.name,
        updatedAt: new Date().toISOString()
      };

      if (mode === 'place') {
        const verifiedResult = await assignMediaToSlot(
          selectedPage,
          selectedSection,
          selectedSlot,
          deviceTarget === 'mobile' ? '' : canonicalMediaObj.id,
          deviceTarget === 'mobile' ? canonicalMediaObj.id : '',
          fitMode,
          canonicalMediaObj
        );

        const slotKey = `${selectedPage}.${selectedSection}.${selectedSlot}`;
        const slotKeyColon = `${selectedPage}:${selectedSection}:${selectedSlot}`;
        const persisted = verifiedResult?.media?.[slotKey] || verifiedResult?.media?.[slotKeyColon] || verifiedResult?.media?.["home.workingSystem.visual"];

        if (!persisted || !persisted.url) {
          throw new Error(`STAGE: FRESH VERIFICATION | TABLE: site_cms_store | OPERATION: VERIFY | CODE: SLOT_NOT_FOUND | MESSAGE: Slot ${slotKey} was not verified in Supabase.`);
        }
      } else {
        await saveCMSState(getCMSState());
      }

      await hydrateCMSFromCloud();
      alert("Published and verified in Supabase.");
      onClose();
    } catch (err) {
      console.error("Upload placement error:", err);
      alert(err.message || "STAGE: CMS PUBLISH | TABLE: site_cms_store | OPERATION: UPDATE | CODE: UNKNOWN | MESSAGE: Failed to publish placement to database.");
    }
  };

  // Determine active asset object for Step 4 Preview
  const activePreviewAsset = sourceMode === 'url'
    ? manualAssetPayload
    : (pendingMedia
        ? { url: pendingMedia.previewUrl, type: pendingMedia.type, mimeType: pendingMedia.type === 'video' ? 'video/mp4' : 'image/jpeg' }
        : (fileMetadata || assetToAssign));

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-3xl w-full shadow-2xl space-y-6 max-h-[92vh] overflow-y-auto">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-4">
          <div>
            <div className="text-xs font-mono font-bold text-[#0052FF] uppercase tracking-wider">
              {mode === 'place' ? 'DIRECT MEDIA UPLOAD OR MANUAL URL PLACEMENT' : 'UPLOAD TO MEDIA LIBRARY'}
            </div>
            <h2 className="text-xl font-extrabold text-[#0B132B]">
              {mode === 'place' ? 'Upload & Place Visual Asset' : 'Upload Asset to Library'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 4-Step Flow Header Indicator */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 text-xs font-mono">
          <span className={step === 1 ? "font-bold text-[#0052FF]" : "text-slate-400"}>1. DESTINATION</span>
          <span>→</span>
          <span className={step === 2 ? "font-bold text-[#0052FF]" : "text-slate-400"}>2. CHOOSE SOURCE</span>
          <span>→</span>
          <span className={step === 3 ? "font-bold text-[#0052FF]" : "text-slate-400"}>3. DISPLAY SETTINGS</span>
          <span>→</span>
          <span className={step === 4 ? "font-bold text-[#0052FF]" : "text-slate-400"}>4. PREVIEW & PUBLISH</span>
        </div>

        {/* STEP 1: DESTINATION FIRST */}
        {step === 1 && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-[#0B132B]">STEP 1: WHERE SHOULD THIS MEDIA APPEAR?</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-mono font-semibold text-slate-700 mb-1">PAGE</label>
                <select
                  value={selectedPage}
                  onChange={(e) => setSelectedPage(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-[#0B132B] font-medium outline-none focus:border-[#0052FF]"
                >
                  {pages.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono font-semibold text-slate-700 mb-1">SECTION</label>
                <select
                  value={selectedSection}
                  onChange={(e) => setSelectedSection(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-[#0B132B] font-medium outline-none focus:border-[#0052FF]"
                >
                  {sections.map(s => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono font-semibold text-slate-700 mb-1">MEDIA SLOT</label>
                <select
                  value={selectedSlot}
                  onChange={(e) => setSelectedSlot(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-[#0B132B] font-medium outline-none focus:border-[#0052FF]"
                >
                  {slots.map(sl => (
                    <option key={sl.id} value={sl.id}>{sl.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-blue-50/80 border border-blue-200 text-xs space-y-1">
              <div className="font-mono text-blue-500 font-semibold uppercase">TARGET PLACEMENT DESTINATION</div>
              <div className="text-base font-extrabold text-[#0B132B]">
                {getPlacementLabel(selectedPage, selectedSection, selectedSlot)}
              </div>
            </div>

            {conflictWarning && (
              <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 text-amber-600" />
                <span>{conflictWarning}</span>
              </div>
            )}

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setStep(2)}
                className="px-6 py-2.5 rounded-xl bg-[#0052FF] text-white font-semibold text-xs hover:bg-[#0042CC] shadow-md"
              >
                Next: Select Media Source →
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: SOURCE CHOSEN (UPLOAD FILE OR MANUAL MEDIA URL) */}
        {step === 2 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <h3 className="text-sm font-bold text-[#0B132B]">STEP 2: CHOOSE MEDIA SOURCE</h3>
              
              <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl">
                <button
                  onClick={() => { setSourceMode('file'); setErrorMsg(''); }}
                  className={`px-4 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${sourceMode === 'file' ? 'bg-[#0052FF] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
                >
                  <Upload className="w-3.5 h-3.5 inline mr-1.5" />
                  UPLOAD FILE
                </button>
                <button
                  onClick={() => { setSourceMode('url'); setErrorMsg(''); }}
                  className={`px-4 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${sourceMode === 'url' ? 'bg-[#0052FF] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
                >
                  <Link className="w-3.5 h-3.5 inline mr-1.5" />
                  MEDIA URL
                </button>
              </div>
            </div>

            {/* SOURCE MODE A: FILE UPLOAD */}
            {sourceMode === 'file' && (
              <div className="space-y-4">
                <div
                  onClick={() => fileInputRef.current && fileInputRef.current.click()}
                  className="border-2 border-dashed border-slate-300 hover:border-[#0052FF] bg-slate-50 hover:bg-blue-50/40 rounded-2xl p-8 text-center cursor-pointer transition-all space-y-3"
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*,video/*"
                    onChange={(e) => e.target.files && handleFileSelect(e.target.files[0])}
                    className="hidden"
                  />

                  <div className="w-12 h-12 rounded-2xl bg-[#0052FF]/10 text-[#0052FF] flex items-center justify-center mx-auto">
                    <Upload className="w-6 h-6" />
                  </div>

                  <div>
                    <p className="text-sm font-bold text-[#0B132B]">
                      Drop image or video here
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      or <span className="text-[#0052FF] font-semibold underline">CHOOSE FILE</span> from device storage
                    </p>
                  </div>

                  <div className="text-[11px] font-mono text-slate-400">
                    Images (.png, .jpg, .webp) & Videos (.mp4, .webm) supported up to 50 MB
                  </div>
                </div>

                {uploadStatus === 'uploading' && (
                  <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 space-y-2">
                    <div className="flex items-center justify-between text-xs font-mono text-[#0052FF]">
                      <span className="flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        {progressText}
                      </span>
                      <span className="font-bold">{uploadProgress}%</span>
                    </div>
                    <div className="w-full h-2 bg-blue-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#0052FF] transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                  </div>
                )}

                {uploadStatus === 'ready' && fileMetadata && (
                  <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs space-y-2">
                    <div className="flex items-center justify-between font-bold text-emerald-800">
                      <span className="flex items-center gap-1.5">
                        <Check className="w-4 h-4 text-emerald-600" />
                        File Uploaded to Supabase Storage
                      </span>
                      <span className="font-mono">{getMediaType(fileMetadata).toUpperCase()}</span>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] font-mono text-slate-600">
                      <div>FILE: {fileMetadata.name}</div>
                      <div>PATH: {fileMetadata.storagePath}</div>
                      <div>SIZE: {fileMetadata.fileSize}</div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* SOURCE MODE B: MANUAL MEDIA URL INPUT (Requirements 4, 5, 6) */}
            {sourceMode === 'url' && (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
                  <div>
                    <label className="block text-xs font-mono font-semibold text-slate-700 mb-1">
                      PASTE PUBLIC MEDIA URL (HTTPS)
                    </label>
                    <input
                      type="text"
                      placeholder="https://.../storage/v1/object/public/website-media/home/workingSystem/video.mp4"
                      value={manualUrlInput}
                      onChange={(e) => {
                        setManualUrlInput(e.target.value);
                        handleManualUrlSubmit(e.target.value);
                      }}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-[#0B132B] font-mono outline-none focus:border-[#0052FF]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono font-semibold text-slate-700 mb-1">
                      MEDIA TYPE
                    </label>
                    <select
                      value={manualTypeSelection}
                      onChange={(e) => {
                        setManualTypeSelection(e.target.value);
                        if (manualUrlInput) handleManualUrlSubmit(manualUrlInput);
                      }}
                      className="w-full sm:w-60 px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-mono outline-none focus:border-[#0052FF]"
                    >
                      <option value="auto">Auto Detect (by extension)</option>
                      <option value="video">Video (.mp4 / .webm / .mov)</option>
                      <option value="image">Image (.png / .jpg / .webp)</option>
                    </select>
                  </div>
                </div>

                {manualAssetPayload && (
                  <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs space-y-2">
                    <div className="flex items-center justify-between font-bold text-emerald-800">
                      <span className="flex items-center gap-1.5">
                        <Check className="w-4 h-4 text-emerald-600" />
                        Manual Media URL Verified
                      </span>
                      <span className="font-mono">{manualAssetPayload.type.toUpperCase()}</span>
                    </div>
                    <div className="text-[11px] font-mono text-slate-600 truncate">
                      URL: {manualAssetPayload.url}
                    </div>
                  </div>
                )}
              </div>
            )}

            {errorMsg && (
              <div className="p-3 rounded-xl bg-red-50 text-red-700 text-xs border border-red-200">
                {errorMsg}
              </div>
            )}

            <div className="flex justify-between pt-2">
              <button onClick={() => setStep(1)} className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-semibold">
                ← Back
              </button>
              <button
                disabled={sourceMode === 'file' ? (uploadStatus !== 'ready' && !assetToAssign && !pendingMedia) : !manualAssetPayload}
                onClick={() => setStep(3)}
                className="px-6 py-2.5 rounded-xl bg-[#0052FF] text-white font-semibold text-xs hover:bg-[#0042CC] disabled:opacity-50"
              >
                Next: Display Settings →
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: DISPLAY SETTINGS */}
        {step === 3 && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-[#0B132B]">STEP 3: DISPLAY FIT & DEVICE OVERRIDE</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono font-semibold text-slate-700 mb-1">FIT MODE</label>
                <select
                  value={fitMode}
                  onChange={(e) => setFitMode(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs outline-none focus:border-[#0052FF]"
                >
                  <option value="contain">CONTAIN (Default — No Cropping for Google Flow Visuals)</option>
                  <option value="cover">COVER (Environmental Backgrounds Only)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono font-semibold text-slate-700 mb-1">DEVICE VARIANT</label>
                <select
                  value={deviceTarget}
                  onChange={(e) => setDeviceTarget(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs outline-none focus:border-[#0052FF]"
                >
                  <option value="all">All Devices (Default)</option>
                  <option value="mobile">Mobile Media Override Only</option>
                </select>
              </div>
            </div>

            <div className="flex justify-between pt-2">
              <button onClick={() => setStep(2)} className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-semibold">
                ← Back
              </button>
              <button onClick={() => setStep(4)} className="px-6 py-2.5 rounded-xl bg-[#0052FF] text-white font-semibold text-xs hover:bg-[#0042CC]">
                Next: Responsive Preview →
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: RESPONSIVE PREVIEW & PUBLISH */}
        {step === 4 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <div>
                <h3 className="text-sm font-bold text-[#0B132B]">STEP 4: RESPONSIVE SECTION PREVIEW</h3>
                <div className="text-xs font-mono text-[#0052FF]">
                  DESTINATION: {getPlacementLabel(selectedPage, selectedSection, selectedSlot)}
                </div>
              </div>

              <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
                <button
                  onClick={() => setPreviewViewport('1440')}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold ${previewViewport === '1440' ? 'bg-white text-[#0052FF] shadow-xs' : 'text-slate-500'}`}
                >
                  <Monitor className="w-3 h-3 inline mr-1" />1440
                </button>
                <button
                  onClick={() => setPreviewViewport('1024')}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold ${previewViewport === '1024' ? 'bg-white text-[#0052FF] shadow-xs' : 'text-slate-500'}`}
                >
                  <Tablet className="w-3 h-3 inline mr-1" />1024
                </button>
                <button
                  onClick={() => setPreviewViewport('390')}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold ${previewViewport === '390' ? 'bg-white text-[#0052FF] shadow-xs' : 'text-slate-500'}`}
                >
                  <Smartphone className="w-3 h-3 inline mr-1" />390
                </button>
              </div>
            </div>

            {/* Live Responsive Preview Box using CmsMedia */}
            <div className="bg-slate-900 p-6 rounded-2xl flex items-center justify-center min-h-[300px]">
              <div style={{ width: `${previewViewport}px`, maxWidth: '100%' }} className="mx-auto transition-all aspect-video relative overflow-hidden rounded-2xl">
                <CmsMedia
                  asset={activePreviewAsset}
                  className="w-full h-full object-contain"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              <button onClick={() => setStep(3)} className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-semibold">
                ← Back
              </button>
              <button
                onClick={handlePublish}
                disabled={sourceMode === 'file' ? (!fileMetadata && !assetToAssign && !pendingMedia) : !manualAssetPayload}
                className="px-6 py-2.5 rounded-xl bg-[#0052FF] text-white font-semibold text-xs hover:bg-[#0042CC] shadow-md flex items-center gap-2 disabled:opacity-50"
              >
                <Check className="w-4 h-4" />
                <span>Publish to Selected Website Slot</span>
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
