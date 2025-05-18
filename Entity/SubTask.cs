using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Entity
{
    public class SubTask : TaskGeneric
    {
        public Task Task { get; set; }
        public SubTask() { }
        public SubTask(int id, string title, Category category, string description, DateTime creationDate, DateTime endDate, Priority priority, bool state, User user, Task task)
        {
            this.id = id;
            this.Title = title;
            this.Category = category;
            this.Description = description;
            this.CreationDate = DateTime.Now;
            this.EndDate = endDate;
            this.Priority = priority;
            this.State = state;
            this.User = user;
            this.Task = task;
        }
        public override SqlCommand SQLCommandInsert(SqlConnection connection)
        {
            string ssql = "INSERT INTO [dbo].[SubTask]([Title],[Id_Category],[Description],[CreationDate],[EndDate],[Id_Priority],[State],[Id_Task]," +
                "[Id_User])VALUES(@Title,@Id_Category,@Description,@CreationDate,@EndDate,@Id_Priority,@State,@Id_Task,@Id_User)";
            SqlCommand cmd = new SqlCommand(ssql, connection);
            cmd.Parameters.AddWithValue("@Title", this.Title);
            cmd.Parameters.AddWithValue("@Id_Category", this.Category.id);
            if (string.IsNullOrEmpty(this.Description))
                cmd.Parameters.AddWithValue("@Description", DBNull.Value);
            else
                cmd.Parameters.AddWithValue("@Description", this.Description);
            cmd.Parameters.AddWithValue("@CreationDate", DateTime.Now);
            cmd.Parameters.AddWithValue("@EndDate", this.EndDate);
            cmd.Parameters.AddWithValue("@Id_Priority", this.Priority.Id_Priority);
            cmd.Parameters.AddWithValue("@State", this.State);
            cmd.Parameters.AddWithValue("@Id_Task", this.Task.id);
            cmd.Parameters.AddWithValue("@Id_User", this.User.id);
            return cmd;
        }
        public void CheckLikeCompleted() => this.State = true;
        public void UncheckLikeCompleted() => this.State = false;

    }
}
