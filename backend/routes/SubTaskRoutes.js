// src/routes/SubTaskRoutes.js
import express from "express";
import { SubTaskService } from "../service/SubTaskService.js";
import { verifyToken } from "../middlewares/AuthMiddleware.js";

const router = express.Router();
const subTaskService = new SubTaskService();

// Middleware para inyectar usuario en el servicio
const injectUser = (req, res, next) => {
  if (req.user) {
    subTaskService.setCurrentUser(req.user);
  }
  next();
};

// Aplicar middleware de autenticación y usuario a todas las rutas
router.use(verifyToken);
router.use(injectUser);

// Rutas de subtareas
router.get("/", async (req, res) => {
  const result = await subTaskService.getAll();
  res.status(result.success ? 200 : 500).json(result);
});

router.get("/task/:taskId", async (req, res) => {
  const { taskId } = req.params;
  const result = await subTaskService.getByTaskId(parseInt(taskId));
  res.status(result.success ? 200 : 403).json(result);
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  const result = await subTaskService.getById(parseInt(id));
  res.status(result.success ? 200 : 404).json(result);
});

router.post("/", async (req, res) => {
  const result = await subTaskService.save(req.body);
  res.status(result.success ? 201 : 400).json(result);
});

router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const subTaskData = { ...req.body, id_SubTask: parseInt(id) };
  const result = await subTaskService.update(subTaskData);
  res.status(result.success ? 200 : 400).json(result);
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  const result = await subTaskService.delete(parseInt(id));
  res.status(result.success ? 200 : 400).json(result);
});

router.put("/task/:taskId/complete-all", async (req, res) => {
  const { taskId } = req.params;
  const result = await subTaskService.markAllAsCompleted(parseInt(taskId));
  res.status(result.success ? 200 : 400).json(result);
});

router.delete("/task/:taskId/all", async (req, res) => {
  const { taskId } = req.params;
  const result = await subTaskService.deleteByParentTask(parseInt(taskId));
  res.status(result.success ? 200 : 400).json(result);
});

export default router;