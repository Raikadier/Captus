// Streak service - migrated from C# BLL\StatisticsLogic.cs
import Streak from '../models/streak.js';

class StreakService {
  constructor(supabase) {
    this.supabase = supabase;
  }

  // Get streak for user
  async getUserStreak(userId) {
    try {
      const { data, error } = await this.supabase
        .from('streaks')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // No streak record exists, return default
          return new Streak({
            user_id: userId,
            current_streak: 0,
            last_completed_date: null,
            daily_goal: 5
          });
        }
        throw error;
      }

      return Streak.fromDatabase(data);
    } catch (error) {
      throw new Error(`Failed to get user streak: ${error.message}`);
    }
  }

  // Update streak for user
  async updateUserStreak(userId, hasCompletedToday = null) {
    try {
      // If hasCompletedToday is not provided, check today's completions
      if (hasCompletedToday === null) {
        const today = new Date().toISOString().split('T')[0];

        const { data: completedTasks, error: tasksError } = await this.supabase
          .from('tasks')
          .select('id')
          .eq('user_id', userId)
          .eq('completed', true)
          .gte('updated_at', `${today}T00:00:00.000Z`)
          .lt('updated_at', `${today}T23:59:59.999Z`);

        if (tasksError) throw tasksError;

        hasCompletedToday = completedTasks.length > 0;
      }

      // Get existing streak or create new one
      let streak;
      try {
        streak = await this.getUserStreak(userId);
      } catch (error) {
        console.warn('No existing streak, creating new one:', error);
        // Create new streak if none exists
        streak = new Streak({
          user_id: userId,
          current_streak: 0,
          last_completed_date: null,
          daily_goal: 5
        });
      }

      // Update streak logic
      streak.updateStreak(hasCompletedToday);

      // Save to database
      const { data, error } = await this.supabase
        .from('streaks')
        .upsert(streak.toDatabase(), { onConflict: 'user_id' })
        .select()
        .single();

      if (error) throw error;

      return Streak.fromDatabase(data);
    } catch (error) {
      throw new Error(`Failed to update user streak: ${error.message}`);
    }
  }

  // Reset streak for user
  async resetUserStreak(userId) {
    try {
      const streak = new Streak({
        user_id: userId,
        current_streak: 0,
        last_completed_date: null,
        daily_goal: 5
      });

      const { data, error } = await this.supabase
        .from('streaks')
        .upsert(streak.toDatabase(), { onConflict: 'user_id' })
        .select()
        .single();

      if (error) throw error;

      return Streak.fromDatabase(data);
    } catch (error) {
      throw new Error(`Failed to reset user streak: ${error.message}`);
    }
  }

  // Update daily goal
  async updateDailyGoal(userId, newGoal) {
    try {
      if (newGoal < 1) {
        throw new Error('Daily goal must be at least 1');
      }

      let streak = await this.getUserStreak(userId);
      streak.daily_goal = newGoal;
      streak.updated_at = new Date();

      const { data, error } = await this.supabase
        .from('streaks')
        .update(streak.toDatabase())
        .eq('user_id', userId)
        .select()
        .single();

      if (error) throw error;

      return Streak.fromDatabase(data);
    } catch (error) {
      throw new Error(`Failed to update daily goal: ${error.message}`);
    }
  }

  // Check if streak should be reset (called by scheduled job)
  async checkAndResetStreaks() {
    try {
      // Get all streaks that might need resetting
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];

      const { data: streaks, error } = await this.supabase
        .from('streaks')
        .select('*')
        .not('last_completed_date', 'is', null)
        .lt('last_completed_date', yesterdayStr);

      if (error) throw error;

      const resetPromises = streaks.map(streak => {
        const streakObj = Streak.fromDatabase(streak);
        if (streakObj.shouldResetStreak()) {
          return this.resetUserStreak(streak.user_id);
        }
        return null;
      }).filter(promise => promise !== null);

      await Promise.all(resetPromises);

      return resetPromises.length;
    } catch (error) {
      console.error('Error checking and resetting streaks:', error);
      return 0;
    }
  }

  // Get streak statistics for user
  async getStreakStats(userId) {
    try {
      const streak = await this.getUserStreak(userId);

      // Get completion history for last 30 days
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const { data: recentTasks, error } = await this.supabase
        .from('tasks')
        .select('completed, updated_at')
        .eq('user_id', userId)
        .eq('completed', true)
        .gte('updated_at', thirtyDaysAgo.toISOString())
        .order('updated_at', { ascending: false });

      if (error) throw error;

      // Calculate completion rate
      const daysWithCompletions = new Set(
        recentTasks.map(task => new Date(task.updated_at).toISOString().split('T')[0])
      ).size;

      const completionRate = daysWithCompletions / 30;

      return {
        currentStreak: streak.current_streak,
        dailyGoal: streak.daily_goal,
        lastCompletedDate: streak.last_completed_date,
        completionRate: Math.round(completionRate * 100) / 100
      };
    } catch (error) {
      throw new Error(`Failed to get streak stats: ${error.message}`);
    }
  }
}

export default StreakService;
