// src/controllers/StatisticsController.js
import { StatisticsService } from "../services/StatisticsService.js";
import { requireSupabaseClient } from "../lib/supabaseAdmin.js";

const statisticsService = new StatisticsService();

export class StatisticsController {
  constructor() {
    // Middleware para inyectar usuario en el servicio
    this.injectUser = (req, res, next) => {
      if (req.user) {
        statisticsService.setCurrentUser(req.user);
      }
      next();
    };
  }

  // Updated to use the enhanced getDashboardStats
  async getByUser(req, res) {
    // Prefer getDashboardStats for the frontend StatsPage
    const result = await statisticsService.getDashboardStats();

    if (result.success) {
      res.status(200).json(result.data);
    } else {
      // Fallback or error handling
      res.status(401).json({ error: result.message });
    }
  }

  // Simple stats for HomePage
  async getHomePageStats(req, res) {
    const result = await statisticsService.getHomePageStats();
    res.status(result.success ? 200 : 500).json(result);
  }

  async update(req, res) {
    const result = await statisticsService.update(req.body);
    res.status(result.success ? 200 : 400).json(result);
  }

  async checkAchievements(req, res) {
    // This method in service returns void in some paths or promise, checking logic
    await statisticsService.checkAchievements();
    res.status(200).json({ success: true, message: "Achievements checked" });
  }

  async getAchievementsStats(req, res) {
    const result = await statisticsService.getAchievementsStats();
    res.status(result.success ? 200 : 401).json(result);
  }

  async getStreakStats(req, res) {
    try {
      statisticsService.setCurrentUser(req.user);
      const stats = await statisticsService.getByCurrentUser();
      if (!stats) {
        return res.status(404).json({ error: 'Statistics not found' });
      }

      // Get tasks completed today
      const taskService = (await import('../services/TaskService.js')).TaskService;
      const taskSvc = new taskService();
      taskSvc.setCurrentUser(req.user);

      const completedTodayResult = await taskSvc.getCompletedTodayByUser();
      const tasksCompletedToday = completedTodayResult.success ? completedTodayResult.data.length : 0;

      // Get total subtasks completed (historical)
      const allTasks = await taskSvc.getAll();
      let totalSubTasksCompleted = 0;
      if (allTasks.success) {
        const subTaskRepository = (await import('../repositories/SubTaskRepository.js')).default;
        const subTaskRepo = new subTaskRepository();
        for (const task of allTasks.data) {
          const subTasks = await subTaskRepo.getAllByTaskId(task.id_Task);
          totalSubTasksCompleted += subTasks.filter(st => st.state).length;
        }
      }

      // Get motivational message
      const motivationalMessages = await statisticsService.getMotivationalMessage();
      const randomMessage = motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)];

      const streakData = {
        currentStreak: stats.racha || 0,
        dailyGoal: stats.dailyGoal || 5,
        tasksCompletedToday,
        progressPercentage: Math.min((tasksCompletedToday / (stats.dailyGoal || 5)) * 100, 100),
        lastCompletedDate: stats.lastRachaDate,
        motivationalMessage: randomMessage,
        bestStreak: stats.bestStreak || 0,
        totalSubTasksCompleted
      };

      res.status(200).json(streakData);
    } catch (error) {
      console.error('Error getting streak stats:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // ✅ New endpoint for additional stats widgets - OPTIMIZED
  async getAdditionalStats(req, res) {
    try {
      const supabase = requireSupabaseClient();
      const userId = req.user.id;

      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);

      // Run all count queries in parallel for maximum performance
      const [
        eventsResult,
        upcomingEventsResult,
        projectsResult,
        activeProjectsResult,
        notesResult,
        recentNotesResult,
        categoriesResult,
        priorityDataResult,
        completedTasksResult,
        achievementsResult
      ] = await Promise.all([
        supabase.from('events').select('*', { count: 'exact', head: true }).eq('user_id', userId),
        supabase.from('events').select('*', { count: 'exact', head: true }).eq('user_id', userId).gte('date', today.toISOString()),
        supabase.from('projects').select('*', { count: 'exact', head: true }).eq('user_id', userId),
        supabase.from('projects').select('*', { count: 'exact', head: true }).eq('user_id', userId).neq('status', 'completed'),
        supabase.from('notes').select('*', { count: 'exact', head: true }).eq('user_id', userId),
        supabase.from('notes').select('*', { count: 'exact', head: true }).eq('user_id', userId).gte('created_at', weekAgo.toISOString()),
        supabase.from('categories').select('*', { count: 'exact', head: true }).eq('user_id', userId),
        supabase.from('tasks').select('priority_id').eq('user_id', userId),
        supabase.from('tasks').select('created_at, endDate').eq('user_id', userId).not('endDate', 'is', null).eq('completed', true).order('created_at', { ascending: false }).limit(50),
        supabase.from('user_achievements').select('achievementId, unlockedAt').eq('user_id', userId).order('unlockedAt', { ascending: false }).limit(3)
      ]);

      // Process priority stats
      const priorityStats = { high: 0, medium: 0, low: 0 };
      if (priorityDataResult.data) {
        priorityDataResult.data.forEach(task => {
          const priorityId = task.priority_id;
          if (priorityId === 3) priorityStats.high++;
          else if (priorityId === 2) priorityStats.medium++;
          else if (priorityId === 1) priorityStats.low++;
        });
      }

      // Calculate average completion time
      let averageCompletionTime = 0;
      if (completedTasksResult.data && completedTasksResult.data.length > 0) {
        const times = completedTasksResult.data.map(task => {
          const created = new Date(task.created_at);
          const completed = new Date(task.endDate);
          return (completed - created) / (1000 * 60 * 60); // hours
        }).filter(time => time > 0 && time < 24 * 30);
        averageCompletionTime = times.length > 0 ? times.reduce((a, b) => a + b, 0) / times.length : 0;
      }

      const additionalStats = {
        totalEvents: eventsResult.count || 0,
        upcomingEvents: upcomingEventsResult.count || 0,
        completedEvents: (eventsResult.count || 0) - (upcomingEventsResult.count || 0),
        totalProjects: projectsResult.count || 0,
        activeProjects: activeProjectsResult.count || 0,
        totalNotes: notesResult.count || 0,
        recentNotes: recentNotesResult.count || 0,
        totalCategories: categoriesResult.count || 0,
        priorityStats,
        averageCompletionTime: parseFloat(averageCompletionTime.toFixed(1)),
        recentAchievements: achievementsResult.data || []
      };

      res.status(200).json(additionalStats);
    } catch (error) {
      console.error('Error getting additional stats:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // ✅ New method for /api/statistics/tasks
  async getTaskStats(req, res) {
    const result = await statisticsService.getTaskStatistics();
    if (result.success) {
      res.status(200).json(result.data);
    } else {
      res.status(500).json({ error: result.message });
    }
  }

  async updateDailyGoal(req, res) {
    const { dailyGoal } = req.body;
    const result = await statisticsService.updateDailyGoal(dailyGoal);
    res.status(result.success ? 200 : 400).json(result);
  }
}
