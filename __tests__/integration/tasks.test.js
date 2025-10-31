// Integration tests for task management
import request from 'supertest';
import express from 'express';
import jwt from 'jsonwebtoken';
import { createClient } from '@supabase/supabase-js';

// Mock Supabase
jest.mock('@supabase/supabase-js', () => ({
  createClient: jest.fn(() => ({
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          order: jest.fn(() => ({
            data: [],
            error: null
          })),
          single: jest.fn(() => ({
            data: null,
            error: { code: 'PGRST116' }
          }))
        })),
        insert: jest.fn(() => ({
          select: jest.fn(() => ({
            single: jest.fn(() => ({
              data: { id: 1, title: 'Test Task' },
              error: null
            }))
          }))
        })),
        update: jest.fn(() => ({
          eq: jest.fn(() => ({
            select: jest.fn(() => ({
              single: jest.fn(() => ({
                data: { id: 1, title: 'Updated Task' },
                error: null
              }))
            }))
          }))
        })),
        delete: jest.fn(() => ({
          eq: jest.fn(() => ({
            error: null
          }))
        }))
      }))
    }))
  }))
}));

// Import after mocking
import app from '../server.js';

const JWT_SECRET = 'test_jwt_secret';

describe('Task Management Integration Tests', () => {
  let server;
  let supabase;
  let authToken;

  beforeAll(() => {
    // Set test environment variables
    process.env.JWT_SECRET = JWT_SECRET;
    process.env.SUPABASE_URL = 'https://test.supabase.co';
    process.env.SUPABASE_ANON_KEY = 'test-anon-key';

    supabase = createClient();

    // Create auth token for tests
    authToken = jwt.sign({ id: 'user-123', email: 'test@example.com' }, JWT_SECRET);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/tasks', () => {
    it('should get user tasks successfully', async () => {
      const mockTasks = [
        { id: 1, title: 'Task 1', completed: false, user_id: 'user-123' },
        { id: 2, title: 'Task 2', completed: true, user_id: 'user-123' }
      ];

      supabase.from().select().eq().order.mockReturnValue({
        data: mockTasks,
        error: null
      });

      const response = await request(app)
        .get('/api/tasks')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body).toHaveLength(2);
    });

    it('should handle unauthorized access', async () => {
      const response = await request(app)
        .get('/api/tasks')
        .expect(401);

      expect(response.body.error).toBe('Access token required');
    });
  });

  describe('POST /api/tasks', () => {
    it('should create a new task successfully', async () => {
      const taskData = {
        title: 'New Test Task',
        description: 'Test description',
        priority_id: 1,
        category_id: 1
      };

      const response = await request(app)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${authToken}`)
        .send(taskData)
        .expect(201);

      expect(response.body).toBeDefined();
      expect(response.body.title).toBe('Test Task'); // From mock
    });

    it('should validate required fields', async () => {
      const invalidTaskData = {
        description: 'Missing title'
      };

      const response = await request(app)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${authToken}`)
        .send(invalidTaskData)
        .expect(500); // Service layer validation

      expect(response.body.error).toContain('Validation failed');
    });
  });

  describe('PUT /api/tasks/:id', () => {
    it('should update a task successfully', async () => {
      const updateData = {
        title: 'Updated Task Title',
        completed: true
      };

      const response = await request(app)
        .put('/api/tasks/1')
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData)
        .expect(200);

      expect(response.body).toBeDefined();
      expect(response.body.title).toBe('Updated Task'); // From mock
    });

    it('should handle task not found', async () => {
      // Mock task not found
      supabase.from().select().eq().single.mockReturnValueOnce({
        data: null,
        error: { code: 'PGRST116' }
      });

      const response = await request(app)
        .put('/api/tasks/999')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ title: 'Updated' })
        .expect(404);

      expect(response.body.error).toBe('Task not found');
    });
  });

  describe('DELETE /api/tasks/:id', () => {
    it('should delete a task successfully', async () => {
      const response = await request(app)
        .delete('/api/tasks/1')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(204);

      expect(response.status).toBe(204);
    });
  });

  describe('GET /api/tasks/overdue', () => {
    it('should get overdue tasks', async () => {
      const overdueTasks = [
        { id: 1, title: 'Overdue Task', due_date: '2024-01-01', completed: false }
      ];

      supabase.from().select().eq().eq().lt().order.mockReturnValue({
        data: overdueTasks,
        error: null
      });

      const response = await request(app)
        .get('/api/tasks/overdue')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe('GET /api/tasks/completed-today', () => {
    it('should get tasks completed today', async () => {
      const completedTodayTasks = [
        { id: 1, title: 'Completed Today', completed: true }
      ];

      supabase.from().select().eq().eq().gte().lt.mockReturnValue({
        data: completedTodayTasks,
        error: null
      });

      const response = await request(app)
        .get('/api/tasks/completed-today')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe('POST /api/tasks/:id/subtasks', () => {
    it('should create a subtask', async () => {
      const subtaskData = {
        title: 'New Subtask',
        description: 'Subtask description'
      };

      const response = await request(app)
        .post('/api/tasks/1/subtasks')
        .set('Authorization', `Bearer ${authToken}`)
        .send(subtaskData)
        .expect(201);

      expect(response.body).toBeDefined();
    });
  });

  describe('GET /api/tasks/:id/subtasks', () => {
    it('should get subtasks for a task', async () => {
      const subtasks = [
        { id: 2, title: 'Subtask 1', parent_task_id: 1 },
        { id: 3, title: 'Subtask 2', parent_task_id: 1 }
      ];

      supabase.from().select().eq().order.mockReturnValue({
        data: subtasks,
        error: null
      });

      const response = await request(app)
        .get('/api/tasks/1/subtasks')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body).toHaveLength(2);
    });
  });
});