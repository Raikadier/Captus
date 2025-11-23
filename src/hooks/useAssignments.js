import { useState, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';

const API_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000/api';

export function useAssignments() {
  const { session } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getAssignments = useCallback(async (courseId) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/assignments/course/${courseId}`, {
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        }
      });
      if (!response.ok) throw new Error('Error fetching assignments');
      return await response.json();
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [session]);

  const getAssignment = useCallback(async (id) => {
      setLoading(true);
      try {
        const response = await fetch(`${API_URL}/assignments/${id}`, {
            headers: {
            'Authorization': `Bearer ${session.access_token}`
            }
        });
        if (!response.ok) throw new Error('Error fetching assignment');
        return await response.json();
      } finally {
          setLoading(false);
      }
  }, [session]);

  const createAssignment = async (data) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/assignments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error('Error creating assignment');
      return await response.json();
    } finally {
      setLoading(false);
    }
  };

  const updateAssignment = async (id, data) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/assignments/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error('Error updating assignment');
      return await response.json();
    } finally {
      setLoading(false);
    }
  };

  const deleteAssignment = async (id) => {
      setLoading(true);
      try {
        const response = await fetch(`${API_URL}/assignments/${id}`, {
            method: 'DELETE',
            headers: {
            'Authorization': `Bearer ${session.access_token}`
            }
        });
        if (!response.ok) throw new Error('Error deleting assignment');
      } finally {
          setLoading(false);
      }
  };

  return { getAssignments, getAssignment, createAssignment, updateAssignment, deleteAssignment, loading, error };
}
