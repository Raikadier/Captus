// src/service/StatisticsService.js
import StatisticsRepository from "../repositories/StatisticsRepository.js";
import UserAchievementsRepository from "../repositories/UserAchievementsRepository.js";
import { TaskService } from "./TaskService.js";
import { SubjectService } from "./SubjectService.js";
import { OperationResult } from "../shared/OperationResult.js";
import { achievements, getMotivationalMessage } from "../shared/achievementsConfig.js";
import { requireSupabaseClient } from "../lib/supabaseAdmin.js";

const statisticsRepository = new StatisticsRepository();
const userAchievementsRepository = new UserAchievementsRepository();
const taskService = new TaskService();
const subjectService = new SubjectService();

export class StatisticsService {
  constructor() {
    this.currentUser = null;
  }

  setCurrentUser(user) {
    this.currentUser = user;
    taskService.setCurrentUser(user);
    subjectService.setCurrentUser(user);
  }

  // ✅ Enhanced Dashboard Stats - Focused on streak and favorite category
  async getDashboardStats() {
    try {
      if (!this.currentUser) return new OperationResult(false, "Not authenticated");

      // Check and update streak before getting stats
      await this.checkStreak();

      // Get base stats
      const baseStats = await this.getByCurrentUser();

      // Get academic stats
      const subjectsResult = await subjectService.getAllByUser();
      const subjects = subjectsResult.success ? subjectsResult.data : [];

      const averageGrade = subjects.length > 0
        ? subjects.reduce((acc, sub) => acc + sub.grade, 0) / subjects.length
        : 0;

      // Get favorite category analysis
      const favoriteCategoryAnalysis = await this.getFavoriteCategoryAnalysis();

      return new OperationResult(true, "Dashboard stats retrieved", {
        ...baseStats,
        averageGrade: parseFloat(averageGrade.toFixed(2)),
        subjects,
        favoriteCategoryAnalysis
      });
    } catch (error) {
      return new OperationResult(false, `Error fetching dashboard stats: ${error.message}`);
    }
  }

  // ✅ Simple Dashboard Stats for HomePage
  async getHomePageStats() {
    try {
      if (!this.currentUser) return new OperationResult(false, "Usuario no autenticado");

      const supabaseClient = requireSupabaseClient();

      // Get total tasks efficiently
      const { count: totalTasks, error: tasksError } = await supabaseClient
        .from('tasks')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', this.currentUser.id);

      if (tasksError) {
        console.error('Error counting tasks:', tasksError);
        return new OperationResult(false, `Error obteniendo estadísticas del dashboard: ${tasksError.message}`);
      }

      // Get total notes directly from database
      const { count: totalNotes, error: notesError } = await supabaseClient
        .from('notes')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', this.currentUser.id);

      if (notesError) {
        console.error('Error counting notes:', notesError);
        return new OperationResult(false, `Error obteniendo estadísticas del dashboard: ${notesError.message}`);
      }

      return new OperationResult(true, "Estadísticas del dashboard obtenidas", {
        totalTasks: totalTasks || 0,
        totalNotes: totalNotes || 0,
        // Próximos eventos y recordatorios activos serán implementados después
        upcomingEvents: 0,
        activeReminders: 0
      });
    } catch (error) {
      return new OperationResult(false, `Error obteniendo estadísticas del dashboard: ${error.message}`);
    }
  }

  // ... [Rest of the existing methods remain unchanged, just re-exporting them below] ...

