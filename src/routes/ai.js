import express from "express";
import { routerAgent } from "../ai/routerAgent.js";

const router = express.Router();

router.post("/chat", async (req, res) => {
  try {
    // Security Fix: Extract userId from authenticated token (req.user), NOT from body.
    // This prevents IDOR attacks where user A claims to be user B.
    const userId = req.user?.id;
    const { message } = req.body || {};

    if (!userId) {
      return res.status(401).json({ error: "Usuario no autenticado" });
    }
    if (typeof message !== "string" || !message.trim()) {
      return res.status(400).json({ error: "message debe ser texto" });
    }

    console.info("[AI/chat] request", { userId, preview: message.slice(0, 80) });

    // Pass the verified userId to the agent
    const result = await routerAgent(message, userId);

    console.info("[AI/chat] response", { userId, preview: String(result).slice(0, 80) });

    return res.json({ result });
  } catch (err) {
    console.error("[AI/chat] error", err);
    return res.status(500).json({ error: "Error en IA" });
  }
});

export default router;
