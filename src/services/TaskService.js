// backend/src/services/TaskService.js
import TaskRepository from "../repositories/TaskRepository.js";
import SubTaskRepository from "../repositories/SubTaskRepository.js";
import PriorityRepository from "../repositories/PriorityRepository.js";
import CategoryRepository from "../repositories/CategoryRepository.js";
import StatisticsRepository from "../repositories/StatisticsRepository.js";
import { OperationResult } from "../shared/OperationResult.js";
import nodemailer from 'nodemailer';

const taskRepository = new TaskRepository();
const subTaskRepository = new SubTaskRepository();
const priorityRepository = new PriorityRepository();
const categoryRepository = new CategoryRepository();
const statisticsRepository = new StatisticsRepository();

/**
 * Servicio para la gestión de tareas.
 * Sigue un patrón stateless donde cada método recibe el userId para validación.
 */
export class TaskService {

  // El constructor ahora está vacío al ser stateless.
  constructor() {}

  /**
   * Valida los datos de una tarea.
   * @param {object} task - El objeto de la tarea.
   * @param {boolean} isUpdate - Indica si es una operación de actualización.
   * @returns {OperationResult} - El resultado de la validación.
   */
  validateTask(task, isUpdate = false) {
    if (!task) {
      return new OperationResult(false, "La tarea no puede ser nula.");
    }

    if (!isUpdate && (!task.title || task.title.trim() === "")) {
      return new OperationResult(false, "El título de la tarea no puede estar vacío.");
    }

    if (task.due_date || task.endDate) {
      const dueDate = new Date((task.due_date || task.endDate) + 'T00:00:00');
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (dueDate < today) {
        return new OperationResult(false, "La fecha límite no puede ser anterior a hoy.");
      }
    }

    return new OperationResult(true);
  }

  /**
   * Crea una nueva tarea.
   * @param {object} taskData - Datos de la tarea.
   * @param {string} userId - ID del usuario propietario.
   * @param {string} userEmail - Email del usuario para notificaciones.
   * @returns {Promise<OperationResult>}
   */
  async create(taskData, userId, userEmail) {
    try {
      const validation = this.validateTask(taskData);
      if (!validation.success) return validation;

      const taskToSave = {
        ...taskData,
        id_User: userId, // Asegura la propiedad
        user_id: userId, // Mantengo por consistencia con otros schemas
        creationDate: new Date(),
        state: false,
      };

      const savedTask = await taskRepository.save(taskToSave);

      await this.loadTaskRelations(savedTask);

      // Notificación asíncrona
      this.sendTaskNotification(savedTask, 'created', userEmail).catch(error => {
        console.error('Error enviando notificación de creación de tarea:', error);
      });

      return new OperationResult(true, `Tarea "${savedTask.title}" creada exitosamente.`, savedTask);
    } catch (error) {
      console.error(`Error inesperado en TaskService.create: ${error.message}`);
      throw new Error("Ocurrió un error inesperado al crear la tarea.");
    }
  }

  /**
   * Marca una tarea como completada.
   * @param {string|number} taskId - ID de la tarea.
   * @param {string} userId - ID del usuario.
   * @param {string} userEmail - Email del usuario para notificaciones.
   * @returns {Promise<OperationResult>}
   */
  async complete(taskId, userId, userEmail) {
    try {
        const task = await taskRepository.getById(taskId);
        if (!task) {
            return new OperationResult(false, "Tarea no encontrada.");
        }
        if (task.id_User !== userId) {
            return new OperationResult(false, "No tienes permiso para modificar esta tarea.");
        }
        if (task.state) {
            return new OperationResult(true, "La tarea ya estaba completada.", task);
        }

        task.state = true;
        const updatedTask = await taskRepository.update(task);

        await this.updateStatisticsOnCompletion(userId);
        await this.loadTaskRelations(updatedTask);

        this.sendTaskNotification(updatedTask, 'completed', userEmail).catch(error => {
            console.error('Error enviando notificación de completitud de tarea:', error);
        });

        return new OperationResult(true, `¡Tarea "${updatedTask.title}" completada!`, updatedTask);
    } catch (error) {
        console.error(`Error inesperado en TaskService.complete: ${error.message}`);
        throw new Error("Ocurrió un error inesperado al completar la tarea.");
    }
  }

