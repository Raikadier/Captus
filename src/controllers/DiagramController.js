import { DiagramService } from "../services/DiagramService.js";

const diagramService = new DiagramService();

export class DiagramController {
  constructor() {
    this.injectUser = (req, res, next) => {
      if (req.user) {
        diagramService.setCurrentUser(req.user);
      }
      next();
    };
  }

  async getAll(req, res) {
    const result = await diagramService.getAllByUser();
    res.status(result.success ? 200 : 400).json(result);
  }

  async create(req, res) {
    const result = await diagramService.create(req.body);
    res.status(result.success ? 201 : 400).json(result);
  }

  async update(req, res) {
    const { id } = req.params;
    const result = await diagramService.update(id, req.body);
    res.status(result.success ? 200 : 400).json(result);
  }

  async delete(req, res) {
    const { id } = req.params;
    const result = await diagramService.delete(id);
    res.status(result.success ? 200 : 400).json(result);
  }
}
