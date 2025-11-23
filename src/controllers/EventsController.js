import { EventsService } from "../services/EventsService.js";

const eventsService = new EventsService();
import NotificationService from '../services/NotificationService.js';

export class EventsController {
  constructor() {
    this.injectUser = (req, res, next) => {
      if (req.user) {
        eventsService.setCurrentUser(req.user);
      }
      next();
    };
  }

  async getAll(req, res) {
    const result = await eventsService.getAll();
    res.status(result.success ? 200 : 401).json(result);
  }

  async getById(req, res) {
    const { id } = req.params;
    const result = await eventsService.getById(parseInt(id));
    res.status(result.success ? 200 : 404).json(result);
  }

  async getByDateRange(req, res) {
    const { startDate, endDate } = req.query;
    const result = await eventsService.getByDateRange(startDate, endDate);
    res.status(result.success ? 200 : 400).json(result);
  }

  async create(req, res) {
    const result = await eventsService.create(req.body);

    if (result.success) {
      await NotificationService.notify({
        user_id: req.user.id,
        title: 'Evento Creado',
        body: `Evento "${result.data.title}" agendado.`,
        event_type: 'event_created',
        entity_id: result.data.id,
        is_auto: true
      });
    }

    res.status(result.success ? 201 : 400).json(result);
  }

  async update(req, res) {
    const { id } = req.params;
    const eventData = { ...req.body, id: parseInt(id) };
    const result = await eventsService.update(eventData);
    res.status(result.success ? 200 : 400).json(result);
  }

  async delete(req, res) {
    const { id } = req.params;
    const result = await eventsService.delete(parseInt(id));
    res.status(result.success ? 200 : 400).json(result);
  }

  async checkUpcomingEvents(req, res) {
    await eventsService.checkUpcomingEvents();
    res.status(200).json({ success: true, message: "Upcoming events checked" });
  }
}