using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Mail;
using System.Net;
using System.Text;
using System.Threading.Tasks;
using System.Threading;

namespace BLL
{
    public static class NotifyEmails
    {
        public static async Task<bool> SendNotifyAsync(string correoDestino, string asunto, string mensaje)
        {
            try
            {
                Console.WriteLine("Enviando correo a: " + correoDestino);
                var mail = new MailMessage();
                mail.From = new MailAddress("captusupc07@gmail.com", "CAPTUS Notificaciones");
                mail.To.Add(correoDestino);
                mail.Subject = asunto;
                mail.Body = mensaje;

                var smtp = new SmtpClient("smtp.gmail.com", 587)
                {
                    Credentials = new NetworkCredential("captusupc07@gmail.com", "qguo vidf kanr amvg"),
                    EnableSsl = true
                };

                await smtp.SendMailAsync(mail);
                return true;
            }
            catch (Exception)
            {
                return false;
            }
        }
        private static readonly List<string> MessageInsert = new List<string>
    {
        "📌 ¡Atención estudiante estrella!\n\nTienes una nueva tarea:\n📝 \"{0}\"\n📅 Fecha límite: {1}\n📁 Categoría: {2}\n\n¡Hora de sacar la capa de superhéroe! 🦸‍♂️\n\n— Con cariño, CAPTUS",
"⚠️ ¡Misión asignada!\n\nNombre en clave: \"{0}\"\nVence el: {1}\nCategoría: {2}\n\nActiva el modo productividad y ¡a triunfar! 🧠🚀\n\n— CAPTUS, tu compañero de batallas",
"💥 ¡Boom! Otra tarea aparece en tu vida:\n\"{0}\"\nFecha límite: {1}\nCategoría: {2}\n\nPero tranquilo, si sobreviviste a parciales, esto es pan comido 😌\n\n— CAPTUS confía en ti",
"🔔 ¡Ding ding! Nueva tarea entrante:\n\n» {0}\nFecha límite: {1}\nCategoría: {2}\n\n¡Conviértela en una victoria más en tu lista! 🏆\n\n— CAPTUS te apoya",
"🎯 ¡Blanco fijado!\n\nTu nueva tarea es:\n» {0}\nFecha límite: {1}\nCategoría: {2}\n\nQue no cunda el pánico... ¡tú puedes con esto! 🧘‍♂️\n\n— CAPTUS contigo hasta el final",
"👨‍💻 ¡Código rojo! Tarea detectada:\n\"{0}\"\nFecha límite: {1}\nCategoría: {2}\n\nNo hay problema que una buena playlist y CAPTUS no puedan resolver 🎧🧠"
    };

        private static readonly List<string> MessageUpdate = new List<string>
    {
        "🛠️ Ajustes aplicados a tu tarea:\n\"{0}\"\nAhora vence el: {1}\nCategoría: {2}\n\nComo diría un profe: '¡esto es para tu bien!' 😅\n\n— CAPTUS te tiene cubierto",
"🧪 ¡Revisión completada!\n\nTu tarea \"{0}\" ha sido modificada:\n📅 Fecha límite: {1}\n📂 Categoría: {2}\n\nMás clara, más fuerte, ¡más tú! 💪\n\n— CAPTUS en modo evolución",
"🧹 ¡Orden y mejora!\n\nTu tarea \"{0}\" ahora se ve mejor:\nNuevo plazo: {1}\nCategoría: {2}\n\n¡Como cuando limpias el escritorio! 😄\n\n— CAPTUS no deja cabos sueltos",
"⚙️ La tarea \"{0}\" ha sido optimizada.\nFecha límite: {1}\nCategoría: {2}\n\nNo te asustes, solo queríamos ponértelo más fácil. 😇\n\n— CAPTUS, tu coach personal",
"🧭 Ajuste de ruta:\n\"{0}\"\nNueva fecha: {1}\nCategoría: {2}\n\nRecuerda: cambiar no es retroceder, es adaptarse. 🌀\n\n— CAPTUS siempre encuentra el camino",
"🎨 Tu tarea \"{0}\" recibió un toque artístico.\nNueva fecha: {1}\nCategoría: {2}\n\n¡Listo para inspirarte otra vez! 🎨✨\n\n— CAPTUS, maestro del estilo"
    };

        private static readonly List<string> MessageDelete = new List<string>
    {
        "🍀 ¡El universo te sonríe!\n\nLa tarea \"{0}\" ha sido eliminada.\n\nGuarda este milagro... vienen tiempos difíciles 😅\n\n— CAPTUS comparte tu alegría",
"🔥 ¡Una menos! La tarea \"{0}\" fue eliminada.\n\nDisfruta tu respiro... o empieza la próxima 😎\n\n— CAPTUS eliminando tus preocupaciones",
"🙌 ¡Respiro divino!\n\nAdiós a la tarea: \"{0}\"\n\nCelebra esta pequeña victoria, ¡te la mereces! 🥳\n\n— CAPTUS se alegra contigo",
"🚫 ¡Tarea eliminada con éxito!\n\n\"{0}\" ha desaparecido de tu radar.\n\nAprovecha este break para ser feliz... o dormir 💤\n\n— CAPTUS, eliminador profesional de pendientes",
"🥷 ¡Eliminación sigilosa completada!\n\nTarea: \"{0}\"\n\nSin huellas, sin estrés. 🕶️\n\n— CAPTUS, ninja de tareas",
"💤 Menos una cosa de qué preocuparse:\n\n\"{0}\"\n\nRelájate, ya hicimos nuestra parte 😉\n\n— CAPTUS al rescate"
    };

        public static string GetMessageInsert(string titulo, string fecha, string categoria)
        {
            string plantilla = MessageInsert[new Random().Next(MessageInsert.Count)];
            return string.Format(plantilla, titulo, fecha, categoria);
        }

        public static string GetMessageUpdate(string titulo, string fecha, string categoria)
        {
            string plantilla = MessageUpdate[new Random().Next(MessageUpdate.Count)];
            return string.Format(plantilla, titulo, fecha, categoria);
        }

        public static string GetMessageDelete(string titulo)
        {
            string plantilla = MessageDelete[new Random().Next(MessageDelete.Count)];
            return string.Format(plantilla, titulo);
        }
    }
}
