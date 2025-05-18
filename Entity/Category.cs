using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Entity
{
    public class Category : ClassName
    {
        public Category() { }
        public Category(int id,string name)
        {
            this.id = id;
            this.Name = name;
        }

        public override SqlCommand SQLCommandInsert(SqlConnection connection)
        {
            string ssql = "INSERT INTO [dbo].[Category]([Name])VALUES(@Name)";
            SqlCommand cmd = new SqlCommand(ssql, connection);
            cmd.Parameters.AddWithValue("@Name", this.Name);
            return cmd;
        }
    }
}
