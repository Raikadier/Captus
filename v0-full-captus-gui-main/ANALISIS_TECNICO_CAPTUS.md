# Análisis Técnico Exhaustivo - Proyecto Captus

Este documento presenta un análisis detallado del estado actual del frontend de Captus, con un enfoque específico en la preparación para la integración con el backend y la futura migración a un entorno React + Vite.

## 1. Arquitectura y Calidad de Código

### Estado Actual
- **Estructura de Componentes**: El proyecto sigue una estructura basada en páginas (`components/*Page.tsx`) que actúan como controladores de vista. Esto es positivo para la separación de responsabilidades.
- **Gestión de Estado**: Se depende fuertemente de `useState` local en cada componente.
- **TypeScript**: El uso de tipos es inconsistente. Se detectaron usos de `any` en archivos críticos como `calendarPage.tsx` y `notesPage.tsx`.

### Recomendaciones
1.  **Capa de Servicios (Crucial para Backend)**:
    - Actualmente, la lógica de datos está acoplada a la UI.
    - **Acción**: Crear una carpeta `services/` o `api/`. Definir funciones para cada entidad (ej: `courseService.ts`, `authService.ts`).
    - **Beneficio**: Permitirá cambiar de datos mock a llamadas reales al backend sin tocar los componentes visuales.

2.  **Centralización de Tipos (DTOs)**:
    - **Acción**: Crear una carpeta `types/` o `interfaces/`. Definir interfaces que reflejen la estructura de la base de datos (ej: `User`, `Course`, `Assignment`).
    - **Beneficio**: Asegura que el frontend y el backend hablen el mismo "idioma" y facilita el autocompletado.

3.  **Gestión de Estado Global**:
    - Para datos que persisten entre vistas (usuario autenticado, notificaciones, configuración de tema), el `Context API` actual (`ThemeContext`) es un buen inicio, pero se quedará corto.
    - **Acción**: Evaluar librerías ligeras como **Zustand** para manejar el estado global de la sesión y caché de datos (SWR o TanStack Query son ideales para el fetching).

## 2. Preparación para Integración Backend

Dado que el backend está en desarrollo, el frontend debe ser "agnóstico" al origen de los datos por ahora, pero estar listo para conectarse.

### Estrategia de "Adapter Pattern"
- **Problema**: Los componentes esperan datos con una forma específica. Si el backend cambia el nombre de un campo (ej: `title` por `name`), se rompe la UI.
- **Solución**: Implementar adaptadores.
  \`\`\`typescript
  // api/adapters/courseAdapter.ts
  export const adaptCourse = (backendData: any): Course => ({
    id: backendData._id,
    title: backendData.course_name, // Mapeo de campos
    // ...
  });
  \`\`\`

### Manejo de Estados de Carga y Error
- **Hallazgo**: Muchos componentes no tienen estados de `loading` o `error` explícitos visualmente robustos (skeletons).
- **Acción**: Implementar un componente `<PageLoader />` o Skeletons específicos para las tarjetas de cursos y listas de tareas. El usuario no debe ver una pantalla en blanco mientras el backend responde.

### Cliente HTTP Unificado
- **Acción**: Configurar una instancia de Axios o un wrapper de Fetch que maneje:
  - Inyección automática del Token de autorización (Bearer token) en los headers.
  - Interceptores para manejar errores globales (ej: 401 Unauthorized -> redirigir a login).

## 3. UI/UX y Diseño

### Consistencia Visual
- **Hallazgo**: Se ha hecho un gran trabajo unificando los dropdowns y eliminando estilos duplicados (`min-h-screen`).
- **Mejora**: Los colores "hardcoded" (ej: `bg-[#F6F7FB]`) deberían moverse a variables CSS o configuración de Tailwind (`bg-background-secondary`) para facilitar cambios de tema globales.

### Animaciones
- Las animaciones actuales agregan dinamismo. Asegurar que respeten la preferencia de "reducción de movimiento" del sistema operativo para accesibilidad.

### Feedback al Usuario
- El sistema de `toast` es bueno, pero para acciones críticas (borrar curso, enviar tarea), se recomienda usar diálogos de confirmación modales antes de ejecutar la acción, previendo la latencia del backend.

## 4. Migración a React + Vite

El código actual está en Next.js (App Router), pero el destino es Vite.

### Rutas
- **Desafío**: `next/navigation` (`useRouter`, `usePathname`) no existe en Vite.
- **Preparación**: Abstraer la navegación en un hook propio `useAppNavigation`.
  - Ahora: usa `next/navigation`.
  - Futuro: usará `react-router-dom`.
  - Esto evitará tener que refactorizar cientos de archivos después.

### Imágenes y Assets
- Next.js optimiza imágenes automáticamente con `<Image />`. En Vite, se usará la etiqueta `<img>` estándar. Verificar que las imágenes estén en formatos optimizados (WebP/SVG) desde el origen.

## 5. Resumen de Tareas Prioritarias

1.  **Refactorización de API**: Extraer toda la lógica de datos mock a archivos de servicio separados.
2.  **Tipado Estricto**: Eliminar `any` y definir interfaces TypeScript sólidas para las entidades principales.
3.  **Hook de Navegación**: Crear `hooks/useCustomRouter.ts` para desacoplar la lógica de enrutamiento de Next.js.
4.  **Variables de Diseño**: Reemplazar valores hex arbitrarios por tokens semánticos de Tailwind.

Este análisis sienta las bases para un desarrollo escalable y una integración fluida con el equipo de backend.
