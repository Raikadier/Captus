import express from "express";
import { UserController } from "../controllers/UserController.js";
import buildSupabaseAuthMiddleware from "../middlewares/verifySupabaseToken.js";
import { getSupabaseClient } from "../lib/supabaseAdmin.js";

const router = express.Router();
const userController = new UserController();
const supabaseAdmin = getSupabaseClient();
const verifySupabaseToken = buildSupabaseAuthMiddleware(supabaseAdmin);

// Rutas públicas
router.post("/login", userController.login.bind(userController));
router.post("/register", userController.register.bind(userController));

// Rutas protegidas (requieren token)
router.use(verifySupabaseToken);
router.use(userController.injectUser);

router.get("/all", userController.getProfile.bind(userController));
router.get("/:id", userController.getProfile.bind(userController));
router.put("/:id", userController.updateProfile.bind(userController));
router.delete("/:id", userController.getProfile.bind(userController));

export default router;
