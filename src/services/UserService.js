import UserRepository from "../repositories/UserRepository.js";
import { OperationResult } from "../shared/OperationResult.js";

const userRepository = new UserRepository();

export class UserService {
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
    return this.getById(this.currentUser.id);
  }

  async updateProfile(user) {
    if (!this.currentUser) return new OperationResult(false, "Usuario no autenticado.");
    user.id_User = this.currentUser.id;
    return this.update(user);
  }

  async changePassword() {
    // Supabase maneja passwords
    return new OperationResult(false, "Cambio de password se maneja vía Supabase Auth.");
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
  }
}
