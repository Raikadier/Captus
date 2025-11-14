import BaseRepository from "./BaseRepository.js";
import Statistics from "../models/StatisticsModels.js";
import User from "../models/UserModels.js";

export default class StatisticsRepository extends BaseRepository {
  constructor() {
    super(Statistics);
  }

  async getByUser(userId) {
    try {
      if (!userId) return null;
      return await Statistics.findOne({
        where: { id_User: userId },
        include: [{ model: User, as: "User" }],
      });
    } catch (error) {
      console.error("Error getting statistics by user:", error.message);
      return null;
    }
  }

  async update(statistics) {
    try {
      if (!statistics || !statistics.id_User) return false;

      const [updated] = await Statistics.update(
        {
          startDate: statistics.startDate,
          endDate: statistics.endDate,
          racha: statistics.racha,
          totalTasks: statistics.totalTasks,
          completedTasks: statistics.completedTasks,
          dailyGoal: statistics.dailyGoal,
          lastRachaDate: statistics.lastRachaDate ?? null,
        },
        { where: { id_User: statistics.id_User } }
      );

      return updated > 0;
    } catch (error) {
      console.error("Error updating statistics:", error.message);
      return false;
    }
  }

  async getById(id) {
    try {
      return await Statistics.findByPk(id, { include: [{ model: User, as: "User" }] });
    } catch (error) {
      console.error("Error getting statistics by id:", error.message);
      return null;
    }
  }

  async delete(userId) {
    try {
      if (!userId) return false;
      const deleted = await Statistics.destroy({ where: { id_User: userId } });
      return deleted > 0;
    } catch (error) {
      console.error("Error deleting statistics:", error.message);
      return false;
    }
  }

  // Estas son estadísticas por defecto al crear un usuario
  defaultStatistics(user) {
    return {
      id_User: user.id_User,
      startDate: new Date(),
      endDate: new Date(),
      racha: 0,
      totalTasks: 0,
      completedTasks: 0,
      dailyGoal: 5,
      lastRachaDate: null,
    };
  }
}
