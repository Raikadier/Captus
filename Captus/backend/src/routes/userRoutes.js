// User routes
import express from 'express';
import UserController from '../controllers/userController.js';

const router = express.Router();

// Initialize controller with supabase (will be passed from main app)
let userController = null;

export const setUserController = (supabase) => {
  userController = new UserController(supabase);
};

// User profile routes
router.get('/profile', (req, res) => userController.getProfile(req, res));
router.put('/profile', (req, res) => userController.updateProfile(req, res));
router.get('/stats', (req, res) => userController.getUserStats(req, res));

// Admin/sync routes (may need additional auth)
router.post('/sync', (req, res) => userController.syncUserFromAuth(req, res));

export default router;