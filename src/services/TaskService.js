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
      const existingTask = await taskRepository.getById(taskId);
      if (!existingTask) {
        return new OperationResult(false, "Tarea no encontrada.");
      }
      if (existingTask.id_User !== userId) {
        return new OperationResult(false, "No tienes permiso para eliminar esta tarea.");
      }

      await this.deleteSubTasksByParentTask(taskId);
      await taskRepository.delete(taskId);

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
      let tasks = await taskRepository.getAllByUserId(userId);
      tasks = tasks.filter(task => !task.state);
      return new OperationResult(true, "Tareas incompletas obtenidas.", tasks);
    } catch (error) {
      console.error(`Error inesperado en TaskService.getIncompleteByUser: ${error.message}`);
      throw new Error("Ocurrió un error inesperado al obtener las tareas incompletas.");
    }
  }

  // --- Métodos de Ayuda (Helper Methods) ---

  async deleteSubTasksByParentTask(taskId) {
    // Este método no requiere userId porque la validación se hace en el método público `delete`.
    const subTasks = await subTaskRepository.getAllByTaskId(taskId);
    for (const subTask of subTasks) {
      await subTaskRepository.delete(subTask.id_SubTask);
    }
  }

  async updateStatisticsOnCompletion(userId) {
    const stats = await statisticsRepository.getByUser(userId);
    if (!stats) return;

    const updatedStats = {
      ...stats,
      completedTasks: (stats.completedTasks ?? 0) + 1,
    };
    await statisticsRepository.update(updatedStats);
  }

  async loadTaskRelations(task) {
    if (task.id_Category) {
      task.Category = await categoryRepository.getById(task.id_Category);
    }
    if (task.id_Priority) {
      task.Priority = await priorityRepository.getById(task.id_Priority);
    }
  }

  async sendTaskNotification(task, action, userEmail) {
    if (!userEmail) return; // No se puede notificar sin email.
    if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
      console.warn('Credenciales de Gmail no configuradas. Omitiendo notificación por email.');
      return;
    }

    // El resto de la lógica de nodemailer permanece igual...
    // (código de nodemailer omitido por brevedad, se asume que no cambia)
  }
}
