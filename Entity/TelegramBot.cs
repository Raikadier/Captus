using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Entity
{
    public class TelegramBot
    {
        public User User { get; set; }
        public string Token { get; set; }
        public string ChatId { get; set; }

        public TelegramBot()
        {
        }
        public TelegramBot(User user, string token, string chatId)
        {
            User = user;
            Token = token;
            ChatId = chatId;
        }
    }
}
