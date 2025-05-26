# CaptusGUI - Sistema de Gestión de Tareas con IA

## Descripción
CaptusGUI es una aplicación de escritorio desarrollada en C# que combina la gestión de tareas con un asistente virtual inteligente. El sistema permite a los usuarios organizar sus tareas, establecer metas diarias y recibir asistencia a través de un chatbot integrado.

## Características Principales
- 🎯 Gestión completa de tareas
- 🤖 Asistente virtual con IA integrada
- 📊 Estadísticas y seguimiento de progreso
- 🎨 Interfaz de usuario moderna e intuitiva
- 🔐 Sistema de autenticación seguro
- 📱 Diseño responsivo

## Estructura del Proyecto
El proyecto está organizado en capas siguiendo el patrón de arquitectura en capas:

- **Presentation**: Interfaz de usuario y formularios
- **BLL**: Lógica de negocio
- **DAL**: Acceso a datos
- **ENTITY**: Modelos y entidades

## Principios SOLID Implementados

### 1. Principio de Responsabilidad Única (SRP)
- **TaskLogic**: Encargada exclusivamente de la lógica de negocio de tareas
- **ChatLogic**: Maneja únicamente la lógica de procesamiento de mensajes
- **StatisticsLogic**: Gestiona solo las estadísticas y métricas
- **UserRepository**: Responsable solo del acceso a datos de usuarios

### 2. Principio de Abierto/Cerrado (OCP)
- **ILogic<T>**: Interfaz base que permite extender funcionalidad sin modificar código existente
- **BDRepository<T>**: Clase base que permite añadir nuevos repositorios sin modificar la implementación existente
- **TaskCriteria**: Permite extender los criterios de búsqueda sin modificar la lógica base

### 3. Principio de Sustitución de Liskov (LSP)
- **IRepository<T>**: Implementada por diferentes repositorios manteniendo el contrato base
- **IOperationEntity**: Interfaz base para entidades que permite sustitución segura
- **BaseRepository**: Clase base que puede ser sustituida por implementaciones específicas

### 4. Principio de Segregación de Interfaces (ISP)
- **IChatService**: Interfaz específica para servicios de chat
- **ITaskService**: Interfaz dedicada a operaciones de tareas
- **IUserService**: Interfaz específica para operaciones de usuario

### 5. Principio de Inversión de Dependencias (DIP)
- Inyección de dependencias en constructores:
```csharp
public class ChatLogic : IChatService
{
    private readonly AIService _aiService;
    private readonly ChatRepository _chatRepository;
    
    public ChatLogic(AIService aiService, ChatRepository chatRepository)
    {
        _aiService = aiService;
        _chatRepository = chatRepository;
    }
}
```
- Uso de interfaces para desacoplar capas:
```csharp
public class TaskLogic : ILogic<Task>
{
    private readonly ITaskRepository _taskRepository;
    private readonly ISubTaskLogic _subTaskLogic;
}
```

### Beneficios de la Implementación SOLID
- **Mantenibilidad**: Código más fácil de mantener y modificar
- **Testabilidad**: Componentes aislados facilitan las pruebas unitarias
- **Escalabilidad**: Fácil adición de nuevas funcionalidades
- **Reutilización**: Componentes modulares y reutilizables
- **Flexibilidad**: Cambios en implementaciones sin afectar el sistema

## Requisitos del Sistema
- Windows 10 o superior
- .NET Framework 4.7.2 o superior
- SQL Server Express
- Conexión a Internet (para funcionalidades de IA)

## Instalación
1. Clonar el repositorio:
```bash
git clone https://github.com/tu-usuario/CaptusGUI.git
```

2. Abrir la solución en Visual Studio
3. Restaurar los paquetes NuGet
4. Configurar la cadena de conexión en el archivo de configuración
5. Compilar y ejecutar el proyecto

## Configuración de la IA
Para utilizar el asistente virtual, es necesario configurar la clave de API en el archivo `frmBot.cs`:

```csharp
_aiService = new AIService("TU_CLAVE_API_AQUI");
```

## Implementación de la IA
La integración de la IA en CaptusGUI se realizó siguiendo un enfoque modular y extensible:

### Arquitectura
- **AIService**: Clase principal que maneja la comunicación con el servicio de IA
- **ChatLogic**: Implementa la lógica de procesamiento de mensajes y comandos
- **ChatRepository**: Gestiona el almacenamiento y recuperación de mensajes

### Flujo de Procesamiento
1. **Recepción de Mensajes**:
   - El usuario envía un mensaje a través de la interfaz
   - El mensaje se guarda en la base de datos
   - Se procesa a través de ChatLogic

2. **Procesamiento de Comandos**:
   - Verificación de comandos específicos de tareas
   - Si es un comando válido, se ejecuta la acción correspondiente
   - Si no es un comando, se envía al servicio de IA

3. **Integración con IA**:
   - Uso de API REST para comunicación con el servicio de IA
   - Procesamiento asíncrono de respuestas
   - Manejo de errores y timeouts

4. **Gestión de Respuestas**:
   - Almacenamiento de respuestas en la base de datos
   - Formateo y presentación en la interfaz
   - Manejo de estados de carga y errores

### Características Técnicas
- Implementación asíncrona para mejor rendimiento
- Sistema de caché para respuestas frecuentes
- Manejo de contexto de conversación
- Validación y sanitización de entradas
- Sistema de logging para depuración

### Seguridad
- Validación de claves API
- Sanitización de entradas y salidas
- Protección contra ataques de inyección
- Manejo seguro de sesiones

## Uso del Asistente Virtual
El asistente virtual entiende los siguientes comandos:

- Crear tarea: `crear tarea [título] (para [fecha YYYY-MM-DD])`
- Mostrar tareas: `mostrar mis tareas` o `listar tareas`
- Completar tarea: `completar tarea [título]`
- Eliminar tarea: `eliminar tarea [título]`
- Reprogramar tarea: `reprogramar tarea [título] [fecha YYYY-MM-DD]`

## Características de Seguridad
- Contraseñas encriptadas
- Validación de datos de entrada
- Protección contra inyección SQL
- Sesiones de usuario seguras

## Contribución
1. Fork el proyecto
2. Crear una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir un Pull Request

## Licencia
Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE.md](LICENSE.md) para más detalles.

## Contacto
Tu Nombre - [@tutwitter](https://twitter.com/tutwitter) - email@ejemplo.com

Link del proyecto: [https://github.com/tu-usuario/CaptusGUI](https://github.com/tu-usuario/CaptusGUI)