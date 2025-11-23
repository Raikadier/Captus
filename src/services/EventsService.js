import EventsRepository from "../repositories/EventsRepository.js";
import { OperationResult } from "../shared/OperationResult.js";
import nodemailer from 'nodemailer';

const eventsRepository = new EventsRepository();

// Email transporter configuration
const createEmailTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD, // App-specific password
    },
  });
};

export class EventsService {
  constructor() {
    this.currentUser = null;
  }

  setCurrentUser(user) {
    this.currentUser = user;
  }

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

    // Validate date logic
    const startDate = new Date(event.start_date);
    const now = new Date();

    if (startDate < now && !event.is_past) {
      // If event is in the past, mark it as past
      event.is_past = true;
    }

    if (event.end_date) {
      const endDate = new Date(event.end_date);
      if (endDate < startDate) {
        return new OperationResult(false, "La fecha de fin no puede ser anterior a la fecha de inicio.");
      }
    }

    return new OperationResult(true);
  }

  async create(event) {
    return this.save(event);
  }

  async save(event) {
    try {
      const validation = this.validateEvent(event);
      if (!validation.success) return validation;

      event.user_id = this.currentUser?.id;
      if (!event.user_id) {
        return new OperationResult(false, "Usuario no autenticado.");
      }

      const savedEvent = await eventsRepository.save(event);
      if (savedEvent) {
        // Send notification email if requested (non-blocking)
        if (event.notify) {
          this.sendEventNotification(savedEvent, 'created').catch(error => {
            console.error('Error sending event notification:', error);
          });
        }

        return new OperationResult(true, "Evento guardado exitosamente.", savedEvent);
      } else {
        return new OperationResult(false, "Error al guardar el evento.");
      }
    } catch (error) {
      return new OperationResult(false, `Error al guardar el evento: ${error.message}`);
    }
  }

  async getAll() {
    try {
      if (!this.currentUser) {
        return new OperationResult(false, "Usuario no autenticado.");
      }

      const events = await eventsRepository.getAllByUserId(this.currentUser.id);
      return new OperationResult(true, "Eventos obtenidos exitosamente.", events);
    } catch (error) {
      return new OperationResult(false, `Error al obtener eventos: ${error.message}`);
    }
  }

  async getById(id) {
    try {
      if (!id) {
        return new OperationResult(false, "ID de evento inválido.");
      }

      const event = await eventsRepository.getById(id);
      if (event) {
        if (event.user_id === this.currentUser?.id) {
          return new OperationResult(true, "Evento encontrado.", event);
        } else {
          return new OperationResult(false, "Evento no accesible.");
        }
      } else {
        return new OperationResult(false, "Evento no encontrado.");
      }
    } catch (error) {
      return new OperationResult(false, `Error al obtener evento: ${error.message}`);
    }
  }

  async update(event) {
    try {
      const validation = this.validateEvent(event);
      if (!validation.success) return validation;

      const existingEvent = await eventsRepository.getById(event.id);
      if (!existingEvent) {
        return new OperationResult(false, "Evento no encontrado.");
      }

      if (existingEvent.user_id !== this.currentUser?.id) {
        return new OperationResult(false, "Evento no accesible.");
      }

      // Update the update_at timestamp
      event.updated_at = new Date();

      const updated = await eventsRepository.update(event);
      if (updated) {
        // Send notification email if requested and notify setting changed or event was updated
        if (event.notify) {
          this.sendEventNotification(updated, 'updated').catch(error => {
            console.error('Error sending event notification:', error);
          });
        }

        return new OperationResult(true, "Evento actualizado exitosamente.", updated);
      } else {
        return new OperationResult(false, "Error al actualizar el evento.");
      }
    } catch (error) {
      return new OperationResult(false, `Error al actualizar evento: ${error.message}`);
    }
  }

  async delete(id) {
    try {
      if (!id) {
        return new OperationResult(false, "ID de evento inválido.");
      }

      const existingEvent = await eventsRepository.getById(id);
      if (!existingEvent) {
        return new OperationResult(false, "Evento no encontrado.");
      }

      if (existingEvent.user_id !== this.currentUser?.id) {
        return new OperationResult(false, "Evento no accesible.");
      }

      const deleted = await eventsRepository.delete(id);
      if (deleted) {
        return new OperationResult(true, "Evento eliminado exitosamente.");
      } else {
        return new OperationResult(false, "Error al eliminar el evento.");
      }
    } catch (error) {
      return new OperationResult(false, `Error al eliminar evento: ${error.message}`);
    }
  }

  async getByDateRange(startDate, endDate) {
    try {
      if (!this.currentUser) {
        return new OperationResult(false, "Usuario no autenticado.");
      }

      const events = await eventsRepository.getByDateRange(this.currentUser.id, startDate, endDate);
      return new OperationResult(true, "Eventos obtenidos exitosamente.", events);
    } catch (error) {
      return new OperationResult(false, `Error al obtener eventos por rango de fecha: ${error.message}`);
    }
  }

  async sendEventNotification(event, action) {
    try {
      if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
        console.warn('Gmail credentials not configured for notifications');
        return;
      }

      const transporter = createEmailTransporter();

      const actionText = action === 'created' ? 'creado' : 'actualizado';
      const subject = `Evento ${actionText}: ${event.title}`;
      const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #16a34a;">Evento ${actionText}</h2>
          <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin: 0 0 10px 0; color: #1f2937;">${event.title}</h3>
            <p style="margin: 5px 0; color: #4b5563;"><strong>Tipo:</strong> ${event.type}</p>
            <p style="margin: 5px 0; color: #4b5563;"><strong>Fecha:</strong> ${new Date(event.start_date).toLocaleString('es-ES')}</p>
            ${event.end_date ? `<p style="margin: 5px 0; color: #4b5563;"><strong>Hasta:</strong> ${new Date(event.end_date).toLocaleString('es-ES')}</p>` : ''}
            ${event.description ? `<p style="margin: 10px 0; color: #4b5563;"><strong>Descripción:</strong> ${event.description}</p>` : ''}
          </div>
          <p style="color: #6b7280; font-size: 14px;">
            Este es un recordatorio automático de Captus.
          </p>
        </div>
      `;

      await transporter.sendMail({
        from: process.env.GMAIL_USER,
        to: this.currentUser?.email, // Assuming user has email
        subject,
        html,
      });

      console.log(`Notification email sent for ${action} event: ${event.title}`);
    } catch (error) {
      console.error('Error sending event notification:', error);
    }
  }

  async checkUpcomingEvents() {
    try {
      if (!this.currentUser) return;

      // Get events in the next 24 hours that have notifications enabled
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);

      const upcomingEvents = await eventsRepository.getByDateRange(
        this.currentUser.id,
        new Date().toISOString(),
        tomorrow.toISOString()
      );

      for (const event of upcomingEvents) {
        if (event.notify) {
          // Check if we already sent a notification (you might want to add a sent_notifications table)
          await this.sendUpcomingEventNotification(event);
        }
      }
    } catch (error) {
      console.error('Error checking upcoming events:', error);
    }
  }

  async sendUpcomingEventNotification(event) {
    try {
      if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
        console.warn('Gmail credentials not configured for notifications');
        return;
      }

      const transporter = createEmailTransporter();

      const timeUntil = new Date(event.start_date) - new Date();
      const hoursUntil = Math.floor(timeUntil / (1000 * 60 * 60));

      const subject = `Recordatorio: ${event.title} en ${hoursUntil} horas`;
      const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #dc2626;">¡Recordatorio de Evento!</h2>
          <div style="background: #fef2f2; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #dc2626;">
            <h3 style="margin: 0 0 10px 0; color: #1f2937;">${event.title}</h3>
            <p style="margin: 5px 0; color: #4b5563;"><strong>Tipo:</strong> ${event.type}</p>
            <p style="margin: 5px 0; color: #dc2626; font-weight: bold;">📅 ${new Date(event.start_date).toLocaleString('es-ES')}</p>
            ${event.end_date ? `<p style="margin: 5px 0; color: #4b5563;"><strong>Hasta:</strong> ${new Date(event.end_date).toLocaleString('es-ES')}</p>` : ''}
            ${event.description ? `<p style="margin: 10px 0; color: #4b5563;"><strong>Descripción:</strong> ${event.description}</p>` : ''}
            <p style="margin: 15px 0 0 0; color: #dc2626; font-weight: bold;">⏰ El evento comienza en ${hoursUntil} horas</p>
          </div>
          <p style="color: #6b7280; font-size: 14px;">
            Este es un recordatorio automático de Captus.
          </p>
        </div>
      `;

      await transporter.sendMail({
        from: process.env.GMAIL_USER,
        to: this.currentUser?.email,
        subject,
        html,
      });

      console.log(`Upcoming event notification sent for: ${event.title}`);
    } catch (error) {
      console.error('Error sending upcoming event notification:', error);
    }
  }
}