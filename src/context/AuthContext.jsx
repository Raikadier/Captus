import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../shared/api/supabase';
import apiClient from '../shared/api/client';

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
           // Token is handled by onAuthStateChange in supabase.js, but we can ensure it here too
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

      // Sync user to backend (ensures public.users has the latest role/info)
      try {
        await apiClient.post('/users/sync');
      } catch (syncError) {
        console.error('Backend sync failed:', syncError);
        // We don't block login if sync fails, but we log it
      }

      return { success: true, data };
    } catch (err) {
      console.error('Login error:', err);
      return { success: false, error: err.message || 'Login failed' };
    }
  };

  const register = async (email, password, name) => {
    try {
      // Validate password strength
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
      if (!passwordRegex.test(password)) {
        return {
          success: false,
          error: 'La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula y un número'
        };
      }

      // First check if email is already registered in our users table
      try {
        const response = await fetch('/api/users/check-email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email })
        });

        if (response.ok) {
          const result = await response.json();
          if (result.registered) {
            return { success: false, error: 'Este email ya está registrado' };
          }
        }
      } catch (checkError) {
        console.warn('Could not check email registration:', checkError);
        // Continue with registration anyway
      }

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: name,
            display_name: name,
            full_name: name
          }
        }
      });

      if (error) {
        // Handle specific Supabase errors
        if (error.message && (
          error.message.includes('already registered') ||
          error.message.includes('already been registered') ||
          error.message.includes('User already registered')
        )) {
          return { success: false, error: 'Este email ya está registrado' };
        }
        throw error;
      }

      // If we have a session immediately (no email confirm required), sync to backend
      if (data.session) {
        try {
          await apiClient.post('/users/sync');
        } catch (syncError) {
          console.error('Backend sync failed during registration:', syncError);
        }
      }

      // If email confirmation is enabled in Supabase, session might be null
      const requiresEmailConfirmation = !data.session;

      return { success: true, requiresEmailConfirmation };
    } catch (err) {
      console.error('Registration error:', err);

      // Handle specific error messages
      if (err.message && (
        err.message.includes('already registered') ||
        err.message.includes('already been registered') ||
        err.message.includes('User already registered')
      )) {
        return { success: false, error: 'Este email ya está registrado' };
      }

      return { success: false, error: err.message || 'Error en el registro' };
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
    // This can be used by consumers to redirect after login
    // In a real app, you might use useNavigate() from react-router-dom
    // but since this context is often above Router or needs a hard redirect:
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