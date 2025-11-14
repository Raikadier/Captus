import express from "express";
import { CategoryService } from "../service/CategoryService.js";

const router = express.Router();
const categoryService = new CategoryService();

router.use((req, _res, next) => {
  if (req.user) {
    categoryService.setCurrentUser(req.user);
  }
  next();
});

router.get("/", async (_req, res) => {
  const result = await categoryService.getAvailableForUser();
  res.status(result.success ? 200 : 500).json(result);
});

router.post("/", async (req, res) => {
  const result = await categoryService.create(req.body);
  res.status(result.success ? 201 : 400).json(result);
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  const result = await categoryService.delete(parseInt(id, 10));
  res.status(result.success ? 200 : 400).json(result);
});

export default router;
