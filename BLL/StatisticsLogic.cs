using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DAL;
using ENTITY;

namespace BLL
{
    public class StatisticsLogic : ILogic<Statistics>
    {
        private readonly StatisticsRepository statisticsRepository;
        private readonly TaskLogic taskLogic;
        public StatisticsLogic()
        {
            statisticsRepository = new StatisticsRepository(new UserRepository());
            taskLogic = new TaskLogic();
        }
        public void UpdateRacha()
        {
            var stat = GetByCurrentUser();
            if (stat == null) return;

            DateTime today = DateTime.Today;

            int completadasHoy = taskLogic.GetCompletedTodayByUser().Count;

            if (completadasHoy >= stat.DailyGoal)
            {
                if (stat.LastRachaDate.HasValue &&
                    stat.LastRachaDate.Value.Date == today.AddDays(-1))
                {
                    stat.Racha += 1;
                }
                else if (stat.LastRachaDate.HasValue &&
                         stat.LastRachaDate.Value.Date == today)
                {
                }
                else
                {
                    stat.Racha = 1;
                }
                stat.LastRachaDate = today;

                // Guarda en base de datos
                statisticsRepository.Update(stat);
            }
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
            catch (Exception)
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
    }
}
