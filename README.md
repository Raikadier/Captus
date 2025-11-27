# 🎓 Captus - Plataforma de Gestión Académica Inteligente

Una aplicación web moderna para estudiantes de ingeniería que integra gestión de tareas, rachas de productividad, notificaciones inteligentes y asistencia con IA.

**Desarrollado por:** Estudiantes de Ingeniería de Sistemas - 6º semestre  
**Universidad:** Universidad Popular del Cesar  
**Tutor:** Wilman Jose Vega Castilla

---

## 🚀 Inicio Rápido

### Requisitos Previos
- **Node.js** (versión 18 o superior)
- **npm** (viene con Node.js)
- **Cuenta de Supabase** (para base de datos y autenticación)

### Instalación

```bash
# 1. Clonar el repositorio
git clone <repository-url>
cd Captus

# 2. Instalación automática (recomendado)
npm run setup

# 3. Configurar variables de entorno
# Backend: copiar backend/.env.example a backend/.env
# Frontend: copiar frontend/.env.example a frontend/.env
# Configurar credenciales de Supabase

# 4. Ejecutar ambos servicios
npm run dev
```

### URLs de Acceso
- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:4000/api
- **Documentación API (Swagger):** http://localhost:4000/api-docs
- **Health Check:** http://localhost:4000/api/health

---

## 📋 Características Principales

### ✅ Funcionalidades Implementadas
- **Gestión de Tareas (CRUD)** - Crear, editar, eliminar y completar tareas con categorías y prioridades
- **Sistema de Rachas** - Mantén tu productividad diaria con seguimiento automático
- **Autenticación Supabase** - Login y registro seguros con roles (estudiante/docente)
- **Notificaciones por Email** - Recordatorios automáticos de tareas próximas
- **Chat con IA** - Asistente virtual contextual con DeepSeek
- **Calendario Académico** - Vista de eventos y tareas próximas
- **Panel de Estadísticas** - Progreso, rendimiento y métricas de productividad
- **Diseño Responsive** - Funciona en todos los dispositivos

### 🔮 Funcionalidades Futuras
- Generación de diagramas UML con IA (Mermaid)
- Subida de archivos y entregas
- Gestión de cursos y grupos de trabajo
- Calificaciones y perfil docente avanzado
- Notificaciones por WhatsApp

---

## 🛠️ Tecnologías

### Frontend
- React 19 + Vite
- Tailwind CSS
- React Router
- Supabase JS (autenticación y DB)
- Axios (comunicación con backend)
- Lucide React (iconos)

### Backend
- Node.js + Express
- Supabase (PostgreSQL + Auth)
- Nodemailer (notificaciones email)
- Swagger (documentación API)
- JWT (validación de tokens)

### Base de Datos
- **PostgreSQL** (vía Supabase)
- Tables: `users`, `tasks`, `categories`, `priorities`, `streaks`, `notifications`, `statistics`
- **RLS (Row Level Security)** habilitado para seguridad

---

## 📁 Estructura del Proyecto

```
Captus/
├── backend/                  # API Node.js/Express
│   ├── src/
│   │   ├── routes/          # Rutas de la API
│   │   ├── services/        # Lógica de negocio
│   │   ├── middleware/      # Autenticación y validación
│   │   └── ai/              # Sistema de IA (router, orchestrator)
│   ├── db/                  # Scripts SQL
│   └── server.js            # Punto de entrada
├── frontend/                # Aplicación React/Vite
│   ├── src/
│   │   ├── components/     # Componentes React
│   │   ├── features/       # Módulos por funcionalidad
│   │   ├── shared/         # API clients y utilidades
│   │   └── context/        # Contextos (Auth, etc.)
│   └── vite.config.js
├── docs/                    # Documentación (deprecated)
├── scripts/                 # Scripts de utilidad
├── patches/                 # Parches npm (patch-package)
└── package.json            # Configuración del monorepo
```

---

## ⚙️ Configuración

### Variables de Entorno

