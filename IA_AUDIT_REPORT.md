# Auditoría del Módulo de IA - Proyecto Captus

## 1. Resumen Ejecutivo

El módulo de IA de Captus se encuentra en un estado **funcional pero inconsistente**, con una base sólida pero con debilidades críticas en arquitectura y seguridad.

- **Completitud General:** Estimación del **65%**.
- **Fortalezas:** La arquitectura de `Router -> Agente Contextual -> Orquestador -> Herramienta` es robusta y escalable. El frontend (`ChatBotPage`) está sorprendentemente maduro, es completamente funcional y ya está preparado para consumir las "acciones" (tool calling) del backend. La coherencia entre la API y el consumidor de frontend es excelente.
- **Debilidades Críticas:**
    1.  **Seguridad:** Existe una vulnerabilidad crítica de **IDOR (Insecure Direct Object Reference)** que permitiría a un usuario modificar o eliminar recursos (tareas, eventos) de otro usuario.
    2.  **Arquitectura:** Las herramientas acceden directamente a la base de datos, omitiendo la capa de servicios. Esto impide la ejecución de lógica de negocio (ej. validaciones, notificaciones) y crea un riesgo de inconsistencia de datos.
    3.  **Inconsistencia Funcional:** Existen agentes (`notesAgent`) sin herramientas correspondientes, lo que lleva a un comportamiento impredecible y "alucinaciones" del LLM.

En resumen, el sistema funciona para el caso de uso principal (crear tareas/eventos), pero requiere una intervención inmediata para corregir los fallos de seguridad y arquitectura antes de poder considerarse listo para producción o para seguir expandiendo sus capacidades.

---

## 2. Mapa del Sistema IA Actual

El flujo de una petición de IA sigue el siguiente camino:

**Frontend (`ChatBotPage.jsx`)**
1.  El usuario envía un mensaje.
2.  `handleSendMessage` llama a `aiEventsService.sendMessage`.
3.  Se realiza una petición `POST /api/ai/chat` con `{ message, conversationId }`.

**Backend (`ai.js`)**
4.  El middleware `verifySupabaseToken` autentica al usuario.
5.  La ruta `/chat` recibe la petición, gestiona la conversación (crea o valida) y persiste el mensaje del usuario.
6.  Invoca a `routerAgent(message, userId)`.

**Backend (`routerAgent.js`)**
7.  Usa un LLM para clasificar el mensaje en una categoría (`task`, `notes`, `schedule`, etc.).
8.  Delega la petición al "agente" correspondiente (ej. `taskAgent`).

**Backend (`*Agent.js`)**
9.  Los agentes actúan como contextualizadores. Pueden añadir un prefijo al mensaje (ej. `notesAgent`) antes de pasarlo al orquestador.
10. Invocan a `orchestrator(message, userId)`.

**Backend (`orchestrator.js`)**
11. Usa un LLM con un prompt que incluye la lista de herramientas disponibles desde `toolRegistry`.
12. El LLM decide si debe usar una herramienta (responde con JSON) o tener una conversación (responde con texto).
13. **Si es una herramienta:**
    -   Parsea el JSON.
    -   Valida que la herramienta exista.
    -   Ejecuta `tools[nombre].handler(input)`.

**Backend (`toolRegistry.js`)**
14. La función `handler` de la herramienta ejecuta una operación directa sobre la base de datos de Supabase.
15. El resultado de la operación de BD vuelve al `orchestrator`.

**Flujo de Retorno**
16. `Orchestrator` formatea una respuesta estructurada: `{ result, actionPerformed, data }`.
17. `ai.js` recibe el objeto, persiste el mensaje del bot y lo envía al frontend.
18. `ChatBotPage` recibe la respuesta. Si existe `actionPerformed`, actualiza el estado de la aplicación (ej. `fetchTasks()`) y muestra una confirmación en la UI.

---

## 3. Análisis Archivo por Archivo

### Backend

