import { together, MODEL_REASONING } from "./model.js";
import { tools } from "./toolRegistry.js";

// Convert tools object to OpenAI-compatible tool definitions
const toolDefinitions = Object.entries(tools).map(([name, tool]) => ({
  type: "function",
  function: {
    name,
    description: tool.description,
    parameters: {
      type: "object",
      // For simplicity in this custom implementation, we are trusting the LLM to infer params from description
      // A more robust solution would have explicit JSON schemas in toolRegistry.
      properties: {},
    },
  },
}));

export const orchestrator = async (objective, userId) => {
  const started = Date.now();

  // Create a context string about available tools to guide the model
  // since we are manually handling JSON output or using function calling if supported.
  // Together.ai supports function calling, but let's stick to the robust JSON prompt
  // or use the official tool_choice if preferred.
  // Given the prompt requested "Together debe manejar tool calling", we can use the native API or prompt engineering.
  // The previous implementation used JSON parsing. Let's improve it to be more robust but stick to the prompt-based approach
  // if we want to ensure compatibility without strict schema definitions for every tool parameter.

  // However, "Meta-Llama-3.1-70B-Instruct-Turbo" is excellent at JSON.

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

        // Return a human friendly summary of the action
        // We return an object to allow the frontend to trigger updates
        return {
          text: `He ejecutado la acción: ${parsed.tool}. Resultado: éxito.`,
          toolUsed: parsed.tool,
          toolResult: result // Optional: Pass data if needed, but not requested explicitly
        };
      }
    } catch (e) {
      console.warn("[AI/orchestrator] JSON parse error", e);
      // Fallback to returning content if parsing fails
    }
  }

  console.info("[AI/orchestrator] no tool used", { userId, ms: duration });
  return {
    text: content,
    toolUsed: null
  };
};