#### Backend (`backend/.env`)
```env
SUPABASE_URL=tu_url_de_supabase
SUPABASE_SERVICE_ROLE_KEY=tu_service_role_key
PORT=4000
FRONTEND_URL=http://localhost:5173
NODE_ENV=development

# Notificaciones por Email (opcional)
GMAIL_USER=tu-email@gmail.com
GMAIL_APP_PASSWORD=tu-contraseña-de-aplicación
```

#### Frontend (`frontend/.env`)
```env
VITE_SUPABASE_URL=tu_url_de_supabase
VITE_SUPABASE_ANON_KEY=tu_anon_key
VITE_API_URL=http://localhost:4000
NODE_ENV=development
```

### Configurar Gmail (Opcional)

Para habilitar notificaciones por email:

1. Habilita la **verificación en dos pasos** en tu cuenta de Gmail
2. Genera una **contraseña de aplicación** en [Google Account](https://myaccount.google.com/)
3. Agrega las credenciales en `backend/.env`
4. Reinicia el servidor backend

---

## 🎯 Comandos Disponibles

### Desde la Raíz
```bash
npm run dev              # Ejecutar frontend + backend
npm run setup            # Instalación completa
npm run check:ports      # Verificar puertos disponibles
npm run health           # Verificar estado del backend
npm run backend:dev      # Solo backend
npm run frontend:dev     # Solo frontend
```

### Backend
```bash
cd backend
npm run dev             # Desarrollo con nodemon
npm start               # Producción
npm test                # Ejecutar tests
npm run lint            # Verificar código
```

### Frontend
```bash
cd frontend
npm run dev             # Servidor de desarrollo
npm run build           # Build para producción
npm run preview         # Preview del build
npm run lint            # Verificar código
```

---

## 🔒 Arquitectura de Seguridad

### Flujo de Autenticación
1. **Login:** Usuario se autentica con `supabase.auth.signInWithPassword`
2. **Token Storage:** El `access_token` JWT se guarda en `localStorage`
3. **Request:** Cada petición HTTP incluye `Authorization: Bearer <token>`
4. **Validation:** Middleware `verifySupabaseToken` valida el token con Supabase Admin
5. **Access Control:** RLS en base de datos + validación por `req.user.id`

### Middleware de Seguridad
- **verifySupabaseToken**: Valida tokens de Supabase
- **CORS**: Configurado para permitir solo `FRONTEND_URL`
- **Helmet**: Headers de seguridad HTTP
- **Row Level Security (RLS)**: Políticas a nivel de base de datos

---

## 🗄️ Base de Datos

### Tablas Principales

| Tabla | Descripción |
|-------|-------------|
| `users` | Información de usuarios (email, nombre, carrera, role) |
| `tasks` | Tareas con categorías, prioridades y subtareas |
| `categories` | Categorías personalizadas por usuario |
| `priorities` | Prioridades (Baja, Media, Alta) |
| `streaks` | Sistema de rachas diarias |
| `notifications` | Notificaciones y preferencias |
| `statistics` | Estadísticas de usuario |
| `subjects` | Materias académicas |
| `study_sessions` | Sesiones de estudio |

### Ejecutar Migraciones

Ejecuta los siguientes scripts en el **SQL Editor** de Supabase:

1. **Schema principal:** `docs/supabase-schema.sql`
2. **Roles:** `backend/src/docs/migration_add_role.sql`
3. **Notificaciones:** `backend/db/notifications_schema.sql`
4. **Cron Job (opcional):** `backend/db/cron_job.sql`

---

## 🤖 Sistema de IA

### Arquitectura
- **Modelo de razonamiento:** Together.ai
- **Chat rápido:** Groq
- **Router Agent:** Clasifica intenciones del usuario
- **Orchestrator:** Ejecuta herramientas especializadas
- **Tool Registry:** Herramientas para gestionar tareas, calendario, etc.

### Consumo de Endpoints
```javascript
// Frontend
const response = await apiClient.post('/api/ai/chat', {
  message: "Crear una tarea para mañana"
});
```

### ⚠️ Notas de Seguridad (del Audit)
- El `userId` debe venir de `req.user.id` (validado por JWT), nunca de `req.body`
- Las herramientas usan cliente privilegiado de Supabase - asegurar scope correcto
- Normalizar respuestas del LLM con `.toLowerCase()` para evitar fallos

---

## 📊 Notificaciones y Cron Jobs

### Notificaciones por Email
El sistema envía emails automáticamente para:
- Recordatorios 24 horas antes de deadlines
- Creación de eventos con notificaciones activadas
- Actualizaciones de tareas importantes

### Cron Jobs (Producción)
Para ejecutar el checker de deadlines diariamente:

1. Habilita `pg_cron` en Supabase
2. Ejecuta `backend/db/cron_job.sql`
3. Actualiza la URL del endpoint a tu backend en producción

### Testing Local
Usa **ngrok** para exponer localhost:
```bash
ngrok http 4000
# Actualiza cron_job.sql con la URL de ngrok
```

O dispara manualmente:
```bash
curl http://localhost:4000/api/notifications/check-deadlines
```

---

## ⚠️ Solución de Problemas

### Puerto Ocupado
```bash
# Verificar procesos
netstat -ano | findstr :4000
netstat -ano | findstr :5173

# Cambiar puerto del backend
PORT=4001 npm run backend:dev
```

### Error de Dependencias
```bash
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### Error de Supabase
- Verifica que las variables de entorno estén configuradas
- Confirma que las credenciales sean correctas
- Asegúrate de que el proyecto de Supabase esté activo
- Verifica RLS en las tablas

### Error de CORS
- Verifica `FRONTEND_URL` en backend
- Confirma proxy en `vite.config.js`

### Notificaciones no funcionan
- Verifica credenciales de Gmail en `.env`
- Revisa carpeta de spam
- Confirma que el servidor esté reiniciado tras cambios en `.env`

---

## 🧪 Testing

### Backend Tests
```bash
cd backend
npm test                    # Todos los tests
npm test -- --watch        # Modo watch
npm test -- --coverage     # Con cobertura
```

### Verificación de Health
```bash
npm run health
# O navegador: http://localhost:4000/api/health
```

---

## 🚢 Despliegue

### Recomendaciones
- **Frontend:** Netlify, Vercel
- **Backend:** Render, Railway, Fly.io
- **Base de Datos:** Supabase (ya en la nube)

### Preparación
```bash
# Frontend
cd frontend
npm run build

# Backend (ya listo para producción)
cd backend
npm start
```

---

## 📚 Documentación API

Una vez ejecutando el backend, accede a la documentación interactiva:
- **Swagger UI:** http://localhost:4000/api-docs

### Endpoints Principales

| Método | Endpoint | Descripción |
|--------|---------|-------------|
| GET | `/api/health` | Estado del servidor |
| POST | `/api/auth/login` | Iniciar sesión |
| POST | `/api/auth/register` | Registrar usuario |
| GET | `/api/tasks` | Listar tareas |
| POST | `/api/tasks` | Crear tarea |
| PUT | `/api/tasks/:id` | Actualizar tarea |
| DELETE | `/api/tasks/:id` | Eliminar tarea |
| GET | `/api/streaks/stats` | Estadísticas de racha |
| POST | `/api/ai/chat` | Chat con IA |
| GET | `/api/statistics` | Estadísticas de usuario |
| GET | `/api/notifications/check-deadlines` | Verificar deadlines |

---

## 👥 Contribución

Este proyecto es parte del currículo académico. Si eres estudiante:
1. Crea un fork del repositorio
2. Crea una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -m 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

---

## 🆘 Soporte

Si tienes problemas:
1. Ejecuta `npm run check:ports`
2. Verifica las variables de entorno (backend/.env y frontend/.env)
3. Revisa los logs en la consola
4. Consulta `/api/health` para validar el backend
5. Verifica la documentación de Supabase

---

## 📄 Licencia

Este proyecto es parte del currículo académico de Ingeniería de Sistemas en la Universidad Popular del Cesar.

---

## 🙏 Agradecimientos

- **Tutor:** Wilman Jose Vega Castilla
- **Estudiantes de 6º semestre** - Equipo de desarrollo
- **Universidad Popular del Cesar** - Infraestructura y soporte

---

**💡 Tip:** Mantén ambos servicios (frontend y backend) ejecutándose durante el desarrollo para una mejor experiencia.
