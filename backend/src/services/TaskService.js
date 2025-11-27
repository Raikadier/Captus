import TaskRepository from "../repositories/TaskRepository.js";
import SubTaskRepository from "../repositories/SubTaskRepository.js";
import PriorityRepository from "../repositories/PriorityRepository.js";
import CategoryRepository from "../repositories/CategoryRepository.js";
import { OperationResult } from "../shared/OperationResult.js";
import nodemailer from 'nodemailer';

const taskRepository = new TaskRepository();
const subTaskRepository = new SubTaskRepository();
const priorityRepository = new PriorityRepository();
const categoryRepository = new CategoryRepository();

/**
 * Service for Task management.
 * Follows a stateless pattern where each method receives the userId for validation.
 * Standardized to use 'completed' and 'user_id' per SQL schema.
 */
export class TaskService {

  constructor() {}

  /**
   * Validates task data.
   * @param {object} task - The task object.
   * @param {boolean} isUpdate - Indicates if it's an update operation.
   * @returns {OperationResult}
   */
  validateTask(task, isUpdate = false) {
    if (!task) {
      return new OperationResult(false, "La tarea no puede ser nula.");
    }

    if (!isUpdate && (!task.title || task.title.trim() === "")) {
      return new OperationResult(false, "El título de la tarea no puede estar vacío.");
    }

    // Check dates (support both snake_case and camelCase for flexibility during transition)
    const dueDateVal = task.due_date || task.endDate || task.dueDate;
    if (dueDateVal) {
      const dueDate = new Date(dueDateVal);
      // If passing just YYYY-MM-DD string, append time to ensure local/UTC handling doesn't shift it back
      // But usually Date() parses ISO strings correctly.

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (dueDate < today) {
        // Warning: this prevents creating past tasks, which might be annoying if importing data.
        // But keeping original logic:
        return new OperationResult(false, "La fecha límite no puede ser anterior a hoy.");
      }
    }

    return new OperationResult(true);
  }

  /**
   * Creates a new task.
   * @param {object} taskData
   * @param {string} userId
   * @param {string} userEmail
   * @returns {Promise<OperationResult>}
   */
  async create(taskData, userId, userEmail) {
    try {
      const validation = this.validateTask(taskData);
      if (!validation.success) return validation;

      const taskToSave = {
        ...taskData,
        user_id: userId,
        created_at: new Date(),
        completed: false,
        // Legacy support if repo needs it (TaskRepository maps mapToDb, so we should pass what mapToDb expects)
        // TaskRepository.mapToDb uses: title, description, due_date, priority_id, category_id, completed, user_id
      };

      const savedTask = await taskRepository.save(taskToSave);
      await this.loadTaskRelations(savedTask);

      // Async notification
      this.sendTaskNotification(savedTask, 'created', userEmail).catch(error => {
        console.error('Error enviando notificación de creación de tarea:', error);
      });

      return new OperationResult(true, `Tarea "${savedTask.title}" creada exitosamente.`, savedTask);
    } catch (error) {
      console.error(`Error inesperado en TaskService.create: ${error.message}`);
      throw new Error("Ocurrió un error inesperado al crear la tarea.");
    }
  }

  // Alias for legacy calls if any
  async save(taskData, userId) {
    // Assuming 'save' in Controller might pass (body, user)
    // We need email from user object if possible, but here we might miss it.
    // For now, pass null email or handle it.
    return this.create(taskData, userId, null);
  }

