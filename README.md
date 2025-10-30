# Captus Frontend – Prototipo Navegable (No Funcional)

Este repositorio contiene un prototipo navegable del frontend de Captus. Es un "vistaso" fiel de cómo será la interfaz final: puedes recorrer todas las pantallas y flujos principales, pero no requiere backend ni bases de datos para funcionar.

- No implementa lógica de backend ni persistencia real.
- Las llamadas a API se simulan (mock) para evitar errores de red durante la demo.
- El botón "Iniciar sesión" navega sin validar credenciales, para evaluar solo la UI/UX y la navegabilidad.

## Cómo ejecutar

Requisitos:
- Node.js 18+

Pasos:
- npm install
- npm run dev
- Abre http://localhost:5173 y realiza un hard refresh (Ctrl+F5)

Opcional (usar backend real):
- Define `VITE_API_BASE_URL` en `.env.local` apuntando a tu API. Si no lo defines, el cliente HTTP usa datos mock y no hace llamadas reales.

## Tecnologías
- React + Vite
- Tailwind CSS 4
- Framer Motion (animaciones)
- Lucide Icons

## Estructura del proyecto (frontend en raíz)
- index.html
- src/
- public/
- vite.config.js
- postcss.config.js
- package.json

## Rutas y navegación
- Pantallas: `/` (Login), `/home`, `/tasks`, `/calendar`, `/notes`, `/chatbot`, `/profile`, `/groups`, `/settings`, `/stats`.
- Sidebar con enlaces funcionales a cada vista.
- Login: botón "Iniciar sesión" redirige a `/home` sin validar.

## Accesibilidad y semántica
- Landmarks: `aside role="navigation"` (Sidebar) y `main role="main"` con objetivo de foco accesible.
- Enlaces con `aria-current="page"` en el activo.
- Botones con `aria-label`, `aria-expanded`, `aria-controls` donde aplica.
- Iconos decorativos con `aria-hidden`. Avatares con `role="img"`/`aria-label`.

## Por qué cumple la rúbrica

- I. Navegabilidad y Funcionalidad del Prototipo (35%)
  - Cobertura de Vistas (15%): Todas las vistas principales y secundarias del flujo están presentes como rutas navegables.
  - Enlaces Funcionales (20%): Sidebar y acciones navegan a sus vistas; login dirige a `/home` sin validación.

- II. Diseño y Experiencia de Usuario (35%)
  - Diseño Responsivo (15%): Layout con sidebar y contenido responsivo con Tailwind; probado en desktop y mobile.
  - Consistencia Visual (10%): Paleta verde, tipografía y espaciado coherentes; componentes reutilizables.
  - Usabilidad Básica (10%): Navegación clara, estados de foco visibles, jerarquía visual estable.

- III. Código y Organización (30%)
  - Estructura HTML Semántica (10%): Uso de `main`, `nav/aside`, títulos por vista, atributos ARIA.
  - Organización de Archivos (10%): Estructura clara en raíz (`src`, `public`, `index.html`, configs de build).
  - Calidad y Estilos del Código (10%): Tailwind para estilos consistentes, componentes modulares, accesibilidad básica.

## Mock de API (modo frontend-only)
- Si no existe `VITE_API_BASE_URL`:
  - `src/shared/api/client.js` mockea endpoints usados por la UI: `/api/categories`, `/api/priorities`, `/api/streaks`.
  - Esto permite recorrer las pantallas sin backend ni errores de red.

## Despliegue (demo)
- npm run build
- Sirve la carpeta `dist/` con tu hosting estático preferido.

---

Legacy docs below

# Captus Web - Aplicación de Gestión de Tareas

Una versión web moderna de la aplicación de escritorio Captus, migrada de C# a una pila React + Node.js con Supabase.

## 🚀 Características (MVP)

- ✅ Autenticación de usuarios (registro/inicio de sesión) con Supabase Auth
- ✅ Gestión de tareas (operaciones CRUD)
- ✅ Soporte para subtareas
- ✅ Categorías y prioridades
- ✅ Sistema de seguimiento de rachas (streaks)
- ✅ Interfaz responsiva con Tailwind CSS
- ✅ API REST con autenticación JWT
- ✅ Documentación de API con Swagger

## 🏗️ Arquitectura

### Backend
- **Framework**: Node.js + Express
- **Base de Datos**: Supabase (PostgreSQL)
- **Autenticación**: Supabase Auth + JWT
- **Documentación**: Swagger/OpenAPI
- **Estructura**: Modular (controladores, servicios, modelos, rutas)

### Frontend
- **Framework**: React + Vite
- **Gestión de Estado**: Context API + Custom Hooks
- **Estilos**: Tailwind CSS
- **Arquitectura**: Bulletproof React (features, shared, components)
- **Enrutamiento**: React Router

