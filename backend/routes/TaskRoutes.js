// src/routes/TaskRoutes.js
import express from "express";
import { TaskService } from "../service/TaskService.js";
import { verifyToken } from "../middlewares/AuthMiddleware.js";

const router = express.Router();
const taskService = new TaskService();

// Middleware para inyectar usuario en el servicio
const injectUser = (req, res, next) => {
  if (req.user) {
    taskService.setCurrentUser(req.user);
  }
  next();
};

// Aplicar middleware de autenticación y usuario a todas las rutas
router.use(verifyToken);
router.use(injectUser);

// Rutas de tareas
router.get("/", async (req, res) => {
  const result = await taskService.getAll();
  res.status(result.success ? 200 : 500).json(result);
});

router.get("/incomplete", async (req, res) => {
  const result = await taskService.getIncompleteByUser();
  res.status(result.success ? 200 : 500).json(result);
});

router.get("/completed", async (req, res) => {
  const result = await taskService.getCompletedByUser();
  res.status(result.success ? 200 : 500).json(result);
});

router.get("/completed-today", async (req, res) => {
  const result = await taskService.getCompletedTodayByUser();
  res.status(result.success ? 200 : 500).json(result);
});

router.get("/overdue", async (req, res) => {
  const result = await taskService.getOverdueTasks();
  res.status(result.success ? 200 : 500).json(result);
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  const result = await taskService.getById(parseInt(id));
  res.status(result.success ? 200 : 404).json(result);
});

router.post("/", async (req, res) => {
  const result = await taskService.save(req.body);
  res.status(result.success ? 201 : 400).json(result);
});

router.post("/create", async (req, res) => {
  const { title, description, endDate, priorityText, categoryText } = req.body;
  const userId = req.user.id;

  const result = await taskService.createAndSaveTask(
    title,
    description,
    new Date(endDate),
    priorityText,
    categoryText,
    userId
  );
  res.status(result.success ? 201 : 400).json(result);
});

router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const taskData = { ...req.body, id_Task: parseInt(id) };
  const result = await taskService.update(taskData);
  res.status(result.success ? 200 : 400).json(result);
});

router.put("/:id/state", async (req, res) => {
  const { id } = req.params;
  const { state } = req.body;
  const result = await taskService.updateTaskState(parseInt(id), state);
  res.status(result.success ? 200 : 400).json(result);
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  const result = await taskService.delete(parseInt(id));
  res.status(result.success ? 200 : 400).json(result);
});

router.delete("/user/:userId", async (req, res) => {
  const { userId } = req.params;
  const result = await taskService.deleteByUser(parseInt(userId));
  res.status(result.success ? 200 : 400).json(result);
});

router.delete("/category/:categoryId", async (req, res) => {
  const { categoryId } = req.params;
  const result = await taskService.deleteByCategory(parseInt(categoryId));
  res.status(result.success ? 200 : 400).json(result);
});

export default router;