using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using ENTITY;

namespace DAL
{
    public class StatisticsRepository : BDRepository<Statistics>
    {
        private readonly UserRepository userRepository;

        public StatisticsRepository(UserRepository userRepository)
        {
            this.userRepository = userRepository;
        }
        public Statistics GetByUser(int id)
        {
            try
            {
                if (id <= 0) return null;

                bd.OpenConection();
                SqlCommand cmd = new SqlCommand("SELECT * FROM [dbo].[Statistics] WHERE Id_User=@Id_User", bd.connection);
                cmd.Parameters.AddWithValue("@Id_User", id);

                using (var reader = cmd.ExecuteReader())
                {
                    if (reader.Read())
                    {
                        return MappingType(reader);
                    }
                }

                return null; // <- Devuelve null si no hay resultado
            }
            catch (SqlException)
            {
                throw new Exception("Error en la consulta SQL");
            }
            catch (Exception)
            {
                throw new Exception("Error en la consulta");
            }
            finally
            {
                bd.CloseConection();
            }
        }
        public override Statistics GetById(int id)
        {
            Statistics statistics = new Statistics();
            try
            {
                if (id <= 0) return null;
                bd.OpenConection();
                SqlCommand cmd = new SqlCommand("SELECT * FROM [dbo].[Statistics] WHERE Id_Statistics = @Id_Statistics", bd.connection);
                cmd.Parameters.AddWithValue("@Id_Statistics", id);
                SqlDataReader reader = cmd.ExecuteReader();
                if (reader.Read())
                {
                    statistics = MappingType(reader);
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
            return statistics;
        }
        public override bool Update(Statistics entity)
        {
            try
            {
                if (entity == null) return false;
                bd.OpenConection();
                SqlCommand cmd = new SqlCommand("UPDATE [dbo].[Statistics]SET [Id_User] = @Id_User,[StartDate] = @StartDate,[EndDate] = @EndDate," +
                    "[Racha] = @Racha,[TotalTask] = @TotalTask,[CompletedTask] = @CompletedTask,[DailyGoal] = @DailyGoal,[lastRachaDate] = @lastRachaDate WHERE Id_User=@Id_User", bd.connection);
                cmd.Parameters.AddWithValue("@Id_User", entity.User.id);
                cmd.Parameters.AddWithValue("@StartDate", entity.StartDate);
                cmd.Parameters.AddWithValue("@EndDate", entity.EndDate);
                cmd.Parameters.AddWithValue("@Racha", entity.Racha);
                cmd.Parameters.AddWithValue("@TotalTask", entity.TotalTasks);
                cmd.Parameters.AddWithValue("@CompletedTask", entity.CompletedTasks);
                cmd.Parameters.AddWithValue("@DailyGoal", entity.DailyGoal);
                if (entity.LastRachaDate.HasValue)
                    cmd.Parameters.AddWithValue("@LastRachaDate", entity.LastRachaDate.Value);
                else
                    cmd.Parameters.AddWithValue("@LastRachaDate", DBNull.Value);
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
        public override Statistics MappingType(SqlDataReader reader)
        {
            Statistics statistics = new Statistics();
            statistics.id = Convert.ToInt32(reader["Id_Statistics"]);
            statistics.User = SearchEntity.SearchUserById(userRepository.GetAll(), Convert.ToInt32(reader["Id_User"]));
            statistics.StartDate = Convert.ToDateTime(reader["StartDate"]);
            statistics.EndDate = Convert.ToDateTime(reader["EndDate"]);
            statistics.Racha = Convert.ToInt32(reader["Racha"]);
            statistics.TotalTasks = Convert.ToInt32(reader["TotalTask"]);
            statistics.CompletedTasks = Convert.ToInt32(reader["CompletedTask"]);
            statistics.DailyGoal = Convert.ToInt32(reader["DailyGoal"]);
            if (reader["lastRachaDate"] != DBNull.Value)
                statistics.LastRachaDate = Convert.ToDateTime(reader["lastRachaDate"]);
            else
                statistics.LastRachaDate = null;
            return statistics;
        }
        public override List<Statistics> GetAll()
        {
            List<Statistics> statistics = new List<Statistics>();
            try
            {
                bd.OpenConection();
                SqlCommand cmd = new SqlCommand("SELECT * FROM [dbo].[Statistics]", bd.connection);
                SqlDataReader reader = cmd.ExecuteReader();
                while (reader.Read())
                {
                    statistics.Add(MappingType(reader));
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
            return statistics;
        }
        public override bool Delete(int id)
        {
            try
            {
                if (id <= 0) return false;
                bd.OpenConection();
                SqlCommand cmd = new SqlCommand("DELETE FROM [dbo].[Statistics] WHERE Id_User=@Id_User", bd.connection);
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
    }
}
