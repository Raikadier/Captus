// src/service/StatisticsService.js
import StatisticsRepository from "../repository/StatisticsRepository.js";
import UserAchievementsRepository from "../repository/UserAchievementsRepository.js";
import { TaskService } from "./TaskService.js";
import { OperationResult } from "../shared/OperationResult.js";
import { achievements, getMotivationalMessage } from "../shared/achievementsConfig.js";

const statisticsRepository = new StatisticsRepository();
const userAchievementsRepository = new UserAchievementsRepository();
const taskService = new TaskService();

export class StatisticsService {
  constructor() {
    // Simular sesión - en un entorno real esto vendría del contexto de autenticación
    this.currentUser = null;
  }

  // Método para establecer el usuario actual (desde middleware de auth)
  setCurrentUser(user) {
    this.currentUser = user;
    taskService.setCurrentUser(user); // También inyectar en TaskService
  }

  // ✅ Verificar y actualizar la racha de días
  async checkStreak() {
    try {
      const stats = await this.getByCurrentUser();
      if (!stats) return;

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);

      // Obtener tareas completadas hoy
      const completedTodayResult = await taskService.getCompletedTodayByUser();
      const completedToday = completedTodayResult.success ? completedTodayResult.data.length : 0;

      let streakChanged = false;

      if (completedToday < stats.dailyGoal) {
        // Si no cumplió la meta diaria
        if (!stats.lastRachaDate || new Date(stats.lastRachaDate).getTime() < yesterday.getTime()) {
          stats.racha = 0;
          stats.lastRachaDate = null;
          streakChanged = true;
          await statisticsRepository.update(stats);
        }
      } else {
        // Si cumplió la meta diaria
        if (!stats.lastRachaDate || new Date(stats.lastRachaDate).getTime() < today.getTime()) {
          if (stats.lastRachaDate && new Date(stats.lastRachaDate).getTime() === yesterday.getTime()) {
            stats.racha += 1;
            streakChanged = true;
          } else {
            stats.racha = 1;
            streakChanged = true;
          }

          stats.lastRachaDate = today;
          await statisticsRepository.update(stats);
        }
      }

      // Actualizar mejor racha histórica
      if (streakChanged && stats.racha > stats.bestStreak) {
        stats.bestStreak = stats.racha;
        await statisticsRepository.update(stats);
      }

      // Verificar logros relacionados con racha
      await this.checkAchievements();
    } catch (error) {
      console.error("Error verificando racha:", error);
    }
  }

  // ✅ Actualizar estadísticas generales (totales, completadas, categoría favorita)
  async updateGeneralStats() {
    try {
      const stats = await this.getByCurrentUser();
      if (!stats) return;

      // Obtener todas las tareas del usuario
      const allTasksResult = await taskService.getAll();
      const allTasks = allTasksResult.success ? allTasksResult.data : [];

      // Obtener tareas completadas
      const completedTasksResult = await taskService.getCompletedByUser();
      const completedTasks = completedTasksResult.success ? completedTasksResult.data : [];

      stats.totalTasks = allTasks.length;
      stats.completedTasks = completedTasks.length;

      // Calcular categoría más usada
      const categoryCount = {};
      allTasks.forEach(task => {
        if (task.id_Category) {
          categoryCount[task.id_Category] = (categoryCount[task.id_Category] || 0) + 1;
        }
      });

      if (Object.keys(categoryCount).length > 0) {
        stats.favoriteCategory = Object.keys(categoryCount).reduce((a, b) =>
          categoryCount[a] > categoryCount[b] ? a : b
        );
      }

      await statisticsRepository.update(stats);

      // Verificar logros después de actualizar estadísticas
      await this.checkAchievements();
    } catch (error) {
      console.error("Error actualizando estadísticas generales:", error);
    }
  }

  // ✅ Calcular porcentaje de completitud
  async getCompletionPercentage() {
    try {
      const stats = await this.getByCurrentUser();
      if (!stats || stats.totalTasks === 0) return 0;

      return Math.round((stats.completedTasks / stats.totalTasks) * 100);
    } catch (error) {
      console.error("Error calculando porcentaje:", error);
      return 0;
    }
  }

  // ✅ Obtener estadísticas semanales
  async getWeeklyStats() {
    try {
      const stats = await this.getByCurrentUser();
      if (!stats) return null;

      const today = new Date();
      const weekStart = new Date(today);
      weekStart.setDate(today.getDate() - today.getDay()); // Inicio de semana (domingo)
      weekStart.setHours(0, 0, 0, 0);

      // Obtener tareas completadas esta semana
      const allTasksResult = await taskService.getAll();
      const allTasks = allTasksResult.success ? allTasksResult.data : [];

      const weeklyTasks = allTasks.filter(task => {
        const taskDate = new Date(task.creationDate);
        return taskDate >= weekStart;
      });

      const completedWeekly = weeklyTasks.filter(task => task.state).length;

      return {
        totalTasks: weeklyTasks.length,
        completedTasks: completedWeekly,
        completionRate: weeklyTasks.length > 0 ? Math.round((completedWeekly / weeklyTasks.length) * 100) : 0,
        currentStreak: stats.racha,
        dailyGoal: stats.dailyGoal
      };
    } catch (error) {
      console.error("Error obteniendo estadísticas semanales:", error);
      return null;
    }
  }

  // ✅ Verificar y desbloquear logros
  async checkAchievements() {
    try {
      if (!this.currentUser) return;

      const stats = await this.getByCurrentUser();
      if (!stats) return;

      // Obtener estadísticas adicionales para logros complejos
      const additionalStats = await this.getAdditionalStats();

      for (const [achievementId, achievement] of Object.entries(achievements)) {
        const hasAchievement = await userAchievementsRepository.hasAchievement(this.currentUser.id, achievementId);

        if (!hasAchievement) {
          let currentValue = 0;
          let shouldUnlock = false;

          // Verificar condición según el tipo de logro
          switch (achievement.type) {
            case "completed_tasks":
              currentValue = stats.completedTasks;
              shouldUnlock = currentValue >= achievement.targetValue;
              break;

            case "streak":
              currentValue = stats.racha;
              shouldUnlock = currentValue >= achievement.targetValue;
              break;

            case "tasks_created":
              currentValue = stats.totalTasks;
              shouldUnlock = currentValue >= achievement.targetValue;
              break;

            case "high_priority_tasks":
              currentValue = additionalStats.highPriorityTasks;
              shouldUnlock = currentValue >= achievement.targetValue;
              break;

            case "subtasks_created":
              currentValue = additionalStats.subTasksCreated;
              shouldUnlock = currentValue >= achievement.targetValue;
              break;

            case "early_tasks":
              currentValue = additionalStats.earlyTasks;
              shouldUnlock = currentValue >= achievement.targetValue;
              break;

            case "subtasks_completed":
              currentValue = additionalStats.subTasksCompleted;
              shouldUnlock = currentValue >= achievement.targetValue;
              break;

            case "tasks_in_day":
              currentValue = additionalStats.maxTasksInDay;
              shouldUnlock = currentValue >= achievement.targetValue;
              break;

            case "solo_tasks":
              currentValue = additionalStats.soloTasks;
              shouldUnlock = currentValue >= achievement.targetValue;
              break;

            case "sunday_tasks":
              currentValue = additionalStats.sundayTasks;
              shouldUnlock = currentValue >= achievement.targetValue;
              break;
          }

          if (shouldUnlock) {
            await userAchievementsRepository.unlockAchievement(this.currentUser.id, achievementId, currentValue);
          } else if (this.isProgressAchievement(achievement.type)) {
            // Actualizar progreso para logros acumulativos
            await userAchievementsRepository.updateProgress(this.currentUser.id, achievementId, currentValue);
          }
        }
      }
    } catch (error) {
      console.error("Error verificando logros:", error);
    }
  }

  // ✅ Obtener estadísticas adicionales para logros complejos
  async getAdditionalStats() {
    try {
      const allTasksResult = await taskService.getAll();
      const allTasks = allTasksResult.success ? allTasksResult.data : [];

      const subTasksResult = await taskService.getAll(); // Esto debería ser del SubTaskService
      const subTasks = []; // TODO: Implementar método en SubTaskService

      let highPriorityTasks = 0;
      let earlyTasks = 0;
      let sundayTasks = 0;
      let soloTasks = 0;
      const tasksByDay = {};

      allTasks.forEach(task => {
        // Tareas de alta prioridad
        if (task.id_Priority === 3) highPriorityTasks++; // Asumiendo ID 3 = Alta

        // Tareas completadas temprano
        if (task.state && task.endDate) {
          const completionTime = new Date(task.endDate);
          if (completionTime.getHours() < 9) earlyTasks++;
        }

        // Tareas completadas en domingo
        if (task.state && task.endDate) {
          const completionDate = new Date(task.endDate);
          if (completionDate.getDay() === 0) sundayTasks++;
        }

        // Tareas sin subtareas
        if (task.state && !subTasks.some(st => st.id_Task === task.id_Task)) {
          soloTasks++;
        }

        // Contar tareas por día
        if (task.state && task.endDate) {
          const dayKey = new Date(task.endDate).toDateString();
          tasksByDay[dayKey] = (tasksByDay[dayKey] || 0) + 1;
        }
      });

      const maxTasksInDay = Math.max(...Object.values(tasksByDay), 0);

      return {
        highPriorityTasks,
        earlyTasks,
        sundayTasks,
        soloTasks,
        subTasksCreated: subTasks.length,
        subTasksCompleted: subTasks.filter(st => st.state).length,
        maxTasksInDay
      };
    } catch (error) {
      console.error("Error obteniendo estadísticas adicionales:", error);
      return {
        highPriorityTasks: 0,
        earlyTasks: 0,
        sundayTasks: 0,
        soloTasks: 0,
        subTasksCreated: 0,
        subTasksCompleted: 0,
        maxTasksInDay: 0
      };
    }
  }

  // ✅ Verificar si un logro permite progreso
  isProgressAchievement(type) {
    return ["completed_tasks", "streak", "tasks_created", "high_priority_tasks",
            "subtasks_created", "early_tasks", "subtasks_completed", "sunday_tasks"].includes(type);
  }

  // ✅ Obtener logros del usuario con progreso
  async getAchievements() {
    try {
      if (!this.currentUser) return [];

      const userAchievementsList = await userAchievementsRepository.getByUser(this.currentUser.id);
      const stats = await this.getByCurrentUser();

      const result = [];

      for (const [achievementId, achievement] of Object.entries(achievements)) {
        const userAchievement = userAchievementsList.find(ua => ua.achievementId === achievementId);

        let currentProgress = 0;
        let isCompleted = false;

        if (userAchievement) {
          isCompleted = userAchievement.isCompleted;
          currentProgress = userAchievement.progress;
        } else {
          // Calcular progreso actual si no está desbloqueado
          switch (achievement.type) {
            case "completed_tasks":
              currentProgress = stats ? stats.completedTasks : 0;
              break;
            case "streak":
              currentProgress = stats ? stats.racha : 0;
              break;
            case "tasks_created":
              currentProgress = stats ? stats.totalTasks : 0;
              break;
            // Otros tipos...
          }
        }

        result.push({
          id: achievementId,
          name: achievement.name,
          description: achievement.description,
          icon: achievement.icon,
          difficulty: achievement.difficulty,
          color: achievement.color,
          targetValue: achievement.targetValue,
          currentProgress,
          isCompleted,
          progressPercentage: Math.min((currentProgress / achievement.targetValue) * 100, 100)
        });
      }

      return result;
    } catch (error) {
      console.error("Error obteniendo logros:", error);
      return [];
    }
  }

  // ✅ Obtener mensaje motivacional basado en racha
  async getMotivationalMessage() {
    const stats = await this.getByCurrentUser();
    const streak = stats ? stats.racha : 0;
    return getMotivationalMessage(streak);
  }

  // ✅ Obtener estadísticas de logros del usuario actual
  async getAchievementsStats() {
    try {
      if (!this.currentUser) {
        return new OperationResult(false, "Usuario no autenticado.");
      }

      const stats = await this.getAchievementStats(this.currentUser.id);
      return stats;
    } catch (error) {
      return new OperationResult(false, `Error al obtener estadísticas de logros: ${error.message}`);
    }
  }

  // ✅ Obtener estadísticas del usuario actual
  async getByCurrentUser() {
    try {
      if (!this.currentUser) return null;
      let stats = await statisticsRepository.getByUser(this.currentUser.id);
      if (!stats) {
        const defaults = statisticsRepository.defaultStatistics(this.currentUser.id);
        stats = await statisticsRepository.save(defaults);
      }
      return stats;
    } catch (error) {
      console.error("Error obteniendo estadísticas del usuario:", error);
      return null;
    }
  }

  // ✅ CRUD básico
  async save(statistics) {
    try {
      if (!statistics) return new OperationResult(false, "Las estadísticas no pueden ser nulas.");

      const existingStats = await statisticsRepository.getById(statistics.id_Statistics);
      if (existingStats) {
        return new OperationResult(false, "Las estadísticas ya existen.");
      }

      const saved = await statisticsRepository.save(statistics);
      if (saved) {
        return new OperationResult(true, "Estadísticas guardadas exitosamente.", saved);
      } else {
        return new OperationResult(false, "Error al guardar estadísticas.");
      }
    } catch (error) {
      return new OperationResult(false, `Error al guardar estadísticas: ${error.message}`);
    }
  }

  async getAll() {
    try {
      const stats = await statisticsRepository.getAll();
      return new OperationResult(true, "Estadísticas obtenidas exitosamente.", stats);
    } catch (error) {
      return new OperationResult(false, `Error al obtener estadísticas: ${error.message}`);
    }
  }

  async getById(id) {
    try {
      if (!id || id <= 0) {
        return new OperationResult(false, "ID de estadísticas inválido.");
      }

      const stats = await statisticsRepository.getById(id);
      if (stats) {
        return new OperationResult(true, "Estadísticas encontradas.", stats);
      } else {
        return new OperationResult(false, "Estadísticas no encontradas.");
      }
    } catch (error) {
      return new OperationResult(false, `Error al obtener estadísticas: ${error.message}`);
    }
  }

  async update(statistics) {
    try {
      if (!statistics) {
        return new OperationResult(false, "Las estadísticas no pueden ser nulas.");
      }

      const existingStats = await statisticsRepository.getById(statistics.id_Statistics);
      if (!existingStats) {
        return new OperationResult(false, "Estadísticas no encontradas.");
      }

      const updated = await statisticsRepository.update(statistics);
      if (updated) {
        return new OperationResult(true, "Estadísticas actualizadas exitosamente.");
      } else {
        return new OperationResult(false, "Error al actualizar estadísticas.");
      }
    } catch (error) {
      return new OperationResult(false, `Error al actualizar estadísticas: ${error.message}`);
    }
  }

  async delete(id) {
    try {
      if (!id || id <= 0) {
        return new OperationResult(false, "ID de estadísticas inválido.");
      }

      const existingStats = await statisticsRepository.getById(id);
      if (!existingStats) {
        return new OperationResult(false, "Estadísticas no encontradas.");
      }

      const deleted = await statisticsRepository.delete(id);
      if (deleted) {
        return new OperationResult(true, "Estadísticas eliminadas exitosamente.");
      } else {
        return new OperationResult(false, "Error al eliminar estadísticas.");
      }
    } catch (error) {
      return new OperationResult(false, `Error al eliminar estadísticas: ${error.message}`);
    }
  }

  // ✅ Actualizar meta diaria
  async updateDailyGoal(newGoal) {
    try {
      if (!newGoal || newGoal <= 0) {
        return new OperationResult(false, "La meta diaria debe ser mayor a 0.");
      }

      const stats = await this.getByCurrentUser();
      if (!stats) {
        return new OperationResult(false, "Estadísticas no encontradas.");
      }

      stats.dailyGoal = newGoal;
      const updated = await statisticsRepository.update(stats);
      if (updated) {
        return new OperationResult(true, "Meta diaria actualizada exitosamente.");
      } else {
        return new OperationResult(false, "Error al actualizar meta diaria.");
      }
    } catch (error) {
      return new OperationResult(false, `Error al actualizar meta diaria: ${error.message}`);
    }
  }
}
