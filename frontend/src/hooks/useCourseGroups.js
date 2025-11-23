import { useState, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';

const API_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000/api';

export function useCourseGroups() {
  const { session } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getGroups = useCallback(async (courseId) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/groups/course/${courseId}`, {
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        }
      });
      if (!response.ok) throw new Error('Error fetching groups');
      return await response.json();
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [session]);

  const createGroup = async (data) => {
    // data: { course_id, name, description }
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/groups`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error('Error creating group');
      return await response.json();
    } finally {
      setLoading(false);
    }
  };

  const addMember = async (groupId, studentId) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/groups/add-member`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({ groupId, studentId })
      });
      if (!response.ok) {
          const res = await response.json();
          throw new Error(res.error || 'Error adding member');
      }
      return await response.json();
    } finally {
      setLoading(false);
    }
  };

  return { getGroups, createGroup, addMember, loading, error };
}
