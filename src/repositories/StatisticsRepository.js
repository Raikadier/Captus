import BaseRepository from "./BaseRepository.js";

const mapFromDb = (row) => ({
  id_Statistics: row.id,
  id_User: row.user_id,
  startDate: row.start_date,
  endDate: row.end_date,
  lastRachaDate: row.last_racha_date,
  racha: row.racha,
  totalTasks: row.total_tasks,
  completedTasks: row.completed_tasks,
  dailyGoal: row.daily_goal,
  bestStreak: row.best_streak,
  favoriteCategory: row.favorite_category,
});

const mapToDb = (entity) => ({
  user_id: entity.id_User,
  start_date: entity.startDate ?? null,
  end_date: entity.endDate ?? null,
  last_racha_date: entity.lastRachaDate ?? null,
  racha: entity.racha ?? 0,
  total_tasks: entity.totalTasks ?? 0,
  completed_tasks: entity.completedTasks ?? 0,
  daily_goal: entity.dailyGoal ?? 5,
  best_streak: entity.bestStreak ?? 0,
  favorite_category: entity.favoriteCategory ?? null,
});

export default class StatisticsRepository extends BaseRepository {
  constructor() {
    super("statistics", {
      primaryKey: "id",
      mapFromDb,
      mapToDb,
    });
  }

  async getByUser(userId) {
    if (!userId) return null;
    const { data, error } = await this.client
      .from(this.tableName)
      .select("*")
      .eq("user_id", userId)
      .maybeSingle();

    if (error) {
      if (error.code === "PGRST116") return null;
      throw new Error(error.message);
    }

    return data ? mapFromDb(data) : null;
  }

  async update(statistics) {
    if (!statistics?.id_User) return null;
    const result = await this.client
      .from(this.tableName)
      .update(mapToDb(statistics))
      .eq("user_id", statistics.id_User)
      .select("*")
      .maybeSingle();

    if (result.error) {
      throw new Error(result.error.message);
    }

    return result.data ? mapFromDb(result.data) : null;
  }

  async delete(userId) {
    if (!userId) return false;
    const { error } = await this.client.from(this.tableName).delete().eq("user_id", userId);
    if (error) {
      throw new Error(error.message);
    }
    return true;
  }

  defaultStatistics(userId) {
    return {
      id_User: userId,
      startDate: new Date(),
      endDate: new Date(),
      racha: 0,
      totalTasks: 0,
      completedTasks: 0,
      dailyGoal: 5,
      bestStreak: 0,
      lastRachaDate: null,
      favoriteCategory: null,
    };
  }
}
