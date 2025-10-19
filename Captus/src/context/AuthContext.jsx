import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

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
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  // Set up axios defaults
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [token]);

  // Check if user is logged in on app start
  useEffect(() => {
    const checkAuth = async () => {
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        try {
          // Verify token with backend
          const response = await axios.get('/api/auth/verify', {
            headers: { Authorization: `Bearer ${storedToken}` }
          });
          setToken(storedToken);
          setUser(response.data.user);
        } catch (error) {
          localStorage.removeItem('token');
          setToken(null);
          setUser(null);
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await axios.post('/api/auth/login', { email, password });
      const { user, token } = response.data;

      setUser(user);
      setToken(token);
      localStorage.setItem('token', token);

      return { success: true };
    } catch (error) {
      return { success: false, error: error.response?.data?.error || 'Login failed' };
    }
  };

  const redirectToTasks = () => {
    window.location.href = '/tasks';
  };

  const register = async (email, password, name) => {
    try {
      const response = await axios.post('/api/auth/register', { email, password, name });
      const { user, session } = response.data;

      if (session) {
        // User is auto-logged in after registration - get token from login
        const loginResponse = await axios.post('/api/auth/login', { email, password });
        const { token } = loginResponse.data;

        setUser(user);
        setToken(token);
        localStorage.setItem('token', token);
      }

      return { success: true, requiresEmailConfirmation: !session };
    } catch (error) {
      return { success: false, error: error.response?.data?.error || 'Registration failed' };
    }
  };

  const logout = async () => {
    try {
      await axios.post('/api/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      setToken(null);
      localStorage.removeItem('token');
    }
  };

  const value = {
    user,
    token,
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