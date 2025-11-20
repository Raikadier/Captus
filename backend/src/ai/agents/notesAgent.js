import { orchestrator } from "../orchestrator.js";

export const notesAgent = async (message, userId) => {
  return await orchestrator(`Analiza notas. ${message}`, userId);
};
