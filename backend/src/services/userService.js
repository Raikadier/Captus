// User service - migrated from C# BLL\UserLogic.cs
import User from '../models/user.js';

class UserService {
  constructor(supabase) {
    this.supabase = supabase;
  }

  // Get user by ID
  async getUserById(userId) {
    try {
      const { data, error } = await this.supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          throw new Error('User not found');
        }
        throw error;
      }

      return User.fromDatabase(data);
    } catch (error) {
      throw new Error(`Failed to get user: ${error.message}`);
    }
  }

  // Get all users (admin function)
  async getAllUsers() {
    try {
      const { data, error } = await this.supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      return data.map(row => User.fromDatabase(row));
    } catch (error) {
      throw new Error(`Failed to get users: ${error.message}`);
    }
  }

  // Create or update user from Supabase auth
  async syncUserFromAuth(authUser) {
    try {
      const user = User.fromSupabaseAuth(authUser);

      const { data, error } = await this.supabase
        .from('users')
        .upsert(user.toDatabase(), { onConflict: 'id' })
        .select()
        .single();

      if (error) throw error;

      return User.fromDatabase(data);
    } catch (error) {
      throw new Error(`Failed to sync user: ${error.message}`);
    }
  }

  // Update user profile
  async updateUser(userId, updateData) {
    try {
      const existingUser = await this.getUserById(userId);

      const updatedUser = new User({
        ...existingUser,
        ...updateData,
        updated_at: new Date()
      });

      const validation = updatedUser.validate();
      if (!validation.isValid) {
        throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
      }

      const { data, error } = await this.supabase
        .from('users')
        .update(updatedUser.toDatabase())
        .eq('id', userId)
        .select()
        .single();

      if (error) throw error;

      return User.fromDatabase(data);
    } catch (error) {
      throw new Error(`Failed to update user: ${error.message}`);
    }
  }

  // Delete user (admin function)
  async deleteUser(userId) {
    try {
      // Check if user exists
      await this.getUserById(userId);

      // Note: In a real application, you might want to soft delete
      // or handle related data cleanup (tasks, streaks, etc.)
      const { error } = await this.supabase
        .from('users')
        .delete()
        .eq('id', userId);

      if (error) throw error;

      return true;
    } catch (error) {
      throw new Error(`Failed to delete user: ${error.message}`);
    }
  }

  // Get user statistics
  async getUserStats(userId) {
    try {
      // Get task counts
      const { data: taskStats, error: taskError } = await this.supabase
        .from('tasks')
        .select('completed, id')
        .eq('user_id', userId);

      if (taskError) throw taskError;

      const totalTasks = taskStats.length;
      const completedTasks = taskStats.filter(task => task.completed).length;
      const pendingTasks = totalTasks - completedTasks;

      // Get streak info
      const { data: streakData, error: streakError } = await this.supabase
        .from('streaks')
        .select('*')
        .eq('user_id', userId)
        .single();

      let currentStreak = 0;
      if (!streakError && streakData) {
        currentStreak = streakData.current_streak;
      }

      return {
        totalTasks,
        completedTasks,
        pendingTasks,
        currentStreak
      };
    } catch (error) {
      throw new Error(`Failed to get user stats: ${error.message}`);
    }
  }
}

export default UserService;