  async checkStreak() {
    try {
      const stats = await this.getByCurrentUser();
      if (!stats) return;

      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);

      // Get tasks completed today
      const completedTodayResult = await taskService.getCompletedTodayByUser();
      const tasksCompletedToday = completedTodayResult.success ? completedTodayResult.data.length : 0;

      // console.log(`[STREAK] Checking streak: ${tasksCompletedToday}/${stats.dailyGoal} tasks completed today`);

      let streakChanged = false;
      const lastCompletionDate = stats.lastRachaDate ? new Date(stats.lastRachaDate) : null;
      const lastCompletionDateString = lastCompletionDate ? lastCompletionDate.toDateString() : null;
      const todayString = today.toDateString();
      const yesterdayString = yesterday.toDateString();

      // console.log(`[STREAK] Last completion: ${lastCompletionDateString}, Today: ${todayString}, Yesterday: ${yesterdayString}`);
      // console.log(`[STREAK] Current streak before check: ${stats.racha}`);

      if (tasksCompletedToday >= stats.dailyGoal) {
        // Goal achieved today
        // console.log(`[STREAK] Goal achieved! Current streak: ${stats.racha}`);

        if (!lastCompletionDate || lastCompletionDateString !== todayString) {
          // Check if yesterday was also completed (consecutive streak)
          const yesterdayCompleted = lastCompletionDateString === yesterdayString;

          if (yesterdayCompleted) {
            stats.racha += 1;
            // console.log(`[STREAK] Consecutive day! New streak: ${stats.racha}`);
          } else {
            stats.racha = 1;
            // console.log(`[STREAK] New streak started: ${stats.racha}`);
          }

          stats.lastRachaDate = today;
          streakChanged = true;
        } else {
          // console.log(`[STREAK] Already updated for today`);
        }
      } else {
        // Goal not achieved today - check if we need to reset streak
        // console.log(`[STREAK] Goal not achieved. Checking if streak should reset...`);

        if (lastCompletionDate && lastCompletionDateString !== todayString && lastCompletionDateString !== yesterdayString) {
          // Last completion was before yesterday, reset streak
          console.log(`[STREAK] Resetting streak from ${stats.racha} to 0`);
          stats.racha = 0;
          stats.lastRachaDate = null;
          streakChanged = true;
        } else {
          // console.log(`[STREAK] Streak maintained: ${stats.racha}`);
        }
      }

      // Update best streak if current is higher
      if (stats.racha > stats.bestStreak) {
        stats.bestStreak = stats.racha;
        // console.log(`[STREAK] New best streak: ${stats.bestStreak}`);
        streakChanged = true;
      }

      if (streakChanged) {
        console.log(`[STREAK] Updating stats in database...`);
        await statisticsRepository.update(stats);
      } else {
        // console.log(`[STREAK] No changes needed`);
      }

      // try {
      //   await this.checkAchievements();
      // } catch (error) {
      //   // Ignore achievements errors for now
      //   // console.log('[STREAK] Achievements check failed, ignoring');
      // }
    } catch (error) {
      console.error("Error verificando racha:", error);
    }
  }

  async updateGeneralStats() {
    try {
      const stats = await this.getByCurrentUser();
      if (!stats) return;

      const allTasksResult = await taskService.getAll();
      const allTasks = allTasksResult.success ? allTasksResult.data : [];

      const completedTasksResult = await taskService.getCompletedByUser();
      const completedTasks = completedTasksResult.success ? completedTasksResult.data : [];

      stats.totalTasks = allTasks.length;
      stats.completedTasks = completedTasks.length;

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
      // await this.checkAchievements();
    } catch (error) {
      console.error("Error actualizando estadísticas generales:", error);
    }
  }

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

  async getWeeklyStats() {
    try {
      const stats = await this.getByCurrentUser();
      if (!stats) return null;

      const today = new Date();
      const weekStart = new Date(today);
      weekStart.setDate(today.getDate() - today.getDay());
      weekStart.setHours(0, 0, 0, 0);

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

  async checkAchievements() {
    try {
      if (!this.currentUser) return;
      const stats = await this.getByCurrentUser();
      if (!stats) return;
      const additionalStats = await this.getAdditionalStats();

      for (const [achievementId, achievement] of Object.entries(achievements)) {
        const hasAchievement = await userAchievementsRepository.hasAchievement(this.currentUser.id, achievementId);

        if (!hasAchievement) {
          let currentValue = 0;
          let shouldUnlock = false;

          switch (achievement.type) {
            case "completed_tasks": currentValue = stats.completedTasks; shouldUnlock = currentValue >= achievement.targetValue; break;
            case "streak": currentValue = stats.racha; shouldUnlock = currentValue >= achievement.targetValue; break;
            case "tasks_created": currentValue = stats.totalTasks; shouldUnlock = currentValue >= achievement.targetValue; break;
            case "high_priority_tasks": currentValue = additionalStats.highPriorityTasks; shouldUnlock = currentValue >= achievement.targetValue; break;
            case "subtasks_created": currentValue = additionalStats.subTasksCreated; shouldUnlock = currentValue >= achievement.targetValue; break;
            case "early_tasks": currentValue = additionalStats.earlyTasks; shouldUnlock = currentValue >= achievement.targetValue; break;
            case "subtasks_completed": currentValue = additionalStats.subTasksCompleted; shouldUnlock = currentValue >= achievement.targetValue; break;
            case "tasks_in_day": currentValue = additionalStats.maxTasksInDay; shouldUnlock = currentValue >= achievement.targetValue; break;
            case "solo_tasks": currentValue = additionalStats.soloTasks; shouldUnlock = currentValue >= achievement.targetValue; break;
            case "sunday_tasks": currentValue = additionalStats.sundayTasks; shouldUnlock = currentValue >= achievement.targetValue; break;
          }

          if (shouldUnlock) {
            await userAchievementsRepository.unlockAchievement(this.currentUser.id, achievementId, currentValue);
          } else if (this.isProgressAchievement(achievement.type)) {
            await userAchievementsRepository.updateProgress(this.currentUser.id, achievementId, currentValue);
          }
        }
      }
    } catch (error) {
      console.error("Error verificando logros:", error);
    }
  }

  async getAdditionalStats() {
    try {
      const allTasksResult = await taskService.getAll();
      const allTasks = allTasksResult.success ? allTasksResult.data : [];
      const subTasks = [];

      let highPriorityTasks = 0;
      let earlyTasks = 0;
      let sundayTasks = 0;
      let soloTasks = 0;
      const tasksByDay = {};

      allTasks.forEach(task => {
        if (task.id_Priority === 3) highPriorityTasks++;
        if (task.state && task.endDate) {
          const completionTime = new Date(task.endDate);
          if (completionTime.getHours() < 9) earlyTasks++;
        }
        if (task.state && task.endDate) {
          const completionDate = new Date(task.endDate);
          if (completionDate.getDay() === 0) sundayTasks++;
        }
        if (task.state && !subTasks.some(st => st.id_Task === task.id_Task)) {
          soloTasks++;
        }
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
      return { highPriorityTasks: 0, earlyTasks: 0, sundayTasks: 0, soloTasks: 0, subTasksCreated: 0, subTasksCompleted: 0, maxTasksInDay: 0 };
    }
  }

  isProgressAchievement(type) {
    return ["completed_tasks", "streak", "tasks_created", "high_priority_tasks", "subtasks_created", "early_tasks", "subtasks_completed", "sunday_tasks"].includes(type);
  }

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
          switch (achievement.type) {
            case "completed_tasks": currentProgress = stats ? stats.completedTasks : 0; break;
            case "streak": currentProgress = stats ? stats.racha : 0; break;
            case "tasks_created": currentProgress = stats ? stats.totalTasks : 0; break;
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

  async getMotivationalMessage() {
    const stats = await this.getByCurrentUser();
    const streak = stats ? stats.racha : 0;
    return getMotivationalMessage(streak);
  }

  async getAchievementsStats() {
    try {
      if (!this.currentUser) return new OperationResult(false, "Usuario no autenticado.");
      const stats = await userAchievementsRepository.getAchievementStats(this.currentUser.id);
      return new OperationResult(true, "Estadísticas obtenidas exitosamente.", stats);
    } catch (error) {
      return new OperationResult(false, `Error al obtener estadísticas de logros: ${error.message}`);
    }
  }

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

  async save(statistics) {
    try {
      if (!statistics) return new OperationResult(false, "Las estadísticas no pueden ser nulas.");
      const existingStats = await statisticsRepository.getById(statistics.id_Statistics);
      if (existingStats) return new OperationResult(false, "Las estadísticas ya existen.");
      const saved = await statisticsRepository.save(statistics);
      return saved ? new OperationResult(true, "Estadísticas guardadas exitosamente.", saved) : new OperationResult(false, "Error al guardar estadísticas.");
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
      if (!id || id <= 0) return new OperationResult(false, "ID de estadísticas inválido.");
      const stats = await statisticsRepository.getById(id);
      return stats ? new OperationResult(true, "Estadísticas encontradas.", stats) : new OperationResult(false, "Estadísticas no encontradas.");
    } catch (error) {
      return new OperationResult(false, `Error al obtener estadísticas: ${error.message}`);
    }
  }

  async update(statistics) {
    try {
      if (!statistics) return new OperationResult(false, "Las estadísticas no pueden ser nulas.");
      const existingStats = await statisticsRepository.getById(statistics.id_Statistics);
      if (!existingStats) return new OperationResult(false, "Estadísticas no encontradas.");
      const updated = await statisticsRepository.update(statistics);
      return updated ? new OperationResult(true, "Estadísticas actualizadas exitosamente.") : new OperationResult(false, "Error al actualizar estadísticas.");
    } catch (error) {
      return new OperationResult(false, `Error al actualizar estadísticas: ${error.message}`);
    }
  }

  async delete(id) {
    try {
      if (!id || id <= 0) return new OperationResult(false, "ID de estadísticas inválido.");
      const existingStats = await statisticsRepository.getById(id);
      if (!existingStats) return new OperationResult(false, "Estadísticas no encontradas.");
      const deleted = await statisticsRepository.delete(id);
      return deleted ? new OperationResult(true, "Estadísticas eliminadas exitosamente.") : new OperationResult(false, "Error al eliminar estadísticas.");
    } catch (error) {
      return new OperationResult(false, `Error al eliminar estadísticas: ${error.message}`);
    }
  }

  async updateDailyGoal(newGoal) {
    try {
      if (!newGoal || newGoal < 3) return new OperationResult(false, "La meta diaria debe ser al menos 3 tareas.");
      const stats = await this.getByCurrentUser();
      if (!stats) return new OperationResult(false, "Estadísticas no encontradas.");
      stats.dailyGoal = newGoal;
      const updated = await statisticsRepository.update(stats);
      return updated ? new OperationResult(true, "Meta diaria actualizada exitosamente.") : new OperationResult(false, "Error al actualizar meta diaria.");
    } catch (error) {
      return new OperationResult(false, `Error al actualizar meta diaria: ${error.message}`);
    }
  }

  async getCategoryStats() {
    try {
      if (!this.currentUser) return new OperationResult(false, "Usuario no autenticado.");

      const allTasksResult = await taskService.getAll();
      const allTasks = allTasksResult.success ? allTasksResult.data : [];

      const categoryStats = {};

      // Initialize with all user categories
      const categoriesResult = await (await import("./CategoryService.js")).default.prototype.getAll.call({ currentUser: this.currentUser });
      if (categoriesResult.success) {
        categoriesResult.data.forEach(category => {
          categoryStats[category.id_Category] = {
            id: category.id_Category,
            name: category.name,
            totalTasks: 0,
            completedTasks: 0,
            completionRate: 0
          };
        });
      }

      // Calculate stats for each category
      allTasks.forEach(task => {
        if (task.id_Category && categoryStats[task.id_Category]) {
          categoryStats[task.id_Category].totalTasks++;
          if (task.state) {
            categoryStats[task.id_Category].completedTasks++;
          }
        }
      });

      // Calculate completion rates
      Object.values(categoryStats).forEach(stat => {
        stat.completionRate = stat.totalTasks > 0
          ? Math.round((stat.completedTasks / stat.totalTasks) * 100)
          : 0;
      });

      return new OperationResult(true, "Estadísticas por categoría obtenidas exitosamente.", Object.values(categoryStats));
    } catch (error) {
      return new OperationResult(false, `Error al obtener estadísticas por categoría: ${error.message}`);
    }
  }

  // ✅ New method for detailed Task Statistics
  async getTaskStatistics() {
    try {
      if (!this.currentUser) return new OperationResult(false, "Usuario no autenticado");
      const userId = this.currentUser.id;
      const supabase = requireSupabaseClient();

      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);
      const todayEnd = new Date();
      todayEnd.setHours(23, 59, 59, 999);

      // 1. Tasks Created Today
      const { count: tasksCreatedToday, error: createdError } = await supabase
        .from('tasks')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .gte('created_at', todayStart.toISOString())
        .lte('created_at', todayEnd.toISOString());

      if (createdError) throw createdError;

      // 2. Tasks Completed Today
      const { count: tasksCompletedToday, error: completedError } = await supabase
        .from('tasks')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('completed', true)
        .gte('updated_at', todayStart.toISOString())
        .lte('updated_at', todayEnd.toISOString());

      if (completedError) throw completedError;

      // 3. Subtasks Completed Today
      const { count: subTasksCompletedToday, error: subError } = await supabase
        .from('subtasks')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('state', true)
        .gte('updated_at', todayStart.toISOString())
        .lte('updated_at', todayEnd.toISOString());

      // If column doesn't exist, this might fail. But we assume it exists based on instructions.
      // If it fails, we catch and default to 0.

      // 4. Weekly Productivity (Last 7 days)
      const weekStart = new Date();
      weekStart.setDate(weekStart.getDate() - 6);
      weekStart.setHours(0, 0, 0, 0);

      const { data: createdLastWeek, error: weeklyCreatedError } = await supabase
        .from('tasks')
        .select('created_at')
        .eq('user_id', userId)
        .gte('created_at', weekStart.toISOString());

      const { data: completedLastWeek, error: weeklyCompletedError } = await supabase
        .from('tasks')
        .select('updated_at')
        .eq('user_id', userId)
        .eq('completed', true)
        .gte('updated_at', weekStart.toISOString());

      if (weeklyCreatedError || weeklyCompletedError) throw new Error("Error fetching weekly stats");

      const days = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
      const productivityChart = [];

      for (let d = new Date(weekStart); d <= todayEnd; d.setDate(d.getDate() + 1)) {
        const dateStr = d.toISOString().split('T')[0];
        const dayName = days[d.getDay()];
        const createdCount = createdLastWeek.filter(t => t.created_at.startsWith(dateStr)).length;
        const completedCount = completedLastWeek.filter(t => t.updated_at.startsWith(dateStr)).length;
        productivityChart.push({ day: dayName, created: createdCount, completed: completedCount });
      }

      // 5. Total Completed
      const { count: totalCompleted, error: totalError } = await supabase
        .from('tasks')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('completed', true);

      if (totalError) throw totalError;

      // 6. Weekly Completion Rate
      const createdCountWeek = createdLastWeek.length;
      const completedCountWeek = completedLastWeek.length;
      const weeklyCompletionRate = createdCountWeek > 0 ? Math.round((completedCountWeek / createdCountWeek) * 100) : 0;

      // 7. Total Subtasks Completed (Historical)
      const { count: totalSubTasksCompleted, error: subTasksError } = await supabase
        .from('subtasks')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('state', true);

      return new OperationResult(true, "Estadísticas de tareas obtenidas", {
        tasksCreatedToday: tasksCreatedToday || 0,
        tasksCompletedToday: tasksCompletedToday || 0,
        subTasksCompletedToday: subTasksCompletedToday || 0,
        productivityChart,
        totalCompleted: totalCompleted || 0,
        totalSubTasksCompleted: totalSubTasksCompleted || 0,
        weeklyCompletionRate
      });

    } catch (error) {
      console.error("Error fetching task stats:", error);
      // Fallback in case of column missing or other errors
      return new OperationResult(false, `Error obteniendo estadísticas de tareas: ${error.message}`);
    }
  }

  // ✅ Favorite Category Analysis - Intelligent Algorithm
  async getFavoriteCategoryAnalysis() {
    try {
      if (!this.currentUser) return null;

      // Get all tasks for the user
      const allTasks = await taskService.getAll();
      if (!allTasks.success) return null;

      const tasks = allTasks.data;

      // Group tasks by category and calculate metrics
      const categoryStats = {};

      for (const task of tasks) {
        if (task.id_Category) {
          const categoryId = task.id_Category;

          if (!categoryStats[categoryId]) {
            categoryStats[categoryId] = {
              id: categoryId,
              totalTasks: 0,
              completedTasks: 0,
              completionRate: 0,
              score: 0
            };
          }

          categoryStats[categoryId].totalTasks += 1;
          if (task.state) {
            categoryStats[categoryId].completedTasks += 1;
          }
        }
      }

      // Calculate completion rates and scores
      const categories = Object.values(categoryStats);
      categories.forEach(cat => {
        cat.completionRate = cat.totalTasks > 0 ? cat.completedTasks / cat.totalTasks : 0;
        // Score formula: completion rate * log(total tasks + 1)
        // This prioritizes effectiveness over volume, but considers both
        cat.score = cat.completionRate * Math.log(cat.totalTasks + 1);
      });

      // Find the category with the highest score
      if (categories.length === 0) return null;

      const favoriteCategory = categories.reduce((best, current) =>
        current.score > best.score ? current : best
      );

      // Get category details
      const categoryRepository = (await import('../repositories/CategoryRepository.js')).default;
      const catRepo = new categoryRepository();
      const categoryDetails = await catRepo.getById(favoriteCategory.id);

      if (!categoryDetails) return null;

      return {
        category: categoryDetails,
        stats: {
          totalTasks: favoriteCategory.totalTasks,
          completedTasks: favoriteCategory.completedTasks,
          completionRate: Math.round(favoriteCategory.completionRate * 100),
          score: Math.round(favoriteCategory.score * 100) / 100,
          reason: this.getFavoriteCategoryReason(favoriteCategory)
        }
      };
    } catch (error) {
      console.error("Error analyzing favorite category:", error);
      return null;
    }
  }

  getFavoriteCategoryReason(categoryStats) {
    const { totalTasks, completedTasks, completionRate } = categoryStats;

    if (completionRate >= 0.8 && totalTasks >= 10) {
      return `Excelente rendimiento: ${Math.round(completionRate * 100)}% de completación con ${totalTasks} tareas`;
    } else if (completionRate >= 0.7) {
      return `Buen equilibrio: ${Math.round(completionRate * 100)}% de efectividad con ${totalTasks} tareas`;
    } else if (totalTasks >= 20) {
      return `Categoría más activa: ${totalTasks} tareas totales con ${Math.round(completionRate * 100)}% de completación`;
    } else {
      return `Categoría destacada: ${totalTasks} tareas con ${Math.round(completionRate * 100)}% de completación`;
    }
  }

  // ✅ Update Favorite Category when tasks are completed
  async updateFavoriteCategory() {
    try {
      if (!this.currentUser) return;

      const favoriteAnalysis = await this.getFavoriteCategoryAnalysis();
      if (!favoriteAnalysis) return;

      const stats = await this.getByCurrentUser();
      if (!stats) return;

      const updatedStats = {
        ...stats,
        favoriteCategory: favoriteAnalysis.category.id_Category
      };

      await statisticsRepository.update(updatedStats);
    } catch (error) {
      console.error("Error updating favorite category:", error);
    }
  }
}
