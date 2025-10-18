// User routes
import express from 'express';
import UserController from '../controllers/userController.js';

const router = express.Router();

// Initialize controller with supabase (will be passed from main app)
let userController = null;

export const setUserController = (supabase) => {
  userController = new UserController(supabase);
};

/**
 * @swagger
 * /api/users/profile:
 *   get:
 *     summary: Get current user profile
 *     responses:
 *       200:
 *         description: User profile data
 *   put:
 *     summary: Update current user profile
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *     responses:
 *       200:
 *         description: Profile updated
 */

/**
 * @swagger
 * /api/users/stats:
 *   get:
 *     summary: Get current user statistics
 *     responses:
 *       200:
 *         description: User statistics
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalTasks:
 *                   type: integer
 *                 completedTasks:
 *                   type: integer
 *                 pendingTasks:
 *                   type: integer
 *                 currentStreak:
 *                   type: integer
 */

// User profile routes
router.get('/profile', (req, res) => userController.getProfile(req, res));
router.put('/profile', (req, res) => userController.updateProfile(req, res));
router.get('/stats', (req, res) => userController.getUserStats(req, res));

// Admin/sync routes (may need additional auth)
router.post('/sync', (req, res) => userController.syncUserFromAuth(req, res));

export default router;