import UserRepository from "../repositories/UserRepository.js";
import { StatisticsService } from "./StatisticsService.js";
import CategoryService from "./CategoryService.js";
import { OperationResult } from "../shared/OperationResult.js";

const userRepository = new UserRepository();

export class UserService {
  constructor() {
    this.statisticsService = new StatisticsService();
    this.categoryService = new CategoryService();
  }

  // Nota: Login y logout se manejan externamente con Supabase Auth.
  // Este servicio maneja perfiles de usuario.

  async save(user) {
    try {
      if (!user) return new OperationResult(false, "El usuario no puede ser nulo.");
      const existingUser = await userRepository.getByUsername(user.userName);
      if (existingUser) {
        return new OperationResult(false, "El nombre de usuario ya existe.");
      }

      // Verificar email único
      const emailExists = await userRepository.isEmailRegistered(user.email);
      if (emailExists) {
        return new OperationResult(false, "El email ya está registrado.");
      }

      // No hashear password, Supabase lo maneja
      const created = await userRepository.save(user);
      if (created)
        return new OperationResult(true, "Usuario creado exitosamente.", created);
      else return new OperationResult(false, "Error al crear usuario.");
    } catch (error) {
      return new OperationResult(false, `Error: ${error.message}`);
    }
  }

  async getAll() {
    try {
      const users = await userRepository.getAll();
      return new OperationResult(true, "Usuarios obtenidos exitosamente.", users);
    } catch (error) {
      return new OperationResult(false, `Error: ${error.message}`);
    }
  }

  async getById(id) {
    try {
      const user = await userRepository.getById(id);
      if (user) {
        return new OperationResult(true, "Usuario encontrado.", user);
      } else {
        return new OperationResult(false, "Usuario no encontrado.");
      }
    } catch (error) {
      return new OperationResult(false, `Error: ${error.message}`);
    }
  }

  async delete(id) {
    try {
      const deleted = await userRepository.delete(id);
      if (deleted) {
        return new OperationResult(true, "Usuario eliminado exitosamente.");
      } else {
        return new OperationResult(false, "Error al eliminar usuario.");
      }
    } catch (error) {
      return new OperationResult(false, `Error: ${error.message}`);
    }
  }

  async update(user) {
    try {
      if (!user || !user.id_User) {
        return new OperationResult(false, "Datos de usuario inválidos.");
      }

      const existingUser = await userRepository.getById(user.id_User);
      if (!existingUser) {
        return new OperationResult(false, "Usuario no encontrado.");
      }

      // No hashear password, Supabase lo maneja
      const updated = await userRepository.update(user.id_User, user);
      if (updated) {
        return new OperationResult(true, "Usuario actualizado exitosamente.");
      } else {
        return new OperationResult(false, "Error al actualizar usuario.");
      }
    } catch (error) {
      return new OperationResult(false, `Error: ${error.message}`);
    }
  }

  async register(user) {
    return this.save(user);
  }

  async login() {
    // Supabase maneja login, devolver mensaje
    return new OperationResult(false, "Login se maneja vía Supabase Auth.");
  }

  async getProfile() {
    // Asumir que currentUser está disponible
    if (!this.currentUser) return new OperationResult(false, "Usuario no autenticado.");

    // Sincronizar usuario de Supabase con tabla local si no existe
    await this.syncUserFromSupabase(this.currentUser);

    // Obtener el perfil del usuario
    const userResult = await this.getById(this.currentUser.id);
    if (!userResult.success) return userResult;

    // Asegurar que las estadísticas existan
    try {
      this.statisticsService.setCurrentUser(this.currentUser);
      await this.statisticsService.getByCurrentUser();
    } catch (error) {
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
    }
  }

  async updateProfile(user) {
    if (!this.currentUser) return new OperationResult(false, "Usuario no autenticado.");
    user.id_User = this.currentUser.id;
    return this.update(user);
  }

  async changePassword(currentPassword, newPassword) {
    try {
      if (!this.currentUser) {
        return new OperationResult(false, "Usuario no autenticado.");
      }

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

  async deleteAccount() {
    try {
      if (!this.currentUser) {
        return new OperationResult(false, "Usuario no autenticado.");
      }

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
    } catch (error) {
      return new OperationResult(false, `Error al eliminar cuenta: ${error.message}`);
    }
  }

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