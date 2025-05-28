using System;
using System.Data.SqlClient;
using System.Collections.Generic;
using ENTITY;

namespace DAL
{
    public class ChatRepository : BDRepository<ChatMessage>
    {
        private readonly UserRepository _userRepository;

        public ChatRepository()
        {
            _userRepository = new UserRepository();
        }

        public override bool Delete(int id)
        {
            try
            {
                if (id <= 0) return false;
                bd.OpenConection();
                SqlCommand cmd = new SqlCommand("DELETE FROM [dbo].[ChatMessage] WHERE Id_ChatMessage = @Id_ChatMessage", bd.connection);
                cmd.Parameters.AddWithValue("@Id_ChatMessage", id);
                int affectedRows = cmd.ExecuteNonQuery();
                return affectedRows > 0;
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

        public override List<ChatMessage> GetAll()
        {
            var messages = new List<ChatMessage>();
            try
            {
                bd.OpenConection();
                SqlCommand cmd = new SqlCommand("SELECT * FROM [dbo].[ChatMessage] ORDER BY SendDate DESC", bd.connection);
                using (var reader = cmd.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        messages.Add(MappingType(reader));
                    }
                }
            }
            catch (Exception)
            {
                return null;
            }
            finally
            {
                bd.CloseConection();
            }
            return messages;
        }

        public override ChatMessage GetById(int id)
        {
            ChatMessage message = null;
            try
            {
                if (id <= 0) return null;
                bd.OpenConection();
                SqlCommand cmd = new SqlCommand("SELECT * FROM [dbo].[ChatMessage] WHERE Id_ChatMessage = @Id_ChatMessage", bd.connection);
                cmd.Parameters.AddWithValue("@Id_ChatMessage", id);
                using (var reader = cmd.ExecuteReader())
                {
                    if (reader.Read())
                    {
                        message = MappingType(reader);
                    }
                }
            }
            catch (Exception)
            {
                return null;
            }
            finally
            {
                bd.CloseConection();
            }
            return message;
        }

        public override ChatMessage MappingType(SqlDataReader reader)
        {
            return new ChatMessage
            {
                Id = reader.GetInt32(reader.GetOrdinal("Id_ChatMessage")),
                Message = reader.GetString(reader.GetOrdinal("Message")),
                SendDate = reader.GetDateTime(reader.GetOrdinal("SendDate")),
                IsUserMessage = reader.GetBoolean(reader.GetOrdinal("IsUserMessage")),
                User = _userRepository.GetById(reader.GetInt32(reader.GetOrdinal("Id_User")))
            };
        }

        public override bool Update(ChatMessage entity)
        {
            try
            {
                if (entity == null || entity.Id <= 0) return false;
                bd.OpenConection();
                SqlCommand cmd = new SqlCommand("UPDATE [dbo].[ChatMessage] SET Message = @Message WHERE Id_ChatMessage = @Id_ChatMessage", bd.connection);
                cmd.Parameters.AddWithValue("@Id_ChatMessage", entity.Id);
                cmd.Parameters.AddWithValue("@Message", entity.Message);
                int affectedRows = cmd.ExecuteNonQuery();
                return affectedRows > 0;
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

        public bool ValidateUserCredentials(string username, string password)
        {
            try
            {
                var user = _userRepository.Login(username, password);
                return user != null;
            }
            catch
            {
                return false;
            }
        }

        public bool DeleteAll()
        {
            try
            {
                bd.OpenConection();
                
                // Verificar si hay mensajes antes de eliminar
                SqlCommand checkCmd = new SqlCommand("SELECT COUNT(*) FROM [dbo].[ChatMessage]", bd.connection);
                int messageCount = (int)checkCmd.ExecuteScalar();
                
                if (messageCount == 0)
                {
                    return true; // No hay mensajes para eliminar
                }

                // Iniciar transacción
                SqlTransaction transaction = bd.connection.BeginTransaction();
                try
                {
                    SqlCommand cmd = new SqlCommand("DELETE FROM [dbo].[ChatMessage]", bd.connection, transaction);
                    cmd.ExecuteNonQuery();
                    
                    // Confirmar transacción
                    transaction.Commit();
                    return true;
                }
                catch (Exception)
                {
                    // Revertir transacción en caso de error
                    transaction.Rollback();
                    throw;
                }
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