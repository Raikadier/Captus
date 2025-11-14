import { DataTypes } from "sequelize";
import { sequelize } from "../db.js";
import User from "./UserModels.js";
import Project from "./ProjectModels.js";
import Rol from "./RolModels.js";

const ProjectMember = sequelize.define(
  "ProjectMember",
  {
    id_ProjectMember: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    id_User: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "id_User",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
      unique: "user_project_unique",
    },
    id_Project: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Project,
        key: "id_Project",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
      unique: "user_project_unique",
    },
    id_Rol: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Rol,
        key: "id_Rol",
      },
      onDelete: "RESTRICT",
      onUpdate: "CASCADE",
    },
  },
  {
    tableName: "ProjectMember",
    timestamps: false,
  }
);

User.belongsToMany(Project, {
  through: ProjectMember,
  foreignKey: "id_User",
  as: "UserProjects",
});

Project.belongsToMany(User, {
  through: ProjectMember,
  foreignKey: "id_Project",
  as: "ProjectMembers",
});

Rol.hasMany(ProjectMember, { foreignKey: "id_Rol" });
ProjectMember.belongsTo(Rol, { foreignKey: "id_Rol" });

ProjectMember.belongsTo(User, { foreignKey: "id_User" });
ProjectMember.belongsTo(Project, { foreignKey: "id_Project" });

export default ProjectMember;