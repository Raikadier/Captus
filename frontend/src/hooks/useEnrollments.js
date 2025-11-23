import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const API_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000/api';

export function useEnrollments() {
  const { session } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const joinByCode = async (code) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/enrollments/join-by-code`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({ code })
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Error al unirse al curso');
      }
      return await response.json();
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getStudents = async (courseId) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/enrollments/course/${courseId}/students`, {
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        }
      });
      if (!response.ok) throw new Error('Error obteniendo estudiantes');
      return await response.json();
    } catch (err) {
        throw err;
    } finally {
        setLoading(false);
    }
  };

  const addStudentManually = async (courseId, email) => {
      setLoading(true);
      try {
        const response = await fetch(`${API_URL}/enrollments/add-student`, {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.access_token}`
            },
            body: JSON.stringify({ courseId, email })
        });

        if (!response.ok) {
            const data = await response.json();
            throw new Error(data.error || 'Error agregando estudiante');
        }
        return await response.json();
      } catch (err) {
          throw err;
      } finally {
          setLoading(false);
      }
  };

  return { joinByCode, getStudents, addStudentManually, loading, error };
}
