//Esta clase sirve como repositorio base para manejar operaciones CRUD en modelos de Sequelize.

export default class BaseRepository {
  constructor(model) {
    this.model = model;
  }

  async save(entity) {
    try {
      const result = await this.model.create(entity);
      return result;
    } catch (error) {
      console.error("Error saving entity:", error.message);
      return null;
    }
  }

  async update(id, entity) {
    try {
      const [updated] = await this.model.update(entity, { where: { [this.model.primaryKeyAttribute]: id } });
      return updated > 0;
    } catch (error) {
      console.error("Error updating entity:", error.message);
      return false;
    }
  }

  async delete(id) {
    try {
      const deleted = await this.model.destroy({ where: { [this.model.primaryKeyAttribute]: id } });
      return deleted > 0;
    } catch (error) {
      console.error("Error deleting entity:", error.message);
      return false;
    }
  }

  async getById(id) {
    try {
      return await this.model.findByPk(id, { include: this.model.associations ? Object.keys(this.model.associations) : [] });
    } catch (error) {
      console.error("Error getting entity by id:", error.message);
      return null;
    }
  }

  async getAll() {
    try {
      return await this.model.findAll({ include: this.model.associations ? Object.keys(this.model.associations) : [] });
    } catch (error) {
      console.error("Error getting all entities:", error.message);
      return [];
    }
  }
}
