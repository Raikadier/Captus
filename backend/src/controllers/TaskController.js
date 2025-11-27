import TaskService from "../services/TaskService.js";
import NotificationService from '../services/NotificationService.js';

const taskService = new TaskService();

export class TaskController {
  constructor() {
    // Middleware removed as Service is stateless.
    // Kept for compatibility if routes call it, but it does nothing.
    this.injectUser = (req, res, next) => {
      // No-op
      next();
    };
  }

  async getAll(req, res) {
    if (!req.user || !req.user.id) return res.status(401).json({ success: false, message: "Unauthorized" });
    const result = await taskService.getAll(req.user.id);
    res.status(result.success ? 200 : 401).json(result);
  }

  async getById(req, res) {
    if (!req.user || !req.user.id) return res.status(401).json({ success: false, message: "Unauthorized" });
    const { id } = req.params;
    const result = await taskService.getById(parseInt(id), req.user.id);
    res.status(result.success ? 200 : 404).json(result);
  }

  async getByUser(req, res) {
    if (!req.user || !req.user.id) return res.status(401).json({ success: false, message: "Unauthorized" });
    // 'getByUser' is usually alias for 'getAll' in this context
    const result = await taskService.getAll(req.user.id);
    res.status(result.success ? 200 : 401).json(result);
  }

  async create(req, res) {
    if (!req.user || !req.user.id) return res.status(401).json({ success: false, message: "Unauthorized" });

    // Pass user.id and email
    const result = await taskService.create(req.body, req.user.id, req.user.email);

    if (result.success) {
      // Auto-notification
      try {
        await NotificationService.notify({
          user_id: req.user.id,
          title: 'Tarea Creada',
          body: `Has creado la tarea: "${result.data.title}"`,
          event_type: 'task_created',
          entity_id: result.data.id || result.data.id_Task,
          is_auto: true
        });
      } catch (err) {
        console.error("Error in auto-notification:", err);
      }
    }

    res.status(result.success ? 201 : 400).json(result);
  }

  async update(req, res) {
    if (!req.user || !req.user.id) return res.status(401).json({ success: false, message: "Unauthorized" });
    const { id } = req.params;
    const result = await taskService.update(parseInt(id), req.body, req.user.id, req.user.email);
    res.status(result.success ? 200 : 400).json(result);
  }

  async delete(req, res) {
    if (!req.user || !req.user.id) return res.status(401).json({ success: false, message: "Unauthorized" });
    const { id } = req.params;
    const result = await taskService.delete(parseInt(id), req.user.id);
    res.status(result.success ? 200 : 400).json(result);
  }

  async complete(req, res) {
    if (!req.user || !req.user.id) return res.status(401).json({ success: false, message: "Unauthorized" });
    const { id } = req.params;
    const result = await taskService.complete(parseInt(id), req.user.id, req.user.email);
    res.status(result.success ? 200 : 400).json(result);
  }

  async deleteByCategory(req, res) {
    // Warning: DeleteByCategory needs safety checks!
    const { categoryId } = req.params;
    // We should ideally pass userId here to ensure we only delete user's tasks
    const result = await taskService.deleteByCategory(parseInt(categoryId));
    res.status(result.success ? 200 : 400).json(result);
  }

  async getPending(req, res) {
    if (!req.user || !req.user.id) return res.status(401).json({ success: false, message: "Unauthorized" });
    const limit = parseInt(req.query.limit) || 3;
    const result = await taskService.getPendingTasks(req.user.id, limit);
    res.status(result.success ? 200 : 400).json(result);
  }
}
