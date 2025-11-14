import { DataTypes } from "sequelize";
import { sequelize } from "../db.js";
import User from "./UserModels.js";

const UserAchievements = sequelize.define(
  "UserAchievements",
  {
    id_User: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "id_User",
      },
      primaryKey: true,
    },
    achievementId: {
      type: DataTypes.STRING(50),
      allowNull: false,
      primaryKey: true,
    },
    unlockedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    progress: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    isCompleted: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    tableName: "UserAchievements",
    timestamps: false,
  }
);

// Relaciones
User.hasMany(UserAchievements, { foreignKey: "id_User" });
UserAchievements.belongsTo(User, { foreignKey: "id_User" });

export default UserAchievements;