// Task controller - handles HTTP requests for tasks
import TaskService from '../services/taskService.js';

class TaskController {
  constructor(supabase) {
    this.taskService = new TaskService(supabase);
  }

  // GET /api/tasks
  async getTasks(req, res) {
    try {
      const userId = req.user.id;
      const { categoryId, priorityId, completed, searchText, isOverdue } = req.query;

      const filters = {};
      if (categoryId) filters.categoryId = parseInt(categoryId);
      if (priorityId) filters.priorityId = parseInt(priorityId);
      if (completed !== undefined) filters.completed = completed === 'true';
      if (searchText) filters.searchText = searchText;
      if (isOverdue) filters.isOverdue = isOverdue === 'true';

      const tasks = await this.taskService.getTasksByUser(userId, filters);
      res.json(tasks);
    } catch (error) {
      console.error('Error getting tasks:', error);
      res.status(500).json({ error: 'Failed to retrieve tasks' });
    }
  }

  // GET /api/tasks/:id
  async getTaskById(req, res) {
    try {
      const taskId = parseInt(req.params.id);
      const userId = req.user.id;

      const task = await this.taskService.getTaskById(taskId, userId);
      res.json(task);
    } catch (error) {
      console.error('Error getting task:', error);
      if (error.message === 'Task not found') {
        res.status(404).json({ error: 'Task not found' });
      } else {
        res.status(500).json({ error: 'Failed to retrieve task' });
      }
    }
  }

  // POST /api/tasks
  async createTask(req, res) {
    try {
      const userId = req.user.id;
      const taskData = req.body;

      const task = await this.taskService.createTask(taskData, userId);
      res.status(201).json(task);
    } catch (error) {
      console.error('Error creating task:', error);
      res.status(500).json({ error: 'Failed to create task' });
    }
  }

  // PUT /api/tasks/:id
  async updateTask(req, res) {
    try {
      const taskId = parseInt(req.params.id);
      const userId = req.user.id;
      const updateData = req.body;

      const task = await this.taskService.updateTask(taskId, updateData, userId);
      res.json(task);
    } catch (error) {
      console.error('Error updating task:', error);
      if (error.message === 'Task not found') {
        res.status(404).json({ error: 'Task not found' });
      } else {
        res.status(500).json({ error: 'Failed to update task' });
      }
    }
  }

  // DELETE /api/tasks/:id
  async deleteTask(req, res) {
    try {
      const taskId = parseInt(req.params.id);
      const userId = req.user.id;

      await this.taskService.deleteTask(taskId, userId);
      res.status(204).send();
    } catch (error) {
      console.error('Error deleting task:', error);
      if (error.message === 'Task not found') {
        res.status(404).json({ error: 'Task not found' });
      } else {
        res.status(500).json({ error: 'Failed to delete task' });
      }
    }
  }

  // POST /api/tasks/:id/subtasks
  async createSubtask(req, res) {
    try {
      const parentTaskId = parseInt(req.params.id);
      const userId = req.user.id;
      const subtaskData = req.body;

      const subtask = await this.taskService.createSubtask(parentTaskId, subtaskData, userId);
      res.status(201).json(subtask);
    } catch (error) {
      console.error('Error creating subtask:', error);
      res.status(500).json({ error: 'Failed to create subtask' });
    }
  }

  // GET /api/tasks/:id/subtasks
  async getSubtasks(req, res) {
    try {
      const parentTaskId = parseInt(req.params.id);
      const userId = req.user.id;

      const subtasks = await this.taskService.getSubtasks(parentTaskId, userId);
      res.json(subtasks);
    } catch (error) {
      console.error('Error getting subtasks:', error);
      res.status(500).json({ error: 'Failed to retrieve subtasks' });
    }
  }

  // GET /api/tasks/overdue
  async getOverdueTasks(req, res) {
    try {
      const userId = req.user.id;
      const tasks = await this.taskService.getOverdueTasks(userId);
      res.json(tasks);
    } catch (error) {
      console.error('Error getting overdue tasks:', error);
      res.status(500).json({ error: 'Failed to retrieve overdue tasks' });
    }
  }

  // GET /api/tasks/completed-today
  async getCompletedTasksToday(req, res) {
    try {
      const userId = req.user.id;
      const tasks = await this.taskService.getCompletedTasksToday(userId);
      res.json(tasks);
    } catch (error) {
      console.error('Error getting completed tasks today:', error);
      res.status(500).json({ error: 'Failed to retrieve completed tasks' });
    }
  }
}

export default TaskController;