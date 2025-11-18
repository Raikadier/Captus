# 🎓 Captus - Plataforma de Gestión de Tareas para Estudiantes

Una aplicación web moderna para estudiantes de ingeniería de sistemas que permite gestionar tareas, mantener rachas de productividad y organizar el trabajo académico.

## 🚀 Inicio Rápido

### **Instalación y Configuración**
```bash
# 1. Clonar el repositorio
git clone <repository-url>
cd Captus

# 2. Instalación automática
npm run setup
# (incluye postinstall con patch-package para arreglar util._extend en spawn-command)

# 3. Configurar variables de entorno
# Copia backend/env.example a backend/.env
# Copia frontend/env.example a frontend/.env
# Configura tus credenciales de Supabase

# 4. Ejecutar ambos servicios
npm run dev
```

### **URLs de Acceso**
- **Frontend:** http://localhost:5173 (Vite moverá al siguiente puerto libre si 5173 está ocupado; revisa la consola)
- **Backend API base:** http://localhost:4000/api (devuelve JSON con enlaces útiles)
- **Health Check:** http://localhost:4000/api/health
- **Documentación API (Swagger):** http://localhost:4000/api-docs

## 📋 Características

- ✅ **Gestión de Tareas** - Crear, editar y completar tareas
- 🔥 **Sistema de Rachas** - Mantén tu productividad diaria
- 📊 **Dashboard Intuitivo** - Vista general de tu progreso
- 🎨 **Diseño Moderno** - UI limpia y fácil de usar
- 🔐 **Autenticación** - Login y registro seguros
- 📱 **Responsive** - Funciona en todos los dispositivos

## 🛠️ Tecnologías

### **Frontend**
- React 19
- Vite
- Tailwind CSS
- React Router
- Lucide React (iconos)

### **Backend**
- Node.js
- Express
- Supabase
- CORS
- Helmet

## 📁 Estructura del Proyecto

```
Captus/
├── frontend/          # Aplicación React
├── backend/           # API Node.js
├── scripts/           # Scripts de utilidad
├── docs/              # Documentación
└── SETUP.md           # Guía detallada de instalación
```

## 🎯 Comandos Principales

```bash
npm run dev              # Ejecutar ambos servicios
npm run setup            # Configuración inicial
npm run check:ports      # Verificar puertos disponibles
npm run health           # Verificar estado del backend
npm run lint --prefix backend   # Lint backend
npm run lint --prefix frontend  # Lint frontend
```

## 📚 Documentación Completa

Para una guía detallada de instalación, configuración y solución de problemas, consulta [SETUP.md](./SETUP.md).

## 👥 Para Estudiantes

Este proyecto está diseñado específicamente para estudiantes de la Universidad Popular del Cesar. El código está bien comentado y la estructura es fácil de entender para principiantes.

## 🆘 Soporte

Si tienes problemas:
1. Ejecuta `npm run check:ports`
2. Verifica las variables de entorno
3. Consulta [SETUP.md](./SETUP.md) para solución de problemas
4. Revisa los logs en la consola (backend imprime health/docs/api/frontend)
5. Consulta `/api` y `/api/health` para validar el backend

## 📄 Licencia

Este proyecto es parte del currículo académico de ingeniería de sistemas.
