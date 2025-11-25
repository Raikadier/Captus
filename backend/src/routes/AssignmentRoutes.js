import express from 'express';
import { AssignmentController } from '../controllers/AssignmentController.js';
import buildSupabaseAuthMiddleware from '../middlewares/verifySupabaseToken.js';
import { requireTeacherRole } from '../middlewares/requireRole.js';
import { requireSupabaseClient } from '../lib/supabaseAdmin.js';
import { injectUserRole } from '../middlewares/injectUserRole.js';

const router = express.Router();
const controller = new AssignmentController();
const supabaseAdmin = requireSupabaseClient();
const verifySupabaseToken = buildSupabaseAuthMiddleware(supabaseAdmin);

router.use(verifySupabaseToken);
router.use(injectUserRole);

router.post('/', requireTeacherRole, controller.create.bind(controller));
router.get('/course/:id', controller.getByCourse.bind(controller));
router.get('/:id', controller.getById.bind(controller));
router.put('/:id', requireTeacherRole, controller.update.bind(controller));
router.delete('/:id', requireTeacherRole, controller.delete.bind(controller));

export default router;
