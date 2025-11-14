// src/routes/PriorityRoutes.js
import express from "express";
import { PriorityService } from "../service/PriorityService.js";

const router = express.Router();
const priorityService = new PriorityService();

// Rutas de prioridades (no requieren autenticación ya que son datos maestros)
router.get("/", async (req, res) => {
  const result = await priorityService.getAll();
  res.status(result.success ? 200 : 500).json(result);
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  const result = await priorityService.getById(parseInt(id));
  res.status(result.success ? 200 : 404).json(result);
});

export default router;