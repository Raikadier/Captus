/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../shared/api/supabase';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  // Keep token for compatibility with axios interceptor reading localStorage('token')
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState(null);

  // Initialize session/user on app start and subscribe to auth changes
  useEffect(() => {
    let mounted = true;

    const initAuth = async () => {
      try {
        const { data: sessionData } = await supabase.auth.getSession();
        const { data: userData } = await supabase.auth.getUser();

        if (!mounted) return;

        setUser(userData?.user ?? null);
        setRole(userData?.user?.user_metadata?.role ?? null);
        const accessToken = sessionData?.session?.access_token ?? null;
        setToken(accessToken ?? null);
        setLoading(false);
      } catch {
        if (!mounted) return;
        setUser(null);
        setRole(null);
        setToken(null);
        setLoading(false);
      }
    };

    initAuth();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setRole(session?.user?.user_metadata?.role ?? null);
      const accessToken = session?.access_token ?? null;
      setToken(accessToken ?? null);
      // localStorage('token') is already synced in supabase.js listener
    });

    return () => {
      mounted = false;
      // v2 returns { data: { subscription } }
      listener?.subscription?.unsubscribe?.();
    };
  }, []);

  const login = async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;

      setUser(data.user ?? null);
      setRole(data.user?.user_metadata?.role ?? null);
      const accessToken = data.session?.access_token ?? null;
      setToken(accessToken ?? null);

      return { success: true };
    } catch (err) {
      return { success: false, error: err.message || 'Login failed' };
    }
  };

  const register = async (email, password, name, roleValue = 'student') => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { name, role: roleValue } }
      });
      if (error) throw error;

      // If email confirmation is required, there will be no session
      const requiresEmailConfirmation = !data.session;

      // If session exists, user is logged in already
      if (data.session) {
        setUser(data.user ?? null);
        setRole(data.user?.user_metadata?.role ?? roleValue ?? null);
        const accessToken = data.session?.access_token ?? null;
        setToken(accessToken ?? null);
      }

      return { success: true, requiresEmailConfirmation };
    } catch (err) {
      return { success: false, error: err.message || 'Registration failed' };
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
    } catch {
      // ignore logout errors for UX simplicity
    } finally {
      setUser(null);
      setRole(null);
      setToken(null);
      localStorage.removeItem('token');
    }
  };

  const redirectToTasks = () => {
    window.location.href = '/tasks';
  };

  const value = {
    user,
    token,
    role,
    loading,
    login,
    register,
    logout,
    redirectToTasks,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
