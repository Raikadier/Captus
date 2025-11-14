import BaseRepository from "./BaseRepository.js";
import Task from "../models/TaskModels.js";
import User from "../models/UserModels.js";
import Category from "../models/CategoryModels.js";
import Priority from "../models/PriorityModels.js";

class TaskRepository extends BaseRepository {
  constructor() {
    super(Task);
  }

  // Obtener todas las tareas
  async getAll() {
    try {
      return await Task.findAll({
        include: [User, Category, Priority],
      });
    } catch (error) {
      console.error("Error al obtener tareas:", error);
      return [];
    }
  }

  // Obtener todas las tareas de un usuario específico
  async getAllByUserId(userId) {
    try {
      if (!userId) return [];
      return await Task.findAll({
        where: { id_User: userId },
        include: [User, Category, Priority],
      });
    } catch (error) {
      console.error("Error al obtener tareas por usuario:", error);
      return [];
    }
  }

  // Obtener una tarea por su ID
  async getById(id) {
    try {
      if (!id) return null;
      return await Task.findByPk(id, {
        include: [User, Category, Priority],
      });
    } catch (error) {
      console.error("Error al obtener tarea por ID:", error);
      return null;
    }
  }

  // Actualizar tarea
  async update(entity) {
    try {
      if (!entity || !entity.id_Task) return false;

      const task = await Task.findByPk(entity.id_Task);
      if (!task) return false;

      await task.update({
        title: entity.title,
        id_Category: entity.id_Category,
        description: entity.description || null,
        endDate: entity.endDate,
        id_Priority: entity.id_Priority,
        state: entity.state,
        id_User: entity.id_User,
      });

      return true;
    } catch (error) {
      console.error("Error al actualizar tarea:", error);
      return false;
    }
  }

  // Eliminar tarea
  async delete(id) {
    try {
      if (!id) return false;
      const deletedRows = await Task.destroy({
        where: { id_Task: id },
      });
      return deletedRows > 0;
    } catch (error) {
      console.error("Error al eliminar tarea:", error);
      return false;
    }
  }
}

export default TaskRepository;