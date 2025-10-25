// Custom hook for task management
import { useState, useEffect, useCallback } from 'react';
import apiClient from '../../../shared/api/client';

export const useTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all tasks
  const fetchTasks = useCallback(async (filters = {}) => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, value);
        }
      });

      const response = await apiClient.get(`/tasks?${params}`);
      setTasks(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch tasks');
      console.error('Error fetching tasks:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Create a new task
  const createTask = useCallback(async (taskData) => {
    try {
      setError(null);
      const response = await apiClient.post('/tasks', taskData);
      setTasks(prev => [response.data, ...prev]);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create task');
      throw err;
    }
  }, []);

  // Update a task
  const updateTask = useCallback(async (taskId, updateData) => {
    try {
      setError(null);
      const response = await apiClient.put(`/tasks/${taskId}`, updateData);
      setTasks(prev => prev.map(task =>
        task.id === taskId ? response.data : task
      ));
      return response.data;
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update task');
      throw err;
    }
  }, []);

  // Delete a task
  const deleteTask = useCallback(async (taskId) => {
    try {
      setError(null);
      await apiClient.delete(`/tasks/${taskId}`);
      setTasks(prev => prev.filter(task => task.id !== taskId));
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to delete task');
      throw err;
    }
  }, []);

  // Toggle task completion
  const toggleTaskCompletion = useCallback(async (taskId, completed) => {
    return updateTask(taskId, { completed: !completed });
  }, [updateTask]);

  // Get subtasks for a task
  const getSubtasks = useCallback(async (parentTaskId) => {
    try {
      const response = await apiClient.get(`/tasks/${parentTaskId}/subtasks`);
      return response.data;
    } catch (err) {
      console.error('Error fetching subtasks:', err);
      throw err;
    }
  }, []);

  // Create subtask
  const createSubtask = useCallback(async (parentTaskId, subtaskData) => {
    try {
      const response = await apiClient.post(`/tasks/${parentTaskId}/subtasks`, subtaskData);
      return response.data;
    } catch (err) {
      console.error('Error creating subtask:', err);
      throw err;
    }
  }, []);

  // Get overdue tasks
  const getOverdueTasks = useCallback(async () => {
    try {
      const response = await apiClient.get('/tasks/overdue');
      return response.data;
    } catch (err) {
      console.error('Error fetching overdue tasks:', err);
      throw err;
    }
  }, []);

  // Get completed tasks today
  const getCompletedTasksToday = useCallback(async () => {
    try {
      const response = await apiClient.get('/tasks/completed-today');
      return response.data;
    } catch (err) {
      console.error('Error fetching completed tasks today:', err);
      throw err;
    }
  }, []);

  // Load tasks on mount
  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  return {
    tasks,
    loading,
    error,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
    toggleTaskCompletion,
    getSubtasks,
    createSubtask,
    getOverdueTasks,
    getCompletedTasksToday,
    refetch: fetchTasks
  };
};