// Custom hook for task management (DEMO MODE)
import { useState, useEffect, useCallback } from 'react';

// Mock data for demo mode
const MOCK_TASKS = [
  {
    id: 1,
    title: 'Completar reporte de matemáticas',
    description: 'Revisar y entregar el reporte final del semestre',
    completed: false,
    priority: 'alta',
    due_date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    created_at: new Date().toISOString()
  },
  {
    id: 2,
    title: 'Estudiar para examen de historia',
    description: 'Repasar temas del siglo XIX',
    completed: false,
    priority: 'media',
    due_date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    created_at: new Date().toISOString()
  },
  {
    id: 3,
    title: 'Proyecto de programación',
    description: 'Finalizar aplicación de gestión de tareas',
    completed: true,
    priority: 'alta',
    due_date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    created_at: new Date().toISOString()
  }
];

export const useTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all tasks (MOCK)
  const fetchTasks = useCallback(async (filters = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Return mock data
      setTasks(MOCK_TASKS);
    } catch (err) {
      setError('Error al cargar tareas');
      console.error('Error fetching tasks:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Create a new task (MOCK)
  const createTask = useCallback(async (taskData) => {
    try {
      setError(null);
      const newTask = {
        id: Date.now(),
        ...taskData,
        created_at: new Date().toISOString()
      };
      setTasks(prev => [newTask, ...prev]);
      return newTask;
    } catch (err) {
      setError('Error al crear tarea');
      throw err;
    }
  }, []);

  // Update a task (MOCK)
  const updateTask = useCallback(async (taskId, updateData) => {
    try {
      setError(null);
      const updatedTask = {
        ...tasks.find(t => t.id === taskId),
        ...updateData,
        updated_at: new Date().toISOString()
      };
      setTasks(prev => prev.map(task =>
        task.id === taskId ? updatedTask : task
      ));
      return updatedTask;
    } catch (err) {
      setError('Error al actualizar tarea');
      throw err;
    }
  }, [tasks]);

  // Delete a task (MOCK)
  const deleteTask = useCallback(async (taskId) => {
    try {
      setError(null);
      setTasks(prev => prev.filter(task => task.id !== taskId));
    } catch (err) {
      setError('Error al eliminar tarea');
      throw err;
    }
  }, []);

  // Toggle task completion
  const toggleTaskCompletion = useCallback(async (taskId, completed) => {
    return updateTask(taskId, { completed: !completed });
  }, [updateTask]);

  // Get subtasks for a task (MOCK)
  const getSubtasks = useCallback(async (parentTaskId) => {
    try {
      // Return empty array for demo
      return [];
    } catch (err) {
      console.error('Error fetching subtasks:', err);
      throw err;
    }
  }, []);

  // Create subtask (MOCK)
  const createSubtask = useCallback(async (parentTaskId, subtaskData) => {
    try {
      const subtask = {
        id: Date.now(),
        ...subtaskData,
        parent_task_id: parentTaskId,
        created_at: new Date().toISOString()
      };
      return subtask;
    } catch (err) {
      console.error('Error creating subtask:', err);
      throw err;
    }
  }, []);

  // Get overdue tasks (MOCK)
  const getOverdueTasks = useCallback(async () => {
    try {
      return tasks.filter(task => !task.completed && new Date(task.due_date) < new Date());
    } catch (err) {
      console.error('Error fetching overdue tasks:', err);
      throw err;
    }
  }, [tasks]);

  // Get completed tasks today (MOCK)
  const getCompletedTasksToday = useCallback(async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      return tasks.filter(task => 
        task.completed && 
        task.updated_at && 
        task.updated_at.split('T')[0] === today
      );
    } catch (err) {
      console.error('Error fetching completed tasks today:', err);
      throw err;
    }
  }, [tasks]);

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