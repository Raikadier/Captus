import { requireSupabaseClient } from "../lib/supabaseAdmin.js";

const supabase = requireSupabaseClient();

export const tools = {
  create_task: {
    description: "Crea una tarea para un usuario. Argumentos: title (string), description (string), due_date (ISO string, optional)",
    handler: async ({ user_id, title, description, due_date }) => {
      // Using real schema: title, description, due_date, user_id
      // Defaults: priority_id, category_id could be required by DB constraints, but usually have defaults.
      // We'll assume defaults or nullable.
      return await supabase.from("tasks").insert({
        user_id,
        title,
        description,
        due_date,
        // Defaulting to a priority/category might be safer if they are not nullable and no default
        // Checking schema: priority_id, category_id are foreign keys.
        // Assuming there are IDs 1 for defaults or they are nullable.
        // If DB fails, we'll need to fetch default IDs.
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
        .eq("completed", false) // Usually users want pending tasks
        .order('due_date', { ascending: true })
        .limit(10);
    },
  },

  create_event: {
    description: "Crea un evento en el calendario. Argumentos: title, description, start_date, end_date (optional)",
    handler: async ({ user_id, title, description, start_date, end_date }) => {
      // Mapping to the new 'events' table we created
      return await supabase.from("events").insert({
        user_id,
        title,
        description,
        start_date,
        end_date
      });
    },
  },

  send_notification: {
    description: "Crea una notificación para el usuario. Argumentos: message (string)",
    handler: async ({ user_id, message }) => {
      // Mapping to 'notifications' table: id, user_id, title, body, type, read
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
