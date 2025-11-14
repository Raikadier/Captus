// src/service/UserService.js
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import UserRepository from "../repository/UserRepository.js";
import { OperationResult } from "../shared/OperationResult.js";

const userRepository = new UserRepository();

export class UserService {
  async login(username, password) {
    try {
      const user = await userRepository.getByUsername(username);
      if (!user) {
        return new OperationResult(false, "Usuario no encontrado.");
      }

      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        return new OperationResult(false, "Credenciales inválidas.");
      }

      // Generamos el token (equivale a iniciar sesión)
      const token = jwt.sign(
        { id: user.id_User, username: user.userName },
        process.env.JWT_SECRET || "claveSecreta123",
        { expiresIn: "2h" }
      );

      return new OperationResult(true, "Inicio de sesión exitoso.", {
        user,
        token,
      });
    } catch (error) {
      return new OperationResult(false, `Error: ${error.message}`);
    }
  }

  async logout() {
    // En JWT, el logout se maneja desde el frontend eliminando el token.
    // Aquí podríamos implementar una blacklist si fuera necesario.
    return new OperationResult(true, "Cierre de sesión exitoso (lado cliente).");
  }

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

      user.password = await bcrypt.hash(user.password, 10);
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

      // Si se está actualizando el password, hashearlo
      if (user.password) {
        user.password = await bcrypt.hash(user.password, 10);
      }

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
}