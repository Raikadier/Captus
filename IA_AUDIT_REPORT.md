# Auditoría Completa de Errores - Captus

## Resumen
Esta auditoría se realizó para investigar y corregir los errores `ERR_CONNECTION_REFUSED` reportados en la consola web, así como verificar la consistencia entre el Frontend, Backend y el Esquema de Base de Datos SQL.

## Hallazgos Principales y Correcciones

### 1. Caída del Backend (Origen de `ERR_CONNECTION_REFUSED`)
*   **Error:** El servidor backend fallaba al iniciar debido a:
    1.  Error de sintaxis en `backend/src/services/TaskService.js` (bloque `try` sin cerrar).
    2.  Módulo faltante en `backend/src/ai/routerAgent.js` (importaba `./llm/routerClient.js` que no existía).
    3.  Exportación incorrecta en `backend/src/routes/ai.js` (intentaba usar `routerAgent` como función cuando exportaba `handleRoutedMessage`).
*   **Solución:** Se corrigieron los archivos afectados para permitir el inicio exitoso del servidor en el puerto 4000.

### 2. Discrepancias de Esquema (SQL vs Código)
*   **Convención de Nombres:** El esquema SQL usa una mezcla de `snake_case` (ej: `tasks.user_id`, `tasks.due_date`) y `CamelCase` (ej: `subTask` table, `id_Statistics`).
*   **Correcciones en `StatisticsService` y `StatisticsController`:**
    *   Se corrigió el nombre de la tabla `subtasks` a `subTask` para coincidir con el esquema.
    *   Se corrigieron consultas directas a Supabase que usaban columnas inexistentes (`endDate` -> `due_date`, `date` -> `start_date` en eventos).
    *   Se corrigió la consulta a la tabla de proyectos (`projects` -> `project`, `user_id` -> `id_Creator`).

### 3. Arquitectura Stateful vs Stateless
*   **Problema:** Los servicios `TaskService` y `StatisticsService` intentaban almacenar el usuario en `this.currentUser` (`setCurrentUser`), lo cual causa condiciones de carrera y errores en un entorno de servidor compartido.
*   **Solución:** Se refactorizaron ambos servicios y sus controladores para ser **Stateless**. Ahora el `userId` se pasa explícitamente como argumento en cada método.

### 4. Rutas y API
*   **Verificación:**
    *   `GET /api/tasks/pending`: Ahora implementado correctamente en `TaskService` (método `getPendingTasks`).
    *   `GET /api/statistics/home-page`: Ahora implementado correctamente en `StatisticsService`, consultando las tablas correctas.
    *   **Frontend:** El frontend espera propiedades como `state` (legacy) en las tareas. `TaskRepository` maneja la traducción de `completed` (DB) a `state` (App), asegurando compatibilidad sin cambios en el frontend.

## Estado Actual
El backend se encuentra operativo y respondiendo a las peticiones (probado con `curl` retornando 401 Unauthorized, lo que indica que el servidor escucha y valida tokens).
