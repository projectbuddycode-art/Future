import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '../../context/AuthContext';
import { Layers, Lock, ShieldCheck, ArrowRight, AlertCircle } from 'lucide-react';

export default function AdminLogin() {
  const { login, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (isAuthenticated) {
    setLocation('/admin');
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    const res = await login(email, password);
    setSubmitting(false);

    if (res.success) {
      setLocation('/admin');
    } else {
      setError(res.error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Ambient Radial Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#0052FF]/15 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md bg-white/95 rounded-3xl p-8 sm:p-10 shadow-2xl border border-slate-200/90 backdrop-blur-xl relative z-10">
        
        {/* Header */}
        <div className="text-center space-y-3 mb-8">
          <div className="w-12 h-12 rounded-2xl bg-[#0B132B] flex items-center justify-center text-white font-bold text-lg mx-auto shadow-lg shadow-[#0B132B]/20">
            <Layers className="w-6 h-6 text-white" />
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0052FF]/10 text-[#0052FF] text-xs font-mono font-bold tracking-wider uppercase">
            <Lock className="w-3 h-3" />
            <span>ADMIN SYSTEM</span>
          </div>
          <h1 className="text-2xl font-extrabold text-[#0B132B] tracking-tight">
            Sign In to Project Buddy CMS
          </h1>
          <p className="text-xs text-slate-500">
            Authorized administrator access only.
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-mono font-semibold text-slate-700 mb-1.5">
              ADMINISTRATOR EMAIL
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="projectbuddy.code@gmail.com"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 text-xs font-medium text-[#0B132B] focus:border-[#0052FF] focus:ring-2 focus:ring-[#0052FF]/20 outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-mono font-semibold text-slate-700 mb-1.5">
              PASSWORD
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 text-xs font-medium text-[#0B132B] focus:border-[#0052FF] focus:ring-2 focus:ring-[#0052FF]/20 outline-none transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3.5 rounded-xl bg-[#0052FF] hover:bg-[#0042CC] text-white font-semibold text-xs shadow-lg shadow-[#0052FF]/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <span>{submitting ? "Authenticating..." : "Sign In to Admin Dashboard"}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-8 pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 font-mono">
          <div className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-[#0052FF]" />
            <span>SSL Token Protected</span>
          </div>
          <span>v2.4 Production</span>
        </div>

      </div>
    </div>
  );
}
