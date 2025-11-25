import { groq, MODEL_FAST } from "../model.js";
import { orchestrator } from "../orchestrator.js";

// Lista estricta de palabras clave solicitada
const actionKeywords = [
  "crea",
  "crear",
  "agrega",
  "añade",
  "organiza",
  "ordena",
  "completa",
  "marca",
  "registra",
  "programa",
  "agenda"
];

const requiresAction = (text = "") => {
  const lower = text.toLowerCase();
  return actionKeywords.some((k) => lower.includes(k));
};

export const tutorAgent = async (message, userId) => {
  // 1. Dual Provider Logic:
  // Si contiene verbo de acción -> Together (via orchestrator, que usa tools)
  // Si NO contiene verbo -> Groq (chat simple)

  if (requiresAction(message)) {
    console.info("[AI/Tutor] Switch to Together (Action Detected)");
    return await orchestrator(message, userId);
  }

  console.info("[AI/Tutor] Switch to Groq (Simple Query)");
  try {
    // Consultas rápidas/teóricas usan Groq (sin tools).
    const response = await groq.chat.completions.create({
      model: MODEL_FAST,
      messages: [
        {
          role: "system",
          content: "Eres un tutor académico experto y conciso. Responde brevemente.",
        },
        { role: "user", content: message },
      ],
    });
    return response.choices[0].message.content;
  } catch (err) {
    if (err.status === 401) {
      console.error("[AI/Tutor] Groq authentication failed. Check API Key.", err);
      return "Error: La clave de API de Groq no es válida. Por favor, verifica tu configuración.";
    }
    console.error("[AI/Tutor] Groq request failed.", err);
    return "Lo siento, el servicio de chat rápido no está disponible en este momento. Aún puedes usar los comandos para crear tareas, notas, etc.";
  }
};
