import express from "express";
import { routerAgent } from "../ai/routerAgent.js";

const router = express.Router();

router.post("/chat", async (req, res) => {
  try {
    const { message, userId } = req.body || {};

    if (!userId) {
      return res.status(400).json({ error: "userId es requerido" });
    }
    if (typeof message !== "string" || !message.trim()) {
      return res.status(400).json({ error: "message debe ser texto" });
    }

    console.info("[AI/chat] request", { userId, preview: message.slice(0, 80) });
    const result = await routerAgent(message, userId);
    console.info("[AI/chat] response", { userId, preview: String(result).slice(0, 80) });

    return res.json({ result });
  } catch (err) {
    console.error("[AI/chat] error", err);
    return res.status(500).json({ error: "Error en IA" });
  }
});

export default router;
