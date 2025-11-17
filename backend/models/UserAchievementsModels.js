export default class UserAchievements {
  constructor({
    id_User,
    achievementId,
    unlockedAt = new Date(),
    progress = 0,
    isCompleted = false,
  }) {
    this.id_User = id_User; // PK (parte 1)
    this.achievementId = achievementId; // PK (parte 2)
    this.unlockedAt = unlockedAt;
    this.progress = progress;
    this.isCompleted = isCompleted;
  }
}
