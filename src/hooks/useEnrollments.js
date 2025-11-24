import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import apiClient from '../shared/api/client';

export function useEnrollments() {
  const { session } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const joinByCode = async (code) => {
    setLoading(true);
    try {
      const response = await apiClient.post('/enrollments/join-by-code', { code });
      return response.data;
    } catch (err) {
      const message = err.response?.data?.error || err.message || 'Error al unirse al curso';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  const getStudents = async (courseId) => {
    setLoading(true);
    try {
      const response = await apiClient.get(`/enrollments/course/${courseId}/students`);
      return response.data;
    } catch (err) {
        throw err;
    } finally {
        setLoading(false);
    }
  };

  const addStudentManually = async (courseId, email) => {
      setLoading(true);
      try {
        const response = await apiClient.post('/enrollments/add-student', { courseId, email });
        return response.data;
      } catch (err) {
          const message = err.response?.data?.error || err.message || 'Error agregando estudiante';
          throw new Error(message);
      } finally {
          setLoading(false);
      }
  };

  return { joinByCode, getStudents, addStudentManually, loading, error };
}
