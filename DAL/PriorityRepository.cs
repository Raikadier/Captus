using Entity;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DAL
{
    public class PriorityRepository : BD
    {
        protected readonly BD bd;
        public PriorityRepository() { bd = new BD(); }
        public List<Priority> GetAll()
        {
            List<Priority> priorities = new List<Priority>();
            try
            {
                bd.OpenConection();
                SqlCommand cmd = new SqlCommand("SELECT [Id_Priority],[Name] FROM [dbo].[Priority]", bd.connection);
                using (var reader = cmd.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        priorities.Add(MappingType(reader));
                    }
                }
            }
            catch (SqlException)
            {
                return null;
            }
            catch (Exception)
            {
                return null;
            }
            finally
            {
                bd.CloseConection();
            }
            return priorities;
        }
        public Priority GetById(int id)
        {
            Priority priority = null;
            try
            {
                if (id <= 0) return null;
                bd.OpenConection();
                SqlCommand cmd = new SqlCommand("SELECT [Id_Priority],[Name] FROM [dbo].[Priority] WHERE Id_Priority = @Id_Priority", bd.connection);
                cmd.Parameters.Add("@Id_Priority", SqlDbType.Int).Value = id;
                SqlDataReader reader = cmd.ExecuteReader();
                if (reader.Read())
                {
                    priority = MappingType(reader);
                }
                reader.Close();
            }
            catch (SqlException)
            {
                
            }
            catch (Exception)
            {
                
            }
            finally
            {
                bd.CloseConection();
            }
            return priority;
        }
        public Priority MappingType(SqlDataReader reader)
        {
            Priority priority = new Priority
            {
                Id_Priority = reader.GetInt32(reader.GetOrdinal("Id_Priority")),
                Name = reader.GetString(reader.GetOrdinal("Name"))
            };
            return priority;
        }
    }
}
