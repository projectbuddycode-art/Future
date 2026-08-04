import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { getCMSState } from '../services/cmsStore';

const AuthContext = createContext(null);
const TOKEN_KEY = "pb_admin_auth_token_v2";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [, setLocation] = useLocation();

  const cmsState = getCMSState();
  const adminEmail = (cmsState.siteSettings?.adminEmail || "projectbuddy.code@gmail.com").trim().toLowerCase();
  const adminPassword = cmsState.siteSettings?.adminPassword || "Optimusshiv0001@";

  useEffect(() => {
    try {
      const storedToken = sessionStorage.getItem(TOKEN_KEY);
      if (storedToken) {
        const decoded = JSON.parse(atob(storedToken));
        if (decoded.email === adminEmail && decoded.expires > Date.now()) {
          setUser({ email: adminEmail, role: "administrator" });
        } else {
          sessionStorage.removeItem(TOKEN_KEY);
        }
      }
    } catch (e) {
      sessionStorage.removeItem(TOKEN_KEY);
    }
    setLoading(false);
  }, [adminEmail]);

  const login = async (email, password) => {
    await new Promise(res => setTimeout(res, 350));

    if (email.trim().toLowerCase() === adminEmail && password === adminPassword) {
      const session = {
        email: adminEmail,
        role: "administrator",
        expires: Date.now() + 24 * 60 * 60 * 1000,
      };
      const token = btoa(JSON.stringify(session));
      sessionStorage.setItem(TOKEN_KEY, token);
      setUser({ email: adminEmail, role: "administrator" });
      return { success: true };
    } else {
      return { success: false, error: "Invalid email or password. Access denied." };
    }
  };

  const logout = () => {
    sessionStorage.removeItem(TOKEN_KEY);
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
