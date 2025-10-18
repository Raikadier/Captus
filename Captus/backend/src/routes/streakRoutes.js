// Streak routes
import express from 'express';
import StreakService from '../services/streakService.js';

const router = express.Router();

// Initialize service with supabase (will be passed from main app)
let streakService = null;

export const setStreakService = (supabase) => {
  streakService = new StreakService(supabase);
};

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