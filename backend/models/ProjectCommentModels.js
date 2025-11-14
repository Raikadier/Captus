import { DataTypes } from "sequelize";
import { sequelize } from "../db.js";
import User from "./UserModels.js";
import Project from "./ProjectModels.js";

const ProjectComment = sequelize.define("ProjectComment", {
  id_Comment: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  id_Project: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Project,
      key: "id_Project",
    },
    onDelete: "CASCADE",
  },
  id_User: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: "id_User",
    },
    onDelete: "CASCADE",
  },
  id_ParentComment: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: "ProjectComment",
      key: "id_Comment",
    },
    onDelete: "CASCADE",
  },
  content: {
    type: DataTypes.STRING(500),
    allowNull: false,
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: "ProjectComment",
  timestamps: false,
});


User.hasMany(ProjectComment, { foreignKey: "id_User", onDelete: "CASCADE" });
ProjectComment.belongsTo(User, { foreignKey: "id_User" });

Project.hasMany(ProjectComment, { foreignKey: "id_Project", onDelete: "CASCADE" });
ProjectComment.belongsTo(Project, { foreignKey: "id_Project" });

ProjectComment.hasMany(ProjectComment, {
  as: "Replies",
  foreignKey: "id_ParentComment",
});
ProjectComment.belongsTo(ProjectComment, {
  as: "ParentComment",
  foreignKey: "id_ParentComment",
});

export default ProjectComment;
