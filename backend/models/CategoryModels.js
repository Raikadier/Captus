import { DataTypes } from "sequelize";
import { sequelize } from "../db.js";
import User from "./UserModels.js";

const Category = sequelize.define(
  "Category",
  {
    id_Category: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },
    id_User: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: User,
        key: "id_User",
      },
    },
  },
  {
    tableName: "Category",
    timestamps: false,
  }
);


User.hasMany(Category, { foreignKey: "id_User", onDelete: "CASCADE" });
Category.belongsTo(User, { foreignKey: "id_User" });

export default Category;
