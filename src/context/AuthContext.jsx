import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../shared/api/supabase';
// import apiClient from '../shared/api/client'; // Removed unused import

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
  const [loading, setLoading] = useState(true);

  // Initialize session/user on app start and subscribe to auth changes
  useEffect(() => {
    let mounted = true;

    const initAuth = async () => {
      try {
        // Check for existing session
        const { data: sessionData } = await supabase.auth.getSession();

        if (!mounted) return;

        if (sessionData?.session?.user) {
           setUser(sessionData.session.user);
           localStorage.setItem('token', sessionData.session.access_token);
        } else {
           setUser(null);
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        if (mounted) setUser(null);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    initAuth();

    // Subscribe to auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        setUser(session.user);
      } else {
        setUser(null);
      }

      // Note: Token management (localStorage) is centralized in shared/api/supabase.js
      // so we don't need to duplicate it here, just react to user state.
    });

    return () => {
      mounted = false;
      subscription?.unsubscribe();
    };
  }, []);

  const login = async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      return { success: true, data };
    } catch (err) {
      console.error('Login error:', err);
      return { success: false, error: err.message || 'Login failed' };
    }
  };

  const register = async (email, password, name, role = 'student') => {
    try {
      // Create user in Supabase Auth with role in metadata
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { name, role }
        }
      });
      if (error) throw error;

      // If email confirmation is enabled in Supabase, session might be null
      const requiresEmailConfirmation = !data.session;

      return { success: true, requiresEmailConfirmation };
    } catch (err) {
      console.error('Registration error:', err);
      return { success: false, error: err.message || 'Registration failed' };
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      // localStorage clearing is handled by supabase.js onAuthStateChange
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const redirectToTasks = () => {
    window.location.href = '/tasks';
  };

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    redirectToTasks,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
