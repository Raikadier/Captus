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
        private readonly CommandProcessor _commandProcessor;

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
            _commandProcessor = new CommandProcessor();
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
            
            // Procesar comandos utilizando CommandProcessor
            var commandResponse = await _commandProcessor.ProcessCommandAsync(userMessageText);

            if (!string.IsNullOrEmpty(commandResponse) && !commandResponse.StartsWith("Acción no reconocida."))
            {
                 botResponseText = commandResponse;
            }
            else
            {
                // Si no es un comando reconocido por CommandProcessor, obtener respuesta de la IA
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
             // Esta lógica ahora se maneja completamente en CommandProcessor
             response = null; // No se usa en este enfoque
             return false; // Indica que esta lógica no procesó el comando
        }

        private async void SendEmailTaskInsert(ENTITY.Task task)
        {
            // Protección contra null en Category
            string categoryName = task.Category?.Name ?? "General";
            string mensaje = NotifyEmails.GetMessageInsert(task.Title, task.EndDate.ToShortDateString(), categoryName);
            await NotifyEmails.SendNotifyAsync(Session.CurrentUser.Email, "Tu asistente genero una nueva tarea", mensaje);
        }
        private async void SendEmailTaskUpdate(ENTITY.Task task)
        {
            // Protección contra null en Category
            string categoryName = task.Category?.Name ?? "General";
            string mensaje = NotifyEmails.GetMessageUpdate(task.Title, task.EndDate.ToShortDateString(), categoryName);
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