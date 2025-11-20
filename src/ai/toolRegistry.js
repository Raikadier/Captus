import { requireSupabaseClient } from "../lib/supabaseAdmin.js";

const supabase = requireSupabaseClient();

export const tools = {
  create_task: {
    description: "Crea una tarea para un usuario",
    handler: async ({ user_id, title, description, due_date }) => {
      return await supabase.from("tasks").insert({
        user_id, title, description, due_date,
      });
    },
  },

  complete_task: {
    description: "Marca una tarea como completada",
    handler: async ({ task_id }) => {
      return await supabase
        .from("tasks")
        .update({ completed: true })
        .eq("id", task_id);
    },
  },

  get_tasks: {
    description: "Obtiene las tareas del usuario",
    handler: async ({ user_id }) => {
      return await supabase
        .from("tasks")
        .select("*")
        .eq("user_id", user_id);
    },
  },

  create_event: {
    description: "Crea un evento en el calendario",
    handler: async ({ user_id, title, date }) => {
      return await supabase.from("events").insert({
        user_id, title, date,
      });
    },
  },

  send_notification: {
    description: "Crea una notificación para el usuario",
    handler: async ({ user_id, message }) => {
      return await supabase.from("notifications").insert({
        user_id, message,
      });
    },
  },
};
