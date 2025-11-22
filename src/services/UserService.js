// User service - migrated from C# BLL\UserLogic.cs
import User from '../models/UserModels.js';
import { OperationResult } from '../shared/OperationResult.js';

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

  // Alias for deleteAccount from controller merge
  async deleteAccount(userId) {
     try {
       await this.deleteUser(userId);
       // Also delete from auth? Usually yes, but we need admin client for that.
       // For now, just return success to match legacy signature expectations
       return { success: true };
     } catch (e) {
        return { success: false, error: e.message };
     }
  }

  // Check if email is registered
  async isEmailRegistered(email) {
    try {
      // Check in public.users first (fastest)
      const { data, error } = await this.supabase
        .from('users')
        .select('id')
        .eq('email', email)
        .single();

      if (data) return { success: true, data: { registered: true } };

      // If not found, it might be in Auth but not synced.
      // But we can't easily check Auth without admin rights or trying to sign in.
      // Let's assume if not in public.users, it's not "registered" in our app sense.
      return { success: true, data: { registered: false } };
    } catch (error) {
       if (error.code === 'PGRST116') {
          return { success: true, data: { registered: false } };
       }
       throw error;
    }
  }

  // Change password validation (ported from Harold branch)
  async changePassword(currentPassword, newPassword) {
    try {
      // Validar nueva contraseña
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
      if (!passwordRegex.test(newPassword)) {
        return new OperationResult(false, "La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula y un número.");
      }

      // Para Supabase, el cambio de contraseña se maneja desde el cliente
      // Aquí solo validamos y retornamos éxito
      // El cliente debe usar supabase.auth.updateUser()

      return new OperationResult(true, "Contraseña validada correctamente. Use el cliente para actualizar.");
    } catch (error) {
      return new OperationResult(false, `Error al cambiar contraseña: ${error.message}`);
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