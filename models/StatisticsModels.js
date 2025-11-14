import { DataTypes } from "sequelize";
import { sequelize } from "../db.js";
import User from "./UserModels.js";

const Statistics = sequelize.define(
  "Statistics",
  {
    id_Statistics: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    
    id_User: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "id_User",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    lastRachaDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    racha: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    totalTasks: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    completedTasks: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    dailyGoal: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 5,
    },
    bestStreak: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    favoriteCategory: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "Category",
        key: "id_Category",
      },
    },
  },
  {
    tableName: "Statistics",
    timestamps: false,
  }
);

User.hasMany(Statistics, { foreignKey: "id_User" , onDelete: "CASCADE" });
Statistics.belongsTo(User, { foreignKey: "id_User" });

export default Statistics;
