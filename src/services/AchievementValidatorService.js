import { achievements } from "../shared/achievementsConfig.js";
import UserAchievementsRepository from "../repositories/UserAchievementsRepository.js";
import TaskRepository from "../repositories/TaskRepository.js";
import StatisticsRepository from "../repositories/StatisticsRepository.js";

const userAchievementsRepository = new UserAchievementsRepository();
const taskRepository = new TaskRepository();
const statisticsRepository = new StatisticsRepository();

export class AchievementValidatorService {
  constructor() {
    this.currentUser = null;
  }

  setCurrentUser(user) {
    this.currentUser = user;
  }

  /**
   * Valida todos los logros para un usuario
   * @param {string} userId - ID del usuario
   * @returns {Promise<Array>} - Array de logros desbloqueados
   */
  async validateAllAchievements(userId) {
    if (!userId) return [];

    const unlockedAchievements = [];

    for (const [achievementId, achievement] of Object.entries(achievements)) {
      try {
        const isUnlocked = await this.validateAchievement(userId, achievementId);
        if (isUnlocked) {
          unlockedAchievements.push({
            achievementId,
            achievement,
            unlockedAt: new Date()
          });
        }
      } catch (error) {
        console.error(`Error validating achievement ${achievementId}:`, error);
      }
    }

    return unlockedAchievements;
  }

  /**
   * Valida un logro específico para un usuario
   * @param {string} userId - ID del usuario
   * @param {string} achievementId - ID del logro
   * @returns {Promise<boolean>} - True si el logro debe ser desbloqueado
   */
  async validateAchievement(userId, achievementId) {
    // Verificar si ya tiene el logro desbloqueado
    const existing = await userAchievementsRepository.getByUserAndAchievement(userId, achievementId);
    if (existing && existing.isCompleted) {
      return false; // Ya lo tiene desbloqueado
    }

    const achievement = achievements[achievementId];
    if (!achievement) return false;

    const progress = await this.calculateProgress(userId, achievement);

    // Si el progreso alcanza el objetivo, desbloquear el logro
    if (progress >= achievement.targetValue) {
      await userAchievementsRepository.unlockAchievement(userId, achievementId, progress);
      return true;
    }

    // Si no está completado pero tiene progreso, actualizar progreso
    if (existing) {
      await userAchievementsRepository.updateProgress(userId, achievementId, progress);
    } else if (progress > 0) {
      // Crear entrada con progreso si no existe
      await userAchievementsRepository.save({
        id_User: userId,
        achievementId,
        progress,
        isCompleted: false,
        unlockedAt: null,
      });
    }

    return false;
  }

  /**
   * Calcula el progreso actual de un logro para un usuario
   * @param {string} userId - ID del usuario
   * @param {Object} achievement - Configuración del logro
   * @returns {Promise<number>} - Progreso actual
   */
  async calculateProgress(userId, achievement) {
    switch (achievement.type) {
      case 'completed_tasks':
        return await this.getCompletedTasksCount(userId);

      case 'high_priority_tasks':
        return await this.getHighPriorityTasksCount(userId);

      case 'subtasks_created':
        return await this.getSubtasksCreatedCount(userId);

      case 'tasks_created':
        return await this.getTasksCreatedCount(userId);

      case 'streak':
        return await this.getCurrentStreak(userId);

      case 'early_tasks':
        return await this.getEarlyTasksCount(userId);

      case 'subtasks_completed':
        return await this.getSubtasksCompletedCount(userId);

      case 'tasks_in_day':
        return await this.getMaxTasksInDay(userId);

      case 'solo_tasks':
        return await this.getSoloTasksCount(userId);

      case 'sunday_tasks':
        return await this.getSundayTasksCount(userId);

      default:
        return 0;
    }
  }

  // Métodos auxiliares para calcular progreso de cada tipo de logro

  async getCompletedTasksCount(userId) {
    const tasks = await taskRepository.getByUser(userId);
    return tasks.filter(task => task.state === true || task.completed === true).length;
  }

