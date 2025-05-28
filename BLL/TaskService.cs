using System;
using System.Threading.Tasks;
using ENTITY;
using DAL;

namespace BLL
{
    public class TaskService
    {
        private readonly TaskLogic _taskLogic;
        private readonly NotificationService _notificationService;

        public TaskService()
        {
            _taskLogic = new TaskLogic();
            _notificationService = NotificationService.Instance;
        }

        public async Task<OperationResult> CreateTaskAsync(TaskData taskData, User user)
        {
            try
            {
                if (user == null)
                    return new OperationResult { Success = false, Message = "El usuario es requerido." };

                if (string.IsNullOrWhiteSpace(taskData.Titulo))
                    return new OperationResult { Success = false, Message = "El título de la tarea es requerido." };

                ENTITY.Task nuevaTarea;
                var resultado = _taskLogic.CreateAndSaveTask(
                    taskData.Titulo,
                    taskData.Descripcion,
                    taskData.Fecha,
                    taskData.PrioridadTexto,
                    taskData.CategoriaTexto,
                    user,
                    out nuevaTarea);

                if (resultado.Success)
                {
                    await _notificationService.SendTaskNotificationAsync(nuevaTarea, "create");
                    return new OperationResult 
                    { 
                        Success = true, 
                        Message = $"✅ Tarea creada exitosamente: {taskData.Titulo}",
                        Data = nuevaTarea
                    };
                }

                return resultado;
            }
            catch (Exception ex)
            {
                return new OperationResult { Success = false, Message = $"Error al crear la tarea: {ex.Message}" };
            }
        }

        public async Task<OperationResult> UpdateTaskAsync(int taskId, TaskData taskData)
        {
            try
            {
                var tarea = _taskLogic.GetById(taskId);
                if (tarea == null)
                    return new OperationResult { Success = false, Message = "Tarea no encontrada." };

                if (!string.IsNullOrWhiteSpace(taskData.Titulo))
                    tarea.Title = taskData.Titulo;
                if (!string.IsNullOrWhiteSpace(taskData.Descripcion))
                    tarea.Description = taskData.Descripcion;
                if (taskData.Fecha != default)
                    tarea.EndDate = taskData.Fecha;
                if (!string.IsNullOrWhiteSpace(taskData.PrioridadTexto))
                    tarea.Priority = new Priority { Name = taskData.PrioridadTexto };
                if (!string.IsNullOrWhiteSpace(taskData.CategoriaTexto))
                    tarea.Category = new Category { Name = taskData.CategoriaTexto };

                var resultado = _taskLogic.Update(tarea);
                if (resultado.Success)
                {
                    await _notificationService.SendTaskNotificationAsync(tarea, "update");
                    return new OperationResult 
                    { 
                        Success = true, 
                        Message = $"✅ Tarea actualizada exitosamente: {tarea.Title}",
                        Data = tarea
                    };
                }

                return resultado;
            }
            catch (Exception ex)
            {
                return new OperationResult { Success = false, Message = $"Error al actualizar la tarea: {ex.Message}" };
            }
        }

        public async Task<OperationResult> DeleteTaskAsync(int taskId)
        {
            try
            {
                var tarea = _taskLogic.GetById(taskId);
                if (tarea == null)
                    return new OperationResult { Success = false, Message = "Tarea no encontrada." };

                var resultado = _taskLogic.Delete(taskId);
                if (resultado.Success)
                {
                    await _notificationService.SendTaskNotificationAsync(tarea, "delete");
                    return new OperationResult 
                    { 
                        Success = true, 
                        Message = $"✅ Tarea eliminada exitosamente: {tarea.Title}",
                        Data = tarea
                    };
                }

                return resultado;
            }
            catch (Exception ex)
            {
                return new OperationResult { Success = false, Message = $"Error al eliminar la tarea: {ex.Message}" };
            }
        }

        public OperationResult GetTasks(TaskCriteria criteria = null)
        {
            try
            {
                if (Session.CurrentUser == null)
                    return new OperationResult { Success = false, Message = "No hay una sesión de usuario activa." };

                var tasks = _taskLogic.GetTasks(Session.CurrentUser.id, criteria ?? new TaskCriteria());
                return new OperationResult 
                { 
                    Success = true, 
                    Message = "Tareas obtenidas exitosamente",
                    Data = tasks
                };
            }
            catch (Exception ex)
            {
                return new OperationResult { Success = false, Message = $"Error al obtener las tareas: {ex.Message}" };
            }
        }
    }

    public class TaskData
    {
        public string Titulo { get; set; }
        public string Descripcion { get; set; }
        public DateTime Fecha { get; set; }
        public string PrioridadTexto { get; set; }
        public string CategoriaTexto { get; set; }
    }
} 