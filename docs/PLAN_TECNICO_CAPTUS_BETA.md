# ⚙️ PLAN TÉCNICO DE TRABAJO — CAPTUS WEB (Versión Beta 2025)

**Duración total:** 4 semanas  
**Metodología:** Extreme Programming (XP)  
**Objetivo:** desarrollar una versión beta funcional, presentable y desplegable de Captus Web.  

---

## 📅 Plan general XP

| Semana | Sprint XP | Objetivos técnicos | Responsables sugeridos |
|---------|------------|--------------------|------------------------|
| **1** | 🧱 Configuración y entorno | - Configurar Supabase.<br>- Crear estructura `frontend/` y `backend/`.<br>- Implementar login y registro.<br>- Conectar base de datos. | Dev líder + 1 asistente |
| **2** | 🧾 CRUD + Chat IA | - Crear módulo `tasks` completo (frontend + backend).<br>- Integrar chat IA (DeepSeek) en interfaz.<br>- Guardar mensajes en BD. | 2 desarrolladores |
| **3** | 🗓️ Diagramas + calendario | - Integrar Mermaid.js.<br>- Crear endpoint `/api/diagrams`.<br>- Generar diagramas desde texto IA.<br>- Implementar vista calendario. | 1 frontend + 1 backend |
| **4** | 🎨 Pulido y despliegue | - Optimizar UI (Tailwind).<br>- Crear README final.<br>- Desplegar backend (Render) y frontend (Netlify).<br>- Ensayar presentación. | Todo el equipo |

---

## 🧠 Tareas técnicas por módulo

| Módulo | Actividades clave | Dependencias |
|---------|--------------------|---------------|
| **Auth** | Configurar Supabase Auth + context global React. | Supabase |
| **Tasks** | CRUD completo, conexión API. | Backend Express |
| **AI Chat** | Integrar endpoint `/api/ai`. Enviar prompt a DeepSeek API. | OpenRouter |
| **Diagramas** | Generar Mermaid en frontend. | IA + librería Mermaid |
| **Calendar** | Mostrar tareas según fechas. | Supabase tasks |
| **Progreso** | Cálculo % completadas. | Supabase tasks |
| **UI/UX** | Crear layout, navbar, panel IA, widgets. | Tailwind |

---

## 🧩 Herramientas recomendadas

- **GitHub Projects:** seguimiento XP.  
- **Vite + Tailwind + React Router.**  
- **Postman o Thunder Client:** probar API.  
- **Supabase Studio:** gestionar BD.  
- **Render + Netlify:** despliegue.  
- **ChatGPT / Kilo Code:** soporte técnico.  

---

## 🧾 Entregables finales

1. **Demo en línea:** frontend + backend conectados.  
2. **Video corto (2 min):** recorrido de funciones.  
3. **Documento formal:** actualización del proyecto.  
4. **Repositorio público bien estructurado.**  
5. **Informe XP:** historias de usuario, iteraciones y retrospectiva.

---

## 🧭 Siguientes pasos tras la beta

- Implementar **roles docente/estudiante reales**.  
- Añadir **subida de archivos y calificaciones.**  
- Extender IA para lectura de documentos y código.  
- Mejorar sistema de diagramas (colaborativo).  
- Empezar diseño de Captus Mobile / PWA.

---
