// src/routes/StatisticsRoutes.js
import express from "express";
import { StatisticsService } from "../service/StatisticsService.js";

const router = express.Router();
const statisticsService = new StatisticsService();

router.use((req, _res, next) => {
  if (req.user) {
    statisticsService.setCurrentUser(req.user);
  }
  next();
});

// Rutas de estadísticas
router.get("/", async (req, res) => {
  const stats = await statisticsService.getByCurrentUser();
  res.status(stats ? 200 : 404).json(
    stats ? { success: true, data: stats } : { success: false, message: "Estadísticas no encontradas" }
  );
});

router.get("/achievements", async (req, res) => {
  const achievements = await statisticsService.getAchievements();
  res.status(200).json({ success: true, data: achievements });
});

router.get("/motivational-message", async (req, res) => {
  const messages = await statisticsService.getMotivationalMessage();
  res.status(200).json({ success: true, data: messages });
});

router.get("/weekly", async (req, res) => {
  const weeklyStats = await statisticsService.getWeeklyStats();
  res.status(weeklyStats ? 200 : 500).json(
    weeklyStats ? { success: true, data: weeklyStats } : { success: false, message: "Error obteniendo estadísticas semanales" }
  );
});

router.get("/completion-percentage", async (req, res) => {
  const percentage = await statisticsService.getCompletionPercentage();
  res.status(200).json({ success: true, data: { percentage } });
});

router.put("/daily-goal", async (req, res) => {
  const { dailyGoal } = req.body;
  const result = await statisticsService.updateDailyGoal(dailyGoal);
  res.status(result.success ? 200 : 400).json(result);
});

router.post("/check-streak", async (req, res) => {
  await statisticsService.checkStreak();
  res.status(200).json({ success: true, message: "Racha verificada" });
});

router.post("/update-general", async (req, res) => {
  await statisticsService.updateGeneralStats();
  res.status(200).json({ success: true, message: "Estadísticas generales actualizadas" });
});

export default router;
