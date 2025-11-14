import { DataTypes } from "sequelize";
import { sequelize } from "../db.js";
import User from "./UserModels.js";
import ProjectComment from "./ProjectCommentModels.js";

const CommentLike = sequelize.define("CommentLike", {
  id_Like: {
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
  },
  id_Comment: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: ProjectComment,
      key: "id_Comment",
    },
    onDelete: "CASCADE",
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: "CommentLike",
  timestamps: false,
});

// 🔗 Relaciones
User.hasMany(CommentLike, { foreignKey: "id_User", onDelete: "CASCADE" });
CommentLike.belongsTo(User, { foreignKey: "id_User" });

ProjectComment.hasMany(CommentLike, { foreignKey: "id_Comment", onDelete: "CASCADE" });
CommentLike.belongsTo(ProjectComment, { foreignKey: "id_Comment" });

export default CommentLike;

