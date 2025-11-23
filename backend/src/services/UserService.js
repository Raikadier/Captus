import User from '../models/UserModels.js';
import { OperationResult } from '../shared/OperationResult.js';
import CategoryService from "./CategoryService.js";
import { StatisticsService } from "./StatisticsService.js";

class UserService {
  constructor(supabase) {
    this.supabase = supabase;
    this.categoryService = new CategoryService();
    this.statisticsService = new StatisticsService();
    this.currentUser = null;
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

      const syncedUser = User.fromDatabase(data);

      // Initialize features for the user (Harold logic)
      try {
        // Set current user for services
        this.setCurrentUser(syncedUser);

        // Create "General" category if it doesn't exist
        // Note: CategoryService.save usually handles creation.
        // We might need to check if it exists first or rely on save to handle duplicates.
        // Assuming save is safe or we just try it.
        const generalCategory = {
          name: "General",
          id_User: syncedUser.id
        };
        // We'll attempt to save. If it fails (e.g. duplicate), we catch it.
        await this.categoryService.save(generalCategory);
        console.log(`Category "General" initialized for user: ${syncedUser.email}`);
      } catch (initError) {
        // Ignore error if category already exists or other non-critical issue
        console.warn("Note: Could not initialize default category (might already exist):", initError.message);
      }

      return syncedUser;
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

  // Delete account with cascading cleanup (Harold logic)
  async deleteAccount(userId) {
    try {
      // 1. Cleanup Statistics
      try {
        this.statisticsService.setCurrentUser({ id: userId });
        const stats = await this.statisticsService.getByCurrentUser();
        if (stats && stats.id_Statistics) {
          await this.statisticsService.delete(stats.id_Statistics);
        }
      } catch (e) { console.warn("Error cleaning stats:", e.message); }

      // 2. Cleanup Achievements
      try {
        const userAchievementsRepo = (await import("../repositories/UserAchievementsRepository.js")).default;
        const achievementsRepo = new userAchievementsRepo();
        await achievementsRepo.deleteByUser(userId);
      } catch (e) { console.warn("Error cleaning achievements:", e.message); }

      // 3. Cleanup Categories (and Tasks via cascade if DB configured, or manual)
      // Harold logic deleted categories manually.
      try {
        this.categoryService.setCurrentUser({ id: userId });
        const categoriesResult = await this.categoryService.getAll();
        if (categoriesResult.success && Array.isArray(categoriesResult.data)) {
          for (const category of categoriesResult.data) {
            if (category.id_User === userId) {
              await this.categoryService.delete(category.id_Category);
            }
          }
        }
      } catch (e) { console.warn("Error cleaning categories:", e.message); }

      // 4. Cleanup Tasks (if not deleted by categories)
      try {
        const taskModule = await import("./TaskService.js");
        const TaskServiceClass = taskModule.TaskService || taskModule.default;

        if (TaskServiceClass) {
          const taskSvc = new TaskServiceClass();
          taskSvc.setCurrentUser({ id: userId });
          await taskSvc.deleteByUser(userId);
        }
      } catch (e) { console.warn("Error cleaning tasks:", e.message); }

      // 5. Delete User
      await this.deleteUser(userId);

      return { success: true, message: "Account deleted successfully." };
    } catch (e) {
      return { success: false, error: e.message };
    }
  }

  // Check if email is registered
  async isEmailRegistered(email) {
    try {
      const { data, error } = await this.supabase
        .from('users')
        .select('id')
        .eq('email', email)
        .single();

      if (data) return { success: true, data: { registered: true } };

      // If not found, it might be in Auth but not synced.
      return { success: true, data: { registered: false } };
    } catch (error) {
      if (error.code === 'PGRST116') {
        return { success: true, data: { registered: false } };
      }
      return { success: false, error: error.message };
    }
  }

  // Change password validation
  async changePassword(currentPassword, newPassword) {
    try {
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
      if (!passwordRegex.test(newPassword)) {
        return new OperationResult(false, "La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula y un número.");
      }
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

  setCurrentUser(user) {
    this.currentUser = user;
    if (this.statisticsService) this.statisticsService.setCurrentUser(user);
    if (this.categoryService) this.categoryService.setCurrentUser(user);
  }
}

export default UserService;
