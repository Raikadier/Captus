import { DataTypes } from "sequelize";
import { sequelize } from "../db.js";
import User from "./UserModels.js";
import Category from "./CategoryModels.js";
import Priority from "./PriorityModels.js";
import Task from "./TaskModels.js";

const SubTask = sequelize.define(
  "SubTask",
  {
    id_SubTask: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING(150),
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
    id_Task: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Task,
        key: "id_Task",
      },
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
    tableName: "SubTask",
    timestamps: false,
  }
);

Task.hasMany(SubTask, { foreignKey: "id_Task" , onDelete: "CASCADE" });
SubTask.belongsTo(Task, { foreignKey: "id_Task" });

User.hasMany(SubTask, { foreignKey: "id_User" , onDelete: "CASCADE" });
SubTask.belongsTo(User, { foreignKey: "id_User" });

Category.hasMany(SubTask, { foreignKey: "id_Category" , onDelete: "CASCADE" });
SubTask.belongsTo(Category, { foreignKey: "id_Category" });

Priority.hasMany(SubTask, { foreignKey: "id_Priority" , onDelete: "CASCADE" });
SubTask.belongsTo(Priority, { foreignKey: "id_Priority" });

export default SubTask;
