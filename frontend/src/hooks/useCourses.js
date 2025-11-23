import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const API_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000/api';

export function useCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { session, user } = useAuth();

  // Helper to determine if we should fetch teacher or student courses
  const role = user?.user_metadata?.role || 'student';

  const fetchCourses = async () => {
    if (!session?.access_token) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const endpoint = role === 'teacher' ? '/courses/teacher' : '/courses/student';
      const response = await fetch(`${API_URL}${endpoint}`, {
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        }
      });

      if (!response.ok) throw new Error('Error fetching courses');
      const data = await response.json();
      setCourses(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const createCourse = async (courseData) => {
     const response = await fetch(`${API_URL}/courses`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify(courseData)
      });

      if (!response.ok) {
         const error = await response.json();
         throw new Error(error.error || 'Error creando curso');
      }

      await fetchCourses(); // Refresh list
      return await response.json();
  };

  const getCourse = async (id) => {
     const response = await fetch(`${API_URL}/courses/${id}`, {
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        }
      });
      if (!response.ok) throw new Error('Error fetching course detail');
      return await response.json();
  };

  useEffect(() => {
    fetchCourses();
  }, [session, role]);

  return { courses, loading, error, refresh: fetchCourses, createCourse, getCourse };
}
