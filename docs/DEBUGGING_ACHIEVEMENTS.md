# Guía Rápida de Debugging - Logros

## Problema Actual
Los logros aparecen bloqueados en el frontend aunque la base de datos muestra `isCompleted: true`.

## Pasos de Debugging

### 1. Verificar Logs del Backend
Ya confirmado ✅ - El backend está devolviendo 8 logros con `isCompleted: true`

### 2. Verificar Logs del Frontend

Abre la consola del navegador (F12) y busca:

```
📡 Fetching achievements from /achievements/my...
📊 RAW API Response: {...}
✅ Achievements to set in state: [...]
✅ Unlocked achievements: 8
```

**Si ves estos logs:**
- Verifica que "Unlocked achievements" sea 8
- Verifica que cada logro muestre `isCompleted=true (type: boolean)`

**Si NO ves estos logs:**
- El AchievementContext no se está cargando
- Verifica que la página de logros esté usando `useAchievementsContext()`

### 3. Verificar Renderizado

En la consola, busca:

```
🏆 AchievementsPage render: {...}
🎯 Rendering first_task: { isCompleted: true, isUnlocked: true, ... }
```

**Si `isUnlocked` es `false` pero `isCompleted` es `true`:**
- Hay un problema en la lógica de `AchievementCard`
- Verifica la línea: `const isUnlocked = userAchievement?.isCompleted === true;`

### 4. Verificar Datos en React DevTools

1. Instala React DevTools si no lo tienes
2. Abre React DevTools
3. Busca el componente `AchievementProvider`
4. Verifica el estado `userAchievements`
5. Cada achievement debe tener `isCompleted: true` para los desbloqueados

### 5. Solución Rápida - Forzar Recarga

En la consola del navegador, ejecuta:

```javascript
localStorage.clear();
sessionStorage.clear();
location.reload();
```

Esto limpia cualquier caché y recarga la página.

### 6. Verificar Network Tab

1. Abre DevTools → Network
2. Filtra por "achievements"
3. Busca la petición a `/api/achievements/my`
4. Verifica la respuesta JSON
5. Debe mostrar `isCompleted: true` para 8 logros

## Si Nada Funciona

Ejecuta este comando en la consola del navegador para ver los datos exactos:

```javascript
fetch('http://localhost:4000/api/achievements/my', {
  headers: {
    'Authorization': 'Bearer ' + (await supabase.auth.getSession()).data.session.access_token
  }
})
.then(r => r.json())
.then(data => {
  console.log('Direct API call:', data);
  console.log('Unlocked:', data.data.filter(a => a.isCompleted === true).length);
});
```
