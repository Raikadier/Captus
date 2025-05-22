using DAL;
using ENTITY;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace BLL
{
    public class ChatLogic
    {
        private readonly ChatRepository _chatRepository;
        private readonly ChatGPTService _chatGPTService;

        public ChatLogic(ChatGPTService chatGPTService)
        {
            _chatRepository = new ChatRepository();
            _chatGPTService = chatGPTService;
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
                SendDate = System.DateTime.Now,
                IsUserMessage = true,
                User = currentUser
            };
            _chatRepository.Save(userMessage);

            // Obtener respuesta de ChatGPT
            string botResponseText = await _chatGPTService.GetResponseAsync(userMessageText);

            // Guardar el mensaje del bot
            var botMessage = new ChatMessage
            {
                Message = botResponseText,
                SendDate = System.DateTime.Now,
                IsUserMessage = false,
                User = currentUser
            };
            _chatRepository.Save(botMessage);

            return botMessage;
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
    }
} 