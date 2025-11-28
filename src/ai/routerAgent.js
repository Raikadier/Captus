import { together, MODEL_REASONING } from "./model.js";
import { allowedIntents, buildRouterSystemPrompt, resolveContextPrefix } from "./prompts.js";
import { orchestrator } from "./orchestrator.js";
import { extractJson } from "./utils/json.js";

export const routerAgent = async (message, userId) => {
  const started = Date.now();

  const classification = await together.chat.completions.create({
    model: MODEL_REASONING,
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: buildRouterSystemPrompt() },
      { role: "user", content: message },
    ],
  });

  const rawContent = classification.choices?.[0]?.message?.content || "{}";
  const parsed = extractJson(rawContent) || {};
  const intent = allowedIntents.includes(parsed.intent) ? parsed.intent : "general";
  const contextPrefix = resolveContextPrefix(intent);

  console.info("[AI/router] classified", {
    userId,
    intent,
    contextPrefix,
    ms: Date.now() - started,
  });

  return orchestrator({
    message: `${contextPrefix} ${message}`,
    userId,
    intent,
  });
};
