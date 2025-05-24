using DAL;
using ENTITY;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Task = ENTITY.Task; // Alias para evitar ambigüedad
using BLL; // Añadir esta directiva si es necesario

namespace BLL
{
    public class ChatLogic : IChatService
    {
        private readonly ChatRepository _chatRepository;
        private readonly AIService _aiService;
        private readonly TaskLogic _taskLogic;

        // Constante para los comandos de ayuda
        public const string TaskCommandsHelpText = 
            "Comandos de Tareas:\n" +
            "- Crear tarea: crear tarea [título] (para [fecha YYYY-MM-DD])\n" +
            "- Mostrar tareas: mostrar mis tareas / listar tareas\n" +
            "- Completar tarea: completar tarea [título]\n" +
            "- Eliminar tarea: eliminar tarea [título]\n" +
            "- Reprogramar tarea: reprogramar tarea [título] [fecha YYYY-MM-DD]";

        public ChatLogic(AIService aiService)
        {
            _chatRepository = new ChatRepository();
            _aiService = aiService;
            _taskLogic = new TaskLogic("Server=.\\SQLEXPRESS;Database=Captus;Trusted_Connection=True;");
        }

        public List<ChatMessage> GetAllMessages()
        {
            return _chatRepository.GetAll();
        }

        public async Task<ChatMessage> ProcessUserMessageAsync(string userMessageText, User currentUser)
        {
            // Guardar el mensaje del usuario
            var userMessage = new ChatMessage
            {
                Message = userMessageText,
                SendDate = DateTime.Now,
                IsUserMessage = true,
                User = currentUser
            };
            _chatRepository.Save(userMessage);

            string botResponseText;
            
            // Procesar comandos de tareas
            if (TryProcessTaskCommand(userMessageText, currentUser, out string taskResponse))
            {
                botResponseText = taskResponse;
            }
            else
            {
                // Si no es un comando de tarea, obtener respuesta de la IA
                botResponseText = await _aiService.GetResponseAsync(userMessageText);
            }

            // Guardar el mensaje del bot
            var botMessage = new ChatMessage
            {
                Message = botResponseText,
                SendDate = DateTime.Now,
                IsUserMessage = false,
                User = currentUser
            };
            _chatRepository.Save(botMessage);

            return botMessage;
        }

