using DAL;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BLL
{
    public class TaskService : ILogic<Entity.Task>
    {
        private readonly TaskRepository taskRepository;
        public TaskService()
        {
            taskRepository = new TaskRepository();
        }
        public OperationResult Save(Entity.Task task)
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
    }
}
