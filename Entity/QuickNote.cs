using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Entity
{
    public class QuickNote : ClassTitle
    {
        public User user { get; set; }
        public string Content { get; set; }
        public DateTime CreationDate { get; set; }
        public DateTime UpdateDate { get; set; }

        public QuickNote()
        {
            CreationDate = DateTime.Now;
            UpdateDate = DateTime.Now;
        }
        public QuickNote(int id, string title, string content, DateTime creationDate, DateTime updateDate)
        {
            this.id = id;
            this.Title = title;
            this.Content = content;
            this.CreationDate = creationDate;
            this.UpdateDate = updateDate;
        }
        public void UpdateContent(string newContent)
        {
            Content = newContent;
            UpdateDate = DateTime.Now;
        }
        public override SqlCommand SQLCommandInsert(SqlConnection connection)
        {
            string ssql = "INSERT INTO [dbo].[QuickNote]([Title],[Id_User],[CreationDate],[UpdateDate],[Content])" +
                "VALUES(@Title,@Id_User,@CreationDate,@UpdateDate,@Content)";
            SqlCommand cmd = new SqlCommand(ssql, connection);
            cmd.Parameters.AddWithValue("@Title", this.Title);
            cmd.Parameters.AddWithValue("@Id_User", this.user.id);
            cmd.Parameters.AddWithValue("@CreationDate", DateTime.Now);
            cmd.Parameters.AddWithValue("@UpdateDate", DateTime.Now);
            cmd.Parameters.AddWithValue("@Content", this.Content);
            return cmd;
        }
    }
}
