import { useState, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';

const API_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000/api';

export function useSubmissions() {
  const { session } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getSubmissions = useCallback(async (assignmentId) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/submissions/assignment/${assignmentId}`, {
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        }
      });
      if (!response.ok) throw new Error('Error fetching submissions');
      return await response.json();
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [session]);

  const submitAssignment = async (data) => {
    // data: { assignment_id, file_url, group_id }
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/submissions/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify(data)
      });
      if (!response.ok) {
          const resJson = await response.json();
          throw new Error(resJson.error || 'Error submitting assignment');
      }
      return await response.json();
    } finally {
      setLoading(false);
    }
  };

  const gradeSubmission = async (submissionId, gradeData) => {
    // gradeData: { grade, feedback }
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/submissions/grade/${submissionId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify(gradeData)
      });
      if (!response.ok) throw new Error('Error grading submission');
      return await response.json();
    } finally {
      setLoading(false);
    }
  };

  return { getSubmissions, submitAssignment, gradeSubmission, loading, error };
}
