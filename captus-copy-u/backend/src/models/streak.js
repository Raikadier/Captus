// Streak model - migrated from C# ENTITY\Statistics.cs (streak-related fields)
class Streak {
  constructor(data = {}) {
    this.id = data.id || null;
    this.user_id = data.user_id || null;
    this.current_streak = data.current_streak || 0;
    this.last_completed_date = data.last_completed_date || null;
    this.daily_goal = data.daily_goal || 5;
    this.created_at = data.created_at || new Date();
    this.updated_at = data.updated_at || new Date();
  }

  // Check if streak should be reset
  shouldResetStreak() {
    if (!this.last_completed_date) return false;

    const today = new Date();
    const lastDate = new Date(this.last_completed_date);
    const diffTime = Math.abs(today - lastDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    // Reset if more than 1 day has passed since last completion
    return diffDays > 1;
  }

  // Update streak based on completion
  updateStreak(hasCompletedToday) {
    const today = new Date().toISOString().split('T')[0];

    if (hasCompletedToday) {
      if (!this.last_completed_date) {
        // First completion
        this.current_streak = 1;
      } else {
        const lastDate = new Date(this.last_completed_date);
        const currentDate = new Date(today);
        const diffTime = Math.abs(currentDate - lastDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 1) {
          // Consecutive day
          this.current_streak += 1;
        } else {
          // Reset streak
          this.current_streak = 1;
        }
      }
      this.last_completed_date = today;
    } else {
      // Check if we need to reset streak
      if (this.shouldResetStreak()) {
        this.current_streak = 0;
      }
    }

    this.updated_at = new Date();
  }

  // Validate streak data
  validate() {
    const errors = [];

    if (!this.user_id) {
      errors.push('User ID is required');
    }

    if (this.current_streak < 0) {
      errors.push('Current streak cannot be negative');
    }

    if (this.daily_goal < 1) {
      errors.push('Daily goal must be at least 1');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Convert to database format
  toDatabase() {
    return {
      user_id: this.user_id,
      current_streak: this.current_streak,
      last_completed_date: this.last_completed_date,
      daily_goal: this.daily_goal,
      updated_at: new Date()
    };
  }

  // Create from database row
  static fromDatabase(row) {
    return new Streak({
      id: row.id,
      user_id: row.user_id,
      current_streak: row.current_streak,
      last_completed_date: row.last_completed_date,
      daily_goal: row.daily_goal,
      created_at: row.created_at,
      updated_at: row.updated_at
    });
  }
}

export default Streak;
