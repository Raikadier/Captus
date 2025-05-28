using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Mail;
using System.Net;
using System.Text;
using System.Threading.Tasks;

namespace BLL
{
    public class EmailNotification : Notification
    {
        private const string Remitente = "captusupc07@gmail.com";
        private const string NombreRemitente = "CAPTUS Notificaciones";
        private const string ClaveApp = "qguo vidf kanr amvg";

        public override async Task<bool> EnviarAsync(string correoDestino, string asunto, string mensaje)
        {
            try
            {
                var mail = new MailMessage();
                mail.From = new MailAddress(Remitente, NombreRemitente);
                mail.To.Add(correoDestino);
                mail.Subject = asunto;
                mail.Body = mensaje;

                var smtp = new SmtpClient("smtp.gmail.com", 587)
                {
                    Credentials = new NetworkCredential(Remitente, ClaveApp),
                    EnableSsl = true
                };

                await smtp.SendMailAsync(mail);
                return true;
            }
            catch
            {
                return false;
            }
        }
    }
}