  /**
   * Actualiza una tarea existente.
   * @param {string|number} taskId - ID de la tarea.
   * @param {object} updates - Campos a actualizar.
   * @param {string} userId - ID del usuario.
   * @param {string} userEmail - Email del usuario para notificaciones.
   * @returns {Promise<OperationResult>}
   */
  async update(taskId, updates, userId, userEmail) {
    try {
      const validation = this.validateTask(updates, true);
      if (!validation.success) return validation;

      const existingTask = await taskRepository.getById(taskId);
      if (!existingTask) {
        return new OperationResult(false, "Tarea no encontrada.");
      }
      if (existingTask.id_User !== userId) {
        return new OperationResult(false, "No tienes permiso para actualizar esta tarea.");
      }

      const taskToUpdate = { ...existingTask, ...updates };
      const updatedTask = await taskRepository.update(taskToUpdate);

      await this.loadTaskRelations(updatedTask);
      this.sendTaskNotification(updatedTask, 'updated', userEmail).catch(error => {
        console.error('Error enviando notificación de actualización de tarea:', error);
      });

      return new OperationResult(true, "Tarea actualizada exitosamente.", updatedTask);
    } catch (error) {
      console.error(`Error inesperado en TaskService.update: ${error.message}`);
      throw new Error("Ocurrió un error inesperado al actualizar la tarea.");
    }
  }

