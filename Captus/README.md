# Captus Monorepo (Frontend + Backend)

Estructura simple para estudiantes de 6to semestre. Separación clara:
- frontend/ (React + Vite + supabase-js)
- backend/ (Express + Supabase Service Role para rachas)

Estructura de carpetas
```
Captus/
├─ backend/
│  ├─ server.js
│  ├─ package.json
│  └─ src/
│     ├─ routes/
│     │  └─ streakRoutes.js
│     ├─ services/
│     │  └─ streakService.js
│     └─ models/
│        ├─ streak.js
│        └─ task.js
├─ frontend/
│  ├─ index.html
│  ├─ vite.config.js
│  ├─ package.json
│  └─ src/
│     ├─ context/AuthContext.jsx
│     ├─ shared/api/{client.js,supabase.js}
│     ├─ shared/components/StreakWidget.jsx
│     └─ features/** (tasks, dashboard, etc.)
├─ package.json (scripts de orquestación)
└─ docs/
   ├─ arquitectura.md
   └─ supabase-schema.sql
```

Requisitos
- Node.js 18+
- Cuenta y proyecto en Supabase

Variables de entorno
1) Backend (copiar backend/.env.example → backend/.env)
```
PORT=4000
SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
SUPABASE_SERVICE_ROLE_KEY=YOUR_SUPABASE_SERVICE_ROLE_KEY
FRONTEND_URL=http://localhost:5173
```

2) Frontend (copiar frontend/.env.local.example → frontend/.env.local)
```
VITE_SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
VITE_API_BASE_URL=http://localhost:4000
```

Instalación
- En el raíz (Captus/): instalar dependencias por separado
  - cd backend && npm install
  - cd ../frontend && npm install

Ejecución en desarrollo (dos terminales)
- Terminal 1 (backend):
  - cd Captus
  - npm run backend:dev
  - API: http://localhost:4000
  - Swagger: http://localhost:4000/api-docs
- Terminal 2 (frontend):
  - cd Captus
  - npm run frontend:dev
  - App: http://localhost:5173

Qué hace cada lado
- Frontend:
  - Autenticación: supabase-js (signUp/signIn/signOut)
  - CRUD de tareas: directo a Supabase (RLS)
  - Racha (streak): consulta al backend (GET /api/streaks)
  - Código clave:
    - src/shared/api/supabase.js
    - src/context/AuthContext.jsx
    - src/features/tasks/hooks/useTasks.js
    - src/shared/components/StreakWidget.jsx

- Backend:
  - Valida token de Supabase (Authorization: Bearer <access_token>)
  - Expone /api/streaks (GET/PUT/DELETE) y /api/health
  - No maneja Auth ni CRUD de tasks (lo hace el frontend vía supabase-js)
  - Código clave:
    - backend/server.js
    - backend/src/routes/streakRoutes.js
    - backend/src/services/streakService.js

Esquema de base de datos (Supabase)
- Ver docs/supabase-schema.sql como guía inicial.
- Recomendado (cuando se configure BD real):
  - Habilitar RLS en tablas tasks y streaks
  - Políticas tasks: user_id = auth.uid() para SELECT/INSERT/UPDATE/DELETE
  - Políticas streaks: SELECT por user_id = auth.uid() (updates desde backend con Service Role)
- Para pruebas locales del frontend con supabase-js se requiere VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY válidos.

Comandos útiles (desde Captus/)
- npm run frontend:dev    # Inicia Vite
- npm run frontend:build  # Compila frontend (dist/)
- npm run backend:dev     # Inicia backend con nodemon
- npm run backend:start   # Inicia backend (node)
- npm run backend:test    # Ejecuta pruebas del backend

Notas para el equipo
- Mantenerlo simple: no agregar más endpoints si no es necesario.
- Evitar dos sistemas de autenticación: solo supabase-js en el frontend.
- El backend solo encapsula lógica no pública (ej: streaks con Service Role).
- Si falla la conexión de rachas, revisar:
  - Token en localStorage (acceso con supabase-js)
  - VITE_API_BASE_URL y proxy en vite.config.js
  - SUPABASE_SERVICE_ROLE_KEY en backend/.env

Checklist rápido para correr el proyecto
- [ ] Crear backend/.env desde backend/.env.example
- [ ] Crear frontend/.env.local desde frontend/.env.local.example
- [ ] npm install en backend/ y frontend/
- [ ] Levantar backend y frontend con los scripts del raíz
- [ ] Probar login/registro (supabase-js)
- [ ] Crear una tarea y verificar que aparezca
- [ ] Ver racha en la página de tareas (StreakWidget)
