import { DataTypes } from "sequelize";
import { sequelize } from "../db.js";

const Priority = sequelize.define(
  "Priority",
  {
    id_Priority: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },
  },
  {
    tableName: "Priority",
    timestamps: false,
  }
);

export default Priority;
