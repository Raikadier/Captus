using System.Threading.Tasks;
using ENTITY;

namespace BLL
{
    public class NotificationService
    {
        private static NotificationService _instance;

        private NotificationService()
        {
        }

        public static NotificationService Instance
        {
            get
            {
                if (_instance == null)
                    _instance = new NotificationService();
                return _instance;
            }
        }

        public async System.Threading.Tasks.Task SendTaskNotificationAsync(ENTITY.Task task, string action)
        {
            if (Session.CurrentUser == null) return;

            string mensaje = NotifyEmails.GetMessageInsert(task.Title, task.EndDate.ToShortDateString(), task.Category.Name);
            await NotifyEmails.SendNotifyAsync(Session.CurrentUser.Email, $"Tarea {action}", mensaje);
        }

        public async System.Threading.Tasks.Task SendTaskUpdateNotificationAsync(ENTITY.Task task)
        {
            if (Session.CurrentUser == null) return;
            string mensaje = NotifyEmails.GetMessageUpdate(task.Title, task.EndDate.ToShortDateString(), task.Category.Name);
            await NotifyEmails.SendNotifyAsync(Session.CurrentUser.Email, "Tarea actualizada", mensaje);
        }

        public async System.Threading.Tasks.Task SendTaskDeleteNotificationAsync(ENTITY.Task task)
        {
            if (Session.CurrentUser == null) return;
            string mensaje = NotifyEmails.GetMessageDelete(task.Title);
            await NotifyEmails.SendNotifyAsync(Session.CurrentUser.Email, "Tarea eliminada", mensaje);
        }
    }
} 