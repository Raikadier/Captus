import { DataTypes } from "sequelize";
import { sequelize } from "../db.js";

const Rol = sequelize.define(
  "Rol", {
  id_Rol: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
  },
  description: {
    type: DataTypes.STRING(300),
    allowNull: true,
  },
}, {
  tableName: "Rol",
  timestamps: false,
});


export default Rol;
