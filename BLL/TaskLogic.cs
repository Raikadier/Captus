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

        private OperationResult ValidateTask(ENTITY.Task task)
        {
            if (task == null)
                return new OperationResult { Success = false, Message = "Task cannot be null." };
            
            if (string.IsNullOrWhiteSpace(task.Title))
                return new OperationResult { Success = false, Message = "Task title cannot be empty." };
            
            return new OperationResult { Success = true };
        }

        public OperationResult Save(ENTITY.Task task)
        {
            try
            {
                var validation = ValidateTask(task);
                if (!validation.Success) return validation;

                return taskRepository.Save(task) 
                    ? new OperationResult { Success = true, Message = "Task saved successfully." }
                    : new OperationResult { Success = false, Message = "Failed to save task." };
            }
            catch (Exception ex)
            {
                return new OperationResult { Success = false, Message = $"An error occurred: {ex.Message}" };
            }
        }

        private OperationResult ValidateTaskId(int id)
        {
            if (id <= 0)
                return new OperationResult { Success = false, Message = "Invalid task ID." };
            
            if (GetById(id) == null)
                return new OperationResult { Success = false, Message = "Task not found." };
            
            return new OperationResult { Success = true };
        }

        public OperationResult Delete(int id)
        {
            try
            {
                var validation = ValidateTaskId(id);
                if (!validation.Success) return validation;

                subTaskLogic.DeleteByParentTask(id);
                return taskRepository.Delete(id)
                    ? new OperationResult { Success = true, Message = "Task deleted successfully." }
                    : new OperationResult { Success = false, Message = "Failed to delete task." };
            }
            catch (Exception ex)
            {
                return new OperationResult { Success = false, Message = $"An error occurred: {ex.Message}" };
            }
        }

        public OperationResult DeleteByUser(int idUser)
        {
            try
            {
                if (idUser <= 0)
                    return new OperationResult { Success = false, Message = "Invalid user ID." };

                var tasksToDelete = GetTasksByUser(t => t.User.id == idUser);
                foreach (var task in tasksToDelete)
                {
                    Delete(task.id);
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
                if (idCategory <= 0)
                    return new OperationResult { Success = false, Message = "Invalid category ID." };

                var tasksToDelete = GetTasksByUser(t => t.Category.id == idCategory);
                foreach (var task in tasksToDelete)
                {
                    Delete(task.id);
                }
                return new OperationResult { Success = true, Message = "Tasks deleted successfully." };
            }
            catch (Exception ex)
            {
                return new OperationResult { Success = false, Message = $"An error occurred: {ex.Message}" };
            }
        }

        private List<ENTITY.Task> GetTasksByUser(Func<ENTITY.Task, bool> filter = null)
        {
            try
            {
                if (Session.CurrentUser == null) return null;
                
                var tasks = taskRepository.GetAllByUserId(Session.CurrentUser.id);
                return filter != null ? tasks.Where(filter).ToList() : tasks;
            }
            catch (Exception ex)
            {
                throw new Exception($"An error occurred while retrieving tasks: {ex.Message}");
            }
        }

        public List<ENTITY.Task> GetAll()
        {
            return GetTasksByUser();
        }

        public List<ENTITY.Task> GetTaskIncompletedByUser()
        {
            return GetTasksByUser(t => !t.State);
        }

        public List<ENTITY.Task> GetAllCompleted()
        {
            return GetTasksByUser(t => t.State);
        }

        public List<ENTITY.Task> GetCompletedTasksByUser()
        {
            return GetTasksByUser(t => t.State);
        }

        public List<ENTITY.Task> GetCompletedTodayByUser()
        {
            var today = DateTime.Today;
            return GetTasksByUser(t => t.State && t.CreationDate.Date == today);
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
                var validation = ValidateTask(task);
                if (!validation.Success) return validation;

                var existingTask = taskRepository.GetById(task.id);
                if (existingTask == null)
                    return new OperationResult { Success = false, Message = "Task not found." };

                if (!task.State && existingTask.State)
                    return new OperationResult { Success = false, Message = "Cannot unmark a completed task." };

                if (!taskRepository.Update(task))
                    return new OperationResult { Success = false, Message = "Failed to update task." };

                if (task.State)
                    subTaskLogic.MarkAllAsCompleted(task.id);

                return new OperationResult { Success = true, Message = "Task updated successfully." };
            }
            catch (Exception ex)
            {
                return new OperationResult { Success = false, Message = $"An error occurred: {ex.Message}" };
            }
        }

        public List<ENTITY.Task> GetOverdueTasks()
        {
            var now = DateTime.Now;
            return GetTasksByUser(t => !t.State && t.EndDate < now);
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

        public OperationResult CreateAndSaveTask(string titulo, string descripcion, DateTime fecha, string prioridadTexto, string categoriaTexto, User usuario, out ENTITY.Task nuevaTarea)
        {
            nuevaTarea = null;
            try
            {
                if (string.IsNullOrWhiteSpace(titulo))
                    return new OperationResult { Success = false, Message = "El título de la tarea es requerido." };

                if (usuario == null)
                    return new OperationResult { Success = false, Message = "El usuario es requerido." };

                // Obtener IDs de prioridad y categoría de manera más eficiente
                var (prioridadId, categoriaId) = GetPriorityAndCategoryIds(prioridadTexto, categoriaTexto);

                nuevaTarea = new ENTITY.Task
                {
                    Title = titulo,
                    Description = descripcion,
                    CreationDate = DateTime.Now,
                    EndDate = fecha,
                    Id_Priority = prioridadId,
                    Id_Category = categoriaId,
                    State = false,
                    Id_User = usuario.id,
                    User = usuario
                };

                // Guardar la tarea
                _taskDAL.InsertTask(nuevaTarea);

                // Si llegamos aquí, la inserción fue exitosa (asumiendo que InsertTask lanza una excepción en caso de error)
                LoadTaskRelations(nuevaTarea);

                return new OperationResult { Success = true, Message = "Tarea creada exitosamente.", Data = nuevaTarea };
            }
            catch (Exception ex)
            {
                nuevaTarea = null;
                return new OperationResult { Success = false, Message = $"Error al crear la tarea: {ex.Message}" };
            }
        }

        private (int prioridadId, int categoriaId) GetPriorityAndCategoryIds(string prioridadTexto, string categoriaTexto)
        {
            var priorityService = new PriorityLogic();
            var categoryService = new CategoryLogic();

            // Valores por defecto
            int prioridadId = 1; // Baja
            int categoriaId = 1; // General

            // Intentar obtener IDs de los textos proporcionados
            if (!string.IsNullOrEmpty(prioridadTexto))
            {
                var priority = priorityService.GetAll()
                    .FirstOrDefault(p => p.Name.Equals(prioridadTexto, StringComparison.OrdinalIgnoreCase));
                if (priority != null)
                    prioridadId = priority.Id_Priority;
            }

            if (!string.IsNullOrEmpty(categoriaTexto))
            {
                var category = categoryService.GetAll()
                    .FirstOrDefault(c => c.Name.Equals(categoriaTexto, StringComparison.OrdinalIgnoreCase));
                if (category != null)
                    categoriaId = category.id;
            }

            return (prioridadId, categoriaId);
        }

        private void LoadTaskRelations(ENTITY.Task task)
        {
            var categoryService = new CategoryLogic();
            var priorityService = new PriorityLogic();

            task.Category = categoryService.GetById(task.Id_Category);
            task.Priority = priorityService.GetById(task.Id_Priority);
        }
    }
}
