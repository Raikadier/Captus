using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Entity
{
    public class Notifications: ClassId
    {

        public DateTime SendDate{ get; set; }
        public string Message { get; set; }
        public Task Task { get; set; }
        public User User { get; set; }
        public Notifications()
        {
            //SendDate = DateTime.Now;
        }
        public Notifications(int id, DateTime sendDate, string message, Task task, User user)
        {
            this.id = id;
            this.SendDate = sendDate;
            this.Message = message;
            this.Task = task;
            this.User = user;
        }
        public override SqlCommand SQLCommandInsert(SqlConnection connection)
        {
            string ssql = "INSERT INTO [dbo].[Notification]([SendDate],[Message]," +
                "[Id_Task],[Id_User])VALUES(@SendDate,@Message,@Id_Task,@Id_User)";
            SqlCommand cmd = new SqlCommand(ssql, connection);
            cmd.Parameters.AddWithValue("@SendDate", DateTime.Now);
            cmd.Parameters.AddWithValue("@Message", this.Message);
            cmd.Parameters.AddWithValue("@Id_Task", this.Task.id);
            cmd.Parameters.AddWithValue("@Id_User", this.User.id);
            return cmd;
        }
    }
}
