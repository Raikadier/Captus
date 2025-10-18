# Captus Web

Versión web de la aplicación Captus Desktop, migrada de C# a React + Node.js + Supabase.

## Tecnologías

- **Frontend**: React 19 con Vite
- **Backend**: Node.js con Express.js
- **Base de datos**: Supabase (PostgreSQL)
- **Autenticación**: JWT con Supabase Auth
- **UI**: Tailwind CSS

## Características MVP

### Fase 1 - Esenciales
- ✅ Gestión de tareas (crear, editar, eliminar, completar)
- ✅ Subtareas anidadas
- ✅ Gestión de usuarios (registro, login)
- ✅ Categorías y prioridades
- ✅ Sistema de rachas (streaks)

### Fase 2 - Complementarias (preparado)
- ✅ Notificaciones básicas
- 🔄 Grupos de trabajo (pendiente)
- 🔄 Gestor de documentos (pendiente)

### Fase 3 - Avanzadas (futuro)
- 🔄 Asistente IA
- 🔄 Generador UML
- 🔄 Integraciones n8n/MCP

## Instalación y Configuración

### Prerrequisitos
- Node.js 18+
- Cuenta de Supabase

### Configuración

1. **Clona el repositorio**:
   ```bash
   git clone <repository-url>
   cd CaptusGUI
   ```

2. **Instala dependencias**:
   ```bash
   npm install
   ```

3. **Configura Supabase**:
   - Crea un proyecto en [Supabase](https://supabase.com)
   - Ejecuta el esquema SQL en `supabase-schema.sql` en el SQL Editor de Supabase
   - Copia las credenciales del proyecto

4. **Configura variables de entorno**:
   Edita el archivo `.env`:
   ```env
   SUPABASE_URL=tu_supabase_project_url
   SUPABASE_ANON_KEY=tu_supabase_anon_key
   JWT_SECRET=tu_jwt_secret_key
   PORT=5000
   ```

5. **Ejecuta la aplicación**:
   ```bash
   # Terminal 1: Backend
   npm run server:dev

   # Terminal 2: Frontend
   npm run dev
   ```

6. **Accede a la aplicación**:
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000

## Estructura del Proyecto

```
CaptusGUI/
├── server.js                 # Backend Express
├── supabase-schema.sql       # Esquema de base de datos
├── vite.config.js           # Configuración Vite
├── package.json             # Dependencias
├── .env                     # Variables de entorno
├── src/
│   ├── App.jsx              # Componente principal con routing
│   ├── main.jsx             # Punto de entrada React
│   ├── context/
│   │   └── AuthContext.jsx  # Contexto de autenticación
│   └── components/
│       ├── Login.jsx        # Componente de login/registro
│       └── Dashboard.jsx    # Dashboard principal
└── public/                  # Archivos estáticos
```

## API Endpoints

### Autenticación
- `POST /api/auth/login` - Iniciar sesión
- `POST /api/auth/register` - Registrarse
- `POST /api/auth/logout` - Cerrar sesión

### Tareas
- `GET /api/tasks` - Obtener tareas del usuario
- `POST /api/tasks` - Crear nueva tarea
- `PUT /api/tasks/:id` - Actualizar tarea
- `DELETE /api/tasks/:id` - Eliminar tarea

### Subtareas
- `GET /api/subtasks` - Obtener subtareas
- `POST /api/subtasks` - Crear subtarea

### Datos maestros
- `GET /api/categories` - Obtener categorías
- `GET /api/priorities` - Obtener prioridades
- `GET /api/streaks` - Obtener rachas del usuario

### Notificaciones
- `GET /api/notifications` - Obtener notificaciones
- `PUT /api/notifications/:id/read` - Marcar como leída

## Desarrollo

### Scripts disponibles
- `npm run dev` - Inicia el servidor de desarrollo frontend
- `npm run build` - Construye la aplicación para producción
- `npm run server` - Inicia el servidor backend
- `npm run server:dev` - Inicia el servidor backend con nodemon
- `npm run lint` - Ejecuta ESLint

### Arquitectura

La aplicación sigue una arquitectura en 3 capas:
1. **Presentación** (React): Componentes UI y manejo de estado
2. **Servicios** (Express): APIs RESTful y lógica de negocio
3. **Acceso a datos** (Supabase): Consultas a base de datos con RLS

### Seguridad
- Autenticación JWT con tokens en HttpOnly cookies
- Row Level Security (RLS) en Supabase
- Validación de entrada en APIs
- CORS configurado

## Próximos pasos

1. **Fase 2**: Implementar grupos de trabajo y gestor de documentos
2. **Fase 3**: Integrar IA con Ollama/n8n/MCP
3. **Testing**: Añadir tests unitarios e integración
4. **CI/CD**: Configurar pipelines de despliegue
5. **PWA**: Convertir en Progressive Web App

## Contribución

1. Crea una rama para tu feature: `git checkout -b feature/nueva-funcionalidad`
2. Realiza tus cambios y commits: `git commit -m "feat: descripción"`
3. Push a la rama: `git push origin feature/nueva-funcionalidad`
4. Crea un Pull Request

## Licencia

Este proyecto está bajo la Licencia MIT.
