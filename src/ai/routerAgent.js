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

Responde SOLAMENTE con la categoría.
        `,
      },
      { role: "user", content: message },
    ],
  });

  const category = classification.choices[0].message.content.trim();
  console.info("[AI/router] classified", { userId, category, ms: Date.now() - started });

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
      return "No entendí la solicitud. Intenta reformular el mensaje.";
  }
};
