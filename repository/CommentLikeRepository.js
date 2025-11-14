import BaseRepository from "./BaseRepository.js";
import CommentLike from "../models/CommentLikeModels.js";
import User from "../models/UserModels.js";
import ProjectComment from "../models/ProjectCommentModels.js";

class CommentLikeRepository extends BaseRepository {
  constructor() {
    super(CommentLike);
  }

  // Obtener todos los likes
  async getAll() {
    try {
      return await CommentLike.findAll({
        include: [User, ProjectComment],
        order: [["createdAt", "DESC"]],
      });
    } catch (error) {
      console.error("Error al obtener likes:", error);
      return [];
    }
  }

  // Obtener likes de un comentario
  async getByComment(commentId) {
    try {
      if (!commentId) return [];
      return await CommentLike.findAll({
        where: { id_Comment: commentId },
        include: [User, ProjectComment],
        order: [["createdAt", "DESC"]],
      });
    } catch (error) {
      console.error("Error al obtener likes por comentario:", error);
      return [];
    }
  }

  // Obtener likes de un usuario
  async getByUser(userId) {
    try {
      if (!userId) return [];
      return await CommentLike.findAll({
        where: { id_User: userId },
        include: [User, ProjectComment],
        order: [["createdAt", "DESC"]],
      });
    } catch (error) {
      console.error("Error al obtener likes por usuario:", error);
      return [];
    }
  }

  // Obtener un like por su ID
  async getById(id) {
    try {
      if (!id) return null;
      return await CommentLike.findByPk(id, {
        include: [User, ProjectComment],
      });
    } catch (error) {
      console.error("Error al obtener like por ID:", error);
      return null;
    }
  }

  // Verificar si un usuario ya likió un comentario
  async hasUserLiked(commentId, userId) {
    try {
      if (!commentId || !userId) return false;
      const like = await CommentLike.findOne({
        where: { id_Comment: commentId, id_User: userId },
      });
      return like !== null;
    } catch (error) {
      console.error("Error al verificar like:", error);
      return false;
    }
  }

  // Agregar like a un comentario
  async addLike(commentId, userId) {
    try {
      if (!commentId || !userId) return false;

      // Verificar si ya existe
      const existingLike = await this.hasUserLiked(commentId, userId);
      if (existingLike) return false;

      const like = await CommentLike.create({
        id_Comment: commentId,
        id_User: userId,
      });

      return like !== null;
    } catch (error) {
      console.error("Error al agregar like:", error);
      return false;
    }
  }

  // Remover like de un comentario
  async removeLike(commentId, userId) {
    try {
      if (!commentId || !userId) return false;
      const deleted = await CommentLike.destroy({
        where: { id_Comment: commentId, id_User: userId },
      });
      return deleted > 0;
    } catch (error) {
      console.error("Error al remover like:", error);
      return false;
    }
  }

  // Contar likes de un comentario
  async countLikes(commentId) {
    try {
      if (!commentId) return 0;
      return await CommentLike.count({
        where: { id_Comment: commentId },
      });
    } catch (error) {
      console.error("Error al contar likes:", error);
      return 0;
    }
  }

  // Eliminar like por ID
  async delete(id) {
    try {
      if (!id) return false;
      const deletedRows = await CommentLike.destroy({
        where: { id_Like: id },
      });
      return deletedRows > 0;
    } catch (error) {
      console.error("Error al eliminar like:", error);
      return false;
    }
  }
}

export default CommentLikeRepository;