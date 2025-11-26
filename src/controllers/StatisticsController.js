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

  // ✅ New endpoint for additional stats widgets
  async getAdditionalStats(req, res) {
    try {
      const supabase = requireSupabaseClient();
      const userId = req.user.id;

      // Get events stats
      const { count: totalEvents, error: eventsError } = await supabase
        .from('events')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId);

      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const { count: upcomingEvents, error: upcomingError } = await supabase
        .from('events')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .gte('date', today.toISOString());

      // Get projects stats
      const { count: totalProjects, error: projectsError } = await supabase
        .from('projects')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId);

      // Get active projects (not completed)
      const { count: activeProjects, error: activeProjectsError } = await supabase
        .from('projects')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .neq('status', 'completed');

      // Get notes stats
      const { count: totalNotes, error: notesError } = await supabase
        .from('notes')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId);

      // Get recent notes (last 7 days)
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);

      const { count: recentNotes, error: recentNotesError } = await supabase
        .from('notes')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .gte('created_at', weekAgo.toISOString());

      // Get categories stats
      const { count: totalCategories, error: categoriesError } = await supabase
        .from('categories')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId);

      // Get priority stats
      const { data: priorityData, error: priorityError } = await supabase
        .from('tasks')
        .select('id_Priority')
        .eq('user_id', userId);

      const priorityStats = { high: 0, medium: 0, low: 0 };
      if (priorityData) {
        priorityData.forEach(task => {
          if (task.id_Priority === 3) priorityStats.high++;
          else if (task.id_Priority === 2) priorityStats.medium++;
          else if (task.id_Priority === 1) priorityStats.low++;
        });
      }

      // Get average completion time (in hours)
      const { data: completedTasks, error: timeError } = await supabase
        .from('tasks')
        .select('created_at, endDate')
        .eq('user_id', userId)
        .not('endDate', 'is', null)
        .eq('completed', true)
        .order('created_at', { ascending: false })
        .limit(50); // Last 50 completed tasks

      let averageCompletionTime = 0;
      if (completedTasks && completedTasks.length > 0) {
        const times = completedTasks.map(task => {
          const created = new Date(task.created_at);
          const completed = new Date(task.endDate);
          return (completed - created) / (1000 * 60 * 60); // hours
        }).filter(time => time > 0 && time < 24 * 30); // reasonable range
        averageCompletionTime = times.length > 0 ? times.reduce((a, b) => a + b, 0) / times.length : 0;
      }

      // Get recent achievements
      const { data: recentAchievements, error: achievementsError } = await supabase
        .from('user_achievements')
        .select(`
          achievementId,
          unlockedAt,
          achievements!inner(name, icon, color)
        `)
        .eq('user_id', userId)
        .order('unlockedAt', { ascending: false })
        .limit(3);

      const additionalStats = {
        totalEvents: totalEvents || 0,
        upcomingEvents: upcomingEvents || 0,
        totalProjects: totalProjects || 0,
        activeProjects: activeProjects || 0,
        totalNotes: totalNotes || 0,
        recentNotes: recentNotes || 0,
        totalCategories: totalCategories || 0,
        priorityStats,
        averageCompletionTime: parseFloat(averageCompletionTime.toFixed(1)),
        recentAchievements: recentAchievements || []
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
