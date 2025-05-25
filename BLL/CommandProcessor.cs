using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;
using ENTITY;
using System.Text.Json;

namespace BLL
{
    public class CommandProcessor
    {
        private readonly List<ENTITY.Command> _commands;
        private const string CAPTUS_PATTERN = @"@[Cc]aptus\s+";

        // Diccionario para mapear acciones a sus manejadores
        private readonly Dictionary<string, Func<JsonElement, string>> _actionHandlers;

        public CommandProcessor()
        {
            _commands = new List<ENTITY.Command>();
            InitializeCommands();
            
            // Inicializar el diccionario de manejadores de acciones
            _actionHandlers = new Dictionary<string, Func<JsonElement, string>>
            {
                ["crear_tarea"] = HandleCreateTaskFromJson,
                ["eliminar_tarea"] = HandleDeleteTaskFromJson,
                ["actualizar_tarea"] = HandleUpdateTaskFromJson,
                ["consultar_tareas"] = HandleListTasksFromJson
            };
        }

        private void InitializeCommands()
        {
            // Comandos de tareas
            _commands.Add(new ENTITY.Command(
                "Crear Tarea",
                "Crea una nueva tarea",
                @"crear\s+tarea\s+(.+?)(?:\s+para\s+(.+))?$",
                HandleCreateTask
            ));

            _commands.Add(new ENTITY.Command(
                "Actualizar Tarea",
                "Actualiza una tarea existente",
                @"actualizar\s+tarea\s+(\d+)\s+(.+)$",
                HandleUpdateTask
            ));

            _commands.Add(new ENTITY.Command(
                "Eliminar Tarea",
                "Elimina una tarea",
                @"eliminar\s+tarea\s+(\d+)$",
                HandleDeleteTask
            ));

            _commands.Add(new ENTITY.Command(
                "Consultar Tareas",
                "Muestra las tareas",
                @"(?:mostrar|consultar|ver)\s+tareas(?:\s+(.+))?$",
                HandleListTasks
            ));

            // Comandos de notas
            _commands.Add(new ENTITY.Command(
                "Calcular Nota",
                "Calcula la nota final de una materia",
                @"calcular\s+nota\s+(.+?)(?:\s+con\s+(.+))?$",
                HandleCalculateGrade
            ));

            _commands.Add(new ENTITY.Command(
                "Calcular Promedio",
                "Calcula el promedio semestral o acumulado",
                @"calcular\s+promedio\s+(?:semestral|acumulado)$",
                HandleCalculateAverage
            ));
        }

        private string HandleCreateTaskFromJson(JsonElement root)
        {
            try
            {
                // Registrar el JSON recibido para depuración
                System.Diagnostics.Debug.WriteLine($"[DEBUG] JSON recibido para crear tarea: {root}");
                var (titulo, fecha, prioridad, categoria) = ExtractTaskData(root);
                if (string.IsNullOrWhiteSpace(titulo))
                    return "No se pudo extraer el nombre de la tarea. Por favor, intenta ser más específico.";
                if (fecha == default)
                    fecha = DateTime.Now.AddDays(7);
                if (prioridad < 1 || prioridad > 3)
                    prioridad = 1;
                if (categoria < 1)
                    categoria = 1;

                var taskLogic = new TaskLogic();
                var nuevaTarea = new ENTITY.Task
                {
                    Title = titulo,
                    Id_User = Session.CurrentUser.id,
                    CreationDate = DateTime.Now,
                    EndDate = fecha,
                    State = false,
                    Id_Category = categoria,
                    Id_Priority = prioridad
                };
                var result = taskLogic.Save(nuevaTarea);
                if (result.Success)
                    return $"Tarea '{titulo}' creada exitosamente.";
                else
                    return $"No se pudo crear la tarea: {result.Message}";
            }
            catch (Exception ex)
            {
                return $"Error inesperado al crear la tarea: {ex.Message}";
            }
        }

        private string HandleDeleteTaskFromJson(JsonElement root)
        {
            try
            {
                System.Diagnostics.Debug.WriteLine($"[DEBUG] JSON recibido para eliminar tarea: {root}");
                string titulo = root.TryGetProperty("titulo", out var t) ? t.GetString() : null;
                if (string.IsNullOrWhiteSpace(titulo))
                    return "No se pudo extraer el nombre de la tarea a eliminar.";

                var taskLogic = new TaskLogic();
                var tasks = taskLogic.GetTasks(Session.CurrentUser.id, new ENTITY.TaskCriteria { SearchText = titulo });
                if (!tasks.Any())
                    return $"No se encontró la tarea '{titulo}'.";

                var result = taskLogic.Delete(tasks.First().Id_Task);
                if (result.Success)
                    return $"Tarea '{titulo}' eliminada exitosamente.";
                else
                    return $"No se pudo eliminar la tarea: {result.Message}";
            }
            catch (Exception ex)
            {
                return $"Error inesperado al eliminar la tarea: {ex.Message}";
            }
        }

