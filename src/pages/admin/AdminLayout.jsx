import React, { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { useAuth } from '../../context/AuthContext';
import { Layers, LayoutDashboard, FileText, FolderKanban, Image as ImageIcon, Navigation as NavIcon, Search, Settings, LogOut, Menu, X, ShieldCheck, ExternalLink } from 'lucide-react';

export default function AdminLayout({ children, activeTab = 'overview' }) {
  const { user, logout, isAuthenticated, loading } = useAuth();
  const [, setLocation] = useLocation();
  const [drawerOpen, setDrawerOpen] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center font-mono text-xs">
        <span>Authenticating Admin Session...</span>
      </div>
    );
  }

  if (!isAuthenticated) {
    setLocation('/admin/login');
    return null;
  }

  const navItems = [
    { id: 'overview', name: 'Overview', href: '/admin', icon: LayoutDashboard },
    { id: 'pages', name: 'Pages', href: '/admin/pages', icon: FileText },
    { id: 'projects', name: 'Projects', href: '/admin/projects', icon: FolderKanban },
    { id: 'media', name: 'Media Library', href: '/admin/media', icon: ImageIcon },
    { id: 'navigation', name: 'Navigation', href: '/admin/navigation', icon: NavIcon },
    { id: 'seo', name: 'SEO Metadata', href: '/admin/seo', icon: Search },
    { id: 'settings', name: 'Site Settings', href: '/admin/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row text-slate-800">
      
      {/* Sidebar Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-[#0B132B] text-white p-5 justify-between shrink-0 shadow-xl border-r border-slate-800">
        <div className="space-y-6">
          
          {/* Logo Header */}
          <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
            <div className="w-8 h-8 rounded-lg bg-[#0052FF] flex items-center justify-center text-white font-bold text-sm">
              <Layers className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="font-bold text-sm tracking-tight text-white flex items-center gap-1">
                Project Buddy
                <span className="w-1.5 h-1.5 rounded-full bg-[#0052FF]" />
              </div>
              <span className="text-[10px] font-mono text-slate-400">CONTENT CMS v2.4</span>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const IconComp = item.icon;
              const isActive = activeTab === item.id;
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-[#0052FF] text-white shadow-md shadow-[#0052FF]/20'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/80'
                  }`}
                >
                  <IconComp className="w-4 h-4" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="pt-4 border-t border-slate-800 space-y-3">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between px-3.5 py-2 rounded-lg bg-slate-800/60 hover:bg-slate-800 text-xs font-medium text-slate-300 transition-colors"
          >
            <span>View Public Website</span>
            <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
          </a>

          <div className="flex items-center justify-between text-xs pt-1">
            <span className="text-[11px] font-mono text-slate-400 truncate max-w-[130px]">
              {user?.email}
            </span>
            <button
              onClick={logout}
              className="p-1.5 rounded-md text-slate-400 hover:text-red-400 hover:bg-red-950/40 transition-colors"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Topbar */}
      <div className="md:hidden bg-[#0B132B] text-white p-4 flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Layers className="w-5 h-5 text-[#0052FF]" />
          <span className="font-bold text-sm">Project Buddy Admin</span>
        </div>
        <button
          onClick={() => setDrawerOpen(!drawerOpen)}
          className="p-1.5 rounded-lg text-slate-300 hover:bg-slate-800"
        >
          {drawerOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Sidebar Drawer */}
      {drawerOpen && (
        <div className="md:hidden bg-[#0B132B] text-white p-5 space-y-4 border-b border-slate-800">
          {navItems.map((item) => {
            const IconComp = item.icon;
            return (
              <Link
                key={item.id}
                href={item.href}
                onClick={() => setDrawerOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold ${
                  activeTab === item.id ? 'bg-[#0052FF] text-white' : 'text-slate-300'
                }`}
              >
                <IconComp className="w-5 h-5" />
                <span>{item.name}</span>
              </Link>
            );
          })}
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-red-400 bg-red-950/40"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout Administrator</span>
          </button>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto max-w-7xl">
        {children}
      </main>

    </div>
  );
}
