import { DataTypes } from "sequelize";
import { sequelize } from "../db.js";
import User from "./UserModels.js";
import Category from "./CategoryModels.js";
import Priority from "./PriorityModels.js";

const Task = sequelize.define(
  "Task",
  {
    id_Task: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    id_Category: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Category,
        key: "id_Category",
      },
    },
    description: {
      type: DataTypes.STRING(250),
      allowNull: true,
    },
    creationDate: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    id_Priority: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Priority,
        key: "id_Priority",
      },
    },
    state: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    id_User: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "id_User",
      },
    },
  },
  {
    tableName: "Task",
    timestamps: false,
  }
);

User.hasMany(Task, { foreignKey: "id_User", onDelete: "CASCADE" });
Task.belongsTo(User, { foreignKey: "id_User" });

Category.hasMany(Task, { foreignKey: "id_Category", onDelete: "CASCADE" });
Task.belongsTo(Category, { foreignKey: "id_Category" });

Priority.hasMany(Task, { foreignKey: "id_Priority", onDelete: "CASCADE" });
Task.belongsTo(Priority, { foreignKey: "id_Priority" });

export default Task;

