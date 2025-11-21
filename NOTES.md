# Resumen de Integración Backend-Frontend (Captus)

## 1. Flujo de Autenticación
El sistema utiliza **Supabase Auth** como fuente de verdad para la identidad, pero el backend Node.js valida cada petición.

1.  **Frontend Login:** El usuario se loguea en el frontend (`AuthContext.jsx`) usando `supabase.auth.signInWithPassword`.
2.  **Token Storage:** Al iniciar sesión, el `access_token` JWT de Supabase se guarda automáticamente en `localStorage` (clave: `'token'`) gracias al listener en `shared/api/supabase.js`.
3.  **Request:** Cada petición HTTP realizada con `apiClient` (`shared/api/client.js`) intercepta este token y lo añade al header: `Authorization: Bearer <token>`.
4.  **Backend Validation:** El middleware `verifySupabaseToken.js` en el backend recibe el token, lo valida con Supabase Admin, y popula `req.user` con la información del usuario (ID, email).
5.  **Acceso a Datos:** Los controladores usan `req.user.id` para filtrar datos (RLS lógico) y asegurar que cada usuario solo vea su información.

## 2. Consumo de Endpoints
Los componentes clave del frontend ahora consumen la API del backend en lugar de ir directo a la base de datos:

*   **StatsPage.jsx** → `GET /api/statistics`
    *   Devuelve un objeto agregado con: `averageGrade`, `completedTasks`, `studyHours`, `subjects` (lista de materias).
*   **StreakWidget.jsx** → `GET /api/streaks/stats`
    *   Devuelve `currentStreak`, `dailyGoal`, `lastCompletedDate`.
*   **TaskPage.jsx (useTasks.js)** → `/api/tasks`
    *   `GET /api/tasks`: Lista de tareas (filtrable).
    *   `POST /api/tasks`: Crear tarea.
    *   `PUT /api/tasks/:id`: Actualizar (incluyendo completar).
    *   `DELETE /api/tasks/:id`: Borrar.

## 3. Nuevas Funcionalidades (Materias y Notas)
Se ha añadido soporte para **Materias (Subjects)** y **Sesiones de Estudio** para dar vida a la página de estadísticas.

**Importante:** Para que esto funcione, debes correr el script de migración SQL en tu proyecto de Supabase.

### Instrucciones de Activación
1.  Copia el contenido del archivo `backend/db/update_schema_subjects.sql`.
2.  Ve al **SQL Editor** de tu dashboard de Supabase.
3.  Pega y ejecuta el script.
    *   Esto creará las tablas `subjects` y `study_sessions`.
    *   Añadirá la columna `subject_id` a la tabla `tasks`.

## 4. Cómo Probar la Integración

1.  **Levantar Backend:**
    ```bash
    cd backend
    npm run dev
    ```
    *(Debe decir "Backend running on http://localhost:4000")*

2.  **Levantar Frontend:**
    ```bash
    cd frontend
    npm run dev
    ```

3.  **Prueba de Flujo:**
    *   Ve a `http://localhost:5173/` e inicia sesión (o regístrate).
    *   Ve a **Tareas**: Crea una nueva tarea. Debería aparecer en la lista.
    *   Ve a **Estadísticas**: Deberías ver tus contadores reales.
        *   *Nota:* Inicialmente las "Materias" estarán vacías. Puedes usar Postman o Curl para crear una materia de prueba en `POST http://localhost:4000/api/subjects` (Body: `{"name": "Matemáticas", "grade": 9.5}`), o esperar a que implementemos la UI de creación de materias.

## 5. Notas de Desarrollo
*   El backend ahora mapea automáticamente las propiedades legacy (`id_Task`, `state`) a un formato estándar JSON (`id`, `completed`) para facilitar el trabajo en el frontend.
*   Si el token expira (Error 401), el frontend redirigirá automáticamente al login.
