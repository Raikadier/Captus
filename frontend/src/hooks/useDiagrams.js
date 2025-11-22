import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from '@context/AuthContext';

export function useDiagrams() {
  const [diagrams, setDiagrams] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };
  };

  const fetchDiagrams = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:4000/api/diagrams', getAuthHeaders());
      if (response.data.success) {
        setDiagrams(response.data.data);
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const createDiagram = async (data) => {
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:4000/api/diagrams', data, getAuthHeaders());
      if (response.data.success) {
        setDiagrams(prev => [response.data.data, ...prev]);
        return { success: true };
      }
      return { success: false, error: response.data.message };
    } catch (err) {
      return { success: false, error: err.response?.data?.message || err.message };
    } finally {
      setLoading(false);
    }
  };

  const updateDiagram = async (id, data) => {
    setLoading(true);
    try {
      const response = await axios.put(`http://localhost:4000/api/diagrams/${id}`, data, getAuthHeaders());
      if (response.data.success) {
        setDiagrams(prev => prev.map(d => d.id === id ? response.data.data : d));
        return { success: true };
      }
      return { success: false, error: response.data.message };
    } catch (err) {
      return { success: false, error: err.response?.data?.message || err.message };
    } finally {
      setLoading(false);
    }
  };

  const deleteDiagram = async (id) => {
    setLoading(true);
    try {
      const response = await axios.delete(`http://localhost:4000/api/diagrams/${id}`, getAuthHeaders());
      if (response.data.success) {
        setDiagrams(prev => prev.filter(d => d.id !== id));
        return { success: true };
      }
      return { success: false, error: response.data.message };
    } catch (err) {
      return { success: false, error: err.response?.data?.message || err.message };
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDiagrams();
  }, [fetchDiagrams]);

  return {
    diagrams,
    loading,
    error,
    refreshDiagrams: fetchDiagrams,
    createDiagram,
    updateDiagram,
    deleteDiagram
  };
}
