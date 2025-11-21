// src/service/TaskService.js
import TaskRepository from "../repositories/TaskRepository.js";
import SubTaskRepository from "../repositories/SubTaskRepository.js";
import PriorityRepository from "../repositories/PriorityRepository.js";
import CategoryRepository from "../repositories/CategoryRepository.js";
import StatisticsRepository from "../repositories/StatisticsRepository.js";
import { OperationResult } from "../shared/OperationResult.js";

const taskRepository = new TaskRepository();
const subTaskRepository = new SubTaskRepository();
const priorityRepository = new PriorityRepository();
const categoryRepository = new CategoryRepository();
const statisticsRepository = new StatisticsRepository();

export class TaskService {
  constructor() {
    this.currentUser = null;
  }

  setCurrentUser(user) {
    this.currentUser = user;
  }

  validateTask(task) {
    if (!task) {
      return new OperationResult(false, "La tarea no puede ser nula.");
    }
    if (!task.title || task.title.trim() === "") {
      return new OperationResult(false, "El título de la tarea no puede estar vacío.");
    }
    if (!task.id_User) {
      return new OperationResult(false, "La tarea debe tener un usuario asignado.");
    }
    return new OperationResult(true);
  }

  async save(task) {
    try {
      const validation = this.validateTask(task);
      if (!validation.success) return validation;

      if (!task.creationDate) {
        task.creationDate = new Date();
      }

      const savedTask = await taskRepository.save(task);
      if (!savedTask) {
        return new OperationResult(false, "Error al guardar la tarea.");
      }

      return new OperationResult(true, "Tarea guardada exitosamente.", savedTask);
    } catch (error) {
      return new OperationResult(false, `Error al guardar la tarea: ${error.message}`);
    }
  }

  validateTaskId(id) {
    if (!id) {
      return new OperationResult(false, "ID de tarea inválido.");
    }
    return new OperationResult(true);
  }

  async delete(id) {
    try {
      const validation = this.validateTaskId(id);
      if (!validation.success) return validation;

      const existingTask = await taskRepository.getById(id);
      if (!existingTask || existingTask.id_User !== this.currentUser?.id) {
        return new OperationResult(false, "Tarea no encontrada.");
      }

      await this.deleteSubTasksByParentTask(id);
      await taskRepository.delete(id);

      return new OperationResult(true, "Tarea eliminada exitosamente.");
    } catch (error) {
      return new OperationResult(false, `Error al eliminar la tarea: ${error.message}`);
    }
  }

  async deleteSubTasksByParentTask(taskId) {
    try {
      const subTasks = await subTaskRepository.getAllByTaskId(taskId);
      for (const subTask of subTasks) {
        await subTaskRepository.delete(subTask.id_SubTask);
      }
    } catch (error) {
      console.error("Error eliminando subtareas:", error);
    }
  }

  async deleteByUser(userId) {
    try {
      if (!userId) {
        return new OperationResult(false, "ID de usuario inválido.");
      }

      await taskRepository.deleteByUser(userId);
      return new OperationResult(true, "Tareas del usuario eliminadas exitosamente.");
    } catch (error) {
      return new OperationResult(false, `Error al eliminar tareas del usuario: ${error.message}`);
    }
  }

  async deleteByCategory(categoryId) {
    try {
      if (!categoryId) {
        return new OperationResult(false, "ID de categoría inválido.");
      }

      await taskRepository.deleteByCategory(categoryId);
      return new OperationResult(true, "Tareas de la categoría eliminadas exitosamente.");
    } catch (error) {
      return new OperationResult(false, `Error al eliminar tareas de la categoría: ${error.message}`);
    }
  }

  async getTasksByUser(filter = null) {
    try {
      if (!this.currentUser) return [];

      const tasks = await taskRepository.getAllByUserId(this.currentUser.id);
      return filter ? tasks.filter(filter) : tasks;
    } catch (error) {
      console.error("Error al obtener tareas del usuario:", error);
      return [];
    }
  }

  async getAll() {
    try {
      const tasks = await this.getTasksByUser();
      return new OperationResult(true, "Tareas obtenidas exitosamente.", tasks);
    } catch (error) {
      return new OperationResult(false, `Error al obtener tareas: ${error.message}`);
    }
  }

  async getIncompleteByUser() {
    try {
      const tasks = await this.getTasksByUser((task) => !task.state);
      return new OperationResult(true, "Tareas incompletas obtenidas exitosamente.", tasks);
    } catch (error) {
      return new OperationResult(false, `Error al obtener tareas incompletas: ${error.message}`);
    }
  }

  async getCompletedByUser() {
    try {
      const tasks = await this.getTasksByUser((task) => task.state);
      return new OperationResult(true, "Tareas completadas obtenidas exitosamente.", tasks);
    } catch (error) {
      return new OperationResult(false, `Error al obtener tareas completadas: ${error.message}`);
    }
  }

  async getCompletedTodayByUser() {
    try {
      const tasks = await taskRepository.getCompletedToday(this.currentUser?.id);
      return new OperationResult(true, "Tareas completadas hoy obtenidas exitosamente.", tasks);
    } catch (error) {
      return new OperationResult(false, `Error al obtener tareas completadas hoy: ${error.message}`);
    }
  }

