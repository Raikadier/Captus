using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ENTITY
{
    public class Task : TaskGeneric
    {
        public bool IsDelay => !this.State && DateTime.Today > this.EndDate.Date;
        public int Id_Task { get; set; }
        public new string Title { get; set; }
        public int Id_Category { get; set; }
        public new string Description { get; set; }
        public new DateTime CreationDate { get; set; }
        public new DateTime EndDate { get; set; }
        public int Id_Priority { get; set; }
        public new bool State { get; set; }
        public int Id_User { get; set; }

        public Task() { }
        public Task(int id, string title, Category category, string description, DateTime endDate, Priority priority, bool state, User user)
        {
            this.Id_Task = id;
            this.Title = title;
            this.Id_Category = category.id;
            this.Description = description;
            this.CreationDate = DateTime.Now;
            this.EndDate = endDate;
            this.Id_Priority = priority.Id_Priority;
            this.State = state;
            this.Id_User = user.id;
        }

        public override SqlCommand SQLCommandInsert(SqlConnection connection)
        {
            string ssql = "INSERT INTO [dbo].[Task]([Title],[Id_Category],[Description],[CreationDate],[EndDate]," +
                "[Id_Priority],[State],[Id_User]) VALUES(@Title,@Id_Category,@Description,@CreationDate,@EndDate,@Id_Priority,@State,@Id_User)";
            SqlCommand cmd = new SqlCommand(ssql, connection);
            cmd.Parameters.AddWithValue("@Title", this.Title);
            cmd.Parameters.AddWithValue("@Id_Category", this.Category.id);
            if (string.IsNullOrEmpty(this.Description))
                cmd.Parameters.AddWithValue("@Description", DBNull.Value);
            else
                cmd.Parameters.AddWithValue("@Description", this.Description);
            if (this.CreationDate == null)
                cmd.Parameters.AddWithValue("@CreationDate", DBNull.Value);
            else
                cmd.Parameters.AddWithValue("@CreationDate", this.CreationDate);
            cmd.Parameters.AddWithValue("@EndDate", this.EndDate);
            cmd.Parameters.AddWithValue("@Id_Priority", this.Priority.Id_Priority);
            cmd.Parameters.AddWithValue("@State", this.State);
            cmd.Parameters.AddWithValue("@Id_User", this.User.id);
            return cmd;
        }
        public void CheckLikeCompleted()
        {
            this.State = true;
            //foreach (var sub in SubTareas.Where(s => !s.State))
            //    sub.State = true;
        }

        public void UncheckLikeCompleted()
        {
            this.State = false;
            //foreach (var sub in SubTareas)
            //    sub.State = false;
        }
    }
}
