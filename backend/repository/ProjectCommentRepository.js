import BaseRepository from "./BaseRepository.js";
import ProjectComment from "../models/ProjectCommentModels.js";
import User from "../models/UserModels.js";
import Project from "../models/ProjectModels.js";

class ProjectCommentRepository extends BaseRepository {
  constructor() {
    super(ProjectComment);
  }

  // Obtener todos los comentarios
  async getAll() {
    try {
      return await ProjectComment.findAll({
        include: [User, Project, { model: ProjectComment, as: "ParentComment" }],
        order: [["createdAt", "ASC"]],
      });
    } catch (error) {
      console.error("Error al obtener comentarios:", error);
      return [];
    }
  }

  // Obtener comentarios de un proyecto
  async getByProject(projectId) {
    try {
      if (!projectId) return [];
      return await ProjectComment.findAll({
        where: { id_Project: projectId },
        include: [User, Project, { model: ProjectComment, as: "ParentComment" }],
        order: [["createdAt", "ASC"]],
      });
    } catch (error) {
      console.error("Error al obtener comentarios por proyecto:", error);
      return [];
    }
  }

  // Obtener comentarios de un usuario
  async getByUser(userId) {
    try {
      if (!userId) return [];
      return await ProjectComment.findAll({
        where: { id_User: userId },
        include: [User, Project, { model: ProjectComment, as: "ParentComment" }],
        order: [["createdAt", "ASC"]],
      });
    } catch (error) {
      console.error("Error al obtener comentarios por usuario:", error);
      return [];
    }
  }

  // Obtener un comentario por su ID
  async getById(id) {
    try {
      if (!id) return null;
      return await ProjectComment.findByPk(id, {
        include: [
          User,
          Project,
          { model: ProjectComment, as: "ParentComment" },
          { model: ProjectComment, as: "Replies", include: [User] }
        ],
      });
    } catch (error) {
      console.error("Error al obtener comentario por ID:", error);
      return null;
    }
  }

  // Obtener respuestas de un comentario
  async getReplies(commentId) {
    try {
      if (!commentId) return [];
      return await ProjectComment.findAll({
        where: { id_ParentComment: commentId },
        include: [User, Project],
        order: [["createdAt", "ASC"]],
      });
    } catch (error) {
      console.error("Error al obtener respuestas:", error);
      return [];
    }
  }

  // Actualizar comentario
  async update(entity) {
    try {
      if (!entity || !entity.id_Comment) return false;

      const comment = await ProjectComment.findByPk(entity.id_Comment);
      if (!comment) return false;

      await comment.update({
        content: entity.content,
      });

      return true;
    } catch (error) {
      console.error("Error al actualizar comentario:", error);
      return false;
    }
  }

  // Eliminar comentario
  async delete(id) {
    try {
      if (!id) return false;
      const deletedRows = await ProjectComment.destroy({
        where: { id_Comment: id },
      });
      return deletedRows > 0;
    } catch (error) {
      console.error("Error al eliminar comentario:", error);
      return false;
    }
  }
}

export default ProjectCommentRepository;