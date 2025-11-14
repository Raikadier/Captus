import CategoryRepository from "../repository/CategoryRepository.js";
import { OperationResult } from "../shared/OperationResult.js";

const categoryRepository = new CategoryRepository();

export class CategoryService {
  constructor() {
    this.currentUser = null;
  }

  setCurrentUser(user) {
    this.currentUser = user;
  }

  async getAvailableForUser() {
    try {
      const categories = await categoryRepository.getByUser(this.currentUser?.id || null);
      return new OperationResult(true, "Categorías obtenidas exitosamente.", categories);
    } catch (error) {
      return new OperationResult(false, `Error al obtener categorías: ${error.message}`);
    }
  }

  async create(category) {
    try {
      if (!category?.name) {
        return new OperationResult(false, "El nombre de la categoría es obligatorio.");
      }

      const payload = {
        name: category.name,
        id_User: this.currentUser?.id || null,
      };

      const created = await categoryRepository.save(payload);
      return new OperationResult(true, "Categoría creada exitosamente.", created);
    } catch (error) {
      return new OperationResult(false, `Error al crear categoría: ${error.message}`);
    }
  }

  async delete(categoryId) {
    try {
      if (!categoryId) {
        return new OperationResult(false, "ID de categoría inválido.");
      }
      await categoryRepository.delete(categoryId);
      return new OperationResult(true, "Categoría eliminada exitosamente.");
    } catch (error) {
      return new OperationResult(false, `Error al eliminar categoría: ${error.message}`);
    }
  }
}

export default CategoryService;
