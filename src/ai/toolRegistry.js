// backend/src/ai/toolRegistry.js

import { TaskService } from '../services/TaskService.js';
import { EventsService } from '../services/EventsService.js';
import { NotesService } from '../services/NotesService.js';
import { OperationResult } from '../shared/OperationResult.js';

/**
 * Valida que los argumentos de entrada cumplan con el esquema definido.
 * Permite que un campo acepte múltiples tipos (ej. ['string', 'number']).
 */
const validateInput = (args, schema) => {
  for (const key in schema) {
    const rule = schema[key];
    const value = args[key];

    // Validar si es requerido
    if (rule.required && (value === undefined || value === null)) {
      return new OperationResult(false, `El argumento '${key}' es requerido.`);
    }

    // Validar tipo si el valor existe
    if (value !== undefined && value !== null) {
      const allowedTypes = Array.isArray(rule.type) ? rule.type : [rule.type];
      const valueType = typeof value;
      if (!allowedTypes.includes(valueType)) {
        return new OperationResult(false, `El argumento '${key}' debe ser de tipo '${allowedTypes.join(' o ')}', pero se recibió '${valueType}'.`);
      }
    }
  }
  return new OperationResult(true, null, args);
};


/**
 * Fábrica para crear manejadores de herramientas de forma estandarizada y stateless.
 * @param {object} definition - La definición completa de la herramienta.
 */
const createToolHandler = ({ serviceClass, action, inputSchema }) => {
  const service = new serviceClass(); // Instancia stateless, se puede reutilizar.

  return async (args) => {
    try {
      if (!args.user || !args.user.id) {
        throw new Error('No se ha proporcionado un usuario válido para la herramienta.');
      }
      const { user, ...input } = args;

      const validation = validateInput(input, inputSchema);
      if (!validation.success) {
        return validation.message;
      }
      
      const result = await action(service, validation.data, user);

      if (!result || typeof result.success !== 'boolean') {
        console.error("Respuesta inesperada del servicio:", result);
        return "Ocurrió un error inesperado al procesar la solicitud.";
      }

      return result.message;

    } catch (error) {
      console.error(`Error en la herramienta (handler): ${error.message}`);
      return `Error: ${error.message}`;
    }
  };
};

// --- Definiciones de Herramientas ---
const toolDefinitions = [
  // Tareas
  {
    name: 'create_task',
    description: "Crea una nueva tarea. Argumentos: title (string), description (string, opcional), due_date (string ISO 'YYYY-MM-DD', opcional).",
    inputSchema: {
      title: { type: 'string', required: true },
      description: { type: 'string', required: false },
      due_date: { type: 'string', required: false },
    },
    serviceClass: TaskService,
    action: (service, { title, description, due_date }, user) => {
      const taskData = { title, description, endDate: due_date };
      return service.create(taskData, user.id, user.email);
    },
  },
  {
    name: 'complete_task',
    description: "Marca una tarea como completada. Argumentos: task_id (string o number).",
    inputSchema: { task_id: { type: ['string', 'number'], required: true } },
    serviceClass: TaskService,
    action: (service, { task_id }, user) => service.complete(task_id, user.id, user.email),
  },
  {
    name: 'get_tasks',
    description: "Obtiene la lista de tareas pendientes del usuario.",
    inputSchema: {},
    serviceClass: TaskService,
    action: async (service, _, user) => {
      const result = await service.getIncompleteByUser(user.id);
      if (!result.success) return result;
      if (result.data.length === 0) return new OperationResult(true, "No tienes tareas pendientes.", []);
      const taskList = result.data.map(t => `- "${t.title}" (ID: ${t.id_Task})`).join('\n');
      return new OperationResult(true, `Tus tareas pendientes son:\n${taskList}`, result.data);
    },
  },
  // Eventos
  {
    name: 'create_event',
    description: "Crea un evento. Argumentos: title (string), start_date (string ISO), end_date (string ISO, opcional), description (string, opcional).",
    inputSchema: {
      title: { type: 'string', required: true },
      start_date: { type: 'string', required: true },
      end_date: { type: 'string', required: false },
      description: { type: 'string', required: false },
    },
    serviceClass: EventsService,
    action: (service, args, user) => service.create({ ...args, type: 'personal' }, user.id, user.email),
  },
  {
    name: 'update_event',
    description: "Actualiza un evento. Argumentos: event_id (string o number), y campos a actualizar.",
    inputSchema: {
      event_id: { type: ['string', 'number'], required: true },
      title: { type: 'string', required: false },
      start_date: { type: 'string', required: false },
      end_date: { type: 'string', required: false },
      description: { type: 'string', required: false },
    },
    serviceClass: EventsService,
    action: (service, { event_id, ...updates }, user) => service.update(event_id, updates, user.id, user.email),
  },
  {
    name: 'delete_event',
    description: "Elimina un evento. Argumentos: event_id (string o number).",
    inputSchema: { event_id: { type: ['string', 'number'], required: true } },
    serviceClass: EventsService,
    action: (service, { event_id }, user) => service.delete(event_id, user.id),
  },
  {
    name: 'list_events',
    description: "Lista los próximos eventos del usuario.",
    inputSchema: {},
    serviceClass: EventsService,
    action: async (service, _, user) => {
      const result = await service.getAll(user.id);
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
    description: "Crea una nota. Argumentos: title (string), content (string, opcional).",
    inputSchema: {
      title: { type: 'string', required: true },
      content: { type: 'string', required: false },
    },
    serviceClass: NotesService,
    action: (service, args, user) => service.create(args, user.id),
  },
  {
    name: 'get_notes',
    description: "Obtiene todas las notas del usuario.",
    inputSchema: {},
    serviceClass: NotesService,
    action: async (service, _, user) => {
      const result = await service.getAll(user.id);
      if (!result.success) return result;
      if (result.data.length === 0) return new OperationResult(true, "No tienes notas guardadas.", []);
      const noteList = result.data.map(n => `- "${n.title}" (ID: ${n.id})`).join('\n');
      return new OperationResult(true, `Tus notas son:\n${noteList}`, result.data);
    },
  },
  {
    name: 'update_note',
    description: "Actualiza una nota. Argumentos: note_id (string o number), title (string, opcional), content (string, opcional).",
    inputSchema: {
      note_id: { type: ['string', 'number'], required: true },
      title: { type: 'string', required: false },
      content: { type: 'string', required: false },
    },
    serviceClass: NotesService,
    action: (service, { note_id, ...updates }, user) => service.update(note_id, updates, user.id),
  },
  {
    name: 'delete_note',
    description: "Elimina una nota. Argumentos: note_id (string o number).",
    inputSchema: { note_id: { type: ['string', 'number'], required: true } },
    serviceClass: NotesService,
    action: (service, { note_id }, user) => service.delete(note_id, user.id),
  },
  // Herramienta especial
  {
    name: 'send_notification',
    description: "Crea una notificación simple para el usuario. Argumentos: message (string).",
    inputSchema: { message: { type: 'string', required: true } },
    isCustom: true,
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
