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
}
