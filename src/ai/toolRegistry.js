// backend/src/ai/toolRegistry.js

import { TaskService } from '../services/TaskService.js';
import { EventsService } from '../services/EventsService.js';
import { NotesService } from '../services/NotesService.js';
import { OperationResult } from '../shared/OperationResult.js';

/**
 * Valida que los argumentos de entrada cumplan con el esquema definido.
 */
const validateInput = (args, schema) => {
  for (const key in schema) {
    if (schema[key].required && !(key in args)) {
      return new OperationResult(false, `El argumento '${key}' es requerido.`);
    }
    if (key in args && typeof args[key] !== schema[key].type) {
      return new OperationResult(false, `El argumento '${key}' debe ser de tipo '${schema[key].type}'.`);
    }
  }
  return new OperationResult(true, null, args);
};

/**
 * Fábrica para crear manejadores de herramientas de forma estandarizada.
 * @param {object} definition - La definición completa de la herramienta.
 */
const createToolHandler = ({ serviceClass, action, inputSchema }) => {
  return async (args) => {
    try {
      if (!args.user || !args.user.id) {
        throw new Error('No se ha proporcionado un usuario válido.');
      }
      const { user, ...input } = args;

      const validation = validateInput(input, inputSchema);
      if (!validation.success) {
        return validation.message;
      }

      const service = new serviceClass();
      service.setCurrentUser(user);

      const result = await action(service, validation.data);

      if (!result || typeof result.success !== 'boolean') {
        console.error("Respuesta inesperada del servicio:", result);
        return "Ocurrió un error inesperado al procesar la solicitud.";
      }

      return result.message;

    } catch (error) {
      console.error(`Error en la herramienta ${serviceClass.name}: ${error.message}`);
      return `Error: ${error.message}`;
    }
  };
};

