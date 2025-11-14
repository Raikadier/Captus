// src/service/TaskService.js
import TaskRepository from "../repository/TaskRepository.js";
import SubTaskRepository from "../repository/SubTaskRepository.js";
import PriorityRepository from "../repository/PriorityRepository.js";
import CategoryRepository from "../repository/CategoryRepository.js";
import StatisticsRepository from "../repository/StatisticsRepository.js";
import { OperationResult } from "../shared/OperationResult.js";

const taskRepository = new TaskRepository();
const subTaskRepository = new SubTaskRepository();
const priorityRepository = new PriorityRepository();
const categoryRepository = new CategoryRepository();
const statisticsRepository = new StatisticsRepository();

export class TaskService {
  constructor() {
    // Simular sesión - en un entorno real esto vendría del contexto de autenticación
    this.currentUser = null;
  }

  // Método para establecer el usuario actual (desde middleware de auth)
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

      // Establecer fecha de creación si no existe
      if (!task.creationDate) {
        task.creationDate = new Date();
      }

      const savedTask = await taskRepository.save(task);
      if (savedTask) {
        return new OperationResult(true, "Tarea guardada exitosamente.", savedTask);
      } else {
        return new OperationResult(false, "Error al guardar la tarea.");
      }
    } catch (error) {
      return new OperationResult(false, `Error al guardar la tarea: ${error.message}`);
    }
  }

  validateTaskId(id) {
    if (!id || id <= 0) {
      return new OperationResult(false, "ID de tarea inválido.");
    }
    return new OperationResult(true);
  }

  async delete(id) {
    try {
      const validation = this.validateTaskId(id);
      if (!validation.success) return validation;

      // Verificar que la tarea existe
      const existingTask = await taskRepository.getById(id);
      if (!existingTask) {
        return new OperationResult(false, "Tarea no encontrada.");
      }

      // Eliminar subtareas relacionadas primero
      await this.deleteSubTasksByParentTask(id);

      // Eliminar la tarea
      const deleted = await taskRepository.delete(id);
      if (deleted) {
        return new OperationResult(true, "Tarea eliminada exitosamente.");
      } else {
        return new OperationResult(false, "Error al eliminar la tarea.");
      }
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
      if (!userId || userId <= 0) {
        return new OperationResult(false, "ID de usuario inválido.");
      }

      const tasks = await taskRepository.getAllByUserId(userId);
      for (const task of tasks) {
        await this.delete(task.id_Task);
      }

      return new OperationResult(true, "Tareas del usuario eliminadas exitosamente.");
    } catch (error) {
      return new OperationResult(false, `Error al eliminar tareas del usuario: ${error.message}`);
    }
  }

  async deleteByCategory(categoryId) {
    try {
      if (!categoryId || categoryId <= 0) {
        return new OperationResult(false, "ID de categoría inválido.");
      }

      // Obtener todas las tareas y filtrar por categoría
      const allTasks = await taskRepository.getAll();
      const tasksToDelete = allTasks.filter(task => task.id_Category === categoryId);

      for (const task of tasksToDelete) {
        await this.delete(task.id_Task);
      }

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
      const tasks = await this.getTasksByUser(task => !task.state);
      return new OperationResult(true, "Tareas incompletas obtenidas exitosamente.", tasks);
    } catch (error) {
      return new OperationResult(false, `Error al obtener tareas incompletas: ${error.message}`);
    }
  }

  async getCompletedByUser() {
    try {
      const tasks = await this.getTasksByUser(task => task.state);
      return new OperationResult(true, "Tareas completadas obtenidas exitosamente.", tasks);
    } catch (error) {
      return new OperationResult(false, `Error al obtener tareas completadas: ${error.message}`);
    }
  }

  async getCompletedTodayByUser() {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const tasks = await this.getTasksByUser(task => {
        if (!task.state) return false;
        const taskDate = new Date(task.creationDate);
        taskDate.setHours(0, 0, 0, 0);
        return taskDate.getTime() === today.getTime();
      });

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
      if (task) {
        return new OperationResult(true, "Tarea encontrada.", task);
      } else {
        return new OperationResult(false, "Tarea no encontrada.");
      }
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

      // No permitir desmarcar una tarea completada
      if (!task.state && existingTask.state) {
        return new OperationResult(false, "No se puede desmarcar una tarea completada.");
      }

      const updated = await taskRepository.update(task);
      if (updated) {
        // Si la tarea se completó, marcar todas las subtareas como completadas
        if (task.state) {
          await this.markAllSubTasksAsCompleted(task.id_Task);
        }

        return new OperationResult(true, "Tarea actualizada exitosamente.");
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
      const now = new Date();
      const tasks = await this.getTasksByUser(task => !task.state && new Date(task.endDate) < now);
      return new OperationResult(true, "Tareas vencidas obtenidas exitosamente.", tasks);
    } catch (error) {
      return new OperationResult(false, `Error al obtener tareas vencidas: ${error.message}`);
    }
  }

  async updateTaskState(taskId, state) {
    try {
      const task = await taskRepository.getById(taskId);
      if (task) {
        task.state = state;
        const result = await this.update(task);

        // Actualizar estadísticas si la tarea se completó
        if (state) {
          // Aquí iría la lógica de estadísticas
          // const statisticsService = new StatisticsService();
          // await statisticsService.checkStreak(this.currentUser.id);
        }

        return result;
      } else {
        return new OperationResult(false, "Tarea no encontrada.");
      }
    } catch (error) {
      return new OperationResult(false, `Error al actualizar estado de tarea: ${error.message}`);
    }
  }

  async createAndSaveTask(title, description, endDate, priorityText, categoryText, userId) {
    try {
      if (!title || title.trim() === "") {
        return new OperationResult(false, "El título de la tarea es requerido.");
      }

      if (!userId) {
        return new OperationResult(false, "El usuario es requerido.");
      }

      // Obtener IDs de prioridad y categoría
      const { priorityId, categoryId } = await this.getPriorityAndCategoryIds(priorityText, categoryText);

      const newTask = {
        title,
        description: description || null,
        creationDate: new Date(),
        endDate,
        id_Priority: priorityId,
        id_Category: categoryId,
        state: false,
        id_User: userId
      };

      const savedTask = await this.save(newTask);
      if (savedTask.success) {
        // Cargar relaciones
        await this.loadTaskRelations(savedTask.data);
        return new OperationResult(true, "Tarea creada exitosamente.", savedTask.data);
      } else {
        return savedTask;
      }
    } catch (error) {
      return new OperationResult(false, `Error al crear la tarea: ${error.message}`);
    }
  }

  async getPriorityAndCategoryIds(priorityText, categoryText) {
    let priorityId = 1; // Baja por defecto
    let categoryId = 1; // General por defecto

    try {
      // Obtener prioridad por nombre
      if (priorityText) {
        const priorities = await priorityRepository.getAll();
        const priority = priorities.find(p =>
          p.name.toLowerCase() === priorityText.toLowerCase()
        );
        if (priority) {
          priorityId = priority.id_Priority;
        }
      }

      // Obtener categoría por nombre
      if (categoryText) {
        const categories = await categoryRepository.getAll();
        const category = categories.find(c =>
          c.name.toLowerCase() === categoryText.toLowerCase()
        );
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
      // Cargar categoría
      if (task.id_Category) {
        task.Category = await categoryRepository.getById(task.id_Category);
      }

      // Cargar prioridad
      if (task.id_Priority) {
        task.Priority = await priorityRepository.getById(task.id_Priority);
      }
    } catch (error) {
      console.error("Error cargando relaciones de tarea:", error);
    }
  }
}