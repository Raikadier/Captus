import express from "express";
import { RolController } from "../controllers/RolController.js";
import buildSupabaseAuthMiddleware from "../middlewares/verifySupabaseToken.js";
import { requireSupabaseClient } from "../lib/supabaseAdmin.js";

const router = express.Router();
const rolController = new RolController();
const supabaseAdmin = requireSupabaseClient();
const verifySupabaseToken = buildSupabaseAuthMiddleware(supabaseAdmin);

// Aplicar middleware de autenticación a todas las rutas
router.use(verifySupabaseToken);

// Rutas de roles (datos maestros)
router.get("/", rolController.getAll.bind(rolController));
router.get("/:id", rolController.getById.bind(rolController));
router.get("/name/:name", rolController.getByName.bind(rolController));

export default router;
