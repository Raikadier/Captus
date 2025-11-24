import { requireSupabaseClient } from "../lib/supabaseAdmin.js";

const supabase = requireSupabaseClient();

export const tools = {
  create_task: {
    description: "Crea una tarea para un usuario. Argumentos: title (string), description (string), due_date (ISO string, optional)",
    handler: async ({ user_id, title, description, due_date }) => {
      return await supabase.from("tasks").insert({
        user_id,
        title,
        description,
        due_date,
      });
    },
  },

  complete_task: {
    description: "Marca una tarea como completada. Argumentos: task_id (int)",
    handler: async ({ task_id }) => {
      return await supabase
        .from("tasks")
        .update({ completed: true })
        .eq("id", task_id);
    },
  },

  get_tasks: {
    description: "Obtiene las tareas del usuario. Argumentos: user_id",
    handler: async ({ user_id }) => {
      return await supabase
        .from("tasks")
        .select("*")
        .eq("user_id", user_id)
        .eq("completed", false)
        .order('due_date', { ascending: true })
        .limit(10);
    },
  },

  create_event: {
    description: "Crea un evento en el calendario. Argumentos: title, description, start_date, end_date (optional)",
    handler: async ({ user_id, title, description, start_date, end_date }) => {
      return await supabase.from("events").insert({
        user_id,
        title,
        description,
        start_date,
        end_date
      });
    },
  },

  update_event: {
    description: "Actualiza un evento existente. Argumentos: event_id, title (optional), start_date (optional), etc.",
    handler: async ({ event_id, ...updates }) => {
      return await supabase
        .from("events")
        .update(updates)
        .eq("id", event_id);
    },
  },

  delete_event: {
    description: "Elimina un evento. Argumentos: event_id",
    handler: async ({ event_id }) => {
      return await supabase
        .from("events")
        .delete()
        .eq("id", event_id);
    },
  },

  list_events: {
    description: "Lista eventos del usuario. Argumentos: user_id",
    handler: async ({ user_id }) => {
       // Get upcoming events
       const today = new Date().toISOString();
       return await supabase
        .from("events")
        .select("*")
        .eq("user_id", user_id)
        .gte("start_date", today)
        .order("start_date", { ascending: true })
        .limit(10);
    },
  },

  send_notification: {
    description: "Crea una notificación para el usuario. Argumentos: message (string)",
    handler: async ({ user_id, message }) => {
      return await supabase.from("notifications").insert({
        user_id,
        title: "Notificación de IA",
        body: message,
        type: "system",
        read: false
      });
    },
  },
};
