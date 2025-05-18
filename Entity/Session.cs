using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Entity
{
    public static class Session
    {
        public static User CurrentUser { get; private set; }

        public static void Start(User user)
        {
            CurrentUser = user;
        }

        public static void End()
        {
            CurrentUser = null;
        }

        public static bool IsAuthenticated => CurrentUser != null;
    }
}
