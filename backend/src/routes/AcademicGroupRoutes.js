import express from 'express';
import { AcademicGroupController } from '../controllers/AcademicGroupController.js';
import buildSupabaseAuthMiddleware from '../middlewares/verifySupabaseToken.js';
import { requireSupabaseClient } from '../lib/supabaseAdmin.js';
import { injectUserRole } from '../middlewares/injectUserRole.js';

const router = express.Router();
const controller = new AcademicGroupController();
const supabaseAdmin = requireSupabaseClient();
const verifySupabaseToken = buildSupabaseAuthMiddleware(supabaseAdmin);

router.use(verifySupabaseToken);
router.use(injectUserRole);

router.post('/', controller.create.bind(controller));
router.post('/add-member', controller.addMember.bind(controller));
router.get('/course/:id', controller.getByCourse.bind(controller));

export default router;
