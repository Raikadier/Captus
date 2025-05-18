using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Entity
{
    public class User : ClassName
    {
        public string UserName { get; set; }
        public string Password { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
        public User()
        {
        }
        public User(int id, string name, string userName, string password, string lastName, string email, string phone)
        {
            this.id = id;
            this.Name = name;
            this.UserName = userName;
            this.Password = password;
            this.LastName = lastName;
            this.Email = email;
            this.Phone = phone;
        }
        public override SqlCommand SQLCommandInsert(SqlConnection connection)
        {
            string ssql = @"
        INSERT INTO [dbo].[User] ([Name],[UserName],[Password],[LastName],[Email],[Phone])
        OUTPUT INSERTED.Id_User
        VALUES (@Name,@UserName,@Password,@LastName,@Email,@Phone)";

            SqlCommand cmd = new SqlCommand(ssql, connection);
            cmd.Parameters.AddWithValue("@Name", this.Name);
            cmd.Parameters.AddWithValue("@UserName", this.UserName);
            cmd.Parameters.AddWithValue("@Password", this.Password);
            cmd.Parameters.AddWithValue("@LastName", this.LastName);
            cmd.Parameters.AddWithValue("@Email", this.Email);
            cmd.Parameters.AddWithValue("@Phone", this.Phone);
            return cmd;
        }
    }
}
