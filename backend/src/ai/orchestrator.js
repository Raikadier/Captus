import { together, MODEL_REASONING } from "./model.js";
import { tools } from "./toolRegistry.js";

export const orchestrator = async (objective, userId) => {
  const started = Date.now();

  const response = await together.chat.completions.create({
    model: MODEL_REASONING,
    messages: [
      {
        role: "system",
        content: `
Eres un agente con planificación reflexiva. 
Tu objetivo: "${objective}".
Si necesitas ejecutar una acción, responde en formato JSON:
{
  "tool": "nombre_tool",
  "input": { ... }
}
Si no necesitas herramientas, solo respondes texto.
        `,
      },
      {
        role: "user",
        content: `Usuario: ${userId}. Mensaje: ${objective}`,
      },
    ],
  });

  const content = response.choices[0].message.content;
  const duration = Date.now() - started;

  try {
    const parsed = JSON.parse(content);

    if (parsed.tool && tools[parsed.tool]) {
      console.info("[AI/orchestrator] executing tool", { userId, tool: parsed.tool, ms: duration });
      return await tools[parsed.tool].handler(parsed.input);
    }
  } catch (_) {
    console.warn("[AI/orchestrator] non-JSON or parse error", { userId, ms: Date.now() - started });
    return content;
  }

  console.info("[AI/orchestrator] no tool used", { userId, ms: duration });
  return content;
};
