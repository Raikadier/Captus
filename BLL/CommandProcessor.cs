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
        private readonly TaskService _taskService;

        public CommandProcessor()
        {
            _commands = new List<ICommand>();
            _aiService = new AIService(ENTITY.Configuration.OpenRouterKey ?? "");
            _taskService = new TaskService();
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

            // Remover el prefijo @Captus si existe
            input = Regex.Replace(input, CAPTUS_PATTERN, "", RegexOptions.IgnoreCase).Trim();

            // Intentar procesar como comando directo primero
            var command = _commands.FirstOrDefault(c => c.Matches(input));
            if (command != null)
            {
                return await command.Execute(input);
            }

            // Si no es un comando directo, procesar con IA
            try
            {
                var aiResponse = await _aiService.GetResponseAsync(input);
                if (string.IsNullOrWhiteSpace(aiResponse))
                    return "No se pudo procesar la solicitud.";

                return await ProcessAIResponse(aiResponse);
            }
            catch (Exception ex)
            {
                return $"Error al procesar la solicitud: {ex.Message}";
            }
        }

        private async Task<string> ProcessAIResponse(string aiResponse)
        {
            // Extraer el bloque JSON si está envuelto en markdown
            string jsonContent = ExtractJsonFromMarkdown(aiResponse);

            // Si no se encontró un bloque JSON y la respuesta original no parece JSON, devolver la respuesta directamente
            if (string.IsNullOrEmpty(jsonContent) && !aiResponse.TrimStart().StartsWith("{"))
                return aiResponse;

            // Usar el contenido JSON extraído o la respuesta original si no había markdown
            string responseToParse = string.IsNullOrEmpty(jsonContent) ? aiResponse : jsonContent;

            try
            {
                var doc = JsonDocument.Parse(responseToParse);
                var root = doc.RootElement;

                // Manejar respuestas directas (pregunta, error)
                if (root.TryGetProperty("mensaje_error", out var errorProp) && !string.IsNullOrWhiteSpace(errorProp.GetString()))
                    return $"❌ {errorProp.GetString()}"; // Mostrar errores con un prefijo

                if (root.TryGetProperty("pregunta", out var preguntaProp) && !string.IsNullOrWhiteSpace(preguntaProp.GetString()))
                     return $"❓ {preguntaProp.GetString()}"; // Mostrar preguntas con un prefijo

                // Procesar acciones
                string accion = root.TryGetProperty("accion", out var acc) ? acc.GetString() : null;
                if (string.IsNullOrEmpty(accion))
                    return "❓ No pude entender qué acción deseas realizar. Por favor, intenta ser más específico.";

                string resultMessage = "⚠️ Acción no reconocida.";
                switch (accion)
                {
                    case "crear_tarea":
                        resultMessage = await HandleCreateTaskFromJson(responseToParse);
                        break;
                    case "actualizar_tarea":
                        resultMessage = await HandleUpdateTaskFromJson(responseToParse);
                        break;
                    case "eliminar_tarea":
                        resultMessage = await HandleDeleteTaskFromJson(responseToParse);
                        break;
                    case "consultar_tareas":
                        resultMessage = HandleListTasks(responseToParse);
                        break;
                    default:
                        resultMessage = $"⚠️ Acción '{accion}' no implementada aún.";
                        break;
                }

                return resultMessage;
            }
            catch (JsonException)
            {
                return $"❌ Error: La IA no devolvió un JSON válido. Contenido recibido: \n{responseToParse}";
            }
            catch (Exception ex)
            {
                // Capturar cualquier otra excepción durante el procesamiento del JSON
                return $"❌ Error interno al procesar la respuesta de la IA: {ex.Message}";
            }
        }

        // Nuevo método para extraer JSON de bloques markdown
        private string ExtractJsonFromMarkdown(string text)
        {
            var match = Regex.Match(text, @"```json\n([\s\S]*?)\n```");
            if (match.Success)
            {
                return match.Groups[1].Value.Trim();
            }
            return null;
        }

        private async Task<string> HandleCreateTaskFromJson(string json)
        {
            try
            {
                if (Session.CurrentUser == null)
                    return "Error: No hay una sesión de usuario activa.";

                var doc = JsonDocument.Parse(json);
                var root = doc.RootElement;
                
                var taskData = new TaskData
                {
                    Titulo = root.TryGetProperty("titulo", out var t) ? t.GetString() : null,
                    Descripcion = root.TryGetProperty("descripcion", out var d) ? d.GetString() : null,
                    PrioridadTexto = root.TryGetProperty("prioridad", out var p) ? p.GetString() : "Normal",
                    CategoriaTexto = root.TryGetProperty("categoria", out var c) ? c.GetString() : "General",
                    Fecha = root.TryGetProperty("fecha", out var f) ? f.GetDateTime() : DateTime.Now.AddDays(7)
                };

                var resultado = await _taskService.CreateTaskAsync(taskData, Session.CurrentUser);
                return resultado.Message;
            }
            catch (Exception ex)
            {
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

                var taskData = new TaskData
                {
                    Titulo = root.TryGetProperty("titulo", out var t) ? t.GetString() : null,
                    Descripcion = root.TryGetProperty("descripcion", out var d) ? d.GetString() : null,
                    PrioridadTexto = root.TryGetProperty("prioridad", out var p) ? p.GetString() : null,
                    CategoriaTexto = root.TryGetProperty("categoria", out var c) ? c.GetString() : null,
                    Fecha = root.TryGetProperty("fecha", out var f) ? f.GetDateTime() : default
                };

                var resultado = await _taskService.UpdateTaskAsync(taskId, taskData);
                return resultado.Message;
            }
            catch (Exception ex)
            {
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

                var resultado = await _taskService.DeleteTaskAsync(taskId);
                return resultado.Message;
            }
            catch (Exception ex)
            {
                return $"❌ Error al procesar el comando: {ex.Message}";
            }
        }

        private string HandleListTasks(string input)
        {
            try
            {
                if (Session.CurrentUser == null)
                    return "Error: No hay una sesión de usuario activa.";

                var match = Regex.Match(input, @"(?:mostrar|consultar|ver)\s+tareas(?:\s+(.+))?$", RegexOptions.IgnoreCase);
                string filtro = match.Groups[1].Success ? match.Groups[1].Value.Trim() : null;

                var criteria = new TaskCriteria { SearchText = filtro };
                var resultado = _taskService.GetTasks(criteria);

                if (!resultado.Success)
                    return resultado.Message;

                var tasks = (List<ENTITY.Task>)resultado.Data;
                if (tasks == null || !tasks.Any())
                    return "No tienes tareas pendientes o no se encontraron tareas con ese filtro.";

                var sb = new StringBuilder();
                sb.AppendLine("📋 Tus tareas:");
                sb.AppendLine();

                foreach (var task in tasks)
                {
                    sb.AppendLine($"  ID: {task.Id_Task}");
                    sb.AppendLine($"  Título: {task.Title ?? "Sin título"}");
                    sb.AppendLine($"  Descripción: {task.Description ?? "Sin descripción"}");
                    sb.AppendLine($"  Fecha Límite: {task.EndDate:dd/MM/yyyy}");
                    sb.AppendLine($"  Prioridad: {task.Priority?.Name ?? GetPriorityName(task.Id_Priority)}");
                    sb.AppendLine($"  Categoría: {task.Category?.Name ?? GetCategoryName(task.Id_Category)}");
                    sb.AppendLine($"  Estado: {(task.State ? "Completada ✅" : "Pendiente ⏳")}");
                    sb.AppendLine();
                }

                return sb.ToString();
            }
            catch (Exception ex)
            {
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