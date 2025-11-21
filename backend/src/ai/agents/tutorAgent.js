import { groq, together, MODEL_FAST, MODEL_REASONING } from "../model.js";
import { orchestrator } from "../orchestrator.js";

const actionKeywords = [
  "crea",
  "agrega",
  "añade",
  "organiza",
  "marca",
  "completa",
  "agenda",
  "evento",
  "tarea",
  "recordatorio",
  "programa",
  "planifica",
];

const requiresAction = (text = "") => {
  const lower = text.toLowerCase();
  return actionKeywords.some((k) => lower.includes(k));
};

export const tutorAgent = async (message, userId) => {
  // Si el usuario pide una acción, delegamos al orquestador (Together + tools).
  if (requiresAction(message)) {
    return await orchestrator(message, userId);
  }

  // Consultas rápidas/teóricas usan Groq (sin tools).
  const response = await groq.chat.completions.create({
    model: MODEL_FAST,
    messages: [
      {
        role: "system",
        content: "Eres un tutor académico experto.",
      },
      { role: "user", content: message },
    ],
  });

  return response.choices[0].message.content;
};

export { requiresAction };
