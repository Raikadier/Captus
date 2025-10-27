// Unit tests for TaskService
import TaskService from '../backend/src/services/taskService.js';
import Task from '../backend/src/models/task.js';

// Mock Supabase client
const mockSupabase = {
  from: jest.fn(() => ({
    select: jest.fn(() => ({
      eq: jest.fn(() => ({
        single: jest.fn(),
        order: jest.fn(() => ({
          data: [],
          error: null
        }))
      })),
      insert: jest.fn(() => ({
        select: jest.fn(() => ({
          single: jest.fn()
        }))
      })),
      update: jest.fn(() => ({
        eq: jest.fn(() => ({
          select: jest.fn(() => ({
            single: jest.fn()
          }))
        }))
      })),
      delete: jest.fn(() => ({
        eq: jest.fn()
      }))
    }))
  }))
};

describe('TaskService', () => {
  let taskService;

  beforeEach(() => {
    taskService = new TaskService(mockSupabase);
    jest.clearAllMocks();
  });

  describe('createTask', () => {
    it('should create a valid task', async () => {
      const taskData = {
        title: 'Test Task',
        description: 'Test Description',
        due_date: '2024-12-31T23:59:59.000Z'
      };
      const userId = 'user-123';

      const mockTask = {
        id: 1,
        ...taskData,
        user_id: userId,
        completed: false,
        created_at: new Date(),
        updated_at: new Date()
      };

      mockSupabase.from.mockReturnValue({
        insert: jest.fn(() => ({
          select: jest.fn(() => ({
            single: jest.fn(() => ({
              data: mockTask,
              error: null
            }))
          }))
        }))
      });

      const result = await taskService.createTask(taskData, userId);

      expect(result).toBeInstanceOf(Task);
      expect(result.title).toBe(taskData.title);
      expect(result.user_id).toBe(userId);
    });

    it('should throw error for invalid task data', async () => {
      const taskData = { title: '' }; // Invalid: empty title
      const userId = 'user-123';

      await expect(taskService.createTask(taskData, userId)).rejects.toThrow('Validation failed');
    });
  });

  describe('getTaskById', () => {
    it('should return task for valid id and user', async () => {
      const taskId = 1;
      const userId = 'user-123';
      const mockTaskData = {
        id: taskId,
        title: 'Test Task',
        user_id: userId
      };

      mockSupabase.from.mockReturnValue({
        select: jest.fn(() => ({
          eq: jest.fn(() => ({
            single: jest.fn(() => ({
              data: mockTaskData,
              error: null
            }))
          }))
        }))
      });

      const result = await taskService.getTaskById(taskId, userId);

      expect(result).toBeInstanceOf(Task);
      expect(result.id).toBe(taskId);
    });

    it('should throw error for non-existent task', async () => {
      const taskId = 999;
      const userId = 'user-123';

      mockSupabase.from.mockReturnValue({
        select: jest.fn(() => ({
          eq: jest.fn(() => ({
            single: jest.fn(() => ({
              data: null,
              error: { code: 'PGRST116' }
            }))
          }))
        }))
      });

      await expect(taskService.getTaskById(taskId, userId)).rejects.toThrow('Task not found');
    });
  });

  describe('getTasksByUser', () => {
    it('should return user tasks', async () => {
      const userId = 'user-123';
      const mockTasks = [
        { id: 1, title: 'Task 1', user_id: userId },
        { id: 2, title: 'Task 2', user_id: userId }
      ];

      mockSupabase.from.mockReturnValue({
        select: jest.fn(() => ({
          eq: jest.fn(() => ({
            order: jest.fn(() => ({
              data: mockTasks,
              error: null
            }))
          }))
        }))
      });

      const result = await taskService.getTasksByUser(userId);

      expect(result).toHaveLength(2);
      expect(result[0]).toBeInstanceOf(Task);
      expect(result[0].user_id).toBe(userId);
    });
  });

  describe('updateTask', () => {
    it('should update task successfully', async () => {
      const taskId = 1;
      const userId = 'user-123';
      const updateData = { title: 'Updated Title' };

      const existingTask = {
        id: taskId,
        title: 'Original Title',
        user_id: userId,
        completed: false
      };

      const updatedTask = {
        ...existingTask,
        ...updateData,
        updated_at: new Date()
      };

      // Mock getTaskById
      taskService.getTaskById = jest.fn(() => Promise.resolve(Task.fromDatabase(existingTask)));

      mockSupabase.from.mockReturnValue({
        update: jest.fn(() => ({
          eq: jest.fn(() => ({
            select: jest.fn(() => ({
              single: jest.fn(() => ({
                data: updatedTask,
                error: null
              }))
            }))
          }))
        }))
      });

      const result = await taskService.updateTask(taskId, updateData, userId);

      expect(result.title).toBe('Updated Title');
    });
  });

  describe('deleteTask', () => {
    it('should delete task successfully', async () => {
      const taskId = 1;
      const userId = 'user-123';

      taskService.getTaskById = jest.fn(() => Promise.resolve(new Task({ id: taskId, user_id: userId })));
      taskService.deleteSubtasksByParentTask = jest.fn(() => Promise.resolve(true));

      mockSupabase.from.mockReturnValue({
        delete: jest.fn(() => ({
          eq: jest.fn(() => ({
            error: null
          }))
        }))
      });

      const result = await taskService.deleteTask(taskId, userId);

      expect(result).toBe(true);
      expect(taskService.deleteSubtasksByParentTask).toHaveBeenCalledWith(taskId, userId);
    });
  });

  describe('createSubtask', () => {
    it('should create subtask for valid parent task', async () => {
      const parentTaskId = 1;
      const subtaskData = { title: 'Subtask' };
      const userId = 'user-123';

      taskService.getTaskById = jest.fn(() => Promise.resolve(new Task({ id: parentTaskId, user_id: userId })));

      const mockSubtask = {
        id: 2,
        ...subtaskData,
        user_id: userId,
        parent_task_id: parentTaskId
      };

      mockSupabase.from.mockReturnValue({
        insert: jest.fn(() => ({
          select: jest.fn(() => ({
            single: jest.fn(() => ({
              data: mockSubtask,
              error: null
            }))
          }))
        }))
      });

      const result = await taskService.createSubtask(parentTaskId, subtaskData, userId);

      expect(result.parent_task_id).toBe(parentTaskId);
    });
  });
});