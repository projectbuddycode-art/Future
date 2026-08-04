import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { getCMSState } from '../services/cmsStore';
import { supabase, isSupabaseConfigured } from '../services/supabaseClient';

const AuthContext = createContext(null);
const TOKEN_KEY = "pb_admin_auth_token_v2";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [, setLocation] = useLocation();

  const cmsState = getCMSState();
  const fallbackEmail = (cmsState.siteSettings?.adminEmail || "projectbuddy.code@gmail.com").trim().toLowerCase();
  const fallbackPassword = cmsState.siteSettings?.adminPassword || "Optimusshiv0001@";

  useEffect(() => {
    if (isSupabaseConfigured && supabase) {
      // 1. Recover persistent session from Supabase Client
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session && session.user) {
          // Verify public.admin_users record exists for this User UUID
          supabase
            .from('admin_users')
            .select('role')
            .eq('user_id', session.user.id)
            .single()
            .then(({ data: adminRecord, error }) => {
              if (!error && adminRecord) {
                setUser({
                  id: session.user.id,
                  email: session.user.email,
                  role: adminRecord.role || "administrator"
                });
              } else {
                supabase.auth.signOut();
                setUser(null);
              }
              setLoading(false);
            });
        } else {
          setLoading(false);
        }
      });

      // 2. Listen to Auth State Changes
      const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
        if (session && session.user) {
          supabase
            .from('admin_users')
            .select('role')
            .eq('user_id', session.user.id)
            .single()
            .then(({ data: adminRecord }) => {
              if (adminRecord) {
                setUser({
                  id: session.user.id,
                  email: session.user.email,
                  role: adminRecord.role || "administrator"
                });
              }
            });
        } else {
          setUser(null);
        }
      });

      return () => {
        subscription?.unsubscribe();
      };
    } else {
      // Fallback local session storage authentication (Offline Mode)
      try {
        const storedToken = sessionStorage.getItem(TOKEN_KEY);
        if (storedToken) {
          const decoded = JSON.parse(atob(storedToken));
          if (decoded.email === fallbackEmail && decoded.expires > Date.now()) {
            setUser({ email: fallbackEmail, role: "administrator" });
          } else {
            sessionStorage.removeItem(TOKEN_KEY);
          }
        }
      } catch (e) {
        sessionStorage.removeItem(TOKEN_KEY);
      }
      setLoading(false);
    }
  }, [fallbackEmail]);

  const login = async (email, password) => {
    setLoading(true);

    if (isSupabaseConfigured && supabase) {
      // Authenticate via Supabase Auth
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password
      });

      if (error) {
        setLoading(false);
        return { success: false, error: error.message };
      }

      // Query database table admin_users to authorize CMS administrator membership
      const { data: adminRecord, error: adminError } = await supabase
        .from('admin_users')
        .select('*')
        .eq('user_id', data.user.id)
        .single();

      if (adminError || !adminRecord) {
        await supabase.auth.signOut();
        setLoading(false);
        return {
          success: false,
          error: "Your authenticated account is not registered as a CMS administrator."
        };
      }

      setUser({
        id: data.user.id,
        email: data.user.email,
        role: adminRecord.role || "administrator"
      });
      setLoading(false);
      return { success: true };
    } else {
      // Fallback local validation (Offline Mode)
      await new Promise(res => setTimeout(res, 350));
      if (email.trim().toLowerCase() === fallbackEmail && password === fallbackPassword) {
        const session = {
          email: fallbackEmail,
          role: "administrator",
          expires: Date.now() + 24 * 60 * 60 * 1000,
        };
        const token = btoa(JSON.stringify(session));
        sessionStorage.setItem(TOKEN_KEY, token);
        setUser({ email: fallbackEmail, role: "administrator" });
        setLoading(false);
        return { success: true };
      } else {
        setLoading(false);
        return { success: false, error: "Invalid email or password. Access denied." };
      }
    }
  };

  const logout = async () => {
    if (isSupabaseConfigured && supabase) {
      await supabase.auth.signOut();
    } else {
      sessionStorage.removeItem(TOKEN_KEY);
    }
    setUser(null);
    setLocation("/admin/login");
  };

  return (
    <AuthContext.Provider value={{ user, loading, isAuthenticated: !!user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
