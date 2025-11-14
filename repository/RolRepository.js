import BaseRepository from "./BaseRepository.js";
import Rol from "../models/RolModels.js";

class RolRepository extends BaseRepository {
  constructor() {
    super(Rol);
  }

  // Obtener todos los roles
  async getAll() {
    try {
      return await Rol.findAll();
    } catch (error) {
      console.error("Error al obtener roles:", error);
      return [];
    }
  }

  // Obtener un rol por su ID
  async getById(id) {
    try {
      if (!id) return null;
      return await Rol.findByPk(id);
    } catch (error) {
      console.error("Error al obtener rol por ID:", error);
      return null;
    }
  }

  // Obtener un rol por su nombre
  async getByName(name) {
    try {
      if (!name) return null;
      return await Rol.findOne({
        where: { name },
      });
    } catch (error) {
      console.error("Error al obtener rol por nombre:", error);
      return null;
    }
  }
}

export default RolRepository;