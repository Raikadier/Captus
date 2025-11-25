import BaseRepository from "./BaseRepository.js";
import { isMockMode } from "../lib/supabaseClient.js";

// Mappings se mantienen igual
const mapFromDb = (row) => ({
  id: row.id, title: row.title, description: row.description, created_at: row.created_at,
  due_date: row.due_date, priority_id: row.priority_id, category_id: row.category_id,
  completed: row.completed, user_id: row.user_id, updated_at: row.updated_at,
  id_Task: row.id, state: row.completed, creationDate: row.created_at,
  endDate: row.due_date, id_Priority: row.priority_id, id_Category: row.category_id,
  id_User: row.user_id,
});
const mapToDb = (entity) => ({
  title: entity.title, description: entity.description ?? null, due_date: entity.due_date ?? entity.endDate ?? null,
  priority_id: entity.priority_id ?? entity.id_Priority ?? null, category_id: entity.category_id ?? entity.id_Category ?? null,
  completed: entity.completed ?? entity.state ?? false, user_id: entity.user_id ?? entity.id_User,
});

class TaskRepository extends BaseRepository {
  constructor() {
    super("tasks", { primaryKey: "id", mapFromDb, mapToDb });
  }

  // save, update, delete se heredan directamente y son correctos.

  async getAllByUserId(userId) {
    if (!userId) return [];
    return super.getAll({ user_id: userId });
  }

  // --- Métodos con Lógica Aditiva Manual ---

  async getOverdueByUser(userId) {
    if (!userId) return [];
    let supabaseData = [];

    if (this.client) {
      const now = new Date().toISOString();
      const { data, error } = await this.client.from(this.tableName)
        .select("*").eq("user_id", userId).eq("completed", false).lt("due_date", now);
      if (error) throw new Error(error.message);
      supabaseData = data.map(mapFromDb);
    }

    if (isMockMode()) {
      const supabaseIds = new Set(supabaseData.map(t => t.id));
      const now = new Date();
      const additiveMocks = this.mockSet.filter(t =>
        t.user_id === userId && !t.completed && t.due_date && new Date(t.due_date) < now && !supabaseIds.has(t.id)
      );
      return [...supabaseData, ...additiveMocks];
    }
    return supabaseData;
  }

  async getCompletedToday(userId) {
    if (!userId) return [];
    let supabaseData = [];
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    if (this.client) {
      const endOfDay = new Date(startOfDay);
      endOfDay.setDate(endOfDay.getDate() + 1);
      const { data, error } = await this.client.from(this.tableName).select("*").eq("user_id", userId).eq("completed", true)
        .gte("updated_at", startOfDay.toISOString()).lt("updated_at", endOfDay.toISOString());
      if (error) throw new Error(error.message);
      supabaseData = data.map(mapFromDb);
    }

    if (isMockMode()) {
        const supabaseIds = new Set(supabaseData.map(t => t.id));
        const additiveMocks = this.mockSet.filter(t =>
            t.user_id === userId && t.completed && new Date(t.updated_at) >= startOfDay && !supabaseIds.has(t.id)
        );
        return [...supabaseData, ...additiveMocks];
    }
    return supabaseData;
  }

  // --- Métodos de escritura (siempre a Supabase) ---

  async deleteByUser(userId) {
    if (!userId) return true;
    if (!this.client) return false;
    const { error } = await this.client.from(this.tableName).delete().eq("user_id", userId);
    if (error) throw new Error(error.message);
    return true;
  }

  async deleteByCategory(categoryId) {
    if (!categoryId) return true;
    if (!this.client) return false;
    const { error } = await this.client.from(this.tableName).delete().eq("category_id", categoryId);
    if (error) throw new Error(error.message);
    return true;
  }
}

export default TaskRepository;