  async getById(id) {
    try {
      const validation = this.validateTaskId(id);
      if (!validation.success) return validation;

      const task = await taskRepository.getById(id);
      if (task && task.id_User === this.currentUser?.id) {
        return new OperationResult(true, "Tarea encontrada.", task);
      }

      return new OperationResult(false, "Tarea no encontrada.");
    } catch (error) {
      return new OperationResult(false, `Error al obtener tarea: ${error.message}`);
    }
  }

  async update(task) {
    try {
      const validation = this.validateTask(task);
      if (!validation.success) return validation;

      const existingTask = await taskRepository.getById(task.id_Task);
      if (!existingTask) {
        return new OperationResult(false, "Tarea no encontrada.");
      }

      if (existingTask.id_User !== this.currentUser?.id) {
        return new OperationResult(false, "No tienes acceso a esta tarea.");
      }

      if (!task.state && existingTask.state) {
        return new OperationResult(false, "No se puede desmarcar una tarea completada.");
      }

      const updated = await taskRepository.update(task);
      if (updated && task.state) {
        await this.markAllSubTasksAsCompleted(task.id_Task);
      }

      return updated
        ? new OperationResult(true, "Tarea actualizada exitosamente.", updated)
        : new OperationResult(false, "Error al actualizar la tarea.");
    } catch (error) {
      return new OperationResult(false, `Error al actualizar tarea: ${error.message}`);
    }
  }

  async markAllSubTasksAsCompleted(taskId) {
    try {
      const subTasks = await subTaskRepository.getAllByTaskId(taskId);
      for (const subTask of subTasks) {
        if (!subTask.state) {
          subTask.state = true;
          await subTaskRepository.update(subTask);
        }
      }
    } catch (error) {
      console.error("Error marcando subtareas como completadas:", error);
    }
  }

  async getOverdueTasks() {
    try {
      const tasks = await taskRepository.getOverdueByUser(this.currentUser?.id);
      return new OperationResult(true, "Tareas vencidas obtenidas exitosamente.", tasks);
    } catch (error) {
      return new OperationResult(false, `Error al obtener tareas vencidas: ${error.message}`);
    }
  }

  async updateTaskState(taskId, state) {
    try {
      const task = await taskRepository.getById(taskId);
      if (!task || task.id_User !== this.currentUser?.id) {
        return new OperationResult(false, "Tarea no encontrada.");
      }

      task.state = state;
      const result = await this.update(task);

      if (state) {
        await this.updateStatisticsOnCompletion(task.id_User);
      }

      return result;
    } catch (error) {
      return new OperationResult(false, `Error al actualizar estado de tarea: ${error.message}`);
    }
  }

  async updateStatisticsOnCompletion(userId) {
    try {
      const stats = await statisticsRepository.getByUser(userId);
      if (!stats) return;

      const updatedStats = {
        ...stats,
        completedTasks: (stats.completedTasks ?? 0) + 1,
      };

      await statisticsRepository.update(updatedStats);
    } catch (error) {
      console.error("Error actualizando estadísticas:", error);
    }
  }

  async create(task) {
    return this.save(task);
  }

  async complete(id) {
    return this.updateTaskState(id, true);
  }

  async createAndSaveTask(title, description, endDate, priorityText, categoryText, userId) {
    try {
      if (!title || title.trim() === "") {
        return new OperationResult(false, "El título de la tarea es requerido.");
      }

      if (!userId) {
        return new OperationResult(false, "El usuario es requerido.");
      }

      const { priorityId, categoryId } = await this.getPriorityAndCategoryIds(priorityText, categoryText, userId);

      const newTask = {
        title,
        description: description || null,
        creationDate: new Date(),
        endDate,
        id_Priority: priorityId,
        id_Category: categoryId,
        state: false,
        id_User: userId,
      };

      const savedTask = await this.save(newTask);
      if (savedTask.success) {
        await this.loadTaskRelations(savedTask.data);
      }

      return savedTask;
    } catch (error) {
      return new OperationResult(false, `Error al crear la tarea: ${error.message}`);
    }
  }

  async getPriorityAndCategoryIds(priorityText, categoryText, userId) {
    let priorityId = null;
    let categoryId = null;

    try {
      if (priorityText) {
        const priorities = await priorityRepository.getAll();
        const priority = priorities.find((p) => p.name.toLowerCase() === priorityText.toLowerCase());
        if (priority) {
          priorityId = priority.id_Priority;
        }
      }

      if (categoryText) {
        const categories = await categoryRepository.getByUser(userId);
        const category = categories.find((c) => c.name.toLowerCase() === categoryText.toLowerCase());
        if (category) {
          categoryId = category.id_Category;
        }
      }
    } catch (error) {
      console.error("Error obteniendo IDs de prioridad y categoría:", error);
    }

    return { priorityId, categoryId };
  }

  async loadTaskRelations(task) {
    try {
      if (task.id_Category) {
        task.Category = await categoryRepository.getById(task.id_Category);
      }

      if (task.id_Priority) {
        task.Priority = await priorityRepository.getById(task.id_Priority);
      }
    } catch (error) {
      console.error("Error cargando relaciones de tarea:", error);
    }
  }
}
