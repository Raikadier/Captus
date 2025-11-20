import { orchestrator } from "../orchestrator.js";

export const scheduleAgent = async (message, userId) => {
  return await orchestrator(`Organiza calendario. ${message}`, userId);
};
