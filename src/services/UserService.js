<<<<<<< HEAD
import UserRepository from "../repositories/UserRepository.js";
import { StatisticsService } from "./StatisticsService.js";
import CategoryService from "./CategoryService.js";
import { OperationResult } from "../shared/OperationResult.js";

const userRepository = new UserRepository();

export class UserService {
  constructor() {
    this.statisticsService = new StatisticsService();
    this.categoryService = new CategoryService();
=======
// User service - migrated from C# BLL\UserLogic.cs
import User from '../models/UserModels.js';
import { OperationResult } from '../shared/OperationResult.js';

class UserService {
  constructor(supabase) {
    this.supabase = supabase;
>>>>>>> origin/main
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
<<<<<<< HEAD
      console.warn("Error inicializando estadísticas para usuario:", error);
    }

    // Asegurar que las categorías existan (se crean automáticamente en syncUserFromSupabase)
    try {
      this.categoryService.setCurrentUser(this.currentUser);
      await this.categoryService.getAll();
    } catch (error) {
      console.warn("Error inicializando categorías para usuario:", error);
    }

    return userResult;
  }

  async syncUserFromSupabase(supabaseUser) {
    try {
      // Verificar si el usuario ya existe en la tabla local
      const existingUser = await userRepository.getById(supabaseUser.id);

      if (!existingUser) {
        // Crear usuario en tabla local
        // Buscar nombre en propiedades directas primero, luego en user_metadata
        const displayName = supabaseUser.name ||
                           supabaseUser.display_name ||
                           supabaseUser.full_name ||
                           supabaseUser.user_metadata?.name ||
                           supabaseUser.user_metadata?.display_name ||
                           supabaseUser.user_metadata?.full_name ||
                           supabaseUser.email?.split('@')[0] ||
                           'Usuario';

        const userData = {
          id_User: supabaseUser.id,
          email: supabaseUser.email,
          name: displayName,
          userName: displayName,
          password: null, // No almacenamos password, Supabase lo maneja
          lastName: '',
          phone: supabaseUser.user_metadata?.phone || null
        };

        await userRepository.save(userData);
        console.log(`Usuario sincronizado: ${supabaseUser.email} con nombre: ${displayName}`);

        // Crear categoría "General" para el nuevo usuario
        try {
          this.categoryService.setCurrentUser({ id: supabaseUser.id });
          const generalCategory = {
            name: "General",
            id_User: supabaseUser.id
          };
          await this.categoryService.save(generalCategory);
          console.log(`Categoría "General" creada para usuario: ${supabaseUser.email}`);
        } catch (error) {
          console.warn("Error creando categoría General:", error);
        }
      }
    } catch (error) {
      console.error("Error sincronizando usuario:", error);
=======
       if (error.code === 'PGRST116') {
          return { success: true, data: { registered: false } };
       }
       throw error;
>>>>>>> origin/main
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

<<<<<<< HEAD
      const userId = this.currentUser.id;

      // Eliminar estadísticas del usuario
      try {
        await this.statisticsService.setCurrentUser(this.currentUser);
        const stats = await this.statisticsService.getByCurrentUser();
        if (stats && stats.id_Statistics) {
          await this.statisticsService.delete(stats.id_Statistics);
        }
      } catch (error) {
        console.warn("Error eliminando estadísticas:", error);
      }

      // Eliminar logros del usuario
      try {
        const userAchievementsRepo = (await import("../repositories/UserAchievementsRepository.js")).default;
        const achievementsRepo = new userAchievementsRepo();
        await achievementsRepo.deleteByUser(userId);
      } catch (error) {
        console.warn("Error eliminando logros:", error);
      }

      // Eliminar categorías del usuario (antes de tareas, ya que tareas dependen de categorías)
      try {
        const categoriesResult = await this.categoryService.getAll();
        if (categoriesResult.success) {
          for (const category of categoriesResult.data) {
            // Solo eliminar categorías del usuario (no la "General" global si existe)
            if (category.id_User === userId) {
              await this.categoryService.delete(category.id_Category);
            }
          }
        }
      } catch (error) {
        console.warn("Error eliminando categorías:", error);
      }

      // Eliminar tareas y subtareas del usuario
      try {
        const taskService = (await import("./TaskService.js")).TaskService;
        const taskSvc = new taskService();
        taskSvc.setCurrentUser(this.currentUser);
        await taskSvc.deleteByUser(userId);
      } catch (error) {
        console.warn("Error eliminando tareas:", error);
      }

      // Finalmente eliminar el usuario
      const deleteResult = await this.delete(userId);
      if (deleteResult.success) {
        return new OperationResult(true, "Cuenta eliminada exitosamente. Todos tus datos han sido removidos permanentemente.");
      } else {
        return new OperationResult(false, "Error al eliminar la cuenta.");
      }
=======
      return {
        totalTasks,
        completedTasks,
        pendingTasks,
        currentStreak
      };
>>>>>>> origin/main
    } catch (error) {
      throw new Error(`Failed to get user stats: ${error.message}`);
    }
  }
}

<<<<<<< HEAD
  async isEmailRegistered(email) {
    try {
      const exists = await userRepository.isEmailRegistered(email);
      return new OperationResult(true, exists ? "Email registrado." : "Email disponible.", { registered: exists });
    } catch (error) {
      return new OperationResult(false, `Error: ${error.message}`);
    }
  }

  setCurrentUser(user) {
    this.currentUser = user;
    this.statisticsService.setCurrentUser(user);
    this.categoryService.setCurrentUser(user);
  }
}
=======
export default UserService;
>>>>>>> origin/main
