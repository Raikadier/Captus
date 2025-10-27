// Streak routes
import express from 'express';
import StreakService from '../services/streakService.js';

const router = express.Router();

// Initialize service with supabase (will be passed from main app)
let streakService = null;

export const setStreakService = (supabase) => {
  streakService = new StreakService(supabase);
};

/**
 * @swagger
 * /api/streaks:
 *   get:
 *     summary: Get current user's streak information
 *     responses:
 *       200:
 *         description: Streak data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 user_id:
 *                   type: string
 *                 current_streak:
 *                   type: integer
 *                 last_completed_date:
 *                   type: string
 *                   format: date
 *                 daily_goal:
 *                   type: integer
 *   put:
 *     summary: Update user's streak (manually trigger update)
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               hasCompletedToday:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Streak updated
 *   delete:
 *     summary: Reset user's streak
 *     responses:
 *       200:
 *         description: Streak reset
 */

/**
 * @swagger
 * /api/streaks/stats:
 *   get:
 *     summary: Get detailed streak statistics for the user
 *     responses:
 *       200:
 *         description: Streak statistics
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 currentStreak:
 *                   type: integer
 *                 dailyGoal:
 *                   type: integer
 *                 lastCompletedDate:
 *                   type: string
 *                   format: date
 *                 completionRate:
 *                   type: number
 *                   format: float
 */

// Streak routes
router.get('/', async (req, res) => {
  try {
    const userId = req.user.id;
    const streak = await streakService.getUserStreak(userId);
    res.json(streak);
  } catch (error) {
    console.error('Error getting user streak:', error);
    res.status(500).json({ error: 'Failed to retrieve streak' });
  }
});

router.put('/', async (req, res) => {
  try {
    const userId = req.user.id;
    const { hasCompletedToday } = req.body;

    const streak = await streakService.updateUserStreak(userId, hasCompletedToday);
    res.json(streak);
  } catch (error) {
    console.error('Error updating user streak:', error);
    res.status(500).json({ error: 'Failed to update streak' });
  }
});

router.delete('/', async (req, res) => {
  try {
    const userId = req.user.id;
    const streak = await streakService.resetUserStreak(userId);
    res.json(streak);
  } catch (error) {
    console.error('Error resetting user streak:', error);
    res.status(500).json({ error: 'Failed to reset streak' });
  }
});

router.get('/stats', async (req, res) => {
  try {
    const userId = req.user.id;
    const stats = await streakService.getStreakStats(userId);
    res.json(stats);
  } catch (error) {
    console.error('Error getting streak stats:', error);
    res.status(500).json({ error: 'Failed to retrieve streak statistics' });
  }
});

export default router;