// --- Definiciones de Herramientas ---
// Centralizamos la configuración para evitar duplicaciones y facilitar el mantenimiento.
const toolDefinitions = [
  // Tareas
  {
    name: 'create_task',
    description: "Crea una nueva tarea para el usuario. Argumentos: title (string), description (string, opcional), due_date (string ISO 'YYYY-MM-DD', opcional).",
    inputSchema: {
      title: { type: 'string', required: true },
      description: { type: 'string', required: false },
      due_date: { type: 'string', required: false },
    },
    serviceClass: TaskService,
    action: (service, { title, description, due_date }) => {
      const taskData = { title, description, endDate: due_date, id_User: service.currentUser.id };
      return service.create(taskData);
    },
  },
  {
    name: 'complete_task',
    description: "Marca una tarea como completada. Argumentos: task_id (string o number).",
    inputSchema: { task_id: { type: 'string', required: true } },
    serviceClass: TaskService,
    action: (service, { task_id }) => service.complete(task_id),
  },
  {
    name: 'get_tasks',
    description: "Obtiene la lista de tareas pendientes del usuario.",
    inputSchema: {},
    serviceClass: TaskService,
    action: async (service) => {
      const result = await service.getIncompleteByUser();
      if (!result.success) return result;
      if (result.data.length === 0) return new OperationResult(true, "No tienes tareas pendientes.", []);
      const taskList = result.data.map(t => `- "${t.title}" (ID: ${t.id_Task})`).join('\n');
      return new OperationResult(true, `Tus tareas pendientes son:\n${taskList}`, result.data);
    },
  },
  // Eventos
  {
    name: 'create_event',
    description: "Crea un nuevo evento en el calendario. Argumentos: title (string), start_date (string ISO), end_date (string ISO, opcional), description (string, opcional).",
    inputSchema: {
      title: { type: 'string', required: true },
      start_date: { type: 'string', required: true },
      end_date: { type: 'string', required: false },
      description: { type: 'string', required: false },
    },
    serviceClass: EventsService,
    action: (service, args) => service.create({ ...args, type: 'personal' }),
  },
  {
    name: 'update_event',
    description: "Actualiza un evento existente. Argumentos: event_id (string o number), y los campos a actualizar: title, start_date, etc.",
    inputSchema: {
      event_id: { type: 'string', required: true },
      title: { type: 'string', required: false },
      start_date: { type: 'string', required: false },
      end_date: { type: 'string', required: false },
      description: { type: 'string', required: false },
    },
    serviceClass: EventsService,
    action: (service, { event_id, ...updates }) => service.update({ ...updates, id: event_id }),
  },
  {
    name: 'delete_event',
    description: "Elimina un evento del calendario. Argumentos: event_id (string o number).",
    inputSchema: { event_id: { type: 'string', required: true } },
    serviceClass: EventsService,
    action: (service, { event_id }) => service.delete(event_id),
  },
  {
    name: 'list_events',
    description: "Lista los próximos eventos del usuario.",
    inputSchema: {},
    serviceClass: EventsService,
    action: async (service) => {
      const result = await service.getAll();
      if (!result.success) return result;
      const upcomingEvents = result.data.filter(e => new Date(e.start_date) >= new Date());
      if (upcomingEvents.length === 0) return new OperationResult(true, "No tienes próximos eventos.", []);
      const eventList = upcomingEvents.map(e => `- "${e.title}" el ${new Date(e.start_date).toLocaleDateString('es-ES')}`).join('\n');
      return new OperationResult(true, `Tus próximos eventos son:\n${eventList}`, upcomingEvents);
    },
  },
  // Notas
  {
    name: 'create_note',
    description: "Crea una nueva nota. Argumentos: title (string), content (string, opcional).",
    inputSchema: {
      title: { type: 'string', required: true },
      content: { type: 'string', required: false },
    },
    serviceClass: NotesService,
    action: (service, args) => service.create(args),
  },
  {
    name: 'get_notes',
    description: "Obtiene la lista de todas las notas del usuario.",
    inputSchema: {},
    serviceClass: NotesService,
    action: async (service) => {
      const result = await service.getAll();
      if (!result.success) return result;
      if (result.data.length === 0) return new OperationResult(true, "No tienes notas guardadas.", []);
      const noteList = result.data.map(n => `- "${n.title}" (ID: ${n.id})`).join('\n');
      return new OperationResult(true, `Tus notas son:\n${noteList}`, result.data);
    },
  },
  {
    name: 'update_note',
    description: "Actualiza una nota existente. Argumentos: note_id (string o number), title (string, opcional), content (string, opcional).",
    inputSchema: {
      note_id: { type: 'string', required: true },
      title: { type: 'string', required: false },
      content: { type: 'string', required: false },
    },
    serviceClass: NotesService,
    action: (service, { note_id, ...updates }) => service.update({ ...updates, id: note_id }),
  },
  {
    name: 'delete_note',
    description: "Elimina una nota. Argumentos: note_id (string o number).",
    inputSchema: { note_id: { type: 'string', required: true } },
    serviceClass: NotesService,
    action: (service, { note_id }) => service.delete(note_id),
  },
  // Herramienta especial (no usa el patrón de servicio estándar)
  {
    name: 'send_notification',
    description: "Crea una notificación para el usuario. Esto es solo para notificaciones simples y directas. No usar para notificar sobre tareas o eventos. Argumentos: message (string).",
    inputSchema: { message: { type: 'string', required: true } },
    isCustom: true, // Flag para indicar que tiene un manejador personalizado
    handler: async ({ user, message }) => {
      if (!user || !user.id || !message) {
        return "Error: Faltan argumentos para enviar la notificación.";
      }
      try {
        const { requireSupabaseClient } = await import('../lib/supabaseAdmin.js');
        const supabase = requireSupabaseClient();
        await supabase.from("notifications").insert({
          user_id: user.id,
          title: "Notificación de IA",
          body: message,
          type: "system",
        });
        return "Notificación enviada correctamente.";
      } catch (error) {
        console.error("Error en send_notification:", error);
        return "Error al enviar la notificación.";
      }
    },
  },
];

/**
 * Construye el objeto final de herramientas a partir de las definiciones.
 * @param {Array} definitions - El array de definiciones de herramientas.
 * @returns {object} - El objeto de herramientas listo para ser exportado.
 */
const buildTools = (definitions) => {
  return definitions.reduce((acc, def) => {
    acc[def.name] = {
      description: def.description,
      inputSchema: def.inputSchema,
      handler: def.isCustom ? def.handler : createToolHandler(def),
    };
    return acc;
  }, {});
};

export const tools = buildTools(toolDefinitions);
