// src/service/TaskService.js
import TaskRepository from "../repositories/TaskRepository.js";
import SubTaskRepository from "../repositories/SubTaskRepository.js";
import PriorityRepository from "../repositories/PriorityRepository.js";
import CategoryRepository from "../repositories/CategoryRepository.js";
import StatisticsRepository from "../repositories/StatisticsRepository.js";
import { OperationResult } from "../shared/OperationResult.js";
import { requireSupabaseClient } from "../lib/supabaseAdmin.js";
import nodemailer from 'nodemailer';

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

  validateTask(task, isUpdate = false) {
    if (!task) {
      return new OperationResult(false, "La tarea no puede ser nula.");
    }

    // For updates, only validate fields that are being updated
    if (!isUpdate) {
      if (!task.title || task.title.trim() === "") {
        return new OperationResult(false, "El título de la tarea no puede estar vacío.");
      }
      if (!task.user_id && !task.id_User) {
        return new OperationResult(false, "La tarea debe tener un usuario asignado.");
      }
    } else {
      // For updates, user_id is required but title might not be present if only updating completion status
      if (!task.user_id && !task.id_User && !task.id_Task) {
        return new OperationResult(false, "La tarea debe tener un usuario asignado.");
      }
    }

    // Validate due date is not in the past - only allow today and future dates
    if (task.due_date) {
      const dueDate = new Date(task.due_date + 'T00:00:00'); // Ensure we compare dates only, not times
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Reset to start of today

      if (dueDate < today) {
        return new OperationResult(false, "La fecha límite no puede ser anterior a hoy. Selecciona una fecha actual o futura.");
      }
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

      // Load relations for email notification
      await this.loadTaskRelations(savedTask);

      // Send notification email (non-blocking)
      this.sendTaskNotification(savedTask, 'created').catch(error => {
        console.error('Error sending task creation notification:', error);
      });

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

      // Eliminar subtareas asociadas primero
      await this.deleteSubTasksByParentTask(id);

      await taskRepository.delete(id);

      return new OperationResult(true, "¡Tarea eliminada exitosamente! La tarea y todas sus subtareas han sido removidas permanentemente de tu lista.");
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

  async getTasksByUser(filter = null, limit = null) {
    try {
      if (!this.currentUser) return [];

      let tasks = await taskRepository.getAllByUserId(this.currentUser.id);

      if (filter) {
        tasks = tasks.filter(filter);
      }

      if (limit && limit > 0) {
        tasks = tasks.slice(0, limit);
      }

      return tasks;
    } catch (error) {
      console.error("Error al obtener tareas del usuario:", error);
      return [];
    }
  }

  async getAll() {
    try {
      const tasks = await this.getTasksByUser();

      // Load relations in parallel for better performance
      const relationPromises = tasks.map(task => this.loadTaskRelations(task));
      await Promise.all(relationPromises);

      return new OperationResult(true, "Tareas obtenidas exitosamente.", tasks);
    } catch (error) {
      return new OperationResult(false, `Error al obtener tareas: ${error.message}`);
    }
  }

  async getPendingTasks(limit = 3) {
    try {
      if (!this.currentUser) return new OperationResult(false, "Usuario no autenticado");

      // Get only incomplete tasks efficiently with limit
      const tasks = await this.getTasksByUser((task) => !task.state, limit);

      // Load relations in parallel for better performance
      const relationPromises = tasks.map(task => this.loadTaskRelations(task));
      await Promise.all(relationPromises);

      return new OperationResult(true, "Tareas pendientes obtenidas exitosamente.", tasks);
    } catch (error) {
      return new OperationResult(false, `Error al obtener tareas pendientes: ${error.message}`);
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

      if (existingTask.id_User !== this.currentUser?.id) {
        return new OperationResult(false, "No tienes acceso a esta tarea.");
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

        // Send notification email (non-blocking)
        this.sendTaskNotification(updated, 'updated').catch(error => {
          console.error('Error sending task update notification:', error);
        });

        return new OperationResult(true, "Tarea actualizada exitosamente.", updated);
      } else {
        return new OperationResult(false, "Error al actualizar la tarea.");
      }
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
  }

  // Email notification methods
  async sendTaskNotification(task, action) {
    try {
      if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
        console.warn('Gmail credentials not configured for task notifications');
        return;
      }

      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.GMAIL_USER,
          pass: process.env.GMAIL_APP_PASSWORD,
        },
      });

      const actionText = {
        'created': 'creada',
        'completed': 'completada',
        'updated': 'actualizada'
      }[action] || 'modificada';

      const subject = `Tarea ${actionText}: ${task.title}`;
      const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #16a34a;">Tarea ${actionText}</h2>
          <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin: 0 0 10px 0; color: #1f2937;">${task.title}</h3>
            ${task.description ? `<p style="margin: 5px 0; color: #4b5563;"><strong>Descripción:</strong> ${task.description}</p>` : ''}
            ${task.endDate ? `<p style="margin: 5px 0; color: #4b5563;"><strong>Fecha límite:</strong> ${new Date(task.endDate).toLocaleDateString('es-ES')}</p>` : ''}
            ${task.Category ? `<p style="margin: 5px 0; color: #4b5563;"><strong>Categoría:</strong> ${task.Category.name}</p>` : ''}
            ${task.Priority ? `<p style="margin: 5px 0; color: #4b5563;"><strong>Prioridad:</strong> ${task.Priority.name}</p>` : ''}
            <p style="margin: 10px 0; color: #16a34a; font-weight: bold;">Estado: ${task.state ? 'Completada ✅' : 'Pendiente ⏳'}</p>
          </div>
          <p style="color: #6b7280; font-size: 14px;">
            Este es un recordatorio automático de Captus.
          </p>
        </div>
      `;

      await transporter.sendMail({
        from: process.env.GMAIL_USER,
        to: this.currentUser?.email,
        subject,
        html,
      });

      console.log(`Task notification email sent for ${action} task: ${task.title}`);
    } catch (error) {
      console.error('Error sending task notification:', error);
    }
  }
}
