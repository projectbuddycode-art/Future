import React, { useState } from 'react';
import AdminLayout from './AdminLayout';
import { getCMSState, saveCMSState } from '../../services/cmsStore';
import { Plus, Trash2, Check, Save, FolderKanban, ShieldCheck } from 'lucide-react';

export default function AdminProjects() {
  const [state, setState] = useState(getCMSState());
  const [editingProject, setEditingProject] = useState(null);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [savedMsg, setSavedMsg] = useState(false);

  const handleSaveState = async (newState) => {
    try {
      await saveCMSState(newState);
      setState(newState);
      setSavedMsg(true);
      setTimeout(() => setSavedMsg(false), 2500);
    } catch (err) {
      console.error("Save projects error:", err);
      alert(err.message || "Failed to save projects state.");
    }
  };

  const handleAddProject = (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newProj = {
      id: `project_${Date.now()}`,
      slug: newTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      title: newTitle.trim(),
      category: newCategory.trim() || 'Custom Enterprise System',
      badge: 'Enterprise Platform',
      description: newDesc.trim() || 'Custom software system engineered around business operations.',
      status: 'PRODUCTION ACTIVE',
      nodes: ['CORE ENGINE', 'API MESH', 'DATA STORE'],
      mediaId: 'media_hero_01',
      published: true,
    };

    const newState = {
      ...state,
      projects: [...state.projects, newProj]
    };
    handleSaveState(newState);
    setNewTitle('');
    setNewCategory('');
    setNewDesc('');
  };

  const handleDeleteProject = (projId) => {
    const newState = {
      ...state,
      projects: state.projects.filter(p => p.id !== projId)
    };
    handleSaveState(newState);
  };

  return (
    <AdminLayout activeTab="projects">
      <div className="space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
          <div>
            <span className="text-xs font-mono font-bold text-[#0052FF] uppercase tracking-wider">
              ENTERPRISE PROJECTS MANAGER
            </span>
            <h1 className="text-2xl font-extrabold text-[#0B132B]">
              Projects & Flagship Systems
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Add and manage flagship enterprise systems. New projects automatically inherit the approved cinematic template.
            </p>
          </div>
        </div>

        {savedMsg && (
          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-center gap-2">
            <Check className="w-4 h-4" />
            <span>Project State Updated & Saved!</span>
          </div>
        )}

        {/* Add Project Form */}
        <form onSubmit={handleAddProject} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-[#0B132B] flex items-center gap-2">
            <Plus className="w-4 h-4 text-[#0052FF]" />
            Add New Enterprise System Project
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono font-semibold text-slate-700 mb-1">
                PROJECT TITLE
              </label>
              <input
                type="text"
                required
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="e.g. Nexus Logistics Mesh"
                className="w-full px-3.5 py-2 rounded-lg border border-slate-200 text-xs outline-none focus:border-[#0052FF]"
              />
            </div>

            <div>
              <label className="block text-xs font-mono font-semibold text-slate-700 mb-1">
                SYSTEM CATEGORY
              </label>
              <input
                type="text"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                placeholder="e.g. Supply Chain & IoT Dispatch"
                className="w-full px-3.5 py-2 rounded-lg border border-slate-200 text-xs outline-none focus:border-[#0052FF]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono font-semibold text-slate-700 mb-1">
              SYSTEM DESCRIPTION
            </label>
            <textarea
              rows={2}
              value={newDesc}
              onChange={(e) => setNewDesc(e.target.value)}
              placeholder="Describe the operational capabilities and infrastructure..."
              className="w-full px-3.5 py-2 rounded-lg border border-slate-200 text-xs outline-none focus:border-[#0052FF]"
            />
          </div>

          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-[#0052FF] text-white font-semibold text-xs hover:bg-[#0042CC] shadow-md transition-all flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Create Enterprise System Entry</span>
          </button>
        </form>

        {/* Existing Projects List */}
        <div className="space-y-4">
          <h3 className="text-sm font-extrabold text-[#0B132B] uppercase font-mono">
            FLAGSHIP SYSTEMS CATALOG ({state.projects.length} PROJECTS)
          </h3>

          <div className="space-y-4">
            {state.projects.map((proj) => (
              <div key={proj.id} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-md bg-[#0052FF]/10 text-[#0052FF] text-[10px] font-mono font-bold">
                      {proj.badge}
                    </span>
                    <span className="text-xs font-mono text-slate-400">
                      STATUS: {proj.status}
                    </span>
                  </div>

                  <h4 className="text-lg font-bold text-[#0B132B]">
                    {proj.title}
                  </h4>
                  
                  <p className="text-xs text-slate-600 max-w-xl">
                    {proj.description}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => handleDeleteProject(proj.id)}
                    className="p-2 rounded-lg bg-slate-100 text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                    title="Delete project"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

              </div>
            ))}
          </div>
        </div>

      </div>
    </AdminLayout>
  );
}
