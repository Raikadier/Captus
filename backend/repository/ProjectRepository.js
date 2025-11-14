import BaseRepository from "./BaseRepository.js";
import Project from "../models/ProjectModels.js";
import User from "../models/UserModels.js";

class ProjectRepository extends BaseRepository {
  constructor() {
    super(Project);
  }

  // Obtener todos los proyectos
  async getAll() {
    try {
      return await Project.findAll({
        include: [{ model: User, as: "Creator" }],
      });
    } catch (error) {
      console.error("Error al obtener proyectos:", error);
      return [];
    }
  }

  // Obtener proyectos de un usuario (como creador)
  async getByCreator(creatorId) {
    try {
      if (!creatorId) return [];
      return await Project.findAll({
        where: { id_Creator: creatorId },
        include: [{ model: User, as: "Creator" }],
      });
    } catch (error) {
      console.error("Error al obtener proyectos por creador:", error);
      return [];
    }
  }

  // Obtener un proyecto por su ID
  async getById(id) {
    try {
      if (!id) return null;
      return await Project.findByPk(id, {
        include: [{ model: User, as: "Creator" }],
      });
    } catch (error) {
      console.error("Error al obtener proyecto por ID:", error);
      return null;
    }
  }

  // Obtener un proyecto por su nombre
  async getByName(name) {
    try {
      if (!name) return null;
      return await Project.findOne({
        where: { name },
        include: [{ model: User, as: "Creator" }],
      });
    } catch (error) {
      console.error("Error al obtener proyecto por nombre:", error);
      return null;
    }
  }

  // Actualizar proyecto
  async update(entity) {
    try {
      if (!entity || !entity.id_Project) return false;

      const project = await Project.findByPk(entity.id_Project);
      if (!project) return false;

      await project.update({
        name: entity.name,
        description: entity.description || null,
      });

      return true;
    } catch (error) {
      console.error("Error al actualizar proyecto:", error);
      return false;
    }
  }

  // Eliminar proyecto
  async delete(id) {
    try {
      if (!id) return false;
      const deletedRows = await Project.destroy({
        where: { id_Project: id },
      });
      return deletedRows > 0;
    } catch (error) {
      console.error("Error al eliminar proyecto:", error);
      return false;
    }
  }
}

export default ProjectRepository;