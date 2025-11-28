import { useState, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import apiClient from '../shared/api/client';

export function useCourseGroups() {
  const { session } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getGroups = useCallback(async (courseId) => {
    setLoading(true);
    try {
      const response = await apiClient.get(`/groups/course/${courseId}`);
      return response.data;
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
      const response = await apiClient.post('/groups', data);
      return response.data;
    } finally {
      setLoading(false);
    }
  };

  const addMember = async (groupId, studentId) => {
    setLoading(true);
    try {
      const response = await apiClient.post('/groups/add-member', { groupId, studentId });
      return response.data;
    } catch (err) {
      const message = err.response?.data?.error || err.message || 'Error adding member';
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  const getStudentGroups = useCallback(async () => {
    setLoading(true);
    try {
      const response = await apiClient.get('/groups/student');
      return response.data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [session]);

  const getGroupDetails = useCallback(async (groupId) => {
    setLoading(true);
    try {
      const response = await apiClient.get(`/groups/${groupId}`);
      return response.data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [session]);

  const removeMember = async (groupId, studentId) => {
    setLoading(true);
    try {
      const response = await apiClient.delete(`/groups/${groupId}/members/${studentId}`);
      return response.data;
    } catch (err) {
      const message = err.response?.data?.error || err.message || 'Error removing member';
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  return { getGroups, createGroup, addMember, getStudentGroups, getGroupDetails, removeMember, loading, error };
}
