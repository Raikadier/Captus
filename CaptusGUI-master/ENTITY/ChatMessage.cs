using System;
using System.Data.SqlClient;

namespace ENTITY
{
    public class ChatMessage : IOperationEntity
    {
        public int Id { get; set; }
        public string Message { get; set; }
        public DateTime SendDate { get; set; }
        public bool IsUserMessage { get; set; }
        public User User { get; set; }

        public SqlCommand SQLCommandInsert(SqlConnection connection)
        {
            var cmd = new SqlCommand("INSERT INTO [dbo].[ChatMessage] (Message, SendDate, IsUserMessage, Id_User) VALUES (@Message, @SendDate, @IsUserMessage, @Id_User)", connection);
            cmd.Parameters.AddWithValue("@Message", Message);
            cmd.Parameters.AddWithValue("@SendDate", SendDate);
            cmd.Parameters.AddWithValue("@IsUserMessage", IsUserMessage);
            cmd.Parameters.AddWithValue("@Id_User", User.id);
            return cmd;
        }
    }
} 