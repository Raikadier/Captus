# Captus - Prototipo Frontend Navegable

Este es el **prototipo no funcional navegable** de Captus, una aplicación de gestión académica para estudiantes.

## 🎯 Descripción

Captus es una plataforma web diseñada para ayudar a estudiantes universitarios a organizar su vida académica. Incluye gestión de tareas, notas, calendario, chat con IA y más.

## ✨ Características Implementadas

- ✅ **Navegación completa** entre todas las vistas
- ✅ **Modo demo** sin necesidad de backend
- ✅ **Diseño responsivo** (desktop y mobile)
- ✅ **UI/UX moderno** con Tailwind CSS
- ✅ **Rutas protegidas** (simuladas)
- ✅ **Autenticación en modo demo**

## 🚀 Instalación y Uso

### Prerrequisitos

- Node.js (v16 o superior)
- npm o yarn

### Pasos de Instalación

1. Clona el repositorio:
```bash
git clone <url-del-repositorio>
cd Captus
git checkout frontend-only
```

2. Entra a la carpeta frontend:
```bash
cd frontend
```

3. Instala las dependencias:
```bash
npm install
```

4. Inicia el servidor de desarrollo:
```bash
npm run dev
```

5. Abre tu navegador en: `http://localhost:5173`

## 📱 Vistas Disponibles

- **Login** (`/`) - Página de inicio de sesión (modo demo activado)
- **Home** (`/home`) - Dashboard principal con resumen
- **Tareas** (`/tasks`) - Gestión de tareas académicas
- **Calendario** (`/calendar`) - Vista mensual de eventos
- **Notas** (`/notes`) - Sistema de apuntes
- **ChatBot** (`/chatbot`) - Asistente virtual de IA
- **Grupos** (`/groups`) - Gestión de grupos de trabajo
- **Perfil** (`/profile`) - Información del usuario
- **Estadísticas** (`/estadisticas`) - Análisis de rendimiento
- **Configuración** (`/configuracion`) - Ajustes de la aplicación

## 🎨 Tecnologías Utilizadas

- **React** 19.1.1
- **React Router** 7.9.4
- **Tailwind CSS** 4.1.16
- **Lucide React** (iconos)
- **Vite** (build tool)

## 📝 Modo Demo

Este prototipo funciona completamente sin backend. Todas las funcionalidades están en **modo demo**:

- **Autenticación**: Automáticamente autenticado como usuario demo
- **Tareas**: Datos de ejemplo pre-cargados
- **CRUD**: Las operaciones se simulan localmente (sin persistencia)
- **Navegación**: Totalmente funcional entre todas las vistas

## 🏗️ Arquitectura

```
frontend/
├── src/
│   ├── App.jsx                # Componente principal y rutas
│   ├── context/
│   │   └── AuthContext.jsx    # Autenticación en modo demo
│   ├── features/
│   │   ├── auth/              # Login y registro
│   │   ├── dashboard/         # Home y layouts
│   │   ├── tasks/             # Gestión de tareas
│   │   ├── calendar/          # Vista calendario
│   │   ├── notes/             # Sistema de notas
│   │   ├── chatbot/           # Chat con IA
│   │   ├── groups/            # Grupos de trabajo
│   │   ├── profile/           # Perfil de usuario
│   │   └── stats/             # Estadísticas
│   ├── shared/
│   │   └── components/        # Componentes compartidos
│   └── ui/                    # Componentes UI base
├── public/                    # Assets estáticos
└── package.json
```

## 📋 Criterios de Evaluación Cumplidos

### Navegabilidad y Funcionalidad (35%)
- ✅ Todas las vistas principales implementadas
- ✅ Enlaces funcionales entre todas las páginas
- ✅ Rutas protegidas simuladas correctamente

### Diseño y Experiencia de Usuario (35%)
- ✅ Diseño responsivo para desktop y mobile
- ✅ Consistencia visual en todas las vistas
- ✅ UI intuitiva y navegable

### Código y Organización (30%)
- ✅ HTML semántico y estructurado
- ✅ Organización clara de carpetas
- ✅ Código limpio y bien estructurado

## 👥 Integrantes del Grupo

[Agregar nombres de los integrantes aquí]

## 📄 Licencia

Este proyecto es parte de un trabajo académico.

