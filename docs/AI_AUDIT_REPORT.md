# Auditoría de Rutas de IA - Captus

**Fecha:** 23 de Octubre, 2023
**Auditor:** Jules (AI Agent)
**Estado:** ⚠️ Requiere Atención Inmediata (Riesgos de Seguridad)

## 1. Resumen Ejecutivo
El sistema de IA de Captus tiene una arquitectura base sólida utilizando un modelo de "Doble Proveedor" (Together.ai para razonamiento, Groq para chat rápido) y un sistema de agentes especializados. Sin embargo, **existen vulnerabilidades críticas de seguridad** relacionadas con la suplantación de identidad (IDOR) y fragilidad en la lógica de enrutamiento que deben ser corregidas antes de producción.

## 2. Hallazgos Críticos de Seguridad 🚨

### 2.1. Vulnerabilidad de Suplantación de Identidad (IDOR)
**Ubicación:** `backend/src/routes/ai.js`
**Severidad:** Crítica

El endpoint `/chat` extrae el `userId` directamente del cuerpo de la petición (`req.body`), ignorando la identidad verificada por el token JWT.

```javascript
// Código Actual (Inseguro)
const { message, userId } = req.body || {}; // Un atacante puede enviar cualquier userId aquí
```

**Riesgo:** Un usuario autenticado malintencionado podría enviar una petición con el `userId` de otro usuario. Dado que las herramientas de IA (toolRegistry) usan el cliente de Supabase Admin (privilegiado), esto permitiría leer, crear o borrar datos de cualquier usuario.

**Solución:** Usar estrictamente `req.user.id`, que es poblado por el middleware `verifySupabaseToken`.

### 2.2. Ejecución Privilegiada sin Scope
**Ubicación:** `backend/src/ai/toolRegistry.js`
**Severidad:** Alta

Las herramientas utilizan `requireSupabaseClient()`, que presumiblemente retorna el cliente con privilegios de servicio (Service Role). Al confiar en el `user_id` pasado como argumento (que actualmente viene del body inseguro), no hay barrera de seguridad.

**Solución:** Asegurar que el `user_id` que llega a las herramientas provenga exclusivamente del token de sesión validado.

## 3. Análisis de Lógica de Enrutamiento 🧠

### 3.1. Fragilidad en Clasificación de Intenciones
**Ubicación:** `backend/src/ai/routerAgent.js`
**Severidad:** Media

La lógica de selección depende de una coincidencia exacta de strings (Case Sensitive) y asume que el LLM siempre obedecerá la instrucción de "SOLAMENTE la categoría".

```javascript
// Código Actual
const category = classification.choices[0].message.content.trim();
switch (category) {
    case "task": ... // Falla si el LLM responde "Task" o "task."
```

**Riesgo:** Si el modelo responde "Task" (mayúscula) o agrega puntuación, el sistema cae al `default` ("No entendí..."), degradando la experiencia de usuario.

**Solución:** Normalizar la respuesta: `category.toLowerCase().replace(/[^a-z]/g, '')`.

### 3.2. Parsing Manual de JSON (Orchestrator)
**Ubicación:** `backend/src/ai/orchestrator.js`
**Severidad:** Media

El orquestador intenta parsear JSON extrayéndolo manualmente del texto o limpiando bloques de código markdown.

```javascript
// Código Actual
const cleanContent = content.replace(/```json/g, "").replace(/```/g, "").trim();
```

**Riesgo:** Es propenso a fallar si el modelo añade texto explicativo antes o después del JSON que no esté en bloques de código.

**Solución:** Usar "Native Tool Calling" (Function Calling) de la API de Together/OpenAI, o usar un modo "JSON Mode" forzado si el modelo lo soporta.

### 3.3. Código Muerto
**Ubicación:** `backend/src/ai/orchestrator.js`
**Observación:** La variable `toolDefinitions` se define pero nunca se envía a la API. Se usa `toolsList` (string) en el prompt del sistema en su lugar.

## 4. Estabilidad y Calidad de Código 🛠️

### 4.1. Falta de Timeouts
Las llamadas a la API de IA (Together.ai) no tienen timeout configurado. Si el proveedor externo se cuelga, el backend mantendrá la conexión abierta indefinidamente hasta que el servidor web la corte.

### 4.2. Validación de Inputs
No hay límite de longitud para `message`. Un usuario podría enviar un texto de 10MB, causando consumo excesivo de tokens o Denegación de Servicio (DoS) en el procesamiento de strings.

---

## 5. Plan de Acción Recomendado

1.  **Corregir Seguridad (Prioridad 1):**
    *   Modificar `backend/src/routes/ai.js` para usar `const userId = req.user.id`.
    *   Eliminar `userId` de la desestructuración de `req.body`.

2.  **Robustecer Enrutamiento (Prioridad 2):**
    *   Añadir `.toLowerCase()` en el switch del `routerAgent`.
    *   Implementar un fallback más inteligente (e.g., enviar al chat general/Groq en lugar de error).

3.  **Limpieza de Código:**
    *   Eliminar `toolDefinitions` si no se va a usar el function calling nativo.
    *   Añadir validación de longitud máxima en `message`.
