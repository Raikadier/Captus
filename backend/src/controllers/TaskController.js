import { TaskService } from "../services/TaskService.js";
import NotificationService from '../services/NotificationService.js';

const taskService = new TaskService();

export class TaskController {
  constructor() {
    // Middleware para inyectar usuario en el servicio
    this.injectUser = (req, res, next) => {
      if (req.user) {
        taskService.setCurrentUser(req.user);
      }
      next();
    };
  }

  async getAll(req, res) {
    const result = await taskService.getAll();
    res.status(result.success ? 200 : 401).json(result);
  }

  async getById(req, res) {
    const { id } = req.params;
    const result = await taskService.getById(parseInt(id));
    res.status(result.success ? 200 : 404).json(result);
  }

  async getByUser(req, res) {
    const result = await taskService.getByUser();
    res.status(result.success ? 200 : 401).json(result);
  }

  async create(req, res) {
    const result = await taskService.save(req.body, req.user);

    if (result.success) {
      // Auto-notification
      await NotificationService.notify({
        user_id: req.user.id,
        title: 'Tarea Creada',
        body: `Has creado la tarea: "${result.data.title}"`,
        event_type: 'task_created',
        entity_id: result.data.id || result.data.id_Task,
        is_auto: true
      });
    }

    res.status(result.success ? 201 : 400).json(result);
  }

  async update(req, res) {
    const { id } = req.params;
    const taskData = { ...req.body, id_Task: parseInt(id) };
    const result = await taskService.update(taskData);
    res.status(result.success ? 200 : 400).json(result);
  }

  async delete(req, res) {
    const { id } = req.params;
    const result = await taskService.delete(parseInt(id));
    res.status(result.success ? 200 : 400).json(result);
  }

  async complete(req, res) {
    const { id } = req.params;
    const result = await taskService.complete(parseInt(id));
    res.status(result.success ? 200 : 400).json(result);
  }

  async deleteByCategory(req, res) {
    const { categoryId } = req.params;
    const result = await taskService.deleteByCategory(parseInt(categoryId));
    res.status(result.success ? 200 : 400).json(result);
  }

  async getPending(req, res) {
    const limit = parseInt(req.query.limit) || 3;
    const result = await taskService.getPendingTasks(limit);
    res.status(result.success ? 200 : 400).json(result);
  }
}