using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using ENTITY;

namespace DAL
{
    public class TaskRepository : BDRepository<ENTITY.Task>
    {
        private readonly UserRepository userRepository;
        private readonly PriorityRepository priorityRepository;
        private readonly CategoryRepository categoryRepository;
        public TaskRepository() { userRepository = new UserRepository(); priorityRepository = new PriorityRepository(); categoryRepository = new CategoryRepository(); }

        public override bool Delete(int id)
        {
            try
            {
                if (id <= 0) return false;
                bd.OpenConection();
                SqlCommand cmd = new SqlCommand("DELETE FROM [dbo].[Task] WHERE Id_Task= @Id_Task", bd.connection);
                cmd.Parameters.AddWithValue("@Id_Task", id);
                int affectedRows = cmd.ExecuteNonQuery();
                if (affectedRows > 0) return true;
                return false;
            }
            catch (SqlException)
            {
                return false;
            }
            catch (Exception)
            {
                return false;
            }
            finally
            {
                bd.CloseConection();
            }
        }

        public override List<ENTITY.Task> GetAll()
        {
            var task = new List<ENTITY.Task>();
            try
            {
                bd.OpenConection();
                SqlCommand cmd = new SqlCommand("SELECT * FROM [dbo].[Task]", bd.connection);
                using (var reader = cmd.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        task.Add(MappingType(reader));
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
            return task;
        }

        public List<ENTITY.Task> GetAllByUserId(int id)
        {
            var task = new List<ENTITY.Task>();
            try
            {
                bd.OpenConection();
                SqlCommand cmd = new SqlCommand("SELECT * FROM [dbo].[Task] WHERE Id_User= @Id_User", bd.connection);
                cmd.Parameters.AddWithValue("@Id_User", id);
                using (var reader = cmd.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        task.Add(MappingType(reader));
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
            return task;
        }
        public override ENTITY.Task GetById(int id)
        {
            ENTITY.Task task = null;
            try
            {
                if (id <= 0) return null;
                bd.OpenConection();
                SqlCommand cmd = new SqlCommand("SELECT * FROM [dbo].[Task] WHERE Id_Task = @Id_Task", bd.connection);
                cmd.Parameters.AddWithValue("@Id_Task", id);
                SqlDataReader reader = cmd.ExecuteReader();
                if (reader.Read())
                {
                    task = MappingType(reader);
                }
                reader.Close();
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
            return task;
        }

        public override ENTITY.Task MappingType(SqlDataReader reader)
        {
            ENTITY.Task task = new ENTITY.Task
            {
                id = Convert.ToInt32(reader["Id_Task"]),
                Title = reader.GetString(reader.GetOrdinal("Title")),
                Category = SearchEntity.SearchCategoryById(categoryRepository.GetAll(), Convert.ToInt32(reader["Id_Category"])),
                Description = reader.IsDBNull(reader.GetOrdinal("Description")) ? null : reader.GetString(reader.GetOrdinal("Description")),
                CreationDate = reader.GetDateTime(reader.GetOrdinal("CreationDate")),
                EndDate = reader.GetDateTime(reader.GetOrdinal("EndDate")),
                Priority = SearchEntity.SearchPriorityById(priorityRepository.GetAll(), Convert.ToInt32(reader["Id_Priority"])),
                State = reader.GetBoolean(reader.GetOrdinal("State")),
                User = SearchEntity.SearchUserById(userRepository.GetAll(), Convert.ToInt32(reader["Id_User"]))
            };
            return task;
        }

        public override bool Update(ENTITY.Task entity)
        {
            try
            {
                if (entity == null) return false;
                bd.OpenConection();
                SqlCommand cmd = new SqlCommand("UPDATE[dbo].[Task] SET[Title] = @Title, [Id_Category] = @Id_Category, [Description] = @Description, [CreationDate] = @CreationDate, [EndDate] = @EndDate, [Id_Priority] = @Id_Priority, [State] = @State, [Id_User] = @Id_User WHERE Id_Task = @Id_Task");
                cmd.Connection = bd.connection;
                cmd.Parameters.AddWithValue("@Id_Task", entity.id);
                cmd.Parameters.AddWithValue("@Title",entity.Title);
                cmd.Parameters.AddWithValue("@Id_Category",entity.Category.id);
                if (string.IsNullOrEmpty(entity.Description))
                    cmd.Parameters.AddWithValue("@Description", DBNull.Value);
                else
                    cmd.Parameters.AddWithValue("@Description",entity.Description);
                if (entity.CreationDate== null)
                    cmd.Parameters.AddWithValue("@CreationDate", DBNull.Value);
                else
                    cmd.Parameters.AddWithValue("@CreationDate",entity.CreationDate);
                cmd.Parameters.AddWithValue("@EndDate",entity.EndDate);
                cmd.Parameters.AddWithValue("@Id_Priority",entity.Priority.Id_Priority);
                cmd.Parameters.AddWithValue("@State",entity.State);
                cmd.Parameters.AddWithValue("@Id_User",entity.User.id);
                int affectedRows = cmd.ExecuteNonQuery();
                if (affectedRows > 0) return true;
                return false;
            }
            catch (SqlException)
            {
                return false;
            }
            catch (Exception)
            {
                return false;
            }
            finally
            {
                bd.CloseConection();
            }
        }
    }
}