-   **`routes/ai.js`**: **Correcto.** Gestiona bien la autenticación, el ciclo de vida de las conversaciones y la persistencia de mensajes. El contrato de la API (`/chat`) está bien alineado con lo que el frontend espera.
-   **`ai/routerAgent.js`**: **Correcto.** Implementación sólida de un clasificador de intenciones. La normalización de la respuesta del LLM es una buena práctica.
-   **`ai/agents/*`**: **Incompleto/Inconsistente.** Actúan como meros contextualizadores. `taskAgent` es un simple passthrough, mientras que `notesAgent` añade contexto. El problema principal es que la existencia de un agente no garantiza que existan herramientas para él.
-   **`ai/orchestrator.js`**: **Bueno, pero mejorable.** El núcleo del sistema. Emula el "tool calling" de forma efectiva. La inyección de `userId` es una buena medida de seguridad. Sin embargo, depende de un parsing de JSON que puede ser frágil.
-   **`ai/toolRegistry.js`**: **Funcional, pero con fallos críticos.** Define las capacidades reales.
    -   **Problema 1 (Arquitectura):** Accede a Supabase directamente, saltándose la capa de servicios.
    -   **Problema 2 (Seguridad):** Las funciones de modificación/borrado no validan la propiedad del recurso.
    -   **Problema 3 (Funcionalidad):** Faltan herramientas para `notes`.

### Frontend

-   **`features/chatbot/ChatBotPage.jsx`**: **Excelente.** Es una implementación completa y funcional. Maneja el historial, los mensajes, el estado de carga y, lo más importante, ya está preparado para reaccionar a `actionPerformed` y actualizar el estado de otras partes de la aplicación.
-   **`services/aiEventsService.js`**: **Correcto.** Un wrapper limpio y bien definido que se alinea perfectamente con la API del backend.
-   **`shared/api/client.js`**: **Correcto (Inferido).** Gestiona la inyección automática del token de autenticación, lo cual es la práctica correcta.

---

## 4. Inconsistencias Entre Capas

La inconsistencia más grande no es entre frontend y backend (que están muy bien alineados), sino **dentro del propio backend**:

1.  **Agentes vs. Herramientas:** El `routerAgent` puede dirigir peticiones al `notesAgent`, pero el `orchestrator` no tiene herramientas de notas para ejecutar. Esto crea un "callejón sin salida" funcional que confunde al LLM y al usuario.
2.  **Lógica de Negocio Centralizada vs. Bypass de IA:** La lógica de la aplicación (servicios, repositorios) está siendo completamente ignorada por el módulo de IA, que opera directamente en la base de datos. Esto garantiza que en el futuro habrá inconsistencias de comportamiento entre las acciones realizadas por un usuario en la UI y las realizadas por la IA.

---

## 5. Lista de Problemas Críticos (Bugs, Riesgos, Faltantes)

1.  **CRÍTICO (Riesgo de Seguridad):** **Vulnerabilidad IDOR.** Las herramientas `complete_task`, `update_event`, y `delete_event` no validan que el `user_id` de la sesión sea el propietario del `task_id` o `event_id`.
2.  **CRÍTICO (Diseño Inconsistente):** **Bypass de la Capa de Servicios.** Las herramientas que modifican la base de datos deben pasar por los servicios correspondientes (ej. `TaskService`) para asegurar que se apliquen todas las validaciones y lógicas de negocio.
3.  **ALTO (Bug / Faltante):** **Funcionalidad de Notas Inexistente.** El `notesAgent` es inútil sin herramientas de `create_note`, `get_notes`, etc. en el `toolRegistry`.
4.  **MEDIO (Riesgo):** **Parsing de JSON Frágil.** El `orchestrator` depende de que el LLM devuelva un JSON con un formato estricto. Si el modelo falla o cambia su formato, la ejecución de herramientas se romperá. Una solución más robusta sería usar el modo "function calling" nativo del proveedor del modelo si está disponible.

## 6. Lista de Mejoras Opcionales