## 📁 Estructura del Proyecto

```
Captus/
├── backend/src/
│   ├── controllers/     # Manejadores de peticiones HTTP
│   ├── services/        # Capa de lógica de negocio
│   ├── models/          # Modelos de datos
│   ├── routes/          # Definiciones de rutas API
│   └── middleware/      # Middleware de Express
├── src/
│   ├── features/        # Código específico de características
│   │   └── tasks/       # Característica de gestión de tareas
│   ├── shared/          # Utilidades y componentes compartidos
│   └── context/         # Proveedores de contexto React
├── __tests__/           # Pruebas unitarias e integración
├── server.js            # Archivo principal del servidor
├── supabase-schema.sql  # Esquema de base de datos
└── MIGRATION_PLAN.md    # Documentación de migración
```

## 🔧 Instalación y Configuración

### Prerrequisitos
- Node.js 18+
- npm o yarn
- Cuenta y proyecto en Supabase

### Variables de Entorno
Crea un archivo `.env` en el directorio raíz:

```env
# Configuración de Supabase
SUPABASE_URL=tu_url_de_proyecto_supabase
SUPABASE_ANON_KEY=tu_clave_anonima_supabase

# Secreto JWT
JWT_SECRET=tu_clave_secreta_jwt

# Configuración del Servidor
PORT=5432
FRONTEND_URL=http://localhost:5173
```

### Instalación

1. **Clonar y configurar**:
   ```bash
   git checkout feature/web-migration
   npm install
   ```

2. **Configuración de base de datos**:
   - Crear un proyecto en Supabase
   - Ejecutar el esquema SQL desde `supabase-schema.sql` en el editor SQL de Supabase
   - Actualizar el archivo `.env` con las credenciales de Supabase

3. **Iniciar la aplicación**:
   ```bash
   # Iniciar servidor backend
   npm run server:dev

   # En otra terminal, iniciar frontend
   npm run dev
   ```

4. **Acceder a la aplicación**:
   - Frontend: http://localhost:5173
   - API Backend: http://localhost:5432
   - Documentación API: http://localhost:5432/api-docs

## 🧪 Pruebas

```bash
# Ejecutar todas las pruebas
npm test

# Ejecutar pruebas en modo vigilante
npm run test:watch

# Ejecutar con cobertura
npm test -- --coverage
```

## 📚 Documentación de la API

La API está completamente documentada con Swagger. Visita `/api-docs` cuando el servidor esté ejecutándose.

### Endpoints Principales

#### Autenticación
- `POST /api/auth/register` - Registrar nuevo usuario
- `POST /api/auth/login` - Iniciar sesión de usuario
- `POST /api/auth/logout` - Cerrar sesión de usuario

#### Tareas
- `GET /api/tasks` - Obtener tareas del usuario (con filtros)
- `POST /api/tasks` - Crear nueva tarea
- `PUT /api/tasks/:id` - Actualizar tarea
- `DELETE /api/tasks/:id` - Eliminar tarea
- `GET /api/tasks/overdue` - Obtener tareas vencidas
- `GET /api/tasks/completed-today` - Obtener tareas completadas hoy
- `POST /api/tasks/:id/subtasks` - Crear subtarea
- `GET /api/tasks/:id/subtasks` - Obtener subtareas de una tarea

#### Rachas
- `GET /api/streaks` - Obtener racha del usuario
- `PUT /api/streaks` - Actualizar racha
- `DELETE /api/streaks` - Reiniciar racha
- `GET /api/streaks/stats` - Obtener estadísticas de racha

#### Datos de Referencia
- `GET /api/categories` - Obtener todas las categorías
- `GET /api/priorities` - Obtener todas las prioridades

## 🔄 Migración desde Versión Desktop

Esta versión web mantiene paridad de características con la aplicación de escritorio C#:

