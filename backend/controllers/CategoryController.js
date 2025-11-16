import { CategoryService } from "../service/CategoryService.js";

const categoryService = new CategoryService();

export class CategoryController {
  constructor() {
    // Middleware para inyectar usuario en el servicio
    this.injectUser = (req, res, next) => {
      if (req.user) {
        categoryService.setCurrentUser(req.user);
      }
      next();
    };
  }

  async getAll(req, res) {
    const result = await categoryService.getAll();
    res.status(result.success ? 200 : 401).json(result);
  }

  async getById(req, res) {
    const { id } = req.params;
    const result = await categoryService.getById(parseInt(id));
    res.status(result.success ? 200 : 404).json(result);
  }

  async getByName(req, res) {
    const { name } = req.params;
    const result = await categoryService.getByName(decodeURIComponent(name));
    res.status(result.success ? 200 : 404).json(result);
  }

  async create(req, res) {
    const result = await categoryService.save(req.body);
    res.status(result.success ? 201 : 400).json(result);
  }

  async update(req, res) {
    const { id } = req.params;
    const categoryData = { ...req.body, id_Category: parseInt(id) };
    const result = await categoryService.update(categoryData);
    res.status(result.success ? 200 : 400).json(result);
  }

  async delete(req, res) {
    const { id } = req.params;
    const result = await categoryService.delete(parseInt(id));
    res.status(result.success ? 200 : 400).json(result);
  }
}