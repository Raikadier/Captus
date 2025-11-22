import express from "express";
import { UserController } from "../controllers/UserController.js";
import buildSupabaseAuthMiddleware from "../middlewares/verifySupabaseToken.js";
import { getSupabaseClient } from "../lib/supabaseAdmin.js";

const router = express.Router();
const userController = new UserController();
const supabaseAdmin = getSupabaseClient();
const verifySupabaseToken = buildSupabaseAuthMiddleware(supabaseAdmin);

// Protected routes (require token)
router.use(verifySupabaseToken);

// Sync endpoint - used by Frontend after login/register
router.post("/sync", userController.syncUser.bind(userController));

// Profile management
router.get("/profile", userController.getProfile.bind(userController)); // Current user
router.get("/:id", userController.getProfile.bind(userController));
router.put("/:id", userController.updateProfile.bind(userController));

export default router;
