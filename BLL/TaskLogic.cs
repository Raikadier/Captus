using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using ENTITY;
using DAL;

namespace BLL
{
    public class TaskLogic : ILogic<ENTITY.Task>
    {
        private readonly TaskRepository taskRepository;
        private readonly SubTaskLogic subTaskLogic;
        public TaskLogic()
        {
            taskRepository = new TaskRepository();
            subTaskLogic = new SubTaskLogic();
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
                .Where(t =>
                    t.CreationDate.Date == today)
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
            return GetAll()?.Where(t => !t.State && t.EndDate < DateTime.Now).ToList();
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
    }
}
