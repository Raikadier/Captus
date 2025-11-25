import BaseRepository from "./BaseRepository.js";
import { isMockMode } from "../lib/supabaseClient.js";

// Mappings se mantienen igual
const mapFromDb = (row) => ({
  id: row.id, user_id: row.user_id, title: row.title, description: row.description,
  start_date: row.start_date, end_date: row.end_date, created_at: row.created_at,
  updated_at: row.updated_at, type: row.type, is_past: row.is_past, notify: row.notify,
});
const mapToDb = (entity) => ({
  user_id: entity.user_id, title: entity.title, description: entity.description ?? null,
  start_date: entity.start_date, end_date: entity.end_date ?? null, type: entity.type,
  is_past: entity.is_past ?? false, notify: entity.notify ?? false,
});

class EventsRepository extends BaseRepository {
  constructor() {
    super("events", { primaryKey: "id", mapFromDb, mapToDb });
  }

  // save, update, delete se heredan y son correctos.

  async getAllByUserId(userId) {
    if (!userId) return [];
    return super.getAll({ user_id: userId });
  }

  // --- Métodos con Lógica Aditiva Manual ---

  async getUpcomingByUserId(userId, limit = null) {
    if (!userId) return [];
    let supabaseData = [];

    if (this.client) {
        const now = new Date().toISOString();
        let query = this.client.from(this.tableName).select("*").eq("user_id", userId).eq("is_past", false)
          .gte("start_date", now).order("start_date", { ascending: true });
        if (limit) query = query.limit(limit);
        const { data, error } = await query;
        if (error) throw new Error(error.message);
        supabaseData = data.map(mapFromDb);
    }

    if (isMockMode()) {
        const supabaseIds = new Set(supabaseData.map(e => e.id));
        const now = new Date();
        const upcomingMocks = this.mockSet
            .filter(e => e.user_id === userId && !e.is_past && new Date(e.start_date) >= now && !supabaseIds.has(e.id))
            .sort((a, b) => new Date(a.start_date) - new Date(b.start_date));
        const additiveMocks = limit ? upcomingMocks.slice(0, limit - supabaseData.length) : upcomingMocks;
        return [...supabaseData, ...additiveMocks];
    }
    return supabaseData;
  }

  // Se simplifican otros métodos para operar solo en Supabase
  async getByDateRange(userId, startDate, endDate) {
    if (!userId || !startDate || !endDate || !this.client) return [];
    const { data, error } = await this.client.from(this.tableName).select("*").eq("user_id", userId)
      .gte("start_date", startDate).lte("start_date", endDate).order("start_date", { ascending: true });
    if (error) throw new Error(error.message);
    return data.map(mapFromDb);
  }

  async markAsPast(eventId) {
    if (!eventId || !this.client) return null;
    return super.update(eventId, { is_past: true });
  }

  async deleteByUser(userId) {
    if (!userId || !this.client) return true;
    const { error } = await this.client.from(this.tableName).delete().eq("user_id", userId);
    if (error) throw new Error(error.message);
    return true;
  }
}

export default EventsRepository;
