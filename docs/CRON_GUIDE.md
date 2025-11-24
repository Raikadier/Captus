# Guía para Probar Cron Jobs en Local

Como tu backend corre en `localhost` y Supabase está en la nube, Supabase no puede "ver" tu computadora directamente para ejecutar el Cron Job. Tienes dos opciones:

## Opción A: Usar un Túnel (Recomendado para simular producción)
Herramientas como **ngrok** o **localtunnel** crean una URL pública que redirige a tu localhost.

1.  **Instalar ngrok** (si no lo tienes):
    ```bash
    npm install -g ngrok
    ```

2.  **Iniciar el túnel**:
    Si tu backend corre en el puerto 4000:
    ```bash
    ngrok http 4000
    ```
    Esto te dará una URL como: `https://a1b2-c3d4.ngrok-free.app`

3.  **Actualizar el Script SQL en Supabase**:
    Usa esa URL en el script `backend/db/cron_job.sql`:

    ```sql
    select cron.schedule(
      'daily_deadline_checker',
      '*/5 * * * *', -- Ejecutar cada 5 mins para probar (luego cambiar a diario)
      $$
      select
        net.http_get(
            url:='https://a1b2-c3d4.ngrok-free.app/api/notifications/check-deadlines',
            headers:='{"Content-Type": "application/json"}'
        ) as request_id;
      $$
    );
    ```

## Opción B: Disparo Manual (Para desarrollo rápido)
Simplemente llama al endpoint desde tu navegador o Postman/Curl cuando quieras probar la lógica:

*   **URL**: `http://localhost:4000/api/notifications/check-deadlines`
*   **Método**: GET

## Opción C: Cron Local (Solo desarrollo)
Si no quieres configurar Supabase aún, puedes simular el cron dentro de Node.js temporalmente. (Nota: Esto no usa la infraestructura de Supabase).

En `backend/src/server.js`, podrías agregar:
```javascript
// Solo para dev
setInterval(async () => {
  console.log('Running local deadline check...');
  await fetch('http://localhost:4000/api/notifications/check-deadlines');
}, 60000 * 60 * 24); // Cada 24 horas
```
