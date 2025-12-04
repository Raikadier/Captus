# Configuración de Gmail para Notificaciones por Email

## Requisitos Previos

Para que las notificaciones por email funcionen correctamente, necesitas configurar las credenciales de Gmail en el archivo `.env` del backend.

## Pasos para Configurar Gmail

### 1. Habilitar la Verificación en Dos Pasos
1. Ve a [Google Account](https://myaccount.google.com/)
2. Ve a "Seguridad" en el menú lateral
3. Busca "Verificación en dos pasos" y actívala

### 2. Generar una Contraseña de Aplicación
1. Después de activar la verificación en dos pasos, regresa a "Seguridad"
2. Busca "Contraseñas de aplicaciones" (App passwords)
3. Selecciona "Correo" como aplicación
4. Selecciona "Otro" como dispositivo y escribe "Captus App"
5. Google te dará una contraseña de 16 caracteres

### 3. Configurar Variables de Entorno
Edita el archivo `backend/.env` y agrega estas líneas:

```env
# Gmail configuration for email notifications
GMAIL_USER=tu-email@gmail.com
GMAIL_APP_PASSWORD=abcd-efgh-ijkl-mnop
```

**Importante:**
- `GMAIL_USER`: Tu dirección completa de Gmail
- `GMAIL_APP_PASSWORD`: La contraseña de aplicación de 16 caracteres (sin espacios)

### 4. Reiniciar el Servidor
Después de configurar las variables, reinicia el servidor backend:

```bash
cd backend
npm start
```

## Funcionalidades de Email

Una vez configurado, el sistema enviará emails automáticamente para:

- **Creación de eventos**: Cuando creas un evento con notificaciones activadas
- **Actualización de eventos**: Cuando modificas un evento existente
- **Recordatorios**: Notificaciones automáticas 24 horas antes de eventos próximos

## Solución de Problemas

### Error: "Gmail credentials not configured for notifications"
- Verifica que las variables `GMAIL_USER` y `GMAIL_APP_PASSWORD` estén correctamente configuradas
- Asegúrate de que la contraseña de aplicación sea correcta (16 caracteres)
- Reinicia el servidor después de cambiar las variables

### Error: "Invalid login"
- Verifica que la dirección de email sea correcta
- Genera una nueva contraseña de aplicación si la anterior no funciona
- Asegúrate de que la verificación en dos pasos esté activada

### Emails no llegan
- Revisa la carpeta de spam
- Verifica que la dirección de email del usuario esté correcta en la base de datos
- Los emails pueden tardar unos minutos en llegar

## Seguridad

- Las contraseñas de aplicación son específicas para cada aplicación
- Puedes revocarlas en cualquier momento desde Google Account
- Nunca compartas tu contraseña de aplicación
- La contraseña normal de Gmail sigue funcionando normalmente