        private string HandleUpdateTaskFromJson(JsonElement root)
        {
            try
            {
                System.Diagnostics.Debug.WriteLine($"[DEBUG] JSON recibido para actualizar tarea: {root}");
                var (titulo, fecha, prioridad, categoria) = ExtractTaskData(root);
                if (string.IsNullOrWhiteSpace(titulo))
                    return "No se pudo extraer el nombre de la tarea a actualizar.";

                var taskLogic = new TaskLogic();
                var tasks = taskLogic.GetTasks(Session.CurrentUser.id, new ENTITY.TaskCriteria { SearchText = titulo });
                if (!tasks.Any())
                    return $"No se encontró la tarea '{titulo}'.";

                var task = tasks.First();
                task.EndDate = fecha == default ? task.EndDate : fecha;
                task.Id_Priority = (prioridad < 1 || prioridad > 3) ? task.Id_Priority : prioridad;
                task.Id_Category = (categoria < 1) ? task.Id_Category : categoria;
                var result = taskLogic.Update(task);
                if (result.Success)
                    return $"Tarea '{titulo}' actualizada exitosamente.";
                else
                    return $"No se pudo actualizar la tarea: {result.Message}";
            }
            catch (Exception ex)
            {
                return $"Error inesperado al actualizar la tarea: {ex.Message}";
            }
        }

        private string HandleListTasksFromJson(JsonElement root)
        {
            try
            {
                System.Diagnostics.Debug.WriteLine($"[DEBUG] JSON recibido para consultar tareas: {root}");
                var taskLogic = new TaskLogic();
                var tasks = taskLogic.GetTasks(Session.CurrentUser.id, new ENTITY.TaskCriteria());
                if (!tasks.Any())
                    return "No tienes tareas pendientes.";

                return "Tus tareas pendientes son:\n" + 
                       string.Join("\n", tasks.Select(t => 
                           $"- {t.Title} (Fecha: {t.EndDate:dd/MM/yyyy}, Prioridad: {t.Id_Priority}, Categoría: {t.Id_Category})"));
            }
            catch (Exception ex)
            {
                return $"Error inesperado al consultar las tareas: {ex.Message}";
            }
        }

        private (string titulo, DateTime fecha, int prioridad, int categoria) ExtractTaskData(JsonElement root)
        {
            string titulo = root.TryGetProperty("titulo", out var t) ? t.GetString() : null;
            string fechaStr = root.TryGetProperty("fecha", out var f) ? f.GetString() : null;
            string prioridadStr = root.TryGetProperty("prioridad", out var p) ? p.GetString() : null;
            string categoriaStr = root.TryGetProperty("categoria", out var c) ? c.GetString() : null;

            DateTime fecha = DateTime.Now.AddDays(7);
            if (!string.IsNullOrWhiteSpace(fechaStr))
                DateTime.TryParse(fechaStr, out fecha);

            int prioridad = 1;
            if (!string.IsNullOrWhiteSpace(prioridadStr))
            {
                prioridad = prioridadStr.ToLower().Contains("alta") ? 3 :
                           prioridadStr.ToLower().Contains("media") ? 2 : 1;
            }

            int categoria = 1;
            if (!string.IsNullOrWhiteSpace(categoriaStr))
            {
                string catName = categoriaStr.ToLower();
                categoria = catName.Contains("uni") ? 2 :
                           catName.Contains("trab") ? 3 :
                           catName.Contains("pers") ? 4 : 1;
            }

            return (titulo, fecha, prioridad, categoria);
        }