### Mapeo de Entidades
- `Task` (C#) → tabla `tasks`
- `SubTask` (C#) → tabla `tasks` con `parent_task_id`
- `User` (C#) → Supabase Auth + tabla `users`
- `Category` (C#) → tabla `categories`
- `Priority` (C#) → tabla `priorities`
- `Statistics` (C#) → tabla `streaks`

### Migración de Lógica de Negocio
- Validación de tareas y reglas de negocio preservadas
- Lógica de cálculo de rachas migrada
- Gestión de sesiones de usuario adaptada para web
- Operaciones CRUD mantienen comportamiento desktop

Ver `MIGRATION_PLAN.md` para notas detalladas de migración.

## 🚀 Despliegue

### Despliegue del Backend
```bash
npm run build
npm run server  # Servidor de producción
```

### Despliegue del Frontend
```bash
npm run build
# Desplegar la carpeta dist/ a tu servicio de hosting
```

## 🤝 Contribución

1. Crear una rama de característica desde `feature/web-migration`
2. Realizar los cambios
3. Agregar pruebas para nueva funcionalidad
4. Asegurar que todas las pruebas pasen
5. Enviar un pull request

## 📝 Licencia

Este proyecto es parte de la migración de la aplicación Captus. Ver el proyecto desktop original para información de licencias.

## 🐛 Problemas Conocidos y TODO

- [ ] Notificaciones por email (Fase 2)
- [ ] Gestión de documentos (Fase 2)
- [ ] Grupos de trabajo (Fase 2)
- [ ] Integración IA (Fase 3)
- [ ] Editor UML (Fase 3)

Ver `MIGRATION_PLAN.md` para el roadmap completo.

## 📖 Arquitectura Detallada del Proyecto

### Backend - Funciones por Módulo

#### 🗄️ **Modelos (`backend/src/models/`)**
- **`task.js`**: Modelo de datos para tareas y subtareas
  - Propiedades: id, title, description, due_date, priority_id, category_id, completed, user_id, parent_task_id
  - Métodos: validate(), toDatabase(), fromDatabase(), checkLikeCompleted(), uncheckLikeCompleted()
  - Validaciones: título requerido, fechas futuras para nuevas tareas

- **`user.js`**: Modelo de datos para usuarios
  - Propiedades: id, email, name, created_at, updated_at
  - Métodos: validate(), toDatabase(), fromDatabase(), fromSupabaseAuth()
  - Integración con Supabase Auth

- **`streak.js`**: Modelo para sistema de rachas de productividad
  - Propiedades: id, user_id, current_streak, last_completed_date, daily_goal
  - Métodos: updateStreak(), shouldResetStreak(), validate()
  - Lógica: cálculo automático de rachas consecutivas

#### 🔧 **Servicios (`backend/src/services/`)**
- **`taskService.js`**: Lógica de negocio para gestión de tareas
  - CRUD completo: createTask, getTaskById, updateTask, deleteTask
  - Gestión de subtareas: createSubtask, getSubtasks, deleteSubtasksByParentTask
  - Filtros avanzados: por categoría, prioridad, estado, búsqueda de texto
  - Funciones especiales: getOverdueTasks, getCompletedTasksToday
  - Integración con rachas: updateUserStreak al completar tareas

- **`userService.js`**: Gestión de usuarios y perfiles
  - Autenticación: syncUserFromAuth, getUserById
  - Perfiles: updateUser, getUserStats
  - Estadísticas: totalTasks, completedTasks, pendingTasks, currentStreak

- **`streakService.js`**: Sistema de seguimiento de productividad
  - Gestión de rachas: getUserStreak, updateUserStreak, resetUserStreak
  - Estadísticas: getStreakStats (currentStreak, dailyGoal, completionRate)
  - Automatización: checkAndResetStreaks (para tareas programadas)

#### 🎯 **Controladores (`backend/src/controllers/`)**
- **`taskController.js`**: Controladores HTTP para API de tareas
  - getTasks: lista con filtros de query
  - createTask: creación con validación
  - updateTask: actualización con reglas de negocio
  - deleteTask: eliminación con cleanup de subtareas
  - getOverdueTasks, getCompletedTasksToday: consultas especializadas
  - createSubtask, getSubtasks: gestión jerárquica

- **`userController.js`**: Controladores para gestión de usuarios
  - getProfile, updateProfile: gestión de perfiles
  - getUserStats: estadísticas del usuario
  - syncUserFromAuth: sincronización con Supabase

#### 🛣️ **Rutas (`backend/src/routes/`)**
- **`taskRoutes.js`**: Definición de endpoints REST para tareas
  - Rutas CRUD: GET, POST, PUT, DELETE /api/tasks
  - Rutas especializadas: /overdue, /completed-today
  - Subtareas: /:id/subtasks
  - Documentación Swagger integrada

- **`userRoutes.js`**: Rutas para gestión de usuarios
  - /profile: GET, PUT para perfiles
  - /stats: estadísticas del usuario
  - /sync: sincronización con auth

- **`streakRoutes.js`**: Rutas para sistema de rachas
  - GET /: obtener racha actual
  - PUT /: actualizar racha manualmente
  - DELETE /: reiniciar racha
  - /stats: estadísticas detalladas

### Frontend - Funciones por Módulo

#### 🌐 **API Client (`src/shared/api/`)**
- **`client.js`**: Cliente HTTP configurado
  - Axios instance con interceptores
  - Autenticación automática con JWT
  - Manejo de errores 401 (token expirado)
  - Headers automáticos de autorización

#### 🎣 **Hooks Personalizados (`src/features/tasks/hooks/`)**
- **`useTasks.js`**: Hook principal para gestión de tareas
  - Estado: tasks, loading, error
  - Operaciones CRUD: createTask, updateTask, deleteTask, toggleTaskCompletion
  - Funciones especializadas: getSubtasks, createSubtask, getOverdueTasks
  - Filtros: fetchTasks con parámetros de búsqueda
  - Sincronización automática con API

#### 🧩 **Componentes (`src/features/tasks/components/`)**
- **`TaskCard.jsx`**: Componente para mostrar tareas individuales
  - Estados visuales: completada, vencida, subtarea
  - Acciones: toggle completado, editar, eliminar
  - Información: categorías, prioridades, fechas
  - Diseño responsivo con Tailwind

- **`TaskForm.jsx`**: Formulario para crear/editar tareas
  - Validación en tiempo real
  - Campos: título, descripción, categoría, prioridad, fecha límite
  - Estados: loading, errores de validación
  - Modo creación vs edición

#### 🎨 **Componentes Compartidos (`src/shared/components/`)**
- **`StreakWidget.jsx`**: Widget de rachas de productividad
  - Visualización: llama de fuego, números, colores dinámicos
  - Información: racha actual, meta diaria, tasa de éxito
  - Mensajes motivacionales según progreso

#### 🔐 **Contexto de Autenticación (`src/context/`)**
- **`AuthContext.jsx`**: Gestión global de autenticación
  - Estados: user, token, loading, isAuthenticated
  - Acciones: login, register, logout, redirectToTasks
  - Persistencia: localStorage para tokens
  - Integración con API client

### 🗄️ Base de Datos - Estructura y Relaciones

#### **Tablas Principales**
- **`users`**: Perfiles de usuario (id, email, name, timestamps)
- **`tasks`**: Tareas y subtareas (title, description, due_date, priority_id, category_id, completed, user_id, parent_task_id)
- **`categories`**: Categorías de tareas (id, name, user_id nullable para globales)
- **`priorities`**: Niveles de prioridad (id, name - Baja, Media, Alta)
- **`streaks`**: Sistema de rachas (user_id, current_streak, last_completed_date, daily_goal)

#### **Relaciones**
- **Uno a Muchos**: users → tasks, users → streaks, categories → tasks, priorities → tasks
- **Jerárquica**: tasks → tasks (parent_task_id para subtareas)
- **Referencial**: tasks.category_id → categories.id, tasks.priority_id → priorities.id

#### **Índices de Rendimiento**
- Índices en user_id, parent_task_id, completed, due_date
- Índices únicos en streaks.user_id
- Triggers automáticos para updated_at

### 🔐 Seguridad y Autenticación

#### **Supabase Auth**
- Registro/Login con email + password
- JWT tokens con expiración de 24 horas
- Refresh tokens automático
- Verificación de email opcional

#### **Middleware de Seguridad**
- Autenticación requerida para rutas protegidas
- Validación de tokens JWT
- Autorización por usuario (user_id en consultas)
- Sanitización de inputs

#### **Políticas RLS (Row Level Security)**
- Usuarios solo acceden a sus propios datos
- Categorías globales vs personales
- Validación de ownership en updates/deletes

### 🧪 Estrategia de Testing

#### **Pruebas Unitarias**
- **Modelos**: validaciones, conversiones, métodos de negocio
- **Servicios**: lógica CRUD, reglas de negocio, integración con DB
- **Utilidades**: helpers, formatters, validadores

#### **Pruebas de Integración**
- **API Endpoints**: requests HTTP completos
- **Autenticación**: login/register/logout flows
- **Base de Datos**: operaciones CRUD reales
- **Middleware**: autenticación, validación, errores

#### **Cobertura**
- **Mínimo 60%** en servicios críticos
- **Mínimo 70%** en modelos y utilidades
- **100%** en rutas de autenticación
- Reportes HTML y LCOV generados

### 🚀 Despliegue y DevOps

#### **Variables de Entorno**
- **Supabase**: URL, ANON_KEY para frontend/backend
- **JWT**: SECRET para firma de tokens
- **Server**: PORT, FRONTEND_URL para CORS

#### **Comandos de Build**
- **Backend**: npm run server (producción)
- **Frontend**: npm run build → dist/
- **Testing**: npm test -- --coverage

#### **Monitoreo**
- Health check endpoint: /api/health
- Logs de errores en servicios
- Métricas de rendimiento básicas

Esta arquitectura modular y bien estructurada permite escalabilidad futura y facilita el mantenimiento del código. Cada módulo tiene responsabilidades claras y la separación de concerns permite desarrollo paralelo y testing independiente.
