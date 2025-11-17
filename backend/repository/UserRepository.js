import BaseRepository from "./BaseRepository.js";
import StatisticsRepository from "./StatisticsRepository.js";

const mapFromDb = (row) => ({
  id_User: row.id,
  userName: row.username,
  email: row.email,
  firstName: row.first_name,
  lastName: row.last_name,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

const mapToDb = (entity) => ({
  username: entity.userName,
  email: entity.email,
  first_name: entity.firstName ?? null,
  last_name: entity.lastName ?? null,
});

export default class UserRepository extends BaseRepository {
  constructor() {
    super("users", {
      primaryKey: "id",
      mapFromDb,
      mapToDb,
    });
    this.statisticsRepository = new StatisticsRepository();
  }

  async save(entity) {
    try {
      if (!entity) return null;

      // Inserta usuario en Supabase
      const { data, error } = await this.client
        .from(this.tableName)
        .insert(mapToDb(entity))
        .select("*")
        .single();

      if (error) {
        console.error("Error saving user:", error.message);
        return null;
      }

      const user = mapFromDb(data);

      // Crear estadísticas por defecto
      const stats = this.statisticsRepository.defaultStatistics(user.id_User);
      const statsCreated = await this.statisticsRepository.save(stats);
      if (!statsCreated) {
        // Si falla, eliminar usuario creado
        await this.client.from(this.tableName).delete().eq("id", user.id_User);
        console.error("Error al guardar estadísticas. Usuario eliminado.");
        return null;
      }

      return user;
    } catch (error) {
      console.error("Error saving user:", error.message);
      return null;
    }
  }

  async getByUsername(username) {
    try {
      const { data, error } = await this.client
        .from(this.tableName)
        .select("*")
        .eq("username", username)
        .maybeSingle();

      if (error) {
        console.error("Error getting user by username:", error.message);
        return null;
      }

      return data ? mapFromDb(data) : null;
    } catch (error) {
      console.error("Error getting user by username:", error.message);
      return null;
    }
  }

  // Verificar si email ya está registrado
  async isEmailRegistered(email) {
    try {
      const { data, error } = await this.client
        .from(this.tableName)
        .select("id")
        .eq("email", email)
        .maybeSingle();

      if (error) {
        console.error("Error checking email:", error.message);
        return false;
      }

      return !!data;
    } catch (error) {
      console.error("Error checking email:", error.message);
      return false;
    }
  }

  // Método adicional: obtener usuario por email
  async getByEmail(email) {
    try {
      const { data, error } = await this.client
        .from(this.tableName)
        .select("*")
        .eq("email", email)
        .maybeSingle();

      if (error) {
        console.error("Error getting user by email:", error.message);
        return null;
      }

      return data ? mapFromDb(data) : null;
    } catch (error) {
      console.error("Error getting user by email:", error.message);
      return null;
    }
  }
}
