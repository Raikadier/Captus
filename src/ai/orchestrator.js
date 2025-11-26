// backend/src/ai/orchestrator.js

import { together, MODEL_REASONING } from './model.js';
import { tools } from './toolRegistry.js';
import { OperationResult } from '../shared/OperationResult.js';

/**
 * Intenta extraer un objeto JSON de una cadena de texto.
 * Es tolerante a texto adicional antes o después del JSON.
 * @param {string} text - El texto de entrada, posiblemente del LLM.
 * @returns {object|null} - El objeto JSON parseado o null si no se encuentra o es inválido.
 */
const parseToolCall = (text) => {
  const jsonRegex = /\{[\s\S]*\}/;
  const match = text.match(jsonRegex);

  if (!match) {
    return null;
  }

  try {
    // Intenta parsear el JSON encontrado.
    const parsed = JSON.parse(match[0]);
    // Valida que tenga la estructura mínima de una tool call.
    if (parsed && typeof parsed.tool === 'string' && typeof parsed.input === 'object') {
      return parsed;
    }
    return null;
  } catch (error) {
    console.warn('[AI/orchestrator] Falló el parseo de JSON, se considera conversacional.', { error: error.message });
    return null;
  }
};

/**
 * Ejecuta una herramienta validada del toolRegistry.
 * @param {object} toolCall - El objeto de la herramienta parseado ({ tool, input }).
 * @param {object} user - El objeto de usuario autenticado.
 * @returns {Promise<OperationResult>} - El resultado de la ejecución de la herramienta, normalizado a OperationResult.
 */
const executeTool = async (toolCall, user) => {
  const toolDefinition = tools[toolCall.tool];

  if (!toolDefinition) {
    console.warn(`[AI/orchestrator] Intento de llamada a herramienta no existente: ${toolCall.tool}`);
    return new OperationResult(false, `La herramienta '${toolCall.tool}' no fue encontrada.`);
  }

  try {
    const handlerArgs = { ...toolCall.input, user };
    const result = await toolDefinition.handler(handlerArgs);

    // Normaliza la respuesta del handler a un OperationResult.
    if (result instanceof OperationResult) {
      return result;
    }
    if (typeof result === 'string') {
      return new OperationResult(true, result);
    }

    console.error(`[AI/orchestrator] La herramienta '${toolCall.tool}' devolvió un tipo de respuesta inesperado.`);
    return new OperationResult(false, 'La herramienta devolvió una respuesta con un formato inválido.');

  } catch (error) {
    console.error(`[AI/orchestrator] Error durante la ejecución de la herramienta '${toolCall.tool}':`, error);
    return new OperationResult(false, `Ocurrió un error al ejecutar la herramienta: ${error.message}`);
  }
};

/**
 * Orquesta la interacción con el LLM, decide si usar una herramienta y devuelve una respuesta estructurada.
 * @param {string} objective - El mensaje del usuario.
 * @param {object} user - El objeto de usuario completo (requerido para los handlers).
 * @returns {Promise<object>} - Una respuesta estructurada y consistente.
 */
export const orchestrator = async (objective, user) => {
  const started = Date.now();

  if (!user || !user.id) {
    console.error('[AI/orchestrator] Error Crítico: El orchestrator fue llamado sin un objeto de usuario válido.');
    return {
      result: 'Error de autenticación. No se pudo identificar al usuario.',
      actionPerformed: null,
      data: null,
    };
  }

  const toolsList = Object.values(tools).map(t => `- ${t.description}`).join('\n');
  const userId = user.id; // Se usa en el prompt para contexto del LLM.

  try {
    const response = await together.chat.completions.create({
      model: MODEL_REASONING,
      messages: [
        {
          role: 'system',
          content: `
Eres un asistente IA avanzado de Captus para el usuario con ID: "${userId}".
TIENES ACCESO A ESTAS HERRAMIENTAS:
${toolsList}

REGLAS:
1. Si la petición del usuario se alinea con una herramienta, RESPONDE ÚNICAMENTE con un objeto JSON con el formato: {"tool": "nombre_herramienta", "input": {...}}.
2. NO incluyas el JSON dentro de texto o explicaciones. Solo el JSON.
3. Si no tienes suficiente información para usar una herramienta, pregunta al usuario.
4. Si es una conversación general, responde en texto plano sin formato JSON.
          `.trim(),
        },
        {
          role: 'user',
          content: objective,
        },
      ],
      temperature: 0.1,
    });

    const llmResponse = response.choices[0].message.content.trim();
    const duration = Date.now() - started;

    const toolCall = parseToolCall(llmResponse);

    if (toolCall) {
      // --- MODO: TOOL EJECUTADA ---
      console.log(`[AI/orchestrator] Herramienta detectada: ${toolCall.tool}`, { userId, input: toolCall.input, durationMs: duration });

      const executionResult = await executeTool(toolCall, user);

      // Si la herramienta falló, no se considera una acción completada.
      const actionPerformed = executionResult.success ? toolCall.tool : null;

      return {
        result: executionResult.message,
        actionPerformed: actionPerformed,
        data: executionResult.data ?? null,
      };

    } else {
      // --- MODO: CONVERSACIONAL ---
      console.log('[AI/orchestrator] Respuesta conversacional generada.', { userId, durationMs: duration });
      return {
        result: llmResponse,
        actionPerformed: null,
        data: null,
      };
    }

  } catch (error) {
    // --- MODO: ERROR INESPERADO ---
    console.error('[AI/orchestrator] Error fatal en el flujo principal:', { userId, error });
    return {
      result: 'Ocurrió un error interno al procesar tu solicitud. Por favor, intenta nuevamente.',
      actionPerformed: null,
      data: null,
    };
  }
};