  async getHighPriorityTasksCount(userId) {
    const tasks = await taskRepository.getByUser(userId);
    return tasks.filter(task => task.Priority?.name === 'Alta' || task.priority === 'high').length;
  }

  async getSubtasksCreatedCount(userId) {
    // Esto requiere acceder a la tabla de subtareas
    // Por ahora, devolver 0 hasta implementar
    return 0;
  }

  async getTasksCreatedCount(userId) {
    const tasks = await taskRepository.getByUser(userId);
    return tasks.length;
  }

  async getCurrentStreak(userId) {
    // Obtener estadísticas de racha del servicio de estadísticas
    const streakStats = await statisticsRepository.getStreakStats(userId);
    return streakStats?.currentStreak || 0;
  }

  async getEarlyTasksCount(userId) {
    const tasks = await taskRepository.getByUser(userId);
    const earlyTasks = tasks.filter(task => {
      if (!task.endDate) return false;
      const endTime = new Date(task.endDate);
      return endTime.getHours() < 9; // Antes de las 9 AM
    });
    return earlyTasks.length;
  }

  async getSubtasksCompletedCount(userId) {
    // Esto requiere acceder a la tabla de subtareas
    // Por ahora, devolver 0 hasta implementar
    return 0;
  }

  async getMaxTasksInDay(userId) {
    const tasks = await taskRepository.getByUser(userId);
    const completedTasks = tasks.filter(task => task.state === true || task.completed === true);

    // Agrupar por día
    const tasksByDay = {};
    completedTasks.forEach(task => {
      if (task.endDate) {
        const date = new Date(task.endDate).toDateString();
        tasksByDay[date] = (tasksByDay[date] || 0) + 1;
      }
    });

    // Encontrar el máximo
    return Math.max(...Object.values(tasksByDay), 0);
  }

  async getSoloTasksCount(userId) {
    const tasks = await taskRepository.getByUser(userId);
    // Tareas completadas que no tienen subtareas
    // Esto requiere verificar si tienen subtareas asociadas
    // Por ahora, contar todas las tareas completadas
    return tasks.filter(task => task.state === true || task.completed === true).length;
  }

  async getSundayTasksCount(userId) {
    const tasks = await taskRepository.getByUser(userId);
    const sundayTasks = tasks.filter(task => {
      if (!task.endDate) return false;
      const endDate = new Date(task.endDate);
      return endDate.getDay() === 0; // Domingo
    });
    return sundayTasks.length;
  }

  /**
   * Método para ser llamado después de completar una tarea
   * @param {string} userId - ID del usuario
   */
  async onTaskCompleted(userId) {
    // Validar logros relacionados con tareas completadas
    const taskRelatedAchievements = [
      'first_task', 'productivo', 'maraton', 'maestro', 'titan', 'dios_productividad',
      'early_tasks', 'tasks_in_day', 'solo_tasks', 'sunday_tasks'
    ];

    for (const achievementId of taskRelatedAchievements) {
      await this.validateAchievement(userId, achievementId);
    }
  }

  /**
   * Método para ser llamado después de crear una tarea
   * @param {string} userId - ID del usuario
   */
  async onTaskCreated(userId) {
    // Validar logros relacionados con creación de tareas
    const creationAchievements = ['explorador', 'prioritario'];

    for (const achievementId of creationAchievements) {
      await this.validateAchievement(userId, achievementId);
    }
  }

  /**
   * Método para ser llamado después de crear una subtarea
   * @param {string} userId - ID del usuario
   */
  async onSubtaskCreated(userId) {
    await this.validateAchievement(userId, 'subdivisor');
  }

  /**
   * Método para ser llamado después de completar una subtarea
   * @param {string} userId - ID del usuario
   */
  async onSubtaskCompleted(userId) {
    await this.validateAchievement(userId, 'multitarea');
  }

  /**
   * Método para ser llamado diariamente para verificar rachas
   * @param {string} userId - ID del usuario
   */
  async onDailyCheck(userId) {
    const streakAchievements = ['consistente', 'leyenda', 'inmortal'];

    for (const achievementId of streakAchievements) {
      await this.validateAchievement(userId, achievementId);
    }
  }
}