# Captus - Prototipo Frontend Navegable

Este es el **prototipo no funcional navegable** de Captus, una aplicación de gestión académica para estudiantes.

## 🎯 Descripción

Captus es una plataforma web diseñada para ayudar a estudiantes universitarios a organizar su vida académica. Incluye gestión de tareas, notas, calendario, chat con IA y más.

## ✨ Características Implementadas

- ✅ **Navegación completa** entre todas las vistas
- ✅ **Modo demo** sin necesidad de backend
- ✅ **Diseño responsivo** (desktop y mobile)
- ✅ **UI/UX moderno responsive**
- ✅ **Rutas protegidas simuladas** (liberadas en esta rama)
- ✅ **Autenticación en modo demo**

## 🚀 Instalación y Uso

### Prerrequisitos

- Node.js (v16 o superior)
- npm o yarn

### Pasos de Instalación (Rama frontend-only)

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

## 🧭 Nota para el profesor

- Esta rama (`frontend-only`) contiene únicamente el frontend, listo para evaluar la **navegabilidad** y la **UI/UX**.
- Las rutas protegidas están abiertas para navegación y la autenticación está simulada en **modo demo**.
- Algunas vistas usan datos de ejemplo; no hay persistencia ni consumo real de API.

## 📱 Vistas Disponibles

- **Login** (`/`) - Página de inicio de sesión (modo demo activado)
- **Home** (`/home`) - Dashboard principal con resumen
- **Tareas** (`/tasks`) - Gestión de tareas académicas
- **Calendario** (`/calendar`) - Vista mensual de eventos
- **Notas** (`/notes`) - Sistema de apuntes
- **ChatBot** (`/chatbot`) - Asistente virtual de IA
- **Grupos** (`/groups`) - Gestión de grupos de trabajo
- **Perfil** (`/profile`) - Información del usuario

## 🎨 Tecnologías Utilizadas

- **React** 19.1.1
- **React Router** 7.9.4
- **Lucide React** (iconos)
- **Vite** 7.1.7 (build tool)

## 📝 Modo Demo

Este prototipo funciona completamente sin backend. Todas las funcionalidades están en **modo demo**:

- **Autenticación**: Automáticamente autenticado como usuario demo
- **Tareas**: Datos de ejemplo pre-cargados
- **CRUD**: Las operaciones se simulan localmente (sin persistencia)
- **Navegación**: Totalmente funcional entre todas las vistas

## 🏗️ Arquitectura (simplificada)

```
frontend/
├── src/
│   ├── App.jsx                # Rutas y composición
│   ├── context/
│   │   └── AuthContext.jsx    # Autenticación en modo demo
│   ├── features/
│   │   ├── auth/
│   │   ├── dashboard/
│   │   ├── tasks/
│   │   ├── calendar/
│   │   ├── notes/
│   │   ├── chatbot/
│   │   ├── groups/
│   │   └── profile/
│   └── shared/
│       └── components/
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
- ✅ HTML/JSX semántico y estructurado
- ✅ Organización clara de carpetas
- ✅ Código limpio y legible

## 👥 Integrantes del Grupo

[Agregar nombres de los integrantes aquí]

## 📄 Licencia

Este proyecto es parte de un trabajo académico.

