import BaseRepository from "./BaseRepository.js";
import SubTask from "../models/SubTaskModels.js";
import Task from "../models/TaskModels.js";
import User from "../models/UserModels.js";
import Category from "../models/CategoryModels.js";
import Priority from "../models/PriorityModels.js";

class SubTaskRepository extends BaseRepository {
  constructor() {
    super(SubTask);
  }

  // Obtener todas las subtareas
  async getAll() {
    try {
      return await SubTask.findAll({
        include: [Task, User, Category, Priority],
      });
    } catch (error) {
      console.error("Error al obtener subtareas:", error);
      return [];
    }
  }

  // Obtener todas las subtareas de una tarea específica
  async getAllByTaskId(taskId) {
    try {
      if (!taskId) return [];
      return await SubTask.findAll({
        where: { id_Task: taskId },
        include: [Task, User, Category, Priority],
      });
    } catch (error) {
      console.error("Error al obtener subtareas por tarea:", error);
      return [];
    }
  }

  // Obtener una subtarea por su ID
  async getById(id) {
    try {
      if (!id) return null;
      return await SubTask.findByPk(id, {
        include: [Task, User, Category, Priority],
      });
    } catch (error) {
      console.error("Error al obtener subtarea por ID:", error);
      return null;
    }
  }

  // Actualizar subtarea
  async update(entity) {
    try {
      if (!entity || !entity.id_SubTask) return false;

      const subTask = await SubTask.findByPk(entity.id_SubTask);
      if (!subTask) return false;

      await subTask.update({
        title: entity.title,
        id_Category: entity.id_Category,
        description: entity.description || null,
        creationDate: entity.creationDate,
        endDate: entity.endDate,
        id_Priority: entity.id_Priority,
        state: entity.state,
        id_Task: entity.id_Task,
        id_User: entity.id_User,
      });

      return true;
    } catch (error) {
      console.error("Error al actualizar subtarea:", error);
      return false;
    }
  }

  // Eliminar subtarea
  async delete(id) {
    try {
      if (!id) return false;
      const deletedRows = await SubTask.destroy({
        where: { id_SubTask: id },
      });
      return deletedRows > 0;
    } catch (error) {
      console.error("Error al eliminar subtarea:", error);
      return false;
    }
  }
}

export default SubTaskRepository;