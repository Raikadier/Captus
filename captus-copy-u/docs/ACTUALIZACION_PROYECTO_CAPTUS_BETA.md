# 🚀 ACTUALIZACIÓN DEL PROYECTO — CAPTUS WEB (Versión Beta 2025)

**Equipo:** Estudiantes de Ingeniería de Sistemas – 6.º semestre  
**Tutor:** Profesor [Nombre del docente]  
**Duración:** 4 semanas (metodología XP)  
**Versión:** Beta funcional – Octubre 2025

---

## 🧭 1. Introducción

**Captus Web** es una aplicación académica inteligente que busca centralizar el flujo de trabajo del estudiante de ingeniería.  
Su propósito es integrar gestión de tareas, cursos, proyectos y herramientas de productividad dentro de un entorno asistido por inteligencia artificial.

La **versión beta** tiene como meta construir un prototipo funcional que demuestre el potencial del proyecto ante el docente evaluador, equilibrando interactividad, IA funcional y arquitectura sólida.

---

## ⚙️ 2. Objetivo de la versión beta

Desarrollar un MVP avanzado de Captus Web que:

- Gestione cursos, tareas y entregas.
- Incluya un asistente virtual con IA (DeepSeek/OpenRouter).
- Permita generar diagramas de ingeniería (UML, flujo, ER) desde texto.
- Muestre un calendario y un panel de progreso.
- Sea desplegable en la nube y navegable en web.

---

## 🧩 3. Estructura general del sistema

Captus/
├── frontend/ ← React + Vite + Tailwind
│ ├── src/
│ ├── public/
│ ├── package.json
│ └── .env.local
├── backend/ ← Node.js + Express + Supabase
│ ├── src/
│ ├── package.json
│ └── .env
├── supabase/
│ └── schema.sql
└── docs/


---

## 🧠 4. Módulos funcionales implementados

| Módulo | Descripción | Estado |
|---------|--------------|--------|
| **Autenticación Supabase** | Registro/login básico con roles. | ✅ |
| **Gestión de tareas (CRUD)** | Crear, editar, eliminar y marcar tareas completadas. | ✅ |
| **Chat IA (DeepSeek)** | Asistente contextual básico con acceso a tareas y proyectos. | ✅ |
| **Calendario académico** | Vista de eventos y tareas próximas. | 🟡 |
| **Panel de progreso** | % de tareas completadas + rendimiento visual. | 🟡 |
| **Diagramas IA (Mermaid)** | Generar diagramas UML/flujo desde texto. | 🟢 |
| **Gestión de cursos** | Listado visual (mock inicial). | 🔵 |
| **Roles docente/estudiante** | Separación parcial de vistas. | 🟠 |

---

## 🧾 5. Base de datos Supabase (tablas clave)

| Tabla | Campos | Propósito |
|--------|---------|-----------|
| `users` | id, name, email, role | Identificación y permisos. |
| `tasks` | id, user_id, title, due_date, status | CRUD tareas. |
| `courses` | id, teacher_id, name, description | Cursos. |
| `enrollments` | id, user_id, course_id | Relación curso-usuario. |
| `diagrams` | id, user_id, title, content (JSON) | Diagramas generados. |

---

## 🧭 6. Cronograma XP (4 semanas)

| Semana | Objetivo | Entregables |
|---------|-----------|-------------|
| 1 | Configuración base y login | Repositorios, Supabase Auth, arquitectura. |
| 2 | CRUD + Chat IA | Panel de tareas, chat funcional. |
| 3 | Diagramas + calendario | Generador Mermaid, calendario visual. |
| 4 | Refinamiento + despliegue | Demo funcional, documentación. |

---

## 🎨 7. Diseño UI

- **Paleta:** tonos azules suaves, acentos verdes.  
- **Estilo:** minimalista tipo Notion / dashboard.  
- **Layout:**  
  - Lateral izquierdo → navegación.  
  - Centro → contenido dinámico.  
  - Derecha → chat IA.  

---

## 💬 8. Integración IA

- **Modelo:** DeepSeek (vía OpenRouter).  
- **Funcionalidad:**  
  - Responder preguntas del estudiante.  
  - Crear tareas o diagramas desde texto.  
  - Asistencia en planificación semanal.  

---

## 🔮 9. Futuro (post-beta)

- Subida de archivos (entregas).  
- IA contextual con memoria de usuario.  
- Diagramas colaborativos.  
- Grupos de trabajo y mensajería.  
- Perfil docente real y calificaciones.

---

## 📚 10. Conclusión

Captus Beta es la base del aula inteligente del futuro: combina la gestión académica tradicional con inteligencia artificial aplicada al aprendizaje.  
Su arquitectura moderna y modular permitirá expandirlo hacia una plataforma completa en próximas iteraciones.

---
