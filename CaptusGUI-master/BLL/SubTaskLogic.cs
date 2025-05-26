using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DAL;
using ENTITY;

namespace BLL
{
    public class SubTaskLogic : ILogic<SubTask>
    {
        private readonly SubTaskRepository subTaskRepository;
        public SubTaskLogic()
        {
            subTaskRepository = new SubTaskRepository();
        }
        public OperationResult Save(SubTask subTask)
        {
            try
            {
                if (subTask == null)
                {
                    return new OperationResult
                    {
                        Success = false,
                        Message = "Subtask cannot be null."
                    };
                }
                var parentTask = new TaskRepository().GetById(subTask.Task.id);
                if (parentTask == null || parentTask.User.id != Session.CurrentUser.id)
                {
                    return new OperationResult
                    {
                        Success = false,
                        Message = "Parent task is invalid or not accessible."
                    };
                }
                if (subTaskRepository.Save(subTask))
                {
                    return new OperationResult
                    {
                        Success = true,
                        Message = "Subtask saved successfully."
                    };
                }
                else
                {
                    return new OperationResult
                    {
                        Success = false,
                        Message = "Failed to save subtask."
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
        public OperationResult DeleteByParentTask(int id)
        {
            try
            {
                if (id <= 0) return new OperationResult { Success = false, Message = "Invalid task ID." };
                var subtasksToDelete = subTaskRepository.GetAll().Where(st => st.Task.id == id).ToList();
                foreach (var subtask in subtasksToDelete)
                {
                    subTaskRepository.Delete(subtask.id);
                }
                return new OperationResult { Success = true, Message = "Subtasks deleted successfully." };
            }
            catch (Exception ex)
            {
                return new OperationResult { Success = false, Message = $"An error occurred: {ex.Message}" };
            }
        }
        public List<SubTask> GetAll()
        {
            try
            {
                if (Session.CurrentUser == null)
                {
                    return null;
                }
                return subTaskRepository.GetAll().Where(st => st.Task.User.id == Session.CurrentUser.id).ToList();
            }
            catch (Exception ex)
            {
                throw new Exception($"An error occurred while retrieving tasks: {ex.Message}");
            }
        }
        public SubTask GetById(int id)
        {
            try
            {
                return subTaskRepository.GetById(id);
            }
            catch (Exception)
            {
                return null;
            }
        }

        public OperationResult Update(SubTask subTask)
        {
            try
            {
                if (subTask == null) return new OperationResult { Success = false, Message = "Subtask cannot be null." };
                if (subTask.State == false && subTaskRepository.GetById(subTask.id)?.State == true)
                {
                    return new OperationResult
                    {
                        Success = false,
                        Message = "Cannot unmark a completed task."
                    };
                }
                if (subTaskRepository.Update(subTask))
                {
                    var allSubtasks = subTaskRepository.GetAll().Where(st => st.Task.id == subTask.Task.id).ToList();
                    if (allSubtasks.All(st => st.State))
                    {
                        var task = new TaskRepository().GetById(subTask.Task.id);
                        if (!task.State)
                        {
                            task.State = true;
                            new TaskLogic().Update(task); // o injectar TaskLogic en SubTaskLogic
                        }
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
                        Message = "Subtask not found."
                    };
                }
                if (id <= 0) return new OperationResult
                {
                    Success = false,
                    Message = "Invalid subtask ID."
                };
                if (subTaskRepository.Delete(id))
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
        public void MarkAllAsCompleted(int id)
        {
            var subtasks = subTaskRepository.GetAll().Where(st => st.Task.id == id).ToList();
            foreach (var subtask in subtasks)
            {
                subtask.State = true;
                Update(subtask);
            }
        }
    }
}
