import React, { useState, useEffect, useRef } from 'react';
import AdminLayout from './AdminLayout';
import { getCMSState, saveCMSState } from '../../services/cmsStore';
import { getSupabaseStatus } from '../../services/supabaseClient';
import { uploadDirectFileToSupabase } from '../../services/supabaseClient';
import ProjectBuddyLogo from '../../components/ProjectBuddyLogo';
import { Save, Check, Settings, Mail, Calendar, Linkedin, ShieldCheck, Database, Lock, Upload, Image as ImageIcon, Trash2, HardDrive } from 'lucide-react';

export default function AdminSettings() {
  const [state, setState] = useState(getCMSState());
  const [savedMsg, setSavedMsg] = useState(false);
  const [supabaseStatus, setSupabaseStatus] = useState({ connected: false, message: 'Checking...' });

  // Settings State
  const [companyName, setCompanyName] = useState(state.siteSettings.companyName || "Project Buddy");
  const [logoTagline, setLogoTagline] = useState(state.siteSettings.logoTagline || "Turn idea into reality");
  const [logoUrl, setLogoUrl] = useState(state.siteSettings.logoUrl || "");

  // Admin Auth credentials state
  const [adminEmail, setAdminEmail] = useState(state.siteSettings.adminEmail || "projectbuddy.code@gmail.com");
  const [adminPassword, setAdminPassword] = useState(state.siteSettings.adminPassword || "Optimusshiv0001@");

  // Uploading state
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const logoFileInputRef = useRef(null);

  useEffect(() => {
    getSupabaseStatus().then(res => setSupabaseStatus(res));
  }, []);

  const handleSave = async () => {
    const newState = {
      ...state,
      siteSettings: {
        ...state.siteSettings,
        companyName,
        logoTagline,
        logoUrl,
        adminEmail,
        adminPassword,
      }
    };
    try {
      await saveCMSState(newState);
      setState(newState);
      setSavedMsg(true);
      setTimeout(() => setSavedMsg(false), 2500);
    } catch (err) {
      console.error("Save settings error:", err);
      alert(err.message || "Failed to save settings. Connection offline.");
    }
  };

  const handleLogoFileUpload = async (file) => {
    if (!file) return;
    setUploadingLogo(true);

    try {
      const asset = await uploadDirectFileToSupabase(file, 'brand/logo');
      setLogoUrl(asset.url);
      setUploadingLogo(false);
    } catch (err) {
      console.error("Logo upload failed:", err);
      setUploadingLogo(false);
    }
  };

  const handleFieldChange = (field, val) => {
    const newState = {
      ...state,
      siteSettings: {
        ...state.siteSettings,
        [field]: val,
      }
    };
    setState(newState);
  };

  return (
    <AdminLayout activeTab="settings">
      <div className="space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
          <div>
            <span className="text-xs font-mono font-bold text-[#0052FF] uppercase tracking-wider">
              GLOBAL SITE & BRAND IDENTITY CONTROL
            </span>
            <h1 className="text-2xl font-extrabold text-[#0B132B]">
              Logo, Credentials & Site Settings
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Upload custom logo images, manage brand identity, edit admin login credentials, and configure discovery channels.
            </p>
          </div>

          <button
            onClick={handleSave}
            className="px-6 py-3 rounded-xl bg-[#0052FF] hover:bg-[#0042CC] text-white font-semibold text-xs shadow-md transition-all flex items-center gap-2"
          >
            {savedMsg ? <Check className="w-4 h-4 text-emerald-300" /> : <Save className="w-4 h-4" />}
            <span>{savedMsg ? "Saved All Settings!" : "Save All Settings"}</span>
          </button>
        </div>

        {/* LOGO & BRAND IDENTITY CONTROL BOX */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <h3 className="text-base font-extrabold text-[#0B132B] flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-[#0052FF]" />
            Logo & Brand Identity Control
          </h3>

          {/* Current Live Logo Preview */}
          <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
            <div className="text-xs font-mono font-bold text-slate-400 uppercase">
              CURRENT LIVE LOGO PREVIEW
            </div>
            <div className="p-4 bg-white rounded-xl border border-slate-200 inline-block shadow-sm">
              <ProjectBuddyLogo showTagline={true} />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono font-semibold text-slate-700 mb-1">
                COMPANY / BRAND NAME
              </label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-xs text-[#0B132B] outline-none focus:border-[#0052FF]"
              />
            </div>

            <div>
              <label className="block text-xs font-mono font-semibold text-slate-700 mb-1">
                LOGO TAGLINE
              </label>
              <input
                type="text"
                value={logoTagline}
                onChange={(e) => setLogoTagline(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-xs text-[#0B132B] outline-none focus:border-[#0052FF]"
              />
            </div>
          </div>

          {/* Direct File Upload for Custom Logo */}
          <div className="p-5 rounded-xl border border-dashed border-slate-300 bg-slate-50 space-y-3">
            <div className="text-xs font-mono font-semibold text-slate-700">
              UPLOAD CUSTOM LOGO IMAGE (PNG, SVG, WEBP, JPG)
            </div>

            <div className="flex items-center gap-3">
              <input
                ref={logoFileInputRef}
                type="file"
                accept="image/*"
                onChange={(e) => e.target.files && handleLogoFileUpload(e.target.files[0])}
                className="hidden"
              />

              <button
                type="button"
                onClick={() => logoFileInputRef.current && logoFileInputRef.current.click()}
                disabled={uploadingLogo}
                className="px-5 py-2.5 rounded-xl bg-[#0052FF] text-white font-semibold text-xs hover:bg-[#0042CC] transition-colors flex items-center gap-2"
              >
                <Upload className="w-4 h-4" />
                <span>{uploadingLogo ? "Uploading Logo..." : "Choose Logo File from Device"}</span>
              </button>

              {logoUrl && (
                <button
                  type="button"
                  onClick={() => setLogoUrl("")}
                  className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-600 text-xs font-semibold hover:text-red-500 hover:border-red-200 transition-colors flex items-center gap-1.5"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Reset to Official Monogram</span>
                </button>
              )}
            </div>

            {logoUrl && (
              <div className="text-[11px] font-mono text-slate-500 truncate">
                Logo URL: {logoUrl}
              </div>
            )}
          </div>
        </div>

        {/* READ-ONLY SUPABASE PRODUCTION CONNECTION STATUS CARD (NO MANUAL INPUTS REQUIRED) */}
        <div className="p-6 rounded-2xl bg-slate-900 text-white shadow-xl border border-slate-800 space-y-4 font-mono text-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2 font-bold text-base text-white">
              <Database className="w-5 h-5 text-[#0A84FF]" />
              <span>SUPABASE PRODUCTION CONNECTION</span>
            </div>
            <span className={`px-3 py-1 rounded-full text-[11px] font-bold ${supabaseStatus.connected ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'}`}>
              {supabaseStatus.connected ? 'CONNECTED ✓' : 'LOCAL FALLBACK ENGINE ACTIVE'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-slate-300 text-[11px]">
            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/50">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <div>
                <div className="font-bold text-white">Connection</div>
                <div>{supabaseStatus.connected ? "Active ✓" : "Offline"}</div>
              </div>
            </div>

            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/50">
              <Database className="w-4 h-4 text-emerald-400" />
              <div>
                <div className="font-bold text-white">Database</div>
                <div>{supabaseStatus.database ? "Ready ✓" : "Standby"}</div>
              </div>
            </div>

            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/50">
              <HardDrive className="w-4 h-4 text-emerald-400" />
              <div>
                <div className="font-bold text-white">Storage Bucket</div>
                <div>website-media ✓</div>
              </div>
            </div>
          </div>

          <p className="text-[11px] text-slate-400 font-sans leading-relaxed">
            Connection parameters are automatically provided via environment variables (<code className="text-[#0A84FF]">VITE_SUPABASE_URL</code> & <code className="text-[#0A84FF]">VITE_SUPABASE_ANON_KEY</code>). No manual credential entry is required in Admin.
          </p>
        </div>

        {/* Admin Login Credentials Box */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <h3 className="text-base font-extrabold text-[#0B132B] flex items-center gap-2">
            <Lock className="w-5 h-5 text-[#0052FF]" />
            Administrator Login Credentials
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono font-semibold text-slate-700 mb-1">
                ADMINISTRATOR EMAIL
              </label>
              <input
                type="email"
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                placeholder="admin@projectbuddy.co.in"
                className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-xs text-[#0B132B] outline-none focus:border-[#0052FF]"
              />
            </div>

            <div>
              <label className="block text-xs font-mono font-semibold text-slate-700 mb-1">
                ADMINISTRATOR PASSWORD
              </label>
              <input
                type="password"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-xs text-[#0B132B] outline-none focus:border-[#0052FF]"
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              onClick={handleSave}
              className="px-6 py-3 rounded-xl bg-[#0052FF] text-white font-semibold text-xs hover:bg-[#0042CC] shadow-md transition-all flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>Update Credentials</span>
            </button>
          </div>
        </div>

        {/* Discovery Pathways Settings Box */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <h3 className="text-base font-extrabold text-[#0B132B] flex items-center gap-2">
            <Settings className="w-5 h-5 text-[#0052FF]" />
            Direct Discovery Pathways & Contact Info
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-[#0052FF]" />
                PUBLIC CONTACT EMAIL
              </label>
              <input
                type="email"
                value={state.siteSettings.companyEmail || ''}
                onChange={(e) => handleFieldChange('companyEmail', e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-xs text-[#0B132B] outline-none focus:border-[#0052FF]"
              />
            </div>

            <div>
              <label className="block text-xs font-mono font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#0052FF]" />
                CALENDLY SCHEDULING URL
              </label>
              <input
                type="text"
                value={state.siteSettings.calendlyUrl || ''}
                onChange={(e) => handleFieldChange('calendlyUrl', e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-xs text-[#0B132B] outline-none focus:border-[#0052FF]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
              <Linkedin className="w-3.5 h-3.5 text-[#0052FF]" />
              LINKEDIN PROFILE URL
            </label>
            <input
              type="text"
              value={state.siteSettings.linkedInUrl || ''}
              onChange={(e) => handleFieldChange('linkedInUrl', e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-xs text-[#0B132B] outline-none focus:border-[#0052FF]"
            />
          </div>

          <div className="pt-2 flex justify-end">
            <button
              onClick={handleSave}
              className="px-6 py-3 rounded-xl bg-[#0052FF] text-white font-semibold text-xs hover:bg-[#0042CC] shadow-md transition-all flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>Save All Settings</span>
            </button>
          </div>
        </div>

      </div>
    </AdminLayout>
  );
}
