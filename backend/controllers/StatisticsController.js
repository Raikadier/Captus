// src/controllers/StatisticsController.js
import { StatisticsService } from "../service/StatisticsService.js";

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

  async getByUser(req, res) {
    const result = await statisticsService.getByCurrentUser();
    res.status(result ? 200 : 401).json(result ? { success: true, data: result } : { success: false, message: "Estadísticas no encontradas" });
  }

  async update(req, res) {
    const result = await statisticsService.update(req.body);
    res.status(result.success ? 200 : 400).json(result);
  }

  async checkAchievements(req, res) {
    const result = await statisticsService.checkAchievements();
    res.status(result.success ? 200 : 400).json(result);
  }

  async getAchievementsStats(req, res) {
    const result = await statisticsService.getAchievementsStats();
    res.status(result.success ? 200 : 401).json(result);
  }
}