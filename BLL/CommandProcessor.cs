using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;
using ENTITY;
using System.Text.Json;
using System.Threading.Tasks;
using System.Text;

namespace BLL
{
    public interface ICommand
    {
        string Name { get; }
        string Description { get; }
        string Pattern { get; }
        bool Matches(string input);
        Task<string> Execute(string input);
    }

    public class Command : ICommand
    {
        public string Name { get; }
        public string Description { get; }
        public string Pattern { get; }
        private readonly Func<string, Task<string>> _handler;

        public Command(string name, string description, string pattern, Func<string, Task<string>> handler)
        {
            Name = name;
            Description = description;
            Pattern = pattern;
            _handler = handler;
        }

        public bool Matches(string input)
        {
            return Regex.IsMatch(input, Pattern, RegexOptions.IgnoreCase);
        }

        public async Task<string> Execute(string input)
        {
            return await _handler(input);
        }
    }

    public class CommandProcessor
    {
        private readonly List<ICommand> _commands;
        private const string CAPTUS_PATTERN = @"@[Cc]aptus\s+";
        private readonly AIService _aiService;
        private readonly TaskLogic _taskLogic;
        private readonly NotificationService _notificationService;

        public CommandProcessor()
        {
            _commands = new List<ICommand>();
            _aiService = new AIService(ENTITY.Configuration.OpenRouterKey ?? "");
            _taskLogic = new TaskLogic();
            _notificationService = NotificationService.Instance;
            InitializeCommands();
        }

        private void InitializeCommands()
        {
            _commands.Add(new Command(
                "Crear Tarea",
                "Crea una nueva tarea",
                @"crear\s+tarea\s+(.+?)(?:\s+descripción\s+(.+?))?(?:\s+para\s+(.+?))?(?:\s+prioridad\s+(.+?))?(?:\s+categoría\s+(.+?))?$",
                HandleCreateTask
            ));

            _commands.Add(new Command(
                "Actualizar Tarea",
                "Actualiza una tarea existente",
                @"actualizar\s+tarea\s+(\d+)(?:\s+título\s+(.+?))?(?:\s+descripción\s+(.+?))?(?:\s+para\s+(.+?))?(?:\s+prioridad\s+(.+?))?(?:\s+categoría\s+(.+?))?$",
                HandleUpdateTask
            ));

            _commands.Add(new Command(
                "Eliminar Tarea",
                "Elimina una tarea",
                @"eliminar\s+tarea\s+(\d+)$",
                HandleDeleteTask
            ));

            _commands.Add(new Command(
                "Consultar Tareas",
                "Muestra las tareas",
                @"(?:mostrar|consultar|ver)\s+tareas(?:\s+(.+))?$",
                (input) => System.Threading.Tasks.Task.FromResult(HandleListTasks(input))
            ));

            // Comandos de notas
            _commands.Add(new Command(
                "Calcular Nota",
                "Calcula la nota final de una materia",
                @"calcular\s+nota\s+(.+?)(?:\s+con\s+(.+))?$",
                (input) => System.Threading.Tasks.Task.FromResult(HandleCalculateGrade(input))
            ));

            _commands.Add(new Command(
                "Calcular Promedio",
                "Calcula el promedio semestral o acumulado",
                @"calcular\s+promedio\s+(?:semestral|acumulado)$",
                (input) => System.Threading.Tasks.Task.FromResult(HandleCalculateAverage(input))
            ));
        }

