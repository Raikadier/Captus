using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using ENTITY;
using DAL;
using TaskGeneric = ENTITY.TaskGeneric; // Alias para evitar conflictos si TaskGeneric también causa problemas

namespace BLL
{
    public class TaskLogic : ILogic<ENTITY.Task>
    {
        private readonly TaskRepository taskRepository;
        private readonly SubTaskLogic subTaskLogic;
        private readonly TaskDAL _taskDAL;

        public TaskLogic(string connectionString = null)
        {
            taskRepository = new TaskRepository();
            subTaskLogic = new SubTaskLogic();
            _taskDAL = new TaskDAL(connectionString ?? ENTITY.Configuration.ConnectionString);
        }

        public OperationResult Save(ENTITY.Task task)
        {
            try
            {
                if (task == null)
                {
                    return new OperationResult
                    {
                        Success = false,
                        Message = "Task cannot be null."
                    };
                }
                if (taskRepository.Save(task))
                {
                    return new OperationResult
                    {
                        Success = true,
                        Message = "Task saved successfully."
                    };
                }
                else
                {
                    Console.WriteLine("Error saving task.");
                    return new OperationResult
                    {
                        Success = false,
                        Message = "Failed to save task."
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

        public OperationResult DeleteByUser(int idUser)
        {
            try
            {
                if (idUser <= 0) return new OperationResult { Success = false, Message = "Invalid user ID." };
                var tasksToDelete = taskRepository.GetAll().Where(t => t.User.id == idUser).ToList();
                foreach (var task in tasksToDelete)
                {
                    taskRepository.Delete(task.id);
                }
                return new OperationResult { Success = true, Message = "Tasks deleted successfully." };
            }
            catch (Exception ex)
            {
                return new OperationResult { Success = false, Message = $"An error occurred: {ex.Message}" };
            }
        }

        public OperationResult DeleteByCategory(int idCategory)
        {
            try
            {
                if (idCategory <= 0) return new OperationResult { Success = false, Message = "Invalid category ID." };
                var tasksToDelete = taskRepository.GetAll().Where(t => t.Category.id == idCategory).ToList();
                foreach (var task in tasksToDelete)
                {
                    taskRepository.Delete(task.id);
                }
                return new OperationResult { Success = true, Message = "Tasks deleted successfully." };
            }
            catch (Exception ex)
            {
                return new OperationResult { Success = false, Message = $"An error occurred: {ex.Message}" };
            }
        }

        public List<ENTITY.Task> GetAll()
        {
            try
            {
                if (Session.CurrentUser == null)
                {
                    return null;
                }
                return taskRepository.GetAllByUserId(Session.CurrentUser.id);
            }
            catch (Exception ex)
            {
                throw new Exception($"An error occurred while retrieving tasks: {ex.Message}");
            }
        }

        public List<ENTITY.Task> GetTaskIncompletedByUser()
        {
            try
            {
                if (Session.CurrentUser ==null) return null;
                var tasks = GetAll().Where<ENTITY.Task>(t => !t.State).ToList();
                return tasks;
            }
            catch (Exception ex)
            {
                throw new Exception($"An error occurred while retrieving tasks: {ex.Message}");
            }
        }

        public List<ENTITY.Task> GetAllCompleted()
        {
            try
            {
                if (Session.CurrentUser == null)
                {
                    return null;
                }
                
                return GetAll().Where(t => t.State == true).ToList();
            }
            catch (Exception ex)
            {
                throw new Exception($"An error occurred while retrieving tasks: {ex.Message}");
            }
        }

        public List<ENTITY.Task> GetCompletedTasksByUser()
        {
            var allTasks = taskRepository.GetAllByUserId(Session.CurrentUser.id);
            return allTasks
                .Where(t => t.User.id == Session.CurrentUser.id && t.State)
                .ToList();
        }

        public List<ENTITY.Task> GetCompletedTodayByUser()
        {
            var today = DateTime.Today;
            return GetAllCompleted()
                .Where(t => t.CreationDate.Date == today)
                .ToList();
        }

        public ENTITY.Task GetById(int id)
        {
            try
            {
                return taskRepository.GetById(id);
            }
            catch (Exception)
            {
                return null;
            }
        }

        public OperationResult Update(ENTITY.Task task)
        {
            try
            {
                if (task == null) return new OperationResult { Success = false, Message = "Task cannot be null." };
                if (task.State == false && taskRepository.GetById(task.id)?.State == true)
                {
                    return new OperationResult
                    {
                        Success = false,
                        Message = "Cannot unmark a completed task."
                    };
                }
                if (taskRepository.Update(task))
                {
                    if (task.State)
                    {
                        subTaskLogic.MarkAllAsCompleted(task.id);
                    }

                    return new OperationResult { Success = true, Message = "Task updated successfully." };
                }
                return new OperationResult { Success = false, Message = "Failed to update task." };
            }
            catch (Exception ex)
            {
                return new OperationResult { Success = false, Message = $"An error occurred: {ex.Message}" };
            }
        }

        public OperationResult Delete(int id)
        {
            try
            {
                if (GetById(id) == null)
                {
                    return new OperationResult
                    {
                        Success = false,
                        Message = "Task not found."
                    };
                }
                if (id <= 0) return new OperationResult
                {
                    Success = false,
                    Message = "Invalid task ID."
                };
                subTaskLogic.DeleteByParentTask(id);
                if (taskRepository.Delete(id))
                {
                    return new OperationResult
                    {
                        Success = true,
                        Message = "Task deleted successfully."
                    };
                }
                else
                {
                    return new OperationResult
                    {
                        Success = false,
                        Message = "Failed to delete task."
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

        public List<ENTITY.Task> GetOverdueTasks()
        {
            var criteria = new TaskCriteria
            {
                IsOverdue = true
            };
            return _taskDAL.GetTasksByCriteria(Session.CurrentUser.id, criteria);
        }

        public void UpdateTaskState(int taskId, bool state)
        {
            var task = GetById(taskId);
            if (task != null)
            {
                task.State = state;
                Update(task);
                StatisticsLogic statisticsLogic=new StatisticsLogic();
                statisticsLogic.VerificarRacha();
            }
        }

        public void SaveTask(ENTITY.Task task)
        {
            if (task == null)
                throw new ArgumentNullException(nameof(task));

            task.CreationDate = DateTime.Now;
            _taskDAL.InsertTask(task);
        }

        public void UpdateTask(ENTITY.Task task)
        {
            if (task == null)
                throw new ArgumentNullException(nameof(task));

            _taskDAL.UpdateTask(task);
        }

        public void RescheduleTask(int taskId, DateTime newEndDate)
        {
            var task = _taskDAL.GetTaskById(taskId);
            if (task == null)
                throw new ArgumentException("Task not found", nameof(taskId));

            task.EndDate = newEndDate;
            _taskDAL.UpdateTask(task);
        }

        public ENTITY.Task GetTaskById(int taskId)
        {
            return _taskDAL.GetTaskById(taskId);
        }

        public List<ENTITY.Task> GetTasks(int userId, TaskCriteria criteria)
        {
            return _taskDAL.GetTasksByCriteria(userId, criteria);
        }

        public void DeleteTask(int taskId)
        {
            _taskDAL.DeleteTask(taskId);
        }
    }
}
