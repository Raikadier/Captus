import express from "express";
import { SubjectController } from "../controllers/SubjectController.js";
import buildSupabaseAuthMiddleware from "../src/middlewares/verifySupabaseToken.js";
import { getSupabaseClient } from "../src/lib/supabaseAdmin.js";

const router = express.Router();
const subjectController = new SubjectController();
const supabaseAdmin = getSupabaseClient();
const verifySupabaseToken = buildSupabaseAuthMiddleware(supabaseAdmin);

router.use(verifySupabaseToken);
router.use(subjectController.injectUser);

router.get("/", subjectController.getAll.bind(subjectController));
router.post("/", subjectController.create.bind(subjectController));

export default router;
