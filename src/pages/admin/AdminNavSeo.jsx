import React, { useState } from 'react';
import AdminLayout from './AdminLayout';
import { getCMSState, saveCMSState } from '../../services/cmsStore';
import { Save, Check, Search, Navigation as NavIcon } from 'lucide-react';

export default function AdminNavSeo() {
  const [state, setState] = useState(getCMSState());
  const [savedMsg, setSavedMsg] = useState(false);

  const handleSave = async () => {
    try {
      await saveCMSState(state);
      setSavedMsg(true);
      setTimeout(() => setSavedMsg(false), 2500);
    } catch (err) {
      console.error("Save settings error:", err);
      alert(err.message || "Failed to save settings. Connection offline.");
    }
  };

  const handleSettingChange = (field, val) => {
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
    <AdminLayout activeTab="seo">
      <div className="space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
          <div>
            <span className="text-xs font-mono font-bold text-[#0052FF] uppercase tracking-wider">
              SEO & META SEARCH ENGINE EDITOR
            </span>
            <h1 className="text-2xl font-extrabold text-[#0B132B]">
              SEO Titles, Descriptions & Canonical Meta
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Configure search engine metadata, OpenGraph tags, and character counters.
            </p>
          </div>

          <button
            onClick={handleSave}
            className="px-6 py-3 rounded-xl bg-[#0052FF] hover:bg-[#0042CC] text-white font-semibold text-xs shadow-md transition-all flex items-center gap-2"
          >
            {savedMsg ? <Check className="w-4 h-4 text-emerald-300" /> : <Save className="w-4 h-4" />}
            <span>{savedMsg ? "Saved!" : "Save SEO Metadata"}</span>
          </button>
        </div>

        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <h3 className="text-base font-extrabold text-[#0B132B] flex items-center gap-2">
            <Search className="w-5 h-5 text-[#0052FF]" />
            Global Website Meta & OpenGraph Settings
          </h3>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-mono font-semibold text-slate-700">
                GLOBAL DEFAULT SEO TITLE
              </label>
              <span className="text-[11px] font-mono text-slate-400">
                {state.siteSettings.seoTitle?.length || 0} / 60 chars
              </span>
            </div>
            <input
              type="text"
              value={state.siteSettings.seoTitle || ''}
              onChange={(e) => handleSettingChange('seoTitle', e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-xs text-[#0B132B] outline-none focus:border-[#0052FF]"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-mono font-semibold text-slate-700">
                GLOBAL DEFAULT META DESCRIPTION
              </label>
              <span className="text-[11px] font-mono text-slate-400">
                {state.siteSettings.seoDescription?.length || 0} / 160 chars
              </span>
            </div>
            <textarea
              rows={3}
              value={state.siteSettings.seoDescription || ''}
              onChange={(e) => handleSettingChange('seoDescription', e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-xs text-[#0B132B] outline-none focus:border-[#0052FF]"
            />
          </div>

          <div>
            <label className="block text-xs font-mono font-semibold text-slate-700 mb-1">
              OPENGRAPH OG:IMAGE URL
            </label>
            <input
              type="text"
              value={state.siteSettings.ogImage || ''}
              onChange={(e) => handleSettingChange('ogImage', e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-xs text-[#0B132B] outline-none focus:border-[#0052FF]"
            />
          </div>

          <div className="pt-2 flex justify-end">
            <button
              onClick={handleSave}
              className="px-6 py-3 rounded-xl bg-[#0052FF] text-white font-semibold text-xs hover:bg-[#0042CC] shadow-md transition-all flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>Save SEO Settings</span>
            </button>
          </div>
        </div>

      </div>
    </AdminLayout>
  );
}