        public string ProcessCommand(string input)
        {
            if (string.IsNullOrWhiteSpace(input))
                return "Por favor, ingrese un comando válido.";

            // Verificar si el comando requiere @Captus
            bool requiresCaptus = input.StartsWith("@", StringComparison.OrdinalIgnoreCase);
            string cleanInput = requiresCaptus ? Regex.Replace(input, CAPTUS_PATTERN, "", RegexOptions.IgnoreCase) : input;

            // Intentar procesar comandos tradicionales
            foreach (var command in _commands)
            {
                if (command.RequiresCaptus && !requiresCaptus)
                    continue;

                var match = Regex.Match(cleanInput, command.Pattern, RegexOptions.IgnoreCase);
                if (match.Success)
                {
                    try
                    {
                        command.Handler(match.Groups[1].Value);
                        return $"Comando '{command.Name}' ejecutado correctamente.";
                    }
                    catch (Exception ex)
                    {
                        return $"Error al ejecutar el comando: {ex.Message}";
                    }
                }
            }

            // Si no se reconoce el comando, consultar a la IA
            try
            {
                var aiService = new AIService(ENTITY.Configuration.OpenRouterKey ?? "");
                var aiResponse = aiService.GetResponseAsync(input).GetAwaiter().GetResult();
                
                if (!string.IsNullOrWhiteSpace(aiResponse) && aiResponse.Trim().StartsWith("{"))
                {
                    var doc = System.Text.Json.JsonDocument.Parse(aiResponse);
                    var root = doc.RootElement;
                    string accion = root.TryGetProperty("accion", out var acc) ? acc.GetString() : null;

                    if (accion == "desconocida")
                        return "No se reconoció ninguna acción válida en tu mensaje.";

                    if (_actionHandlers.TryGetValue(accion, out var handler))
                        return handler(root);
                }
            }
            catch (Exception ex)
            {
                return $"Error al analizar el mensaje con IA: {ex.Message}";
            }

            return "Comando no reconocido. Use '@Captus' seguido del comando deseado.";
        }

        public List<ENTITY.Command> GetAvailableCommands()
        {
            return _commands;
        }

        private void HandleCreateTask(string input)
        {
            // Ejemplo de input: "estudiar matemáticas para 2024-05-15 prioridad alta categoría universidad"
            string titulo = "";
            DateTime fecha = DateTime.Now.AddDays(7); // Por defecto, una semana
            int prioridad = 1; // 1: Baja, 2: Media, 3: Alta
            int categoria = 1; // 1: General (por defecto)

            // Buscar fecha (palabra 'para' o 'el' seguida de fecha)
            var fechaMatch = Regex.Match(input, @"(?:para|el)\s+(\d{4}-\d{2}-\d{2})");
            if (fechaMatch.Success && DateTime.TryParse(fechaMatch.Groups[1].Value, out DateTime parsedFecha))
            {
                fecha = parsedFecha;
                input = input.Replace(fechaMatch.Value, "");
            }

            // Buscar prioridad
            if (Regex.IsMatch(input, "prioridad alta", RegexOptions.IgnoreCase))
            {
                prioridad = 3;
                input = Regex.Replace(input, "prioridad alta", "", RegexOptions.IgnoreCase);
            }
            else if (Regex.IsMatch(input, "prioridad media", RegexOptions.IgnoreCase))
            {
                prioridad = 2;
                input = Regex.Replace(input, "prioridad media", "", RegexOptions.IgnoreCase);
            }
            else if (Regex.IsMatch(input, "prioridad baja", RegexOptions.IgnoreCase))
            {
                prioridad = 1;
                input = Regex.Replace(input, "prioridad baja", "", RegexOptions.IgnoreCase);
            }

            // Buscar categoría (palabra 'categoría' o 'categoria' seguida de palabra)
            var catMatch = Regex.Match(input, @"categor[ií]a\s+(\w+)", RegexOptions.IgnoreCase);
            if (catMatch.Success)
            {
                string catName = catMatch.Groups[1].Value.ToLower();
                // Puedes mapear nombres a IDs reales según tus categorías
                if (catName.Contains("uni")) categoria = 2; // Ejemplo: Universidad
                else if (catName.Contains("trab")) categoria = 3; // Trabajo
                else if (catName.Contains("pers")) categoria = 4; // Personal
                else categoria = 1; // General
                input = input.Replace(catMatch.Value, "");
            }

            // El resto es el título
            titulo = input.Trim();
            if (string.IsNullOrEmpty(titulo))
                throw new Exception("El título de la tarea no puede estar vacío.");

            var taskLogic = new TaskLogic();
            var nuevaTarea = new ENTITY.Task
            {
                Title = titulo,
                Id_User = Session.CurrentUser.id,
                CreationDate = DateTime.Now,
                EndDate = fecha,
                State = false,
                Id_Category = categoria,
                Id_Priority = prioridad
            };
            taskLogic.SaveTask(nuevaTarea);
        }

        private void HandleUpdateTask(string input)
        {
            // Implementar lógica de actualización de tarea
        }

        private void HandleDeleteTask(string input)
        {
            // Implementar lógica de eliminación de tarea
        }

        private void HandleListTasks(string input)
        {
            // Implementar lógica de listado de tareas
        }

        private void HandleCalculateGrade(string input)
        {
            // Implementar lógica de cálculo de nota
        }

        private void HandleCalculateAverage(string input)
        {
            // Implementar lógica de cálculo de promedio
        }
    }
} 