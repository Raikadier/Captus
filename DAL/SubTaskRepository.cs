using Entity;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DAL
{
    public class SubTaskRepository : BDRepository<SubTask>
    {
        private readonly TaskRepository taskRepository;
        public SubTaskRepository() { taskRepository = new TaskRepository(); }
        public override bool Delete(int id)
        {
            try
            {
                if (id <= 0) return false;
                bd.OpenConection();
                SqlCommand cmd = new SqlCommand("DELETE FROM [dbo].[SubTask] WHERE Id_SubTask= @Id_SubTask", bd.connection);
                cmd.Parameters.AddWithValue("@Id_SubTask", id);
                return cmd.ExecuteNonQuery() > 0;
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
        public override List<SubTask> GetAll()
        {
            List<SubTask> subTasks = new List<SubTask>();
            try
            {
                bd.OpenConection();
                SqlCommand cmd = new SqlCommand("SELECT * FROM [dbo].[SubTask]", bd.connection);
                using (var reader = cmd.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        subTasks.Add(MappingType(reader));
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
            return subTasks;
        }
        public override SubTask GetById(int id)
        {
            SubTask subTask = null;
            try
            {
                if (id <= 0) return null;
                bd.OpenConection();
                SqlCommand cmd = new SqlCommand("SELECT * FROM [dbo].[SubTask] WHERE Id_SubTask= @Id_SubTask", bd.connection);
                cmd.Parameters.AddWithValue("@Id_SubTask", id);
                using (var reader = cmd.ExecuteReader())
                {
                    if (reader.Read())
                    {
                        subTask = MappingType(reader);
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
            return subTask;
        }
        public List<SubTask> GetAllByTaskId(int taskId)
        {
            List<SubTask> subtasks = new List<SubTask>();
            try
            {
                bd.OpenConection();
                SqlCommand cmd = new SqlCommand("SELECT * FROM [dbo].[SubTask] WHERE Id_Task = @Id_Task", bd.connection);
                cmd.Parameters.AddWithValue("@Id_Task", taskId);
                using (var reader = cmd.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        subtasks.Add(MappingType(reader));
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
            return subtasks;
        }
        public override SubTask MappingType(SqlDataReader reader)
        {
            return new SubTask
            {
                id = reader.GetInt32(reader.GetOrdinal("Id_SubTask")),
                Title = reader.GetString(reader.GetOrdinal("Title")),
                Description = reader.IsDBNull(reader.GetOrdinal("Description")) ? null : reader.GetString(reader.GetOrdinal("Description")),
                CreationDate = reader.GetDateTime(reader.GetOrdinal("CreationDate")),
                EndDate = reader.GetDateTime(reader.GetOrdinal("EndDate")),
                State = reader.GetBoolean(reader.GetOrdinal("State")),
                Task = taskRepository.GetById(reader.GetInt32(reader.GetOrdinal("Id_Task")))
            };
        }

        public override bool Update(SubTask entity)
        {
            try
            {
                bd.OpenConection();
                SqlCommand cmd = new SqlCommand(@"UPDATE [dbo].[SubTask] SET 
                Title=@Title, Description=@Description, CreationDate=@CreationDate, 
                EndDate=@EndDate, State=@State, Id_Task=@Id_Task WHERE Id_SubTask=@Id_SubTask", bd.connection);

                cmd.Parameters.AddWithValue("@Id_SubTask", entity.id);
                cmd.Parameters.AddWithValue("@Title", entity.Title);
                cmd.Parameters.AddWithValue("@Description", string.IsNullOrEmpty(entity.Description) ? DBNull.Value : (object)entity.Description);
                cmd.Parameters.AddWithValue("@CreationDate", entity.CreationDate);
                cmd.Parameters.AddWithValue("@EndDate", entity.EndDate);
                cmd.Parameters.AddWithValue("@State", entity.State);
                cmd.Parameters.AddWithValue("@Id_Task", entity.Task.id);

                return cmd.ExecuteNonQuery() > 0;
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
