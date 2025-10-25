// Task service - migrated from C# BLL\TaskLogic.cs and DAL\TaskDAL.cs
import Task from '../models/task.js';
import Streak from '../models/streak.js';

class TaskService {
  constructor(supabase) {
    this.supabase = supabase;
  }

  // Create a new task
  async createTask(taskData, userId) {
    try {
      const task = new Task({
        ...taskData,
        user_id: userId,
        created_at: new Date(),
        updated_at: new Date()
      });

      const validation = task.validate();
      if (!validation.isValid) {
        throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
      }

      const { data, error } = await this.supabase
        .from('tasks')
        .insert(task.toDatabase())
        .select()
        .single();

      if (error) throw error;

      return Task.fromDatabase(data);
    } catch (error) {
      throw new Error(`Failed to create task: ${error.message}`);
    }
  }

  // Get task by ID
  async getTaskById(taskId, userId) {
    try {
      const { data, error } = await this.supabase
        .from('tasks')
        .select('*')
        .eq('id', taskId)
        .eq('user_id', userId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          throw new Error('Task not found');
        }
        throw error;
      }

      return Task.fromDatabase(data);
    } catch (error) {
      throw new Error(`Failed to get task: ${error.message}`);
    }
  }

  // Get all tasks for a user
  async getTasksByUser(userId, filters = {}) {
    try {
      let query = this.supabase
        .from('tasks')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      // Apply filters
      if (filters.categoryId) {
        query = query.eq('category_id', filters.categoryId);
      }

      if (filters.priorityId) {
        query = query.eq('priority_id', filters.priorityId);
      }

      if (filters.completed !== undefined) {
        query = query.eq('completed', filters.completed);
      }

      if (filters.searchText) {
        query = query.or(`title.ilike.%${filters.searchText}%,description.ilike.%${filters.searchText}%`);
      }

      if (filters.isOverdue) {
        query = query.lt('due_date', new Date().toISOString()).eq('completed', false);
      }

      const { data, error } = await query;

      if (error) throw error;

      return data.map(row => Task.fromDatabase(row));
    } catch (error) {
      throw new Error(`Failed to get tasks: ${error.message}`);
    }
  }

  // Update task
  async updateTask(taskId, updateData, userId) {
    try {
      // Get existing task
      const existingTask = await this.getTaskById(taskId, userId);

      // Create updated task
      const updatedTask = new Task({
        ...existingTask,
        ...updateData,
        updated_at: new Date()
      });

      const validation = updatedTask.validate();
      if (!validation.isValid) {
        throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
      }

      // Check business rules
      if (updatedTask.completed && !existingTask.completed) {
        // Task is being marked as completed - update streak
        await this.updateUserStreak(userId);
      } else if (!updatedTask.completed && existingTask.completed) {
        // Task is being unmarked - this might affect streak, but we'll keep it simple
        // In a more complex system, we might need to recalculate streak
      }

      const { data, error } = await this.supabase
        .from('tasks')
        .update(updatedTask.toDatabase())
        .eq('id', taskId)
        .eq('user_id', userId)
        .select()
        .single();

      if (error) throw error;

      return Task.fromDatabase(data);
    } catch (error) {
      throw new Error(`Failed to update task: ${error.message}`);
    }
  }

  // Delete task
  async deleteTask(taskId, userId) {
    try {
      // Check if task exists and belongs to user
      await this.getTaskById(taskId, userId);

      // Delete subtasks first
      await this.deleteSubtasksByParentTask(taskId, userId);

      const { error } = await this.supabase
        .from('tasks')
        .delete()
        .eq('id', taskId)
        .eq('user_id', userId);

      if (error) throw error;

      return true;
    } catch (error) {
      throw new Error(`Failed to delete task: ${error.message}`);
    }
  }

  // Create subtask
  async createSubtask(parentTaskId, subtaskData, userId) {
    try {
      // Verify parent task exists and belongs to user
      await this.getTaskById(parentTaskId, userId);

      const subtask = new Task({
        ...subtaskData,
        user_id: userId,
        parent_task_id: parentTaskId,
        created_at: new Date(),
        updated_at: new Date()
      });

      const validation = subtask.validate();
      if (!validation.isValid) {
        throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
      }

      const { data, error } = await this.supabase
        .from('tasks')
        .insert(subtask.toDatabase())
        .select()
        .single();

      if (error) throw error;

      return Task.fromDatabase(data);
    } catch (error) {
      throw new Error(`Failed to create subtask: ${error.message}`);
    }
  }

  // Get subtasks for a task
  async getSubtasks(parentTaskId, userId) {
    try {
      const { data, error } = await this.supabase
        .from('tasks')
        .select('*')
        .eq('parent_task_id', parentTaskId)
        .eq('user_id', userId)
        .order('created_at', { ascending: true });

      if (error) throw error;

      return data.map(row => Task.fromDatabase(row));
    } catch (error) {
      throw new Error(`Failed to get subtasks: ${error.message}`);
    }
  }

  // Delete subtasks by parent task
  async deleteSubtasksByParentTask(parentTaskId, userId) {
    try {
      const { error } = await this.supabase
        .from('tasks')
        .delete()
        .eq('parent_task_id', parentTaskId)
        .eq('user_id', userId);

      if (error) throw error;

      return true;
    } catch (error) {
      throw new Error(`Failed to delete subtasks: ${error.message}`);
    }
  }

  // Update user streak based on task completions
  async updateUserStreak(userId) {
    try {
      const today = new Date().toISOString().split('T')[0];

      // Get completed tasks today
      const { data: completedTasks, error: tasksError } = await this.supabase
        .from('tasks')
        .select('id')
        .eq('user_id', userId)
        .eq('completed', true)
        .gte('updated_at', `${today}T00:00:00.000Z`)
        .lt('updated_at', `${today}T23:59:59.999Z`);

      if (tasksError) throw tasksError;

      const hasCompletedToday = completedTasks.length > 0;

      // Get or create streak record
      let { data: streakData, error: streakError } = await this.supabase
        .from('streaks')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (streakError && streakError.code !== 'PGRST116') throw streakError;

      let streak;
      if (!streakData) {
        // Create new streak
        streak = new Streak({
          user_id: userId,
          current_streak: hasCompletedToday ? 1 : 0,
          last_completed_date: hasCompletedToday ? today : null,
          daily_goal: 5
        });

        const { data, error } = await this.supabase
          .from('streaks')
          .insert(streak.toDatabase())
          .select()
          .single();

        if (error) throw error;
        streak = Streak.fromDatabase(data);
      } else {
        // Update existing streak
        streak = Streak.fromDatabase(streakData);
        streak.updateStreak(hasCompletedToday);

        const { error } = await this.supabase
          .from('streaks')
          .update(streak.toDatabase())
          .eq('user_id', userId);

        if (error) throw error;
      }

      return streak;
    } catch (error) {
      console.error('Error updating streak:', error);
      // Don't throw error for streak updates - they're not critical
    }
  }

  // Get overdue tasks
  async getOverdueTasks(userId) {
    try {
      const { data, error } = await this.supabase
        .from('tasks')
        .select('*')
        .eq('user_id', userId)
        .eq('completed', false)
        .lt('due_date', new Date().toISOString())
        .order('due_date', { ascending: true });

      if (error) throw error;

      return data.map(row => Task.fromDatabase(row));
    } catch (error) {
      throw new Error(`Failed to get overdue tasks: ${error.message}`);
    }
  }

  // Get completed tasks today
  async getCompletedTasksToday(userId) {
    try {
      const today = new Date().toISOString().split('T')[0];

      const { data, error } = await this.supabase
        .from('tasks')
        .select('*')
        .eq('user_id', userId)
        .eq('completed', true)
        .gte('updated_at', `${today}T00:00:00.000Z`)
        .lt('updated_at', `${today}T23:59:59.999Z`);

      if (error) throw error;

      return data.map(row => Task.fromDatabase(row));
    } catch (error) {
      throw new Error(`Failed to get completed tasks today: ${error.message}`);
    }
  }
}

export default TaskService;