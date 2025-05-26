using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using ENTITY;

namespace DAL
{
    public class TaskDAL
    {
        private readonly string _connectionString;

        public TaskDAL(string connectionString)
        {
            _connectionString = connectionString;
        }

        // Método para insertar una nueva tarea
        public void InsertTask(Task task)
        {
            using (SqlConnection connection = new SqlConnection(_connectionString))
            {
                using (SqlCommand command = new SqlCommand())
                {
                    command.Connection = connection;
                    command.CommandText = "INSERT INTO [dbo].[Task] (Title, Id_Category, Description, CreationDate, EndDate, Id_Priority, State, Id_User) " +
                                          "VALUES (@Title, @Id_Category, @Description, @CreationDate, @EndDate, @Id_Priority, @State, @Id_User)";
                    command.Parameters.AddWithValue("@Title", task.Title);
                    command.Parameters.AddWithValue("@Id_Category", task.Id_Category);
                    command.Parameters.AddWithValue("@Description", (object)task.Description ?? DBNull.Value);
                    command.Parameters.AddWithValue("@CreationDate", task.CreationDate);
                    command.Parameters.AddWithValue("@EndDate", task.EndDate);
                    command.Parameters.AddWithValue("@Id_Priority", task.Id_Priority);
                    command.Parameters.AddWithValue("@State", task.State);
                    command.Parameters.AddWithValue("@Id_User", task.Id_User);

                    connection.Open();
                    command.ExecuteNonQuery();
                }
            }
        }

        // Método para actualizar una tarea existente
        public void UpdateTask(Task task)
        {
            using (SqlConnection connection = new SqlConnection(_connectionString))
            {
                using (SqlCommand command = new SqlCommand())
                {
                    command.Connection = connection;
                    command.CommandText = "UPDATE [dbo].[Task] SET " +
                                          "Title = @Title, " +
                                          "Id_Category = @Id_Category, " +
                                          "Description = @Description, " +
                                          "EndDate = @EndDate, " +
                                          "Id_Priority = @Id_Priority, " +
                                          "State = @State " +
                                          "WHERE Id_Task = @Id_Task AND Id_User = @Id_User";

                    command.Parameters.AddWithValue("@Title", task.Title);
                    command.Parameters.AddWithValue("@Id_Category", task.Id_Category);
                    command.Parameters.AddWithValue("@Description", (object)task.Description ?? DBNull.Value);
                    // CreationDate no se actualiza
                    command.Parameters.AddWithValue("@EndDate", task.EndDate);
                    command.Parameters.AddWithValue("@Id_Priority", task.Id_Priority);
                    command.Parameters.AddWithValue("@State", task.State);
                    command.Parameters.AddWithValue("@Id_Task", task.Id_Task);
                    command.Parameters.AddWithValue("@Id_User", task.Id_User);

                    connection.Open();
                    command.ExecuteNonQuery();
                }
            }
        }

        // Método para obtener una tarea por su ID
        public Task GetTaskById(int taskId)
        {
            Task task = null;
            using (SqlConnection connection = new SqlConnection(_connectionString))
            {
                using (SqlCommand command = new SqlCommand())
                {
                    command.Connection = connection;
                    command.CommandText = "SELECT Id_Task, Title, Id_Category, Description, CreationDate, EndDate, Id_Priority, State, Id_User " +
                                          "FROM [dbo].[Task] " +
                                          "WHERE Id_Task = @Id_Task";
                    command.Parameters.AddWithValue("@Id_Task", taskId);

                    connection.Open();
                    using (SqlDataReader reader = command.ExecuteReader())
                    {
                        if (reader.Read())
                        {
                            task = new Task
                            {
                                Id_Task = reader.GetInt32(reader.GetOrdinal("Id_Task")),
                                Title = reader.GetString(reader.GetOrdinal("Title")),
                                Id_Category = reader.GetInt32(reader.GetOrdinal("Id_Category")),
                                Description = reader.IsDBNull(reader.GetOrdinal("Description")) ? null : reader.GetString(reader.GetOrdinal("Description")),
                                CreationDate = reader.GetDateTime(reader.GetOrdinal("CreationDate")),
                                EndDate = reader.GetDateTime(reader.GetOrdinal("EndDate")),
                                Id_Priority = reader.GetInt32(reader.GetOrdinal("Id_Priority")),
                                State = reader.GetBoolean(reader.GetOrdinal("State")),
                                Id_User = reader.GetInt32(reader.GetOrdinal("Id_User"))
                            };
                        }
                    }
                }
            }
            return task;
        }

