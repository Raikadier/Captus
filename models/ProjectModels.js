import { DataTypes } from "sequelize";
import { sequelize } from "../db.js";
import User from "./UserModels.js";

const Project = sequelize.define(
  "Project",
  {
    id_Project: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },
    description: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    id_Creator: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "id_User",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },
  },
  {
    tableName: "Project",
    timestamps: false,
  }
);

User.hasMany(Project, { foreignKey: "id_Creator", onDelete: "CASCADE" });
Project.belongsTo(User, { foreignKey: "id_Creator", as: "Creator" });

export default Project;

