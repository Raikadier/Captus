using Entity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DAL;
namespace BLL
{
    public class StatisticsLogic : ILogic<Statistics>
    {
        private readonly StatisticsRepository statisticsRepository;
        public StatisticsLogic()
        {
            statisticsRepository = new StatisticsRepository(new UserRepository());
        }
        public void UpdateRacha(Statistics stats, List<Entity.Task> tareasDelUsuario)
        {
            DateTime hoy = DateTime.Today;

            if (stats.LastRachaDate == hoy)
                return;

            int completadasHoy = tareasDelUsuario
                .Where(t => t.State && t.EndDate.Date == hoy)
                .Count();

            if (completadasHoy >= stats.DailyGoal)
            {
                if (stats.LastRachaDate == hoy.AddDays(-1))
                    stats.Racha++;
                else
                    stats.Racha = 1;

                stats.LastRachaDate = hoy;
            }
            else
            {
                stats.Racha = 0;
                stats.LastRachaDate = null;
            }
            Update(stats);
        }
        public void UpdateCompletedTask(Statistics stats, List<Entity.Task> tareasDelUsuario)
        {
            stats.CompletedTasks = tareasDelUsuario.Count(t => t.State);
            Update(stats);
        }
        public void UpdateDailyGoal(Statistics stats, int dailyGoal)
        {
            stats.DailyGoal = dailyGoal;
            Update(stats);
        }
        public void UpdateTotalTask(Statistics stats, List<Entity.Task> tareasDelUsuario)
        {
            stats.TotalTasks = tareasDelUsuario.Count;
            Update(stats);
        }

        public OperationResult Delete(int id)
        {
            try
            {
                if (id <= 0)
                {
                    return new OperationResult
                    {
                        Success = false,
                        Message = "Invalid statistics ID."
                    };
                }
                if (GetById(id) == null)
                {
                    return new OperationResult
                    {
                        Success = false,
                        Message = "Statistics not found."
                    };
                }
                if (statisticsRepository.Delete(id))
                {
                    return new OperationResult
                    {
                        Success = true,
                        Message = "Statistics deleted successfully."
                    };
                }
                else
                {
                    return new OperationResult
                    {
                        Success = false,
                        Message = "Failed to delete statistics."
                    };
                }

            }
            catch (Exception ex)
            {
                return new OperationResult
                {
                    Success = false,
                    Message = $"An error occurred: {ex.Message}"
                };
            }
        }

        public List<Statistics> GetAll()
        {
            try
            {
                return statisticsRepository.GetAll();
            }
            catch (Exception ex)
            {
                return null;
            }
        }

        public Statistics GetById(int id)
        {
            try
            {
                return SearchEntity.SearchStatisticsById(GetAll(), id);
            }
            catch (Exception ex)
            {
                return null;
                throw new Exception($"An error occurred while retrieving the user: {ex.Message}");
            }
        }

        public OperationResult Save(Statistics statistics)
        {
            try
            {
                if (statistics == null) return new OperationResult
                {
                    Success = false,
                    Message = "Statistics cannot be null."
                };
                if (GetById(statistics.id) != null)
                {
                    return new OperationResult
                    {
                        Success = false,
                        Message = "Statistics already exists."
                    };
                }
                if (statisticsRepository.Save(statistics))
                {
                    return new OperationResult
                    {
                        Success = true,
                        Message = "Statistics inserted successfully."
                    };
                }
                else
                {
                    return new OperationResult
                    {
                        Success = false,
                        Message = "Failed to insert statistics."
                    };
                }
            }
            catch (Exception ex)
            {
                return new OperationResult
                {
                    Success = false,
                    Message = $"An error occurred: {ex.Message}"
                };
            }
        }

        public OperationResult Update(Statistics statistics)
        {
            try
            {
                if (statistics == null)
                {
                    return new OperationResult
                    {
                        Success = false,
                        Message = "Statistics cannot be null."
                    };
                }
                if (GetById(statistics.id) != null)
                {
                    if (statisticsRepository.Update(statistics))
                    {
                        return new OperationResult
                        {
                            Success = true,
                            Message = "Statistics updated successfully."
                        };
                    }
                    else
                    {
                        return new OperationResult
                        {
                            Success = false,
                            Message = "Failed to update statistics."
                        };
                    }
                }
                else
                {
                    return new OperationResult
                    {
                        Success = false,
                        Message = "Statistics not found."
                    };
                }
            }
            catch (Exception ex)
            {
                return new OperationResult
                {
                    Success = false,
                    Message = $"An error occurred: {ex.Message}"
                };
            }
        }
        public Statistics GetByCurrentUser()
        {
            if (Session.CurrentUser == null)
                return null;

            return statisticsRepository.GetByUser(Session.CurrentUser.id);
        }
        public void UpdateRacha(List<Entity.Task> tareasDelUsuario)
        {
            var stats = GetByCurrentUser();
            if (stats == null) return;

            UpdateRacha(stats, tareasDelUsuario);
        }
    }
}