1.  **Mejorar Feedback de Herramientas:** La respuesta del `orchestrator` al ejecutar una herramienta podría ser más descriptiva. En lugar de un genérico "Tarea creada", podría devolver "Tarea 'Comprar leche' creada exitosamente".
2.  **Streaming de Respuestas:** Para mejorar la UX, las respuestas conversacionales podrían ser enviadas al frontend en tiempo real (streaming) en lugar de esperar la respuesta completa.
3.  **Agente Generalista de Fallback:** En el `routerAgent`, en lugar de un mensaje de error genérico en el `default`, se podría derivar a un `tutorAgent` o `generalAgent` que pueda mantener una conversación sin herramientas.
4.  **Centralizar Prompts:** Los prompts de sistema están dispersos (`routerAgent`, `orchestrator`). Centralizarlos en un único lugar facilitaría su mantenimiento.

---

## 7. Diseño Ideal Recomendado

1.  **Refactorizar `toolRegistry.js` para usar Servicios:**
    -   Cada `handler` de herramienta NO debe llamar a `supabase` directamente.
    -   En su lugar, debe llamar al método del servicio correspondiente. Ejemplo: `TaskService.createTask({ ...data, userId })`.
2.  **Corregir la Vulnerabilidad IDOR dentro de los Servicios:**
    -   La capa de servicios debe ser la responsable de la validación de permisos. Cada método (ej. `TaskService.updateTask`) debe verificar que el `userId` que realiza la petición es el propietario del recurso.
3.  **Completar la Funcionalidad de Notas:**
    -   Crear `NoteService` y `NoteRepository` si no existen.
    -   Añadir herramientas `create_note`, `get_notes`, etc. al `toolRegistry` que utilicen `NoteService`.
4.  **Adoptar Function Calling Nativo:**
    -   Migrar la lógica del `orchestrator` para que use la capacidad de "function calling" o "tool calling" nativa del modelo de `together.ai`. Esto es más robusto y menos propenso a errores de formato que instruir al modelo para que genere JSON.

---

## 8. Roadmap Final de Implementación (Paso a Paso)

### Fase 1: Correcciones Críticas (Seguridad y Arquitectura)
*   **Tarea 1.1:** Modificar **TODAS** las funciones en `toolRegistry.js`. Reemplazar las llamadas directas a `supabase` con llamadas a los métodos de servicio correspondientes (ej. `TaskService.createTask`).
*   **Tarea 1.2:** Implementar la validación de propiedad (`userId`) dentro de los métodos de servicio para `update`, `delete` y `get by id` para cerrar la brecha de seguridad IDOR.

### Fase 2: Completar Funcionalidad Básica
*   **Tarea 2.1:** Desarrollar `NoteService` y `NoteRepository` para abstraer la lógica de notas.
*   **Tarea 2.2:** Añadir al menos las herramientas `create_note` y `get_notes` al `toolRegistry`, conectándolas al nuevo `NoteService`.
*   **Tarea 2.3:** Validar el flujo de notas de principio a fin.

### Fase 3: Mejorar la Experiencia de Usuario y Robustez
*   **Tarea 3.1:** Mejorar los mensajes de confirmación de las herramientas para que sean más específicos (ej. "Tarea 'X' creada").
*   **Tarea 3.2 (Opcional):** Investigar e implementar el "streaming" de respuestas para el chat conversacional.
*   **Tarea 3.3:** Refactorizar el `orchestrator` para usar el modo "tool calling" nativo del proveedor de LLM.

### Fase 4: Integración y Expansión
*   **Tarea 4.1:** Integrar el módulo de IA con otros módulos (calendar, diagrams, courses) añadiendo nuevas herramientas y agentes contextuales según sea necesario.
*   **Tarea 4.2:** Diseñar e implementar herramientas más complejas que combinen múltiples servicios.
*   **Tarea 4.3:** Implementar un sistema de feedback en la UI para que los usuarios puedan calificar las respuestas de la IA.

### Fase 5: Optimización y Seguridad Avanzada
*   **Tarea 5.1:** Añadir logging y monitoreo detallado para las operaciones de IA.
*   **Tarea 5.2:** Realizar una auditoría de seguridad específica para "prompt injection" y otras vulnerabilidades relacionadas con LLMs.
*   **Tarea 5.3:** Optimizar los costes controlando la complejidad de los modelos utilizados para cada tarea (ej. un modelo más pequeño y rápido para clasificación).