        public async Task<string> ProcessCommandAsync(string input)
        {
            if (string.IsNullOrWhiteSpace(input))
                return "Por favor, ingrese un comando válido.";

            // Si no es un comando @Captus, intentar procesar como comando normal
            if (!input.StartsWith("@", StringComparison.OrdinalIgnoreCase))
            {
                var command = _commands.FirstOrDefault(c => c.Matches(input));
                if (command != null)
                {
                    return await command.Execute(input);
                }
            }

            // Procesar con IA
            try
            {
                var aiResponse = await _aiService.GetResponseAsync(input);
                if (string.IsNullOrWhiteSpace(aiResponse))
                    return "No se pudo procesar la solicitud.";

                // Intentar parsear la respuesta como JSON
                try
                {
                    var doc = JsonDocument.Parse(aiResponse);
                    var root = doc.RootElement;

                    // Si la IA responde con 'pregunta', mostrarla directamente al usuario
                    if (root.TryGetProperty("pregunta", out var preguntaProp))
                    {
                        var pregunta = preguntaProp.GetString();
                        if (!string.IsNullOrWhiteSpace(pregunta))
                            return pregunta;
                    }

                    // Si la IA responde con 'error', mostrarlo directamente al usuario
                    if (root.TryGetProperty("error", out var errorProp))
                    {
                        var error = errorProp.GetString();
                        if (!string.IsNullOrWhiteSpace(error))
                            return error;
                    }

                    string accion = root.TryGetProperty("accion", out var acc) ? acc.GetString() : null;

                    if (string.IsNullOrEmpty(accion))
                        return "No pude entender qué acción deseas realizar. Por favor, intenta ser más específico.";

                    switch (accion)
                    {
                        case "crear_tarea":
                            return await HandleCreateTaskFromJson(root.ToString());
                        case "actualizar_tarea":
                            return await HandleUpdateTaskFromJson(root.ToString());
                        case "eliminar_tarea":
                            return await HandleDeleteTaskFromJson(root.ToString());
                        case "consultar_tareas":
                            return HandleListTasks(input);
                        default:
                            return "Acción no reconocida.";
                    }
                }
                catch (JsonException)
                {
                    // Si no es JSON válido, devolvemos un mensaje que incluye el contenido crudo recibido.
                    return $"Error: La IA no devolvió un JSON válido para procesar el comando. Contenido recibido: \n{aiResponse}";
                }
            }
            catch (Exception ex)
            {
                return $"Error al procesar la solicitud: {ex.Message}";
            }
        }