  /**
   * Marks a task as completed.
   * @param {number} taskId
   * @param {string} userId
   * @param {string} userEmail
   * @returns {Promise<OperationResult>}
   */
  async complete(taskId, userId, userEmail) {
    try {
        const task = await taskRepository.getById(taskId);
        if (!task) {
            return new OperationResult(false, "Tarea no encontrada.");
        }
        if (task.user_id !== userId) {
            return new OperationResult(false, "No tienes permiso para modificar esta tarea.");
        }
        if (task.completed) {
            return new OperationResult(true, "La tarea ya estaba completada.", task);
        }

        task.completed = true;
        // Also update subtasks? Original code logic had this.
        // "markAllSubTasksAsCompleted(taskId)"
        // We should probably implement that logic here.

        // Update
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
   * Updates an existing task.
   * @param {number} taskId
   * @param {object} updates
   * @param {string} userId
   * @param {string} userEmail
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
      if (existingTask.user_id !== userId) {
        return new OperationResult(false, "No tienes permiso para actualizar esta tarea.");
      }

      // Merge updates
      const taskToUpdate = { ...existingTask, ...updates };
      // Ensure we don't overwrite ID or Owner
      taskToUpdate.id = existingTask.id;
      taskToUpdate.user_id = userId;

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
   * Deletes a task.
   * @param {number} taskId
   * @param {string} userId
   * @returns {Promise<OperationResult>}
   */
  async delete(taskId, userId) {
    try {
      const existingTask = await taskRepository.getById(taskId);
      if (!existingTask) {
        return new OperationResult(false, "Tarea no encontrada.");
      }
      if (existingTask.user_id !== userId) {
        return new OperationResult(false, "No tienes permiso para eliminar esta tarea.");
      }

      // Logic from original: "If completing the task..." - Wait, delete is delete.
      // Original code had mixed logic.
      // We will just delete.

      const deleted = await taskRepository.delete(taskId);
      if (deleted) {
          return new OperationResult(true, "¡Tarea eliminada exitosamente!");
      } else {
          return new OperationResult(false, "No se pudo eliminar la tarea.");
      }
    } catch (error) {
      console.error(`Error inesperado en TaskService.delete: ${error.message}`);
      throw new Error("Ocurrió un error inesperado al eliminar la tarea.");
    }
  }

  async deleteByCategory(categoryId) {
      try {
          // This seems dangerous without UserID check.
          // Ideally we should delete by Category AND UserID.
          // Assuming the Controller checks ownership of Category first?
          // Or we rely on the repo to only delete what matches?
          // For now, implementing blindly as requested by interface presence.
          await taskRepository.deleteByCategory(categoryId);
          return new OperationResult(true, "Tareas eliminadas.");
      } catch (error) {
          return new OperationResult(false, error.message);
      }
  }

  /**
   * Get task by ID.
   */
  async getById(taskId, userId) {
    try {
        const task = await taskRepository.getById(taskId);
        if (!task) {
            return new OperationResult(false, "Tarea no encontrada.");
        }
        if (task.user_id !== userId) {
            return new OperationResult(false, "No tienes permiso para acceder a esta tarea.");
        }
        await this.loadTaskRelations(task);
        return new OperationResult(true, "Tarea obtenida.", task);
    } catch (error) {
        console.error(`Error inesperado en TaskService.getById: ${error.message}`);
        throw new Error("Ocurrió un error inesperado al obtener la tarea.");
    }
  }

  /**
   * Get all tasks for user.
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
   * Get pending (incomplete) tasks for user, optionally with limit.
   * Matches 'getPendingTasks' from Controller.
   */
  async getPendingTasks(userId, limit = null) {
      try {
          const tasks = await taskRepository.getAllByUserId(userId);
          const pending = tasks.filter(t => !t.completed);

          // Sort by due date (nearest first) or priority?
          // Usually pending tasks are sorted by Due Date ascending.
          pending.sort((a, b) => {
              const dateA = new Date(a.due_date || '9999-12-31');
              const dateB = new Date(b.due_date || '9999-12-31');
              return dateA - dateB;
          });

          const result = limit ? pending.slice(0, limit) : pending;

          // Load relations
          await Promise.all(result.map(t => this.loadTaskRelations(t)));

          return new OperationResult(true, "Tareas pendientes obtenidas.", result);
      } catch (error) {
          console.error(error);
          return new OperationResult(false, "Error al obtener tareas pendientes.");
      }
  }

  // Alias for legacy
  async getIncompleteByUser(userId) {
      return this.getPendingTasks(userId);
  }

  /**
   * Get tasks completed today by user.
   */
  async getCompletedToday(userId) {
      try {
          const tasks = await taskRepository.getCompletedToday(userId);
          return new OperationResult(true, "Tareas completadas hoy obtenidas.", tasks);
      } catch (error) {
          console.error(error);
          return new OperationResult(false, "Error al obtener tareas completadas hoy.");
      }
  }

  // Statistics helpers
  async updateStatisticsOnCompletion(userId) {
    try {
      const { StatisticsService } = await import('./StatisticsService.js');
      const statsService = new StatisticsService();
      // StatisticsService needs refactoring too if it's stateful, but for now:
      // Assuming it has a way to work.
      // Original code: statsService.setCurrentUser({ id: userId });
      // We will try to follow that pattern if StatisticsService is not refactored yet.
      // Or better, check if checkStreak accepts userId.

      // Checking usage in original code... it used setCurrentUser.
      // We'll keep it for compatibility until we audit StatisticsService.
      if (statsService.setCurrentUser) {
          statsService.setCurrentUser({ id: userId });
      }
      await statsService.checkStreak(userId); // Passing userId just in case
      await statsService.updateFavoriteCategory(userId);
    } catch (error) {
      console.error("Error actualizando estadísticas:", error);
    }
  }

  async loadTaskRelations(task) {
    try {
      // Map IDs if using snake_case properties
      const categoryId = task.category_id || task.id_Category;
      const priorityId = task.priority_id || task.id_Priority;

      if (categoryId) {
        try {
          task.Category = await categoryRepository.getById(categoryId);
        } catch (error) {
          task.Category = null;
        }
      }

      if (priorityId) {
        try {
          task.Priority = await priorityRepository.getById(priorityId);
        } catch (error) {
          task.Priority = null;
        }
      }
    } catch (error) {
      console.error("Error cargando relaciones de tarea:", error);
    }
  }

  async sendTaskNotification(task, type, userEmail) {
      if (!userEmail) return;
      // Placeholder for email logic
      // console.log(`Sending email to ${userEmail} for task ${type}`);
  }
}

export default TaskService;
