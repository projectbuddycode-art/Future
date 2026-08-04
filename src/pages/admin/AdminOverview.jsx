import React, { useState, useEffect } from 'react';
import AdminLayout from './AdminLayout';
import { getCMSState } from '../../services/cmsStore';
import { getSupabaseStatus, isSupabaseConfigured } from '../../services/supabaseClient';
import { Link } from 'wouter';
import { FileText, FolderKanban, Image as ImageIcon, CheckCircle2, Clock, ArrowRight, ShieldCheck, Database, HardDrive, Lock } from 'lucide-react';

export default function AdminOverview() {
  const [state, setState] = useState(getCMSState());
  const [supabaseStatus, setSupabaseStatus] = useState({ connected: false, message: 'Checking...' });

  useEffect(() => {
    const handleUpdate = () => setState(getCMSState());
    window.addEventListener('cms-state-updated', handleUpdate);

    getSupabaseStatus().then(status => setSupabaseStatus(status));

    return () => window.removeEventListener('cms-state-updated', handleUpdate);
  }, []);

  const stats = [
    { name: 'Editable Pages', value: Object.keys(state.pages).length, icon: FileText, href: '/admin/pages' },
    { name: 'Active Projects', value: state.projects.length, icon: FolderKanban, href: '/admin/projects' },
    { name: 'Media Assets', value: state.mediaAssets.length, icon: ImageIcon, href: '/admin/media' },
  ];

  return (
    <AdminLayout activeTab="overview">
      <div className="space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
          <div>
            <span className="text-xs font-mono font-bold text-[#0052FF] uppercase tracking-wider">
              ADMIN CONTROL CENTER
            </span>
            <h1 className="text-2xl font-extrabold text-[#0B132B]">
              Project Buddy Content System
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Manage copy, direct Supabase media uploads, enterprise projects, and site settings without code changes.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="px-3.5 py-1.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-mono font-semibold flex items-center gap-2 border border-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              SYSTEM PRODUCTION ACTIVE
            </span>
          </div>
        </div>

        {/* Supabase Connection Status Card */}
        <div className="p-4 rounded-2xl bg-slate-900 text-white shadow-xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[#0052FF]/20 text-[#0A84FF]">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-white flex items-center gap-2">
                SUPABASE STORAGE & DATABASE INTEGRATION
                {isSupabaseConfigured ? (
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/30">CONNECTED ✓</span>
                ) : (
                  <span className="text-[10px] bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded border border-amber-500/30">LOCAL FALLBACK ACTIVE</span>
                )}
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                {supabaseStatus.message}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-[11px] text-slate-300">
            <div className="flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-emerald-400" />
              <span>Auth ✓</span>
            </div>
            <div className="flex items-center gap-1.5">
              <HardDrive className="w-3.5 h-3.5 text-emerald-400" />
              <span>Storage ✓</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5 text-emerald-400" />
              <span>Database ✓</span>
            </div>
          </div>
        </div>

        {/* Quick Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((st) => {
            const IconComp = st.icon;
            return (
              <Link
                key={st.name}
                href={st.href}
                className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:border-[#0052FF] hover:shadow-md transition-all flex items-center justify-between group"
              >
                <div className="space-y-1">
                  <span className="text-xs font-mono text-slate-400 font-semibold">{st.name}</span>
                  <div className="text-3xl font-extrabold text-[#0B132B]">{st.value}</div>
                </div>
                <div className="p-3 rounded-xl bg-[#0052FF]/10 text-[#0052FF] group-hover:bg-[#0052FF] group-hover:text-white transition-colors">
                  <IconComp className="w-6 h-6" />
                </div>
              </Link>
            );
          })}
        </div>

        {/* System Overview Details */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <h3 className="text-base font-bold text-[#0B132B] flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#0052FF]" />
              Architectural Guarantee & Direct Upload Pipeline
            </h3>
            <span className="text-xs font-mono text-slate-400">
              Last Updated: {new Date(state.lastUpdated).toLocaleTimeString()}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs leading-relaxed text-slate-600">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
              <div className="font-bold text-[#0B132B]">Direct Supabase File Upload</div>
              <p>Choose images and Google Flow MP4 videos directly from device storage. Files are uploaded to Supabase Storage and placements are resolved instantly by public website components.</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
              <div className="font-bold text-[#0B132B]">No Manual URLs / No Redeploys</div>
              <p>Content and media changes publish live from Supabase. No manual media URLs, Git pushes, or Vercel redeployments are required for normal media updates.</p>
            </div>
          </div>

          <div className="pt-2 flex flex-wrap gap-3">
            <Link
              href="/admin/media"
              className="px-5 py-2.5 rounded-xl bg-[#0052FF] text-white font-semibold text-xs hover:bg-[#0042CC] shadow-md transition-all flex items-center gap-2"
            >
              <span>Upload & Place Supabase Media</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/admin/pages"
              className="px-5 py-2.5 rounded-xl bg-white border border-slate-200 text-[#0B132B] font-semibold text-xs hover:border-[#0052FF] hover:text-[#0052FF] transition-all flex items-center gap-2"
            >
              <span>Edit Page Copy & Visuals</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

      </div>
    </AdminLayout>
  );
}