        private async Task<string> HandleCreateTaskFromJson(string json)
        {
            try
            {
                if (Session.CurrentUser == null)
                    return "Error: No hay una sesión de usuario activa.";

                var doc = JsonDocument.Parse(json);
                var root = doc.RootElement;
                
                string titulo = root.TryGetProperty("titulo", out var t) ? t.GetString() : null;
                string descripcion = root.TryGetProperty("descripcion", out var d) ? d.GetString() : null;
                string prioridadTexto = root.TryGetProperty("prioridad", out var p) ? p.GetString() : "Normal";
                string categoriaTexto = root.TryGetProperty("categoria", out var c) ? c.GetString() : "General";
                DateTime fecha = root.TryGetProperty("fecha", out var f) ? f.GetDateTime() : DateTime.Now.AddDays(7);

                ENTITY.Task nuevaTarea;
                var resultado = _taskLogic.CreateAndSaveTask(
                    titulo, descripcion, fecha, prioridadTexto, categoriaTexto, 
                    Session.CurrentUser, out nuevaTarea);

                if (resultado.Success)
                {
                    await _notificationService.SendTaskNotificationAsync(nuevaTarea, "create");
                    Console.WriteLine($"Tarea creada exitosamente: {titulo}");
                    return $"✅ Tarea creada exitosamente: {titulo}";
                }
                else
                {
                    Console.WriteLine($"Error al crear tarea: {resultado.Message}");
                    return $"❌ Error al crear tarea: {resultado.Message}";
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error al procesar comando JSON: {ex.Message}");
                return $"❌ Error al procesar el comando: {ex.Message}";
            }
        }

        private async Task<string> HandleUpdateTaskFromJson(string json)
        {
            try
            {
                if (Session.CurrentUser == null)
                    return "Error: No hay una sesión de usuario activa.";

                var doc = JsonDocument.Parse(json);
                var root = doc.RootElement;

                if (!root.TryGetProperty("id", out var idProp) || !int.TryParse(idProp.GetString(), out int taskId))
                    return "Error: ID de tarea no válido.";

                var tarea = _taskLogic.GetById(taskId);
                if (tarea == null)
                    return "Error: Tarea no encontrada.";

                if (root.TryGetProperty("titulo", out var t)) tarea.Title = t.GetString();
                if (root.TryGetProperty("descripcion", out var d)) tarea.Description = d.GetString();
                if (root.TryGetProperty("fecha", out var f)) tarea.EndDate = f.GetDateTime();
                if (root.TryGetProperty("prioridad", out var p)) tarea.Priority = new Priority { Name = p.GetString() };
                if (root.TryGetProperty("categoria", out var c)) tarea.Category = new Category { Name = c.GetString() };

                var resultado = _taskLogic.Update(tarea);
                if (resultado.Success)
                {
                    await _notificationService.SendTaskNotificationAsync(tarea, "update");
                    Console.WriteLine($"Tarea actualizada exitosamente: {tarea.Title}");
                    return $"✅ Tarea actualizada exitosamente: {tarea.Title}";
                }
                else
                {
                    Console.WriteLine($"Error al actualizar tarea: {resultado.Message}");
                    return $"❌ Error al actualizar tarea: {resultado.Message}";
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error al procesar comando JSON: {ex.Message}");
                return $"❌ Error al procesar el comando: {ex.Message}";
            }
        }

        private async Task<string> HandleDeleteTaskFromJson(string json)
        {
            try
            {
                if (Session.CurrentUser == null)
                    return "Error: No hay una sesión de usuario activa.";

                var doc = JsonDocument.Parse(json);
                var root = doc.RootElement;

                if (!root.TryGetProperty("id", out var idProp) || !int.TryParse(idProp.GetString(), out int taskId))
                    return "Error: ID de tarea no válido.";

                var tarea = _taskLogic.GetById(taskId);
                if (tarea == null)
                    return "Error: Tarea no encontrada.";

                var resultado = _taskLogic.Delete(taskId);
                if (resultado.Success)
                {
                    await _notificationService.SendTaskNotificationAsync(tarea, "delete");
                    Console.WriteLine($"Tarea eliminada exitosamente: {tarea.Title}");
                    return $"✅ Tarea eliminada exitosamente: {tarea.Title}";
                }
                else
                {
                    Console.WriteLine($"Error al eliminar tarea: {resultado.Message}");
                    return $"❌ Error al eliminar tarea: {resultado.Message}";
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error al procesar comando JSON: {ex.Message}");
                return $"❌ Error al procesar el comando: {ex.Message}";
            }
        }

        private string HandleListTasks(string input)
        {
            try
            {
                if (Session.CurrentUser == null)
                    return "Error: No hay una sesión de usuario activa.";

                // Se mantiene el filtro básico si se proporciona texto adicional, 
                // aunque la implementación detallada dependerá de TaskLogic.GetTasks
                var match = Regex.Match(input, @"(?:mostrar|consultar|ver)\s+tareas(?:\s+(.+))?$", RegexOptions.IgnoreCase);
                string filtro = match.Groups[1].Success ? match.Groups[1].Value.Trim() : null; // Usar null si no hay filtro

                // Si hay filtro, pasarlo a GetTasks; de lo contrario, obtener todas
                var tasks = string.IsNullOrEmpty(filtro)
                    ? _taskLogic.GetTasks(Session.CurrentUser.id, new ENTITY.TaskCriteria())
                    : _taskLogic.GetTasks(Session.CurrentUser.id, new ENTITY.TaskCriteria { SearchText = filtro });


                if (tasks == null || !tasks.Any())
                {
                    return "No tienes tareas pendientes o no se encontraron tareas con ese filtro.";
                }

                var sb = new StringBuilder();
                sb.AppendLine("📋 Tus tareas:");
                sb.AppendLine(); // Línea en blanco para mejor formato

                foreach (var task in tasks)
                {
                    sb.AppendLine($"  ID: {task.Id_Task}");
                    sb.AppendLine($"  Título: {task.Title ?? "Sin título"}");
                    sb.AppendLine($"  Descripción: {task.Description ?? "Sin descripción"}");
                    sb.AppendLine($"  Fecha Límite: {task.EndDate:dd/MM/yyyy}");
                    // Asegurarse de cargar Priority y Category si no están ya cargados
                    // Aunque TaskLogic.GetTasks debería cargarlos, es bueno tener precaución
                    string prioridad = task.Priority?.Name ?? GetPriorityName(task.Id_Priority);
                    string categoria = task.Category?.Name ?? GetCategoryName(task.Id_Category);
                    sb.AppendLine($"  Prioridad: {prioridad}");
                    sb.AppendLine($"  Categoría: {categoria}");
                    sb.AppendLine($"  Estado: {(task.State ? "Completada ✅" : "Pendiente ⏳")}");
                    sb.AppendLine(); // Línea en blanco entre tareas
                }

                return sb.ToString();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error al consultar las tareas: {ex.Message}");
                return $"❌ Error al consultar las tareas: {ex.Message}";
            }
        }

        private string GetPriorityName(int priority)
        {
            switch (priority)
            {
                case 3:
                    return "Alta";
                case 2:
                    return "Media";
                case 1:
                    return "Baja";
                default:
                    return "Media";
            }
        }

        private string GetCategoryName(int category)
        {
            switch (category)
            {
                case 2:
                    return "Universidad";
                case 3:
                    return "Trabajo";
                case 4:
                    return "Personal";
                default:
                    return "Personal";
            }
        }

        private async System.Threading.Tasks.Task<string> HandleCreateTask(string input)
        {
            try
            {
                if (Session.CurrentUser == null)
                    return "Error: No hay una sesión de usuario activa.";

                var match = Regex.Match(input, @"crear\s+tarea\s+(.+?)(?:\s+descripción\s+(.+?))?(?:\s+para\s+(.+?))?(?:\s+prioridad\s+(.+?))?(?:\s+categoría\s+(.+?))?$", RegexOptions.IgnoreCase);

                if (!match.Success || string.IsNullOrWhiteSpace(match.Groups[1].Value))
                {
                    return "Error: Formato incorrecto para crear tarea. Asegúrate de incluir al menos el título.";
                }

                string titulo = match.Groups[1].Value.Trim();
                string descripcion = match.Groups[2].Success ? match.Groups[2].Value.Trim() : null;
                string fechaStr = match.Groups[3].Success ? match.Groups[3].Value.Trim() : null;
                string prioridadTexto = match.Groups[4].Success ? match.Groups[4].Value.Trim() : "media";
                string categoriaTexto = match.Groups[5].Success ? match.Groups[5].Value.Trim() : "personal";

                DateTime fecha = DateTime.Now.AddDays(7); // Valor por defecto
                if (!string.IsNullOrWhiteSpace(fechaStr))
                {
                    if (!DateTime.TryParse(fechaStr, out fecha))
                    {
                        return "Error: Formato de fecha inválido. Usa yyyy-mm-dd.";
                    }
                }

                var taskLogic = new TaskLogic();
                ENTITY.Task nuevaTarea;
                var result = taskLogic.CreateAndSaveTask(
                    titulo,
                    descripcion,
                    fecha,
                    prioridadTexto,
                    categoriaTexto,
                    Session.CurrentUser,
                    out nuevaTarea
                );

                if (result.Success)
                {
                    await NotificationService.Instance.SendTaskNotificationAsync(nuevaTarea, "creada");
                    return $"✅ Tarea '{nuevaTarea.Title}' creada exitosamente.";
                }
                else
                {
                    return $"❌ Error al crear la tarea: {result.Message}";
                }
            }
            catch (Exception ex)
            {
                return $"❌ Error inesperado al procesar el comando crear tarea: {ex.Message}";
            }
        }

        private async System.Threading.Tasks.Task<string> HandleUpdateTask(string input)
         {
            try
            {
                if (Session.CurrentUser == null)
                    return "Error: No hay una sesión de usuario activa.";

                var match = Regex.Match(input, @"actualizar\s+tarea\s+(\d+)(?:\s+título\s+(.+?))?(?:\s+descripción\s+(.+?))?(?:\s+para\s+(.+?))?(?:\s+prioridad\s+(.+?))?(?:\s+categoría\s+(.+?))?$", RegexOptions.IgnoreCase);

                if (!match.Success || !int.TryParse(match.Groups[1].Value, out int taskId))
                {
                    return "Error: Formato incorrecto para actualizar tarea. Asegúrate de incluir el ID y al menos un campo a modificar.";
                }

                var taskLogic = new TaskLogic();
                var tareaActualizar = taskLogic.GetById(taskId);

                if (tareaActualizar == null)
                {
                    return $"Error: Tarea con ID {taskId} no encontrada.";
                }

                // Extraer y asignar campos opcionales si están presentes
                if (match.Groups[2].Success) tareaActualizar.Title = match.Groups[2].Value.Trim();
                if (match.Groups[3].Success) tareaActualizar.Description = match.Groups[3].Value.Trim();

                if (match.Groups[4].Success)
                {
                    if (DateTime.TryParse(match.Groups[4].Value.Trim(), out DateTime newDate))
                    {
                        tareaActualizar.EndDate = newDate;
                    }
                    else
                    {
                        return "Error: Formato de fecha inválido para actualizar. Usa yyyy-mm-dd.";
                    }
                }

                if (match.Groups[5].Success)
                {
                    string prioridadTexto = match.Groups[5].Value.Trim();
                    var priorityService = new PriorityLogic();
                    var prioridad = priorityService.GetAll().FirstOrDefault(p => p.Name.ToLower() == prioridadTexto.ToLower());
                    if (prioridad != null) tareaActualizar.Priority = prioridad;
                    else return $"Error: Prioridad '{prioridadTexto}' no encontrada.";
                }

                if (match.Groups[6].Success)
                {
                    string categoriaTexto = match.Groups[6].Value.Trim();
                    var categoryService = new CategoryLogic();
                    var categoria = categoryService.GetAll().FirstOrDefault(c => c.Name.ToLower() == categoriaTexto.ToLower());
                    if (categoria != null) tareaActualizar.Category = categoria;
                    else return $"Error: Categoría '{categoriaTexto}' no encontrada.";
                }

                // Si no se especificó ningún campo opcional, no hay nada que actualizar
                if (!match.Groups[2].Success && !match.Groups[3].Success && !match.Groups[4].Success && !match.Groups[5].Success && !match.Groups[6].Success)
                {
                     return "Advertencia: No se especificaron campos para actualizar.";
                }

                var result = taskLogic.Update(tareaActualizar);

                if (result.Success)
                {
                    await NotificationService.Instance.SendTaskUpdateNotificationAsync(tareaActualizar);
                    return $"✅ Tarea '{tareaActualizar.Title}' ({tareaActualizar.Id_Task}) actualizada exitosamente.";
                }
                else
                {
                    return $"❌ Error al actualizar la tarea: {result.Message}";
                }
            }
            catch (Exception ex)
            {
                return $"❌ Error inesperado al procesar el comando actualizar tarea: {ex.Message}";
            }
        }

        private async System.Threading.Tasks.Task<string> HandleDeleteTask(string input)
        {
            try
            {
                if (Session.CurrentUser == null)
                    return "Error: No hay una sesión de usuario activa.";

                var match = Regex.Match(input, @"eliminar\s+tarea\s+(\d+)$");

                if (!match.Success || !int.TryParse(match.Groups[1].Value, out int taskId))
                {
                    return "Error: Formato incorrecto para eliminar tarea. Asegúrate de incluir el ID de la tarea.";
                }

                var taskLogic = new TaskLogic();
                var tareaEliminada = taskLogic.GetById(taskId);

                if (tareaEliminada == null)
                {
                    return $"Error: Tarea con ID {taskId} no encontrada.";
                }

                var result = taskLogic.Delete(taskId);

                if (result.Success)
                {
                    await NotificationService.Instance.SendTaskDeleteNotificationAsync(tareaEliminada);
                    return $"✅ Tarea '{tareaEliminada.Title}' ({tareaEliminada.Id_Task}) eliminada exitosamente.";
                }
                else
                {
                    return $"❌ Error al eliminar la tarea: {result.Message}";
                }
            }
            catch (Exception ex)
            {
                return $"❌ Error inesperado al procesar el comando eliminar tarea: {ex.Message}";
            }
        }

        private string HandleCalculateGrade(string input)
        {
            // Implementar lógica de cálculo de nota
            return "Funcionalidad de calcular nota aún no implementada completamente.";
        }

        private string HandleCalculateAverage(string input)
        {
            // Implementar lógica de cálculo de promedio
            return "Funcionalidad de calcular promedio aún no implementada completamente.";
        }

        private (string titulo, DateTime fecha, int prioridad, int categoria) ParseTaskInput(string input)
        {
            string titulo = input;
            DateTime fecha = DateTime.Now.AddDays(7);
            int prioridad = 1;
            int categoria = 1;

            var match = Regex.Match(input, @"(.+?)(?:\s+para\s+(.+))?$");
            if (match.Success)
            {
                titulo = match.Groups[1].Value.Trim();
                if (match.Groups[2].Success)
                {
                    string fechaStr = match.Groups[2].Value.Trim();
                    if (DateTime.TryParse(fechaStr, out DateTime parsedFecha))
                    {
                        fecha = parsedFecha;
                    }
                }
            }

            return (titulo, fecha, prioridad, categoria);
        }

        public List<string> GetAvailableCommands()
        {
            return _commands.Select(c => $"{c.Name}: {c.Description}").ToList();
        }
    }
} 