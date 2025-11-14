// repositories/UserAchievementsRepository.js
import BaseRepository from "./BaseRepository.js";
import UserAchievements from "../models/UserAchievementsModels.js";
import User from "../models/UserModels.js";

class UserAchievementsRepository extends BaseRepository {
  constructor() {
    super(UserAchievements);
  }

  // ✅ Obtener todos los logros de un usuario
  async getByUser(userId) {
    try {
      if (!userId) return [];
      return await UserAchievements.findAll({
        where: { id_User: userId },
        include: [User],
        order: [["unlockedAt", "DESC"]],
      });
    } catch (error) {
      console.error("Error al obtener logros del usuario:", error);
      return [];
    }
  }

  // ✅ Obtener un logro específico de un usuario
  async getByUserAndAchievement(userId, achievementId) {
    try {
      if (!userId || !achievementId) return null;
      return await UserAchievements.findOne({
        where: { id_User: userId, achievementId },
        include: [User],
      });
    } catch (error) {
      console.error("Error al obtener logro específico:", error);
      return null;
    }
  }

  // ✅ Verificar si un usuario tiene un logro desbloqueado
  async hasAchievement(userId, achievementId) {
    try {
      const achievement = await this.getByUserAndAchievement(userId, achievementId);
      return achievement !== null;
    } catch (error) {
      console.error("Error verificando logro:", error);
      return false;
    }
  }

  // ✅ Desbloquear un logro para un usuario
  async unlockAchievement(userId, achievementId, progress = 0) {
    try {
      if (!userId || !achievementId) return false;

      const existing = await this.getByUserAndAchievement(userId, achievementId);
      if (existing) {
        // Actualizar progreso si ya existe
        existing.progress = progress;
        existing.isCompleted = true;
        await existing.save();
        return true;
      }

      // Crear nuevo logro desbloqueado
      const newAchievement = await UserAchievements.create({
        id_User: userId,
        achievementId,
        progress,
        isCompleted: true,
      });

      return newAchievement !== null;
    } catch (error) {
      console.error("Error desbloqueando logro:", error);
      return false;
    }
  }

  // ✅ Actualizar progreso de un logro
  async updateProgress(userId, achievementId, progress) {
    try {
      const achievement = await this.getByUserAndAchievement(userId, achievementId);
      if (achievement) {
        achievement.progress = progress;
        await achievement.save();
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error actualizando progreso:", error);
      return false;
    }
  }

  // ✅ Obtener estadísticas de logros por usuario
  async getAchievementStats(userId) {
    try {
      const achievements = await this.getByUser(userId);
      const completed = achievements.filter(a => a.isCompleted).length;
      const total = achievements.length;

      return {
        totalAchievements: total,
        completedAchievements: completed,
        completionRate: total > 0 ? Math.round((completed / total) * 100) : 0,
      };
    } catch (error) {
      console.error("Error obteniendo estadísticas de logros:", error);
      return { totalAchievements: 0, completedAchievements: 0, completionRate: 0 };
    }
  }
}

export default UserAchievementsRepository;