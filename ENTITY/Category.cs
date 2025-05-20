using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ENTITY
{
    public class Category : ClassName
    {
        public bool IsGlobal => Id_User == null;
        public int? Id_User { get; set; }
        public Category() { }
        public Category(int id, string name, int? idUser = null)
        {
            this.id = id;
            this.Name = name;
            this.Id_User = idUser;
        }

        public override SqlCommand SQLCommandInsert(SqlConnection connection)
        {
            string ssql = "INSERT INTO [dbo].[Category]([Name], [Id_User]) VALUES(@Name, @Id_User)";
            SqlCommand cmd = new SqlCommand(ssql, connection);
            cmd.Parameters.AddWithValue("@Name", this.Name);
            if (this.Id_User.HasValue)
                cmd.Parameters.AddWithValue("@Id_User", this.Id_User.Value);
            else
                cmd.Parameters.AddWithValue("@Id_User", DBNull.Value);
            return cmd;
        }
    }
}
