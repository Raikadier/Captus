import { together, MODEL_REASONING } from "./model.js";
import { tools } from "./toolRegistry.js";

export const orchestrator = async (objective, userId) => {
  const started = Date.now();

  const toolsList = Object.keys(tools).map(k => `- ${k}: ${tools[k].description}`).join("\n");

  const response = await together.chat.completions.create({
    model: MODEL_REASONING,
    messages: [
      {
        role: "system",
        content: `
Eres un asistente IA avanzado de Captus.
Tu objetivo es ayudar al usuario: "${userId}".

TIENES ACCESO A ESTAS HERRAMIENTAS:
${toolsList}

REGLAS:
1. Si el usuario pide una acción que coincide con una herramienta, DEBES generar una respuesta JSON válida con este formato:
{
  "tool": "nombre_de_la_herramienta",
  "input": { "parametro": "valor", "user_id": "${userId}" }
}

2. Si falta información para ejecutar la herramienta, PREGUNTA al usuario.
3. Si es solo una conversación, responde en texto plano.
4. IMPORTANTE: Siempre inyecta el "user_id": "${userId}" en el input de la herramienta.

Ejemplo:
User: "Crea tarea comprar leche"
AI: { "tool": "create_task", "input": { "title": "comprar leche", "description": "", "user_id": "${userId}" } }
        `,
      },
      {
        role: "user",
        content: objective,
      },
    ],
    temperature: 0.1, // Low temp for precise tool calling
  });

  const content = response.choices[0].message.content.trim();
  const duration = Date.now() - started;

  // Try to detect JSON
  if (content.startsWith("{") || content.startsWith("```json")) {
    try {
      // Clean code blocks if present
      const cleanContent = content.replace(/```json/g, "").replace(/```/g, "").trim();
      const parsed = JSON.parse(cleanContent);

      if (parsed.tool && tools[parsed.tool]) {
        console.info("[AI/orchestrator] executing tool", { userId, tool: parsed.tool, ms: duration });
        const result = await tools[parsed.tool].handler(parsed.input);

        // Generate a more user-friendly result message
        let userMessage = `Acción '${parsed.tool}' completada.`;
        if (parsed.tool === 'create_task') {
          userMessage = 'Tarea creada exitosamente.';
        } else if (parsed.tool === 'create_event') {
          userMessage = 'Evento creado exitosamente.';
        }

        // Return a structured response that the controller can use
        return {
          result: userMessage,
          actionPerformed: parsed.tool,
          data: result.data, // Optional: pass back data if needed
        };
      }
    } catch (e) {
      console.warn("[AI/orchestrator] JSON parse error", e);
      // Fallback to returning content if parsing fails
    }
  }

  console.info("[AI/orchestrator] no tool used", { userId, ms: duration });
  // If no tool was used, return object to maintain consistent interface if controller expects it,
  // or just string. But we must support legacy/string return for standard chat.
  // Actually, let's keep it simple: if object, it's structured. If string, it's chat.
  return content;
};
