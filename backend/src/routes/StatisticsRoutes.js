import express from "express";
import { StatisticsController } from "../controllers/StatisticsController.js";
import buildSupabaseAuthMiddleware from "../middlewares/verifySupabaseToken.js";
import { getSupabaseClient } from "../lib/supabaseAdmin.js";

const router = express.Router();
const statisticsController = new StatisticsController();
const supabaseAdmin = getSupabaseClient();
const verifySupabaseToken = buildSupabaseAuthMiddleware(supabaseAdmin);

// Aplicar middleware de autenticación y usuario a todas las rutas
router.use(verifySupabaseToken);
router.use(statisticsController.injectUser);

// Rutas de estadísticas
router.get("/", statisticsController.getByUser.bind(statisticsController));
router.put("/", statisticsController.update.bind(statisticsController));
router.post("/check-achievements", statisticsController.checkAchievements.bind(statisticsController));
router.get("/achievements-stats", statisticsController.getAchievementsStats.bind(statisticsController));

export default router;
