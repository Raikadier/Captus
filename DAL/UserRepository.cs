using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using ENTITY;

namespace DAL
{
    public class UserRepository : BDRepository<User>
    {
        private readonly StatisticsRepository statisticsRepository;

        public UserRepository()
        {
            statisticsRepository = new StatisticsRepository(this);
        }
        public override bool Save(User entity)
        {
            try
            {
                if (entity == null) return false;

                bd.OpenConection();
                SqlCommand cmd = entity.SQLCommandInsert(bd.connection);

                object result = cmd.ExecuteScalar();

                if (result == null || result == DBNull.Value)
                {
                    Console.WriteLine("El ID insertado no se pudo obtener.");
                    return false;
                }

                entity.id = Convert.ToInt32(result);
                Console.WriteLine("ID insertado: " + entity.id);

                var statistics = new Statistics();
                statistics.DefaultStatistics(entity);

                if (!statisticsRepository.Save(statistics))
                {
                    Delete(entity.id);
                    Console.WriteLine("Error al guardar estadísticas. Usuario eliminado.");
                    return false;
                }

                return true;

            }
            catch (SqlException ex)
            {
                Console.WriteLine("SQL Error: " + ex.Message);
                return false;
            }
            catch (Exception ex)
            {
                Console.WriteLine("General Error: " + ex.Message);
                return false;
            }
            finally
            {
                bd.CloseConection();
            }

        }
        public User Login(string username, string password)
        {
            User user = null;
            try
            {
                bd.OpenConection();
                var cmd = new SqlCommand("SELECT [Id_User],[Name],[UserName],[Password],[LastName],[Email],[Phone]FROM [dbo].[User] where UserName=@UserName and Password= @Password", bd.connection);
                cmd.Parameters.AddWithValue("@UserName", username);
                cmd.Parameters.AddWithValue("@Password", password);

                using (var reader = cmd.ExecuteReader())
                {
                    if (reader.Read())
                    {
                        user = MappingType(reader);
                    }
                }
            }
            catch
            {
                return null;
            }
            finally
            {
                bd.CloseConection();
            }

            return user;
        }
        public override bool Delete(int id)
        {
            try
            {
                if (id <= 0) return false;
                bd.OpenConection();
                SqlCommand cmd = new SqlCommand("DELETE FROM [dbo].[User] WHERE Id_User = @Id_User", bd.connection);
                cmd.Parameters.AddWithValue("@Id_User", id);
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
        public override List<User> GetAll()
        {
            List<User> users = new List<User>();
            try
            {
                bd.OpenConection();
                SqlCommand cmd = new SqlCommand("SELECT * FROM [dbo].[User]", bd.connection);
                using (var reader = cmd.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        users.Add(MappingType(reader));
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
            return users;
        }
        public bool IsEmailRegistered(string email)
        {
            try
            {
                if (string.IsNullOrEmpty(email)) return false;
                bd.OpenConection();
                SqlCommand cmd = new SqlCommand("SELECT COUNT(*) FROM [dbo].[User] WHERE Email = @Email", bd.connection);
                cmd.Parameters.AddWithValue("@Email", email);
                int count = (int)cmd.ExecuteScalar();
                return count > 0;
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
        public override User GetById(int id)
        {
            User user = null;
            try
            {
                if (id <= 0) return null;
                bd.OpenConection();
                SqlCommand cmd = new SqlCommand("SELECT * FROM [dbo].[User] WHERE Id_User = @Id_User", bd.connection);
                cmd.Parameters.AddWithValue("@Id_User", id);
                SqlDataReader reader = cmd.ExecuteReader();
                if (reader.Read())
                {
                    user = MappingType(reader);
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
            return user;
        }
        public User GetByUsername(string username)
        {
            User user = null;
            try
            {
                if (string.IsNullOrEmpty(username)) return null;
                bd.OpenConection();
                SqlCommand cmd = new SqlCommand("SELECT * FROM [dbo].[User] WHERE UserName = @UserName", bd.connection);
                cmd.Parameters.AddWithValue("@UserName", username);
                SqlDataReader reader = cmd.ExecuteReader();
                if (reader.Read())
                {
                    user = MappingType(reader);
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
            return user;
        }
        public override User MappingType(SqlDataReader reader)
        {
            User user = new User
            {
                id = reader.GetInt32(reader.GetOrdinal("Id_User")),
                Name = reader.GetString(reader.GetOrdinal("Name")),
                UserName = reader.GetString(reader.GetOrdinal("UserName")),
                Password = reader.GetString(reader.GetOrdinal("Password")),
                LastName = reader.GetString(reader.GetOrdinal("LastName")),
                Email = reader.GetString(reader.GetOrdinal("Email")),
                Phone = reader.GetString(reader.GetOrdinal("Phone"))
            };
            return user;
        }
        public override bool Update(User entity)
        {
            try
            {
                if (entity == null || entity.id <= 0) return false;
                bd.OpenConection();
                SqlCommand cmd = new SqlCommand("UPDATE [dbo].[User] SET Name = @Name,UserName=@UserName,Password = @Password,LastName=@LastName, Email = @Email,Phone=@Phone  WHERE Id_User = @Id_User", bd.connection);
                cmd.Parameters.AddWithValue("@Id_User", entity.id);
                cmd.Parameters.AddWithValue("@Name", entity.Name);
                cmd.Parameters.AddWithValue("@UserName", entity.UserName);
                cmd.Parameters.AddWithValue("@Password", entity.Password);
                cmd.Parameters.AddWithValue("@LastName", entity.LastName);
                cmd.Parameters.AddWithValue("@Email", entity.Email);
                cmd.Parameters.AddWithValue("@Phone", entity.Phone);
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
