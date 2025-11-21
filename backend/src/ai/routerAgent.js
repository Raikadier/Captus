import { together, MODEL_REASONING } from "./model.js";
import { taskAgent } from "./agents/taskAgent.js";
import { notesAgent } from "./agents/notesAgent.js";
import { scheduleAgent } from "./agents/scheduleAgent.js";
import { tutorAgent } from "./agents/tutorAgent.js";
import { notificationAgent } from "./agents/notificationAgent.js";

export const routerAgent = async (message, userId) => {
  const started = Date.now();

  const classification = await together.chat.completions.create({
    model: MODEL_REASONING,
    messages: [
      {
        role: "system",
        content: `
Eres un router IA. Clasificas mensajes en una de estas categorías:
- task
- notes
- schedule
- tutor
- notifications

Responde SOLAMENTE con la categoría en minúsculas, sin puntuación.
        `,
      },
      { role: "user", content: message },
    ],
  });

  // Robustness Fix: Normalize input (lowercase, remove punctuation)
  const rawCategory = classification.choices[0].message.content.trim();
  const category = rawCategory.toLowerCase().replace(/[^a-z]/g, '');

  console.info("[AI/router] classified", { userId, raw: rawCategory, normalized: category, ms: Date.now() - started });

  switch (category) {
    case "task":
      return await taskAgent(message, userId);

    case "notes":
      return await notesAgent(message, userId);

    case "schedule":
      return await scheduleAgent(message, userId);

    case "tutor":
      return await tutorAgent(message, userId);

    case "notifications":
      return await notificationAgent(message, userId);

    default:
      // Fallback logic could go here, for now we return a friendly error
      // or maybe forward to a general chat agent if one existed.
      console.warn(`[AI/router] Unhandled category: ${category}`);
      return "No entendí si es una tarea, nota o evento. Intenta ser más específico (ej: 'Crea una tarea...').";
  }
};
