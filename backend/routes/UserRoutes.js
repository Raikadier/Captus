// src/routes/UserRoutes.js
import express from "express";
import { UserService } from "../service/UserService.js";
import { verifyToken } from "../middlewares/AuthMiddleware.js";

const router = express.Router();
const userService = new UserService();

// Rutas públicas
router.post("/login", async (req, res) => {
  const { userName, password } = req.body;
  const result = await userService.login(userName, password);
  res.status(result.success ? 200 : 400).json(result);
});

router.post("/register", async (req, res) => {
  const result = await userService.save(req.body);
  res.status(result.success ? 201 : 400).json(result);
});

router.post("/logout", async (req, res) => {
  const result = await userService.logout();
  res.status(result.success ? 200 : 400).json(result);
});

// Rutas protegidas (requieren token)
router.get("/all", verifyToken, async (req, res) => {
  const result = await userService.getAll();
  res.status(result.success ? 200 : 500).json(result);
});

router.get("/:id", verifyToken, async (req, res) => {
  const { id } = req.params;
  const result = await userService.getById(parseInt(id));
  res.status(result.success ? 200 : 404).json(result);
});

router.put("/:id", verifyToken, async (req, res) => {
  const { id } = req.params;
  const userData = { ...req.body, id_User: parseInt(id) };
  const result = await userService.update(userData);
  res.status(result.success ? 200 : 400).json(result);
});

router.delete("/:id", verifyToken, async (req, res) => {
  const { id } = req.params;
  const result = await userService.delete(parseInt(id));
  res.status(result.success ? 200 : 400).json(result);
});

export default router;