import BaseRepository from "./BaseRepository.js";
import Priority from "../models/PriorityModels.js";

class PriorityRepository extends BaseRepository {
  constructor() {
    super(Priority);
  }

  // Obtener todas las prioridades
  async getAll() {
    try {
      return await Priority.findAll();
    } catch (error) {
      console.error("Error al obtener prioridades:", error);
      return [];
    }
  }

  // Obtener una prioridad por su ID
  async getById(id) {
    try {
      if (!id) return null;
      return await Priority.findByPk(id);
    } catch (error) {
      console.error("Error al obtener prioridad por ID:", error);
      return null;
    }
  }
}

export default PriorityRepository;