using ENTITY;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace BLL
{
    public interface IChatService
    {
        List<ChatMessage> GetAllMessages();
        Task<ChatMessage> ProcessUserMessageAsync(string userMessageText, User currentUser);
        string GetTaskCommandsHelpText();
    }
} 