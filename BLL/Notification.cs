using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BLL
{
    public abstract class Notification
    {
        public abstract Task<bool> EnviarAsync(string destino, string asunto, string mensaje);
    }
}
