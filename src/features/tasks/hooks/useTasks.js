// Custom hook for task management using Supabase (RLS)
import { useState, useEffect, useCallback } from 'react';
import { supabase, getCurrentUser } from '../../../shared/api/supabase';

export const useTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Build a Supabase query with optional filters
  const buildTasksQuery = (filters = {}) => {
    let query = supabase
      .from('tasks')
      .select('*')
      .order('created_at', { ascending: false });

    if (filters.categoryId) {
      query = query.eq('category_id', Number(filters.categoryId));
    }
    if (filters.priorityId) {
      query = query.eq('priority_id', Number(filters.priorityId));
    }
    if (filters.completed !== undefined && filters.completed !== null && filters.completed !== '') {
      query = query.eq('completed', String(filters.completed) === 'true' || filters.completed === true);
    }
    if (filters.searchText) {
      // Search in title OR description
      const text = String(filters.searchText).trim();
      if (text.length > 0) {
        query = query.or(`title.ilike.%${text}%,description.ilike.%${text}%`);
      }
    }
    if (filters.isOverdue) {
      query = query
        .lt('due_date', new Date().toISOString())
        .eq('completed', false);
    }

    return query;
  };

  // Fetch all tasks
  const fetchTasks = useCallback(async (filters = {}) => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await buildTasksQuery(filters);
      if (error) throw error;

      setTasks(Array.isArray(data) ? data : []);
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

      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;
      const userId = userData?.user?.id;
      if (!userId) throw new Error('User not authenticated');

      const payload = {
        title: taskData.title ?? '',
        description: taskData.description ?? null,
        due_date: taskData.due_date ?? null,
        priority_id: taskData.priority_id ?? 1,
        category_id: taskData.category_id ?? 1,
        completed: taskData.completed ?? false,
        parent_task_id: taskData.parent_task_id ?? null,
        user_id: userId, // Required by RLS policy (user_id = auth.uid())
      };

      const { data, error } = await supabase
        .from('tasks')
        .insert(payload)
        .select()
        .single();

      if (error) throw error;

      setTasks(prev => [data, ...prev]);
      return data;
    } catch (err) {
      console.error('Error creating task:', err);
      setError(err.message || 'Failed to create task');
      throw err;
    }
  }, []);

  // Update a task
  const updateTask = useCallback(async (taskId, updateData) => {
    try {
      setError(null);

      // Sanitize payload (do not allow changing user_id/id/created_at)
      const {
        id, user_id, created_at, updated_at,
        ...rest
      } = updateData || {};

      const { data, error } = await supabase
        .from('tasks')
        .update(rest)
        .eq('id', taskId)
        .select()
        .single();

      if (error) throw error;

      setTasks(prev => prev.map(task =>
        task.id === taskId ? data : task
      ));
      return data;
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

      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', taskId);

      if (error) throw error;

      setTasks(prev => prev.filter(task => task.id !== taskId));
    } catch (err) {
      console.error('Error deleting task:', err);
      setError(err.message || 'Failed to delete task');
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
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('parent_task_id', parentTaskId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      return data;
    } catch (err) {
      console.error('Error fetching subtasks:', err);
      throw err;
    }
  }, []);

  // Create subtask
  const createSubtask = useCallback(async (parentTaskId, subtaskData) => {
    try {
      const user = await getCurrentUser();
      if (!user?.id) throw new Error('User not authenticated');

      const payload = {
        title: subtaskData.title ?? '',
        description: subtaskData.description ?? null,
        due_date: subtaskData.due_date ?? null,
        priority_id: subtaskData.priority_id ?? 1,
        category_id: subtaskData.category_id ?? 1,
        completed: subtaskData.completed ?? false,
        user_id: user.id,
        parent_task_id: parentTaskId,
      };

      const { data, error } = await supabase
        .from('tasks')
        .insert(payload)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (err) {
      console.error('Error creating subtask:', err);
      throw err;
    }
  }, []);

  // Get overdue tasks
  const getOverdueTasks = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('completed', false)
        .lt('due_date', new Date().toISOString())
        .order('due_date', { ascending: true });

      if (error) throw error;
      return data;
    } catch (err) {
      console.error('Error fetching overdue tasks:', err);
      throw err;
    }
  }, []);

  // Get completed tasks today
  const getCompletedTasksToday = useCallback(async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('completed', true)
        .gte('updated_at', `${today}T00:00:00.000Z`)
        .lt('updated_at', `${today}T23:59:59.999Z`);

      if (error) throw error;
      return data;
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