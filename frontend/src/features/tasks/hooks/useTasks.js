// Custom hook for task management using Supabase (RLS)
import { useState, useEffect, useCallback } from 'react';
import apiClient from '../../../shared/api/client';
import { useAuth } from '../../../context/AuthContext';

export const useTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  // Normaliza la tarea recibida desde el backend
  const normalizeTask = (task) => ({
    id: task.id_Task ?? task.id ?? task.id_task,
    title: task.title,
    description: task.description,
    due_date: task.endDate ?? task.due_date,
    priority_id: task.id_Priority ?? task.priority_id,
    category_id: task.id_Category ?? task.category_id,
    completed: task.state ?? task.completed,
    created_at: task.creationDate ?? task.created_at,
    updated_at: task.updatedAt ?? task.updated_at,
  });

  // Fetch all tasks
  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await apiClient.get('/tasks');
      const list = Array.isArray(data?.data) ? data.data : Array.isArray(data) ? data : [];
      setTasks(list.map(normalizeTask));
    } catch (err) {
      console.error('Error fetching tasks:', err);
      setError(err.message || 'Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  }, []);

  // Create a new task
  const createTask = useCallback(async (taskData) => {
    try {
      setError(null);
      if (!user?.id) throw new Error('User not authenticated');

      const payload = {
        title: taskData.title ?? '',
        description: taskData.description ?? null,
        endDate: taskData.due_date ?? taskData.endDate ?? null,
        id_Priority: taskData.priority_id ?? taskData.id_Priority ?? null,
        id_Category: taskData.category_id ?? taskData.id_Category ?? null,
        state: taskData.completed ?? false,
        parentTaskId: taskData.parent_task_id ?? taskData.parentTaskId ?? null,
        id_User: user.id,
      };

      const { data } = await apiClient.post('/tasks', payload);
      if (!data?.success) throw new Error(data?.message || 'Error creando tarea');
      const created = normalizeTask(data.data);
      setTasks(prev => [created, ...prev]);
      return created;
    } catch (err) {
      console.error('Error creating task:', err);
      setError(err.message || 'Failed to create task');
      throw err;
    }
  }, [user?.id]);

  // Update a task
  const updateTask = useCallback(async (taskId, updateData) => {
    try {
      setError(null);
      const payload = {
        ...updateData,
        endDate: updateData?.due_date ?? updateData?.endDate ?? null,
        id_Priority: updateData?.priority_id ?? updateData?.id_Priority ?? null,
        id_Category: updateData?.category_id ?? updateData?.id_Category ?? null,
      };
      const { data } = await apiClient.put(`/tasks/${taskId}`, payload);
      if (!data?.success) throw new Error(data?.message || 'Error actualizando tarea');
      const updated = normalizeTask(data.data);
      setTasks(prev => prev.map(task => (task.id === taskId ? updated : task)));
      return updated;
    } catch (err) {
      console.error('Error updating task:', err);
      setError(err.message || 'Failed to update task');
      throw err;
    }
  }, []);

  // Delete a task
  const deleteTask = useCallback(async (taskId) => {
    try {
      setError(null);
      const { data } = await apiClient.delete(`/tasks/${taskId}`);
      if (data?.success === false) throw new Error(data?.message || 'Error al eliminar');
      setTasks(prev => prev.filter(task => task.id !== taskId));
    } catch (err) {
      console.error('Error deleting task:', err);
      setError(err.message || 'Failed to delete task');
      throw err;
    }
  }, []);

  // Toggle task completion
  const toggleTaskCompletion = useCallback(async (taskId) => {
    try {
      const { data } = await apiClient.put(`/tasks/${taskId}/complete`);
      if (!data?.success) throw new Error(data?.message || 'Error actualizando tarea');
      const updated = normalizeTask(data.data);
      setTasks(prev => prev.map(task => (task.id === taskId ? updated : task)));
      return updated;
    } catch (err) {
      console.error('Error toggling task:', err);
      setError(err.message || 'Failed to toggle task');
      throw err;
    }
  }, []);

  // Get overdue tasks
  const getOverdueTasks = useCallback(async () => {
    const { data } = await apiClient.get('/tasks?overdue=true');
    return Array.isArray(data?.data) ? data.data.map(normalizeTask) : [];
  }, []);

  // Get completed tasks today
  const getCompletedTasksToday = useCallback(async () => {
    const { data } = await apiClient.get('/tasks?completedToday=true');
    return Array.isArray(data?.data) ? data.data.map(normalizeTask) : [];
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
    getOverdueTasks,
    getCompletedTasksToday,
    refetch: fetchTasks
  };
};
