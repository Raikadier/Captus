// src/controllers/SubTaskController.js
import { SubTaskService } from "../services/SubTaskService.js";

const subTaskService = new SubTaskService();

export class SubTaskController {
  constructor() {
    // Middleware para inyectar usuario en el servicio
    this.injectUser = (req, res, next) => {
      if (req.user) {
        subTaskService.setCurrentUser(req.user);
      }
      next();
    };
  }

  async getAll(req, res) {
    const result = await subTaskService.getAll();
    res.status(result.success ? 200 : 401).json(result);
  }

  async getById(req, res) {
    const { id } = req.params;
    const result = await subTaskService.getById(parseInt(id));
    res.status(result.success ? 200 : 404).json(result);
  }

  async getByTask(req, res) {
    const { taskId } = req.params;
    const result = await subTaskService.getByTaskId(parseInt(taskId));
    res.status(result.success ? 200 : 404).json(result);
  }

  async create(req, res) {
    const result = await subTaskService.create(req.body);
    res.status(result.success ? 201 : 400).json(result);
  }

  async update(req, res) {
    const { id } = req.params;
    const subTaskData = { ...req.body, id_SubTask: parseInt(id) };
    const result = await subTaskService.update(subTaskData);
    res.status(result.success ? 200 : 400).json(result);
  }

  async delete(req, res) {
    const { id } = req.params;
    const result = await subTaskService.delete(parseInt(id));
    res.status(result.success ? 200 : 400).json(result);
  }

  async complete(req, res) {
    const { id } = req.params;
    const result = await subTaskService.complete(parseInt(id));
    res.status(result.success ? 200 : 400).json(result);
  }

  async getTaskIdsWithSubTasks(req, res) {
    const result = await subTaskService.getTaskIdsWithSubTasks();
    res.status(result.success ? 200 : 401).json(result);
  }
}