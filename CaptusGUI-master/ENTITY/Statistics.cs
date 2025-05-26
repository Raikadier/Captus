using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ENTITY
{
        public class Statistics : ClassId
        {
            public User User { get; set; }
            public DateTime? StartDate { get; set; }
            public DateTime? EndDate { get; set; }
            public DateTime? LastRachaDate { get; set; }
            public int Racha { get; set; }
            public int TotalTasks { get; set; }
            public int CompletedTasks { get; set; }
            public int DailyGoal { get; set; }

            public Statistics() { }
            public Statistics(User user, DateTime startDate, DateTime endDate, DateTime lastRachaDate, int racha, int totalTasks, int completedTasks, int dailyGoal)
            {
                this.User = user;
                this.StartDate = startDate;
                this.EndDate = endDate;
                this.Racha = racha;
                this.TotalTasks = totalTasks;
                this.CompletedTasks = completedTasks;
                this.DailyGoal = dailyGoal;
                this.LastRachaDate = lastRachaDate;
            }
            public void DefaultStatistics(User user)
            {
                this.User = user;
                this.StartDate = DateTime.Now;
                this.EndDate = DateTime.Now;
                this.Racha = 0;
                this.TotalTasks = 0;
                this.CompletedTasks = 0;
                this.DailyGoal = 5;
                this.LastRachaDate = null;
            }
            public override SqlCommand SQLCommandInsert(SqlConnection connection)
            {
                string ssql = "INSERT INTO [dbo].[Statistics]([Id_User],[StartDate],[EndDate],[Racha],[TotalTask],[CompletedTask],[DailyGoal],[lastRachaDate])" +
                    "VALUES(@Id_User,@StartDate,@EndDate,@Racha,@TotalTask,@CompletedTask,@DailyGoal,@lastRachaDate)";
                SqlCommand cmd = new SqlCommand(ssql, connection);
                cmd.Parameters.AddWithValue("@Id_User", this.User.id);
                if (this.LastRachaDate.HasValue)
                    cmd.Parameters.AddWithValue("@StartDate", this.StartDate.Value);
                else
                    cmd.Parameters.AddWithValue("@StartDate", DBNull.Value);
                if (this.LastRachaDate.HasValue)
                    cmd.Parameters.AddWithValue("@EndDate", this.EndDate.Value);
                else
                    cmd.Parameters.AddWithValue("@EndDate", DBNull.Value);
                cmd.Parameters.AddWithValue("@Racha", this.Racha);
                cmd.Parameters.AddWithValue("@TotalTask", this.TotalTasks);
                cmd.Parameters.AddWithValue("@CompletedTask", this.CompletedTasks);
                cmd.Parameters.AddWithValue("@DailyGoal", this.DailyGoal);
                if (this.LastRachaDate.HasValue)
                    cmd.Parameters.AddWithValue("@LastRachaDate", this.LastRachaDate.Value);
                else
                    cmd.Parameters.AddWithValue("@LastRachaDate", DBNull.Value);
                return cmd;
            }
        }
    }

