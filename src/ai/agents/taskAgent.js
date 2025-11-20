import { orchestrator } from "../orchestrator.js";

export const taskAgent = async (message, userId) => {
  return await orchestrator(message, userId);
};
