import { orchestrator } from "../orchestrator.js";

export const notificationAgent = async (message, userId) => {
  return await orchestrator(`Notificaciones. ${message}`, userId);
};