        // Método para obtener todas las tareas de un usuario
        public List<Task> GetAllTasksByUserId(int userId)
        {
            var tasks = new List<Task>();
            using (SqlConnection connection = new SqlConnection(_connectionString))
            {
                using (SqlCommand command = new SqlCommand())
                {
                    command.Connection = connection;
                    command.CommandText = "SELECT Id_Task, Title, Id_Category, Description, CreationDate, EndDate, Id_Priority, State, Id_User " +
                                          "FROM [dbo].[Task] " +
                                          "WHERE Id_User = @Id_User";
                    command.Parameters.AddWithValue("@Id_User", userId);

                    connection.Open();
                    using (SqlDataReader reader = command.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            Task task = new Task
                            {
                                Id_Task = reader.GetInt32(reader.GetOrdinal("Id_Task")),
                                Title = reader.GetString(reader.GetOrdinal("Title")),
                                Id_Category = reader.GetInt32(reader.GetOrdinal("Id_Category")),
                                Description = reader.IsDBNull(reader.GetOrdinal("Description")) ? null : reader.GetString(reader.GetOrdinal("Description")),
                                CreationDate = reader.GetDateTime(reader.GetOrdinal("CreationDate")),
                                EndDate = reader.GetDateTime(reader.GetOrdinal("EndDate")),
                                Id_Priority = reader.GetInt32(reader.GetOrdinal("Id_Priority")),
                                State = reader.GetBoolean(reader.GetOrdinal("State")),
                                Id_User = reader.GetInt32(reader.GetOrdinal("Id_User"))
                            };
                            tasks.Add(task);
                        }
                    }
                }
            }
            return tasks;
        }

        // Método para obtener tareas según criterios (filtro)
        public List<Task> GetTasksByCriteria(int userId, TaskCriteria criteria)
        {
            var tasks = new List<Task>();
            using (SqlConnection connection = new SqlConnection(_connectionString))
            {
                using (SqlCommand command = new SqlCommand())
                {
                    command.Connection = connection;
                    
                    var conditions = new List<string>();
                    conditions.Add("Id_User = @Id_User");
                    command.Parameters.AddWithValue("@Id_User", userId);

                    if (criteria != null)
                    {
                        if (criteria.CategoryId.HasValue)
                        {
                            conditions.Add("Id_Category = @CategoryId");
                            command.Parameters.AddWithValue("@CategoryId", criteria.CategoryId.Value);
                        }

                        if (criteria.PriorityId.HasValue)
                        {
                            conditions.Add("Id_Priority = @PriorityId");
                            command.Parameters.AddWithValue("@PriorityId", criteria.PriorityId.Value);
                        }

                        if (criteria.State.HasValue)
                        {
                            conditions.Add("State = @State");
                            command.Parameters.AddWithValue("@State", criteria.State.Value);
                        }

                        if (criteria.StartDate.HasValue)
                        {
                            conditions.Add("CreationDate >= @StartDate");
                            command.Parameters.AddWithValue("@StartDate", criteria.StartDate.Value);
                        }

                        if (criteria.EndDate.HasValue)
                        {
                            conditions.Add("EndDate <= @EndDate");
                            command.Parameters.AddWithValue("@EndDate", criteria.EndDate.Value);
                        }

                        if (!string.IsNullOrWhiteSpace(criteria.SearchText))
                        {
                            conditions.Add("(Title LIKE @SearchText OR Description LIKE @SearchText)");
                            command.Parameters.AddWithValue("@SearchText", $"%{criteria.SearchText}%");
                        }

                        if (criteria.IsOverdue.HasValue && criteria.IsOverdue.Value)
                        {
                            conditions.Add("EndDate < GETDATE() AND State = 0");
                        }
                    }

                    string baseQuery = "SELECT Id_Task, Title, Id_Category, Description, CreationDate, EndDate, Id_Priority, State, Id_User FROM [dbo].[Task]";
                    string whereClause = conditions.Count > 0 ? " WHERE " + string.Join(" AND ", conditions) : "";
                    command.CommandText = baseQuery + whereClause;

                    connection.Open();
                    using (SqlDataReader reader = command.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            Task task = new Task
                            {
                                Id_Task = reader.GetInt32(reader.GetOrdinal("Id_Task")),
                                Title = reader.GetString(reader.GetOrdinal("Title")),
                                Id_Category = reader.GetInt32(reader.GetOrdinal("Id_Category")),
                                Description = reader.IsDBNull(reader.GetOrdinal("Description")) ? null : reader.GetString(reader.GetOrdinal("Description")),
                                CreationDate = reader.GetDateTime(reader.GetOrdinal("CreationDate")),
                                EndDate = reader.GetDateTime(reader.GetOrdinal("EndDate")),
                                Id_Priority = reader.GetInt32(reader.GetOrdinal("Id_Priority")),
                                State = reader.GetBoolean(reader.GetOrdinal("State")),
                                Id_User = reader.GetInt32(reader.GetOrdinal("Id_User"))
                            };
                            tasks.Add(task);
                        }
                    }
                }
            }
            return tasks;
        }

        // Método para eliminar una tarea por su ID
        public void DeleteTask(int taskId)
        {
            using (SqlConnection connection = new SqlConnection(_connectionString))
            {
                using (SqlCommand command = new SqlCommand())
                {
                    command.Connection = connection;
                    command.CommandText = "DELETE FROM [dbo].[Task] WHERE Id_Task = @Id_Task";
                    command.Parameters.AddWithValue("@Id_Task", taskId);

                    connection.Open();
                    command.ExecuteNonQuery();
                }
            }
        }
    }
} 