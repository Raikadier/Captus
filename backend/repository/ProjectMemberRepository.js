import BaseRepository from "./BaseRepository.js";
import ProjectMember from "../models/ProjectMembersModels.js";
import User from "../models/UserModels.js";
import Project from "../models/ProjectModels.js";
import Rol from "../models/RolModels.js";

class ProjectMemberRepository extends BaseRepository {
  constructor() {
    super(ProjectMember);
  }

  // Obtener todos los miembros de proyectos
  async getAll() {
    try {
      return await ProjectMember.findAll({
        include: [User, Project, Rol],
      });
    } catch (error) {
      console.error("Error al obtener miembros de proyectos:", error);
      return [];
    }
  }

  // Obtener miembros de un proyecto específico
  async getByProject(projectId) {
    try {
      if (!projectId) return [];
      return await ProjectMember.findAll({
        where: { id_Project: projectId },
        include: [User, Project, Rol],
      });
    } catch (error) {
      console.error("Error al obtener miembros por proyecto:", error);
      return [];
    }
  }

  // Obtener proyectos de un usuario (como miembro)
  async getByUser(userId) {
    try {
      if (!userId) return [];
      return await ProjectMember.findAll({
        where: { id_User: userId },
        include: [User, Project, Rol],
      });
    } catch (error) {
      console.error("Error al obtener proyectos por usuario:", error);
      return [];
    }
  }

  // Obtener un miembro específico por ID
  async getById(id) {
    try {
      if (!id) return null;
      return await ProjectMember.findByPk(id, {
        include: [User, Project, Rol],
      });
    } catch (error) {
      console.error("Error al obtener miembro por ID:", error);
      return null;
    }
  }

  // Verificar si un usuario es miembro de un proyecto
  async isMember(projectId, userId) {
    try {
      if (!projectId || !userId) return false;
      const member = await ProjectMember.findOne({
        where: { id_Project: projectId, id_User: userId },
      });
      return member !== null;
    } catch (error) {
      console.error("Error al verificar membresía:", error);
      return false;
    }
  }

  // Obtener el rol de un usuario en un proyecto
  async getUserRole(projectId, userId) {
    try {
      if (!projectId || !userId) return null;
      const member = await ProjectMember.findOne({
        where: { id_Project: projectId, id_User: userId },
        include: [Rol],
      });
      return member ? member.Rol : null;
    } catch (error) {
      console.error("Error al obtener rol de usuario:", error);
      return null;
    }
  }

  // Actualizar rol de un miembro
  async updateRole(projectId, userId, roleId) {
    try {
      if (!projectId || !userId || !roleId) return false;

      const [updated] = await ProjectMember.update(
        { id_Rol: roleId },
        { where: { id_Project: projectId, id_User: userId } }
      );

      return updated > 0;
    } catch (error) {
      console.error("Error al actualizar rol de miembro:", error);
      return false;
    }
  }

  // Eliminar miembro de un proyecto
  async removeMember(projectId, userId) {
    try {
      if (!projectId || !userId) return false;
      const deleted = await ProjectMember.destroy({
        where: { id_Project: projectId, id_User: userId },
      });
      return deleted > 0;
    } catch (error) {
      console.error("Error al eliminar miembro:", error);
      return false;
    }
  }
}

export default ProjectMemberRepository;