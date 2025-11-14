import BaseRepository from "./BaseRepository.js";
import User from "../models/UserModels.js";
import Statistics from "../models/StatisticsModels.js";
import StatisticsRepository from "./StatisticsRepository.js";

export default class UserRepository extends BaseRepository {
  constructor() {
    super(User);
    this.statisticsRepository = new StatisticsRepository();
  }

  
  async save(entity) {
    const transaction = await User.sequelize.transaction();
    try {
      if (!entity) return false;

      // Crea usuario
      const user = await User.create(entity, { transaction });
      //Crear estadísticas por defecto
        const stats = this.statisticsRepository.defaultStatistics(user);
      const statsCreated = await this.statisticsRepository.save(stats, transaction);
      if (!statsCreated) {
        await transaction.rollback();
        console.error("Error al guardar estadísticas. Usuario eliminado.");
        return false;
      }

      await transaction.commit();
      return user;
    } catch (error) {
      await transaction.rollback();
      console.error("Error saving user:", error.message);
      return false;
    }
  }

  async login(username, password) {
    try {
      const user = await User.findOne({ where: { userName: username, password } });
      return user || null;
    } catch (error) {
      console.error("Error in login:", error.message);
      return null;
    }
  }

  async getByUsername(username) {
    try {
      return await User.findOne({ where: { userName: username } });
    } catch (error) {
      console.error("Error getting user by username:", error.message);
      return null;
    }
  }

  // Verificar si email ya está registrado
  async isEmailRegistered(email) {
    try {
      const count = await User.count({ where: { email } });
      return count > 0;
    } catch (error) {
      console.error("Error checking email:", error.message);
      return false;
    }
  }
}
