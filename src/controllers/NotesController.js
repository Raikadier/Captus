import { NotesService } from "../services/NotesService.js";
import NotificationService from '../services/NotificationService.js';

const notesService = new NotesService();

export class NotesController {
  constructor() {
    this.injectUser = (req, res, next) => {
      if (req.user) {
        notesService.setCurrentUser(req.user);
      }
      next();
    };
  }

  async getAll(req, res) {
    const result = await notesService.getAll();
    res.status(result.success ? 200 : 401).json(result);
  }

  async getById(req, res) {
    const { id } = req.params;
    const result = await notesService.getById(parseInt(id));
    res.status(result.success ? 200 : 404).json(result);
  }

  async create(req, res) {
    const result = await notesService.create(req.body);

    if (result.success) {
      await NotificationService.notify({
        user_id: req.user.id,
        title: 'Nota Creada',
        body: `Has creado una nueva nota.`,
        event_type: 'note_created',
        entity_id: result.data.id,
        is_auto: true
      });
    }

    res.status(result.success ? 201 : 400).json(result);
  }

  async update(req, res) {
    const { id } = req.params;
    const noteData = { ...req.body, id: parseInt(id) };
    const result = await notesService.update(noteData);
    res.status(result.success ? 200 : 400).json(result);
  }

  async togglePin(req, res) {
    const { id } = req.params;
    const result = await notesService.togglePin(parseInt(id));
    res.status(result.success ? 200 : 400).json(result);
  }

  async delete(req, res) {
    const { id } = req.params;
    const result = await notesService.delete(parseInt(id));
    res.status(result.success ? 200 : 400).json(result);
  }
}