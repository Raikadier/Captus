import BaseRepository from "./BaseRepository.js";
import StatisticsRepository from "./StatisticsRepository.js";
import { isMockMode } from "../lib/supabaseClient.js";

// Mappings se mantienen igual
const mapFromDb = (row) => ({
  id_User: row.id, userName: row.name || row.email?.split('@')[0], email: row.email,
  name: row.name, carrer: row.carrer, bio: row.bio,
  createdAt: row.created_at, updatedAt: row.updated_at,
});
const mapToDb = (entity) => ({
  id: entity.id_User, email: entity.email, name: entity.name || entity.userName,
  carrer: entity.carrer, bio: entity.bio,
});

class UserRepository extends BaseRepository {
  constructor() {
    super("users", { primaryKey: "id", mapFromDb, mapToDb });
    this.statisticsRepository = new StatisticsRepository();
  }

  // Sobrescribimos 'save' para mantener la lógica de creación de estadísticas (solo en Supabase).
  async save(entity) {
    const user = await super.save(entity); // Esto siempre escribe en Supabase
    // La creación de estadísticas solo tiene sentido para datos reales.
    if (user && this.client) {
      const existingStats = await this.statisticsRepository.getByUser(user.id_User);
      if (!existingStats) {
        const stats = this.statisticsRepository.defaultStatistics(user.id_User);
        await this.statisticsRepository.save(stats);
      }
    }
    return user;
  }

  // Los métodos de lectura ahora siguen la lógica aditiva.
  async getByUsername(username) {
    const users = await super.getAll({ name: username });
    if (users.length > 0) return users[0];
    if (isMockMode()) {
      return this.mockSet.find(u => u.name === username || u.email.startsWith(username + '@')) || null;
    }
    return null;
  }

  async getByEmail(email) {
    const users = await super.getAll({ email: email });
    if (users.length > 0) return users[0];
    if (isMockMode()) {
      return this.mockSet.find(u => u.email === email) || null;
    }
    return null;
  }

  async isEmailRegistered(email) {
      const user = await this.getByEmail(email);
      return !!user;
  }
}

export default UserRepository;
