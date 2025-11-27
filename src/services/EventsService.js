// backend/src/services/EventsService.js
import EventsRepository from "../repositories/EventsRepository.js";
import { OperationResult } from "../shared/OperationResult.js";
import nodemailer from 'nodemailer';

const eventsRepository = new EventsRepository();

/**
 * Servicio para la gestión de eventos.
 * Sigue un patrón stateless donde cada método recibe el userId para validación.
 */
export class EventsService {

  constructor() {}

  /**
   * Valida los datos de un evento.
   * @param {object} event - El objeto del evento.
   * @returns {OperationResult} - El resultado de la validación.
   */
  validateEvent(event) {
    if (!event) {
      return new OperationResult(false, "El evento no puede ser nulo.");
    }
    if (!event.title || event.title.trim() === "") {
      return new OperationResult(false, "El título del evento no puede estar vacío.");
    }
    if (!event.start_date) {
      return new OperationResult(false, "La fecha de inicio es requerida.");
    }
    if (!event.type || event.type.trim() === "") {
      return new OperationResult(false, "El tipo de evento es requerido.");
    }
    if (event.end_date && new Date(event.end_date) < new Date(event.start_date)) {
      return new OperationResult(false, "La fecha de fin no puede ser anterior a la fecha de inicio.");
    }
    return new OperationResult(true);
  }

  /**
   * Crea un nuevo evento.
   * @param {object} eventData - Datos del evento.
   * @param {string} userId - ID del usuario propietario.
   * @param {string} userEmail - Email del usuario para notificaciones.
   * @returns {Promise<OperationResult>}
   */
  async create(eventData, userId, userEmail) {
    try {
      const validation = this.validateEvent(eventData);
      if (!validation.success) return validation;

      const eventToSave = {
        ...eventData,
        user_id: userId,
      };

      const savedEvent = await eventsRepository.save(eventToSave);

      if (eventData.notify) {
        this.sendEventNotification(savedEvent, 'created', userEmail).catch(error => {
          console.error('Error enviando notificación de creación de evento:', error);
        });
      }

      return new OperationResult(true, `Evento "${savedEvent.title}" creado exitosamente.`, savedEvent);
    } catch (error) {
      console.error(`Error inesperado en EventsService.create: ${error.message}`);
      throw new Error("Ocurrió un error inesperado al crear el evento.");
    }
  }

  /**
   * Actualiza un evento existente.
   * @param {string|number} eventId - ID del evento.
   * @param {object} updates - Campos a actualizar.
   * @param {string} userId - ID del usuario.
   * @param {string} userEmail - Email del usuario para notificaciones.
   * @returns {Promise<OperationResult>}
   */
  async update(eventId, updates, userId, userEmail) {
    try {
      const validation = this.validateEvent(updates, true);
      if (!validation.success) return validation;

      const existingEvent = await eventsRepository.getById(eventId);
      if (!existingEvent) {
        return new OperationResult(false, "Evento no encontrado.");
      }
      if (existingEvent.user_id !== userId) {
        return new OperationResult(false, "No tienes permiso para actualizar este evento.");
      }

      const eventToUpdate = { ...existingEvent, ...updates, updated_at: new Date() };
      const updatedEvent = await eventsRepository.update(eventToUpdate);

      if (updates.notify) {
        this.sendEventNotification(updatedEvent, 'updated', userEmail).catch(error => {
          console.error('Error enviando notificación de actualización de evento:', error);
        });
      }

      return new OperationResult(true, "Evento actualizado exitosamente.", updatedEvent);
    } catch (error) {
      console.error(`Error inesperado en EventsService.update: ${error.message}`);
      throw new Error("Ocurrió un error inesperado al actualizar el evento.");
    }
  }

  /**
   * Elimina un evento.
   * @param {string|number} eventId - ID del evento.
   * @param {string} userId - ID del usuario.
   * @returns {Promise<OperationResult>}
   */
  async delete(eventId, userId) {
    try {
      const existingEvent = await eventsRepository.getById(eventId);
      if (!existingEvent) {
        return new OperationResult(false, "Evento no encontrado.");
      }
      if (existingEvent.user_id !== userId) {
        return new OperationResult(false, "No tienes permiso para eliminar este evento.");
      }

      await eventsRepository.delete(eventId);
      return new OperationResult(true, "Evento eliminado exitosamente.");
    } catch (error) {
      console.error(`Error inesperado en EventsService.delete: ${error.message}`);
      throw new Error("Ocurrió un error inesperado al eliminar el evento.");
    }
  }

  /**
   * Obtiene un evento por su ID.
   * @param {string|number} eventId - ID del evento.
   * @param {string} userId - ID del usuario.
   * @returns {Promise<OperationResult>}
   */
  async getById(eventId, userId) {
    try {
      const event = await eventsRepository.getById(eventId);
      if (!event) {
        return new OperationResult(false, "Evento no encontrado.");
      }
      if (event.user_id !== userId) {
        return new OperationResult(false, "No tienes permiso para ver este evento.");
      }
      return new OperationResult(true, "Evento encontrado.", event);
    } catch (error) {
      console.error(`Error inesperado en EventsService.getById: ${error.message}`);
      throw new Error("Ocurrió un error inesperado al obtener el evento.");
    }
  }

  /**
   * Obtiene todos los eventos de un usuario.
   * @param {string} userId - ID del usuario.
   * @returns {Promise<OperationResult>}
   */
  async getAll(userId) {
    try {
      const events = await eventsRepository.getAllByUserId(userId);
      return new OperationResult(true, "Eventos obtenidos exitosamente.", events);
    } catch (error) {
      console.error(`Error inesperado en EventsService.getAll: ${error.message}`);
      throw new Error("Ocurrió un error inesperado al obtener los eventos.");
    }
  }

  /**
   * Obtiene eventos en un rango de fechas para un usuario.
   * @param {string} userId - ID del usuario.
   * @param {string} startDate - Fecha de inicio (ISO string).
   * @param {string} endDate - Fecha de fin (ISO string).
   * @returns {Promise<OperationResult>}
   */
  async getByDateRange(userId, startDate, endDate) {
    try {
      const events = await eventsRepository.getByDateRange(userId, startDate, endDate);
      return new OperationResult(true, "Eventos obtenidos por rango de fecha.", events);
    } catch (error) {
      console.error(`Error inesperado en EventsService.getByDateRange: ${error.message}`);
      throw new Error("Ocurrió un error inesperado al obtener los eventos por fecha.");
    }
  }

  // --- Métodos de Ayuda (Helper Methods) ---

  async sendEventNotification(event, action, userEmail) {
    if (!userEmail) return;
    if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
      console.warn('Credenciales de Gmail no configuradas. Omitiendo notificación por email.');
      return;
    }
    // Lógica de nodemailer omitida por brevedad...
  }
}
