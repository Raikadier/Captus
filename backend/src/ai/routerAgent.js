/**
 * @file routerAgent.js
 * @description Este archivo implementa el agente de enrutamiento de IA. Su única responsabilidad
 * es clasificar la intención del usuario, extraer entidades relevantes y pasar un contexto
 * de enrutamiento estandarizado al orquestador. No contiene lógica de negocio ni ejecuta herramientas.
 */

import { runOrchestrator } from './orchestrator.js';
import { callRouterModel } from './llm/routerClient.js'; // Asumiendo nueva arquitectura

// --- Constantes y Tipos de Datos ---

const VALID_INTENTS = new Set([
  "create_task",
  "list_tasks",
  "complete_task",
  "create_note",
  "list_notes",
  "create_event",
  "general",
]);

const FALLBACK_ROUTING = {
  intent: "general",
  reason: "Router failed, fallback to general intent.",
  entities: {},
};

// --- Funciones Auxiliares ---

/**
 * Helper para limpiar strings. Devuelve null si el string está vacío o no es un string.
 * @param {*} v - El valor a limpiar.
 * @returns {string | null}
 */
const nullableString = (v) => (typeof v === 'string' && v.trim() ? v.trim() : null);

/**
 * Parsea de forma segura la respuesta JSON del modelo de enrutamiento.
 * En caso de error, devuelve un objeto de enrutamiento de fallback.
 * @param {string} raw - La respuesta en formato string del LLM.
 * @returns {object} El objeto de enrutamiento parseado o el de fallback.
 */
const safeParseRouting = (raw) => {
  try {
    const parsed = JSON.parse(raw);
    if (typeof parsed === 'object' && parsed !== null && 'intent' in parsed) {
      return parsed;
    }
    console.warn("[AI/router] Invalid JSON structure received from router model", { raw });
    return { ...FALLBACK_ROUTING, reason: "Invalid JSON structure from model." };
  } catch (error) {
    console.warn("[AI/router] Failed to parse JSON from router model", { raw, error });
    return { ...FALLBACK_ROUTING, reason: "Failed to parse model's JSON response." };
  }
};

/**
 * Valida y normaliza el objeto de enrutamiento.
 * Asegura que el intent sea válido y limpia las entidades.
 * @param {object} routing - El objeto de enrutamiento parseado.
 * @returns {object} El objeto de enrutamiento normalizado.
 */
const normalizeRouting = (routing) => {
  const intent = VALID_INTENTS.has(routing.intent) ? routing.intent : "general";

  const entities = routing.entities && typeof routing.entities === 'object' ? {
    title: nullableString(routing.entities.title),
    description: nullableString(routing.entities.description),
    dueDate: nullableString(routing.entities.dueDate),
    course: nullableString(routing.entities.course),
    status: nullableString(routing.entities.status),
    noteTitle: nullableString(routing.entities.noteTitle),
    eventDate: nullableString(routing.entities.eventDate),
  } : {};

  return {
    intent,
    reason: typeof routing.reason === 'string' ? routing.reason : "Normalization fallback.",
    entities,
  };
};

// --- Lógica Principal de Enrutamiento ---

/**
 * Construye el prompt para el modelo de enrutamiento.
 * @param {string} message - El mensaje del usuario.
 * @returns {string} El prompt completo.
 */
const buildRoutingPrompt = (message) => {
  return `
Analyze the user's message and classify its intent and extract relevant entities.

**Allowed Intents:**
- "create_task": User wants to create a new task.
- "list_tasks": User wants to see their existing tasks.
- "complete_task": User wants to mark a task as done.
- "create_note": User wants to create a new note.
- "list_notes": User wants to see their existing notes.
- "create_event": User wants to schedule a new event in the calendar.
- "general": A casual conversation, a question not related to other intents, or an ambiguous request. If in doubt, choose this.

**Allowed Entities:**
- For tasks: "title", "description", "dueDate", "course", "status".
- For notes: "noteTitle".
- For events: "eventDate", "title".

**Your Task:**
Respond with a single, valid JSON object and nothing else.
The JSON object must have three keys: "intent", "reason", and "entities".
- "intent": One of the allowed intents.
- "reason": A brief explanation for your choice.
- "entities": An object containing only the extracted entities. If no entities are found, provide an empty object.

**User Message:**
"${message}"

**JSON Response:**
`;
};

/**
 * Función principal del router. Clasifica, extrae entidades y delega al orquestador.
 * @param {object} params
 * @param {string} params.userId - El ID del usuario.
 * @param {string} params.message - El mensaje del usuario.
 * @param {string} params.conversationId - El ID de la conversación actual.
 * @param {object} params.metadata - Metadatos adicionales.
 * @returns {Promise<any>} El resultado de la ejecución del orquestador.
 */
export const handleRoutedMessage = async ({ userId, message, conversationId, metadata }) => {
  let routingContext;

  if (!userId || !message) {
    console.error("[AI/router] Missing userId or message for routing.");
    routingContext = { ...FALLBACK_ROUTING, reason: "Missing required input." };
  } else {
    try {
      const prompt = buildRoutingPrompt(message);
      const rawRoutingResponse = await callRouterModel(prompt);
      const parsedRouting = safeParseRouting(rawRoutingResponse);
      routingContext = normalizeRouting(parsedRouting);
    } catch (error) {
      console.error("[AI/router] Critical failure in routing pipeline", { error });
      routingContext = { ...FALLBACK_ROUTING, reason: error.message };
    }
  }

  // Delegar siempre al orquestador
  return runOrchestrator({
    userId,
    message,
    conversationId,
    routingContext,
    metadata,
  });
};
