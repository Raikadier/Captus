// src/controllers/StatisticsController.js
import { StatisticsService } from "../services/StatisticsService.js";

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
    // Create a simple streak stats response
    const stats = await statisticsService.getByCurrentUser();
    if (!stats) {
      return res.status(404).json({ error: 'Statistics not found' });
    }

    const streakData = {
      currentStreak: stats.racha || 0,
      dailyGoal: stats.dailyGoal || 5,
      lastCompletedDate: stats.lastRachaDate,
      completionRate: 0 // Placeholder, could be calculated
    };

    res.status(200).json(streakData);
  }
}