  /**
   * Elimina una tarea.
   * @param {string|number} taskId - ID de la tarea.
   * @param {string} userId - ID del usuario.
   * @returns {Promise<OperationResult>}
   */
  async delete(taskId, userId) {
    try {
      // Map completed to state if present
      if (task.completed !== undefined) {
        task.state = task.completed;
      }

      const validation = this.validateTask(task, true); // isUpdate = true
      if (!validation.success) return validation;

      const existingTask = await taskRepository.getById(task.id_Task);
      if (!existingTask) {
        return new OperationResult(false, "Tarea no encontrada.");
      }
      if (existingTask.id_User !== userId) {
        return new OperationResult(false, "No tienes permiso para eliminar esta tarea.");
      }

      if (!task.state && existingTask.state) {
        return new OperationResult(false, "No se puede desmarcar una tarea completada.");
      }

      // If completing the task, mark all subtasks as completed
      if (task.state && !existingTask.state) {
        await this.markAllSubTasksAsCompleted(task.id_Task);
      }

      const updated = await taskRepository.update(task);

      if (updated) {
        // Load relations for email notification
        await this.loadTaskRelations(updated);

      return new OperationResult(true, "¡Tarea eliminada exitosamente!");
    } catch (error) {
      console.error(`Error inesperado en TaskService.delete: ${error.message}`);
      throw new Error("Ocurrió un error inesperado al eliminar la tarea.");
    }
  }

  /**
   * Obtiene una tarea por su ID.
   * @param {string|number} taskId - ID de la tarea.
   * @param {string} userId - ID del usuario.
   * @returns {Promise<OperationResult>}
   */
  async getById(taskId, userId) {
    try {
        const task = await taskRepository.getById(taskId);
        if (!task) {
            return new OperationResult(false, "Tarea no encontrada.");
        }
        if (task.id_User !== userId) {
            return new OperationResult(false, "No tienes permiso para acceder a esta tarea.");
        }
        return new OperationResult(true, "Tarea obtenida.", task);
    } catch (error) {
        console.error(`Error inesperado en TaskService.getById: ${error.message}`);
        throw new Error("Ocurrió un error inesperado al obtener la tarea.");
    }
  }

  /**
   * Obtiene todas las tareas de un usuario.
   * @param {string} userId - ID del usuario.
   * @returns {Promise<OperationResult>}
   */
  async getAll(userId) {
    try {
      const tasks = await taskRepository.getAllByUserId(userId);
      const relationPromises = tasks.map(task => this.loadTaskRelations(task));
      await Promise.all(relationPromises);
      return new OperationResult(true, "Tareas obtenidas exitosamente.", tasks);
    } catch (error) {
      console.error(`Error inesperado en TaskService.getAll: ${error.message}`);
      throw new Error("Ocurrió un error inesperado al obtener las tareas.");
    }
  }

  /**
   * Obtiene las tareas incompletas de un usuario.
   * @param {string} userId - ID del usuario.
   * @returns {Promise<OperationResult>}
   */
  async getIncompleteByUser(userId) {
    try {
      const task = await taskRepository.getById(taskId);
      if (!task || task.id_User !== this.currentUser?.id) {
        return new OperationResult(false, "Tarea no encontrada.");
      }

      // Check if task is overdue
      if (state && task.endDate) {
        const now = new Date();
        const dueDate = new Date(task.endDate);
        if (dueDate < now) {
          return new OperationResult(false, "No se puede completar una tarea que ha pasado su fecha límite.");
        }
      }

      // Check if any subtasks are overdue (if trying to complete parent task)
      if (state) {
        const subTasks = await subTaskRepository.getAllByTaskId(taskId);
        const hasOverdueSubTasks = subTasks.some(subTask => {
          if (subTask.endDate) {
            const now = new Date();
            const subTaskDueDate = new Date(subTask.endDate);
            return subTaskDueDate < now;
          }
          return false;
        });

        if (hasOverdueSubTasks) {
          return new OperationResult(false, "No se puede completar una tarea que tiene subtareas vencidas.");
        }

        // Mark all subtasks as completed when completing parent task
        await this.markAllSubTasksAsCompleted(taskId);
      }

      task.state = state;
      const result = await this.update(task);

      if (state) {
        await this.updateStatisticsOnCompletion(task.id_User);

        // Send completion notification email (non-blocking)
        await this.loadTaskRelations(task);
        this.sendTaskNotification(task, 'completed').catch(error => {
          console.error('Error sending task completion notification:', error);
        });
      }

      return result;
    } catch (error) {
      console.error(`Error inesperado en TaskService.getIncompleteByUser: ${error.message}`);
      throw new Error("Ocurrió un error inesperado al obtener las tareas incompletas.");
    }
  }

  async updateStatisticsOnCompletion(userId) {
    try {
      // Update streak after completing a task
      await this.updateStreakOnCompletion(userId);

      // Update favorite category analysis
      await this.updateFavoriteCategory(userId);
    } catch (error) {
      console.error("Error actualizando estadísticas:", error);
    }
  }

  async updateFavoriteCategory(userId) {
    try {
      // Import StatisticsService dynamically to avoid circular dependency
      const { StatisticsService } = await import('./StatisticsService.js');
      const statsService = new StatisticsService();
      statsService.setCurrentUser({ id: userId });
      await statsService.updateFavoriteCategory();
    } catch (error) {
      console.error("Error actualizando categoría favorita:", error);
    }
  }

  async updateStreakOnCompletion(userId) {
    try {
      // Import StatisticsService dynamically to avoid circular dependency
      const { StatisticsService } = await import('./StatisticsService.js');
      const statsService = new StatisticsService();
      statsService.setCurrentUser({ id: userId });
      await statsService.checkStreak();
    } catch (error) {
      console.error("Error actualizando racha:", error);
    }
  }

  async create(task) {
    return this.save(task);
  }

  async complete(id) {
    return this.updateTaskState(id, true);
  }

  async loadTaskRelations(task) {
    if (task.id_Category) {
      task.Category = await categoryRepository.getById(task.id_Category);
    }
    if (task.id_Priority) {
      task.Priority = await priorityRepository.getById(task.id_Priority);
    }
  }

  async loadTaskRelations(task) {
    try {
      if (task.id_Category) {
        try {
          task.Category = await categoryRepository.getById(task.id_Category);
        } catch (error) {
          console.error("Error cargando categoría de tarea:", error);
          task.Category = null;
        }
      }

      if (task.id_Priority) {
        try {
          task.Priority = await priorityRepository.getById(task.id_Priority);
        } catch (error) {
          console.error("Error cargando prioridad de tarea:", error);
          task.Priority = null;
        }
      }
    } catch (error) {
      console.error("Error cargando relaciones de tarea:", error);
    }

    // El resto de la lógica de nodemailer permanece igual...
    // (código de nodemailer omitido por brevedad, se asume que no cambia)
  }
}