        private bool TryProcessTaskCommand(string message, User currentUser, out string response)
        {
            response = null;
            message = message.ToLower().Trim();

            // Mensajes de depuración mejorados
            System.Diagnostics.Debug.WriteLine($"[DEBUG - ChatLogic] Intentando procesar comando de tarea: '{message}' (Longitud: {message.Length})");
            System.Diagnostics.Debug.WriteLine($"[DEBUG - ChatLogic] Contiene 'mostrar': {message.Contains("mostrar")}");
            System.Diagnostics.Debug.WriteLine($"[DEBUG - ChatLogic] Contiene 'tareas': {message.Contains("tareas")}");
            System.Diagnostics.Debug.WriteLine($"[DEBUG - ChatLogic] Contiene 'mis tareas': {message.Contains("mis tareas")}");

            try
            {
                // Comandos para crear tareas
                if (message.StartsWith("crear tarea") || message.StartsWith("nueva tarea") || message.StartsWith("crea una tarea"))
                {
                    var parts = message.Split(new[] { ' ' }, StringSplitOptions.RemoveEmptyEntries);
                    if (parts.Length < 3)
                    {
                        response = "Por favor, especifica el título de la tarea. Ejemplo: 'crear tarea Reunión de equipo'";
                        return true;
                    }

                    // Extraer título y fecha
                    string taskTitle = "";
                    DateTime endDate = DateTime.Now.AddDays(7);
                    bool hasDate = false;

                    for (int i = 2; i < parts.Length; i++)
                    {
                        if (parts[i].ToLower() == "para" || parts[i].ToLower() == "el")
                        {
                            // Intentar parsear la fecha
                            string dateStr = string.Join(" ", parts.Skip(i + 1));
                            if (DateTime.TryParse(dateStr, out DateTime parsedDate))
                            {
                                endDate = parsedDate;
                                hasDate = true;
                                break;
                            }
                        }
                        taskTitle += parts[i] + " ";
                    }

                    taskTitle = taskTitle.Trim();

                    var task = new Task
                    {
                        Title = taskTitle,
                        Id_User = currentUser.id,
                        CreationDate = DateTime.Now,
                        EndDate = endDate,
                        State = false,
                        Id_Category = 1, // Asignar la categoría predeterminada (General)
                        Id_Priority = 1  // Asignar la prioridad predeterminada (Baja)
                    };

                    _taskLogic.SaveTask(task);
                    response = $"Tarea '{task.Title}' creada exitosamente" + 
                             (hasDate ? $" para el {endDate:dd/MM/yyyy HH:mm}" : ".");
                    SendEmailTaskInsert(task);
                    return true;
                }

                // Comandos para listar tareas
                if (message.Contains("listar") && (message.Contains("tareas") || message.Contains("pendientes")) ||
                    message.Contains("mostrar") && (message.Contains("tareas") || message.Contains("mis tareas")) ||
                    message.Contains("cuales son") && message.Contains("tareas"))
                {
                    System.Diagnostics.Debug.WriteLine($"[DEBUG - ChatLogic] Comando de listar tareas reconocido!");
                    var criteria = new ENTITY.TaskCriteria();
                    var tasks = _taskLogic.GetTasks(currentUser.id, criteria);
                    
                    System.Diagnostics.Debug.WriteLine($"[DEBUG - ChatLogic] Número de tareas encontradas: {tasks?.Count ?? 0}");
                    
                    if (!tasks.Any())
                    {
                        response = "No tienes tareas pendientes.";
                        return true;
                    }

                    response = "Tus tareas:\n" + string.Join("\n", tasks.Select(t => 
                        $"- {t.Title} (Estado: {(t.State ? "Completada" : "Pendiente")}, Fecha límite: {t.EndDate:dd/MM/yyyy})"));
                    return true;
                }

                // Comandos para completar tareas
                if (message.StartsWith("completar tarea") || message.StartsWith("marcar tarea"))
                {
                    var parts = message.Split(new[] { ' ' }, StringSplitOptions.RemoveEmptyEntries);
                    if (parts.Length < 3)
                    {
                        response = "Por favor, especifica el título de la tarea a completar.";
                        return true;
                    }

                    var taskTitle = string.Join(" ", parts.Skip(2));
                    var tasks = _taskLogic.GetTasks(currentUser.id, new ENTITY.TaskCriteria { SearchText = taskTitle });
                    
                    if (!tasks.Any())
                    {
                        response = $"No se encontró la tarea '{taskTitle}'.";
                        return true;
                    }

                    var task = tasks.First();
                    task.State = true;
                    _taskLogic.UpdateTask(task);
                    response = $"Tarea '{task.Title}' marcada como completada.";
                    return true;
                }

                // Comandos para eliminar tareas
                if (message.StartsWith("eliminar tarea") || message.StartsWith("borrar tarea"))
                {
                    var parts = message.Split(new[] { ' ' }, StringSplitOptions.RemoveEmptyEntries);
                    if (parts.Length < 3)
                    {
                        response = "Por favor, especifica el título de la tarea a eliminar.";
                        return true;
                    }

                    var taskTitle = string.Join(" ", parts.Skip(2));
                    var tasks = _taskLogic.GetTasks(currentUser.id, new ENTITY.TaskCriteria { SearchText = taskTitle });
                    
                    if (!tasks.Any())
                    {
                        response = $"No se encontró la tarea '{taskTitle}'.";
                        return true;
                    }

                    var task = tasks.First();
                    _taskLogic.DeleteTask(task.Id_Task);
                    response = $"Tarea '{task.Title}' eliminada exitosamente.";
                    SendEmailTaskDelete(task);
                    return true;
                }

                // Comandos para reprogramar tareas
                if (message.StartsWith("reprogramar tarea") || message.StartsWith("cambiar fecha"))
                {
                    var parts = message.Split(new[] { ' ' }, StringSplitOptions.RemoveEmptyEntries);
                    if (parts.Length < 4)
                    {
                        response = "Por favor, especifica el título de la tarea y la nueva fecha. Ejemplo: 'reprogramar tarea Reunión de equipo 2024-03-20'";
                        return true;
                    }

                    var taskTitle = string.Join(" ", parts.Skip(2).Take(parts.Length - 3));
                    var newDateStr = parts.Last();
                    
                    if (!DateTime.TryParse(newDateStr, out DateTime newDate))
                    {
                        response = "Por favor, especifica una fecha válida en formato YYYY-MM-DD.";
                        return true;
                    }

                    var tasks = _taskLogic.GetTasks(currentUser.id, new ENTITY.TaskCriteria { SearchText = taskTitle });
                    
                    if (!tasks.Any())
                    {
                        response = $"No se encontró la tarea '{taskTitle}'.";
                        return true;
                    }

                    var task = tasks.First();
                    _taskLogic.RescheduleTask(task.Id_Task, newDate);
                    response = $"Tarea '{task.Title}' reprogramada para el {newDate:dd/MM/yyyy}.";
                    SendEmailTaskUpdate(task);
                    return true;
                }

                // Si ningún comando de tarea coincide
                System.Diagnostics.Debug.WriteLine($"[DEBUG - ChatLogic] Ningún comando de tarea reconocido para: {message}");
                return false;
            }
            catch (Exception ex)
            {
                response = $"Error al procesar el comando: {ex.Message}";
                System.Diagnostics.Debug.WriteLine($"[DEBUG - ChatLogic] Error al procesar comando '{message}': {ex.Message}");
                return true;
            }
        }
        private async void SendEmailTaskInsert(ENTITY.Task task)
        {
            string mensaje = NotifyEmails.GetMessageInsert(task.Title, task.EndDate.ToShortDateString(), task.Category.Name);
            await NotifyEmails.SendNotifyAsync(Session.CurrentUser.Email, "Tu asistente genero una nueva tarea", mensaje);
        }
        private async void SendEmailTaskUpdate(ENTITY.Task task)
        {
            string mensaje = NotifyEmails.GetMessageUpdate(task.Title, task.EndDate.ToShortDateString(), task.Category.Name);
            await NotifyEmails.SendNotifyAsync(Session.CurrentUser.Email, "Tu asistente actualizo una tarea", mensaje);
        }
        private async void SendEmailTaskDelete(ENTITY.Task task)
        {
            string mensaje = NotifyEmails.GetMessageDelete(task.Title);
            await NotifyEmails.SendNotifyAsync(Session.CurrentUser.Email, "Tu asistente elimino una tarea", mensaje);
        }
        public bool DeleteMessage(int messageId, string username, string password)
        {
            // Validar credenciales antes de eliminar
            if (_chatRepository.ValidateUserCredentials(username, password))
            {
                return _chatRepository.Delete(messageId);
            }
            return false;
        }

        // Implementación del método de la interfaz
        public string GetTaskCommandsHelpText()
        {
            return TaskCommandsHelpText;
        }
    }
} 