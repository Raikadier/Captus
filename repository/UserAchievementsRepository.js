// repositories/UserAchievementsRepository.js
import BaseRepository from "./BaseRepository.js";

const mapFromDb = (row) => ({
  id_User: row.user_id,
  achievementId: row.achievement_id,
  progress: row.progress,
  isCompleted: row.is_completed,
  unlockedAt: row.unlocked_at,
});

const mapToDb = (entity) => ({
  user_id: entity.id_User,
  achievement_id: entity.achievementId,
  progress: entity.progress ?? 0,
  is_completed: entity.isCompleted ?? false,
  unlocked_at: entity.unlockedAt ?? new Date().toISOString(),
});

class UserAchievementsRepository extends BaseRepository {
  constructor() {
    super("user_achievements", {
      primaryKey: "id",
      mapFromDb,
      mapToDb,
    });
  }

  async getByUser(userId) {
    if (!userId) return [];
    const { data, error } = await this.client
      .from(this.tableName)
      .select("*")
      .eq("user_id", userId)
      .order("unlocked_at", { ascending: false });

    if (error) {
      throw new Error(error.message);
    }

    return data.map(mapFromDb);
  }

  async getByUserAndAchievement(userId, achievementId) {
    if (!userId || !achievementId) return null;
    const { data, error } = await this.client
      .from(this.tableName)
      .select("*")
      .eq("user_id", userId)
      .eq("achievement_id", achievementId)
      .maybeSingle();

    if (error) {
      if (error.code === "PGRST116") return null;
      throw new Error(error.message);
    }

    return data ? mapFromDb(data) : null;
  }

  async hasAchievement(userId, achievementId) {
    const achievement = await this.getByUserAndAchievement(userId, achievementId);
    return achievement !== null;
  }

  async unlockAchievement(userId, achievementId, progress = 0) {
    if (!userId || !achievementId) return false;

    const existing = await this.getByUserAndAchievement(userId, achievementId);
    if (existing) {
      return this.updateProgress(userId, achievementId, progress, true);
    }

    await this.save({
      id_User: userId,
      achievementId,
      progress,
      isCompleted: true,
      unlockedAt: new Date().toISOString(),
    });

    return true;
  }

  async updateProgress(userId, achievementId, progress, complete = false) {
    const payload = {
      progress,
    };

    if (complete) {
      payload.is_completed = true;
      payload.unlocked_at = new Date().toISOString();
    }

    const { error } = await this.client
      .from(this.tableName)
      .update(payload)
      .eq("user_id", userId)
      .eq("achievement_id", achievementId);

    if (error) {
      throw new Error(error.message);
    }

    return true;
  }

  async getAchievementStats(userId) {
    const achievements = await this.getByUser(userId);
    const completed = achievements.filter((a) => a.isCompleted).length;
    const total = achievements.length;

    return {
      totalAchievements: total,
      completedAchievements: completed,
      completionRate: total > 0 ? Math.round((completed / total) * 100) : 0,
    };
  }
}

export default UserAchievementsRepository;
