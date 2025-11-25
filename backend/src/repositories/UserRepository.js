import BaseRepository from "./BaseRepository.js";
import StatisticsRepository from "./StatisticsRepository.js";

const mapFromDb = (row) => ({
  id_User: row.id,
  userName: row.name || row.email?.split('@')[0], // Usar name o extraer de email
  email: row.email,
  name: row.name,
  carrer: row.carrer,
  bio: row.bio,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

const mapToDb = (entity) => ({
  id: entity.id_User, // Para upsert
  email: entity.email,
  name: entity.name || entity.userName,
  carrer: entity.carrer,
  bio: entity.bio,
  created_at: entity.createdAt || new Date(),
  updated_at: entity.updatedAt || new Date(),
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

      // Upsert usuario (insertar si no existe, actualizar si existe)
      const { data, error } = await this.client
        .from(this.tableName)
        .upsert(mapToDb(entity), { onConflict: 'id' })
        .select("*")
        .single();

      if (error) {
        console.error("Error saving user:", error.message);
        return null;
      }

      const user = mapFromDb(data);

      // Verificar si ya existen estadísticas, si no, crearlas
      const existingStats = await this.statisticsRepository.getByUser(user.id_User);
      if (!existingStats) {
        const stats = this.statisticsRepository.defaultStatistics(user.id_User);
        const statsCreated = await this.statisticsRepository.save(stats);
        if (!statsCreated) {
          console.error("Error al guardar estadísticas para usuario:", user.id_User);
          // No eliminamos el usuario, solo logueamos el error
        }
      }

      return user;
    } catch (error) {
      console.error("Error saving user:", error.message);
      return null;
    }
  }

  async getByUsername(username) {
    try {
      // Buscar por name o por email (username derivado)
      const { data, error } = await this.client
        .from(this.tableName)
        .select("*")
        .or(`name.eq.${username},email.eq.${username}`)
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
