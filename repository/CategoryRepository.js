import BaseRepository from "./BaseRepository.js";
import Category from "../models/CategoryModels.js";
import User from "../models/UserModels.js";

class CategoryRepository extends BaseRepository {
  constructor() {
    super(Category);
  }

  // Obtener todas las categorías
  async getAll() {
    try {
      return await Category.findAll({
        include: [User],
      });
    } catch (error) {
      console.error("Error al obtener categorías:", error);
      return [];
    }
  }

  // Obtener todas las categorías de un usuario (incluyendo las globales)
  async getByUser(userId) {
    try {
      if (!userId) return [];
      return await Category.findAll({
        where: {
          [require("sequelize").Op.or]: [
            { id_User: userId },
            { id_User: null }
          ]
        },
        include: [User],
      });
    } catch (error) {
      console.error("Error al obtener categorías por usuario:", error);
      return [];
    }
  }

  // Obtener una categoría por su ID
  async getById(id) {
    try {
      if (!id) return null;
      return await Category.findByPk(id, {
        include: [User],
      });
    } catch (error) {
      console.error("Error al obtener categoría por ID:", error);
      return null;
    }
  }

  // Obtener una categoría por su nombre
  async getByName(name) {
    try {
      if (!name) return null;
      return await Category.findOne({
        where: { name },
        include: [User],
      });
    } catch (error) {
      console.error("Error al obtener categoría por nombre:", error);
      return null;
    }
  }

  // Actualizar categoría
  async update(entity) {
    try {
      if (!entity || !entity.id_Category || !entity.name) return false;

      const category = await Category.findByPk(entity.id_Category);
      if (!category) return false;

      await category.update({
        name: entity.name,
        id_User: entity.id_User || null,
      });

      return true;
    } catch (error) {
      console.error("Error al actualizar categoría:", error);
      return false;
    }
  }

  // Eliminar categoría
  async delete(id) {
    try {
      if (!id) return false;
      const deletedRows = await Category.destroy({
        where: { id_Category: id },
      });
      return deletedRows > 0;
    } catch (error) {
      console.error("Error al eliminar categoría:", error);
      return false;
    }
  }
}

export default CategoryRepository;