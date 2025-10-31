// Integration tests for authentication
import request from 'supertest';
import express from 'express';
import jwt from 'jsonwebtoken';
import { createClient } from '@supabase/supabase-js';

// Mock Supabase
jest.mock('@supabase/supabase-js', () => ({
  createClient: jest.fn(() => ({
    auth: {
      signInWithPassword: jest.fn(),
      signUp: jest.fn(),
      signOut: jest.fn()
    },
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          single: jest.fn()
        }))
      })),
      upsert: jest.fn(() => ({
        select: jest.fn(() => ({
          single: jest.fn()
        }))
      }))
    }))
  }))
}));

// Import after mocking
import app from '../server.js';

const JWT_SECRET = 'test_jwt_secret';

describe('Authentication Integration Tests', () => {
  let server;
  let supabase;

  beforeAll(() => {
    // Set test environment variables
    process.env.JWT_SECRET = JWT_SECRET;
    process.env.SUPABASE_URL = 'https://test.supabase.co';
    process.env.SUPABASE_ANON_KEY = 'test-anon-key';

    supabase = createClient();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/auth/register', () => {
    it('should register a new user successfully', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User'
      };

      const mockSupabaseUser = {
        id: 'user-123',
        email: userData.email,
        user_metadata: { name: userData.name }
      };

      supabase.auth.signUp.mockResolvedValue({
        data: { user: mockSupabaseUser },
        error: null
      });

      supabase.from().upsert.mockReturnValue({
        select: jest.fn(() => ({
          single: jest.fn(() => ({
            data: { ...mockSupabaseUser, name: userData.name },
            error: null
          }))
        }))
      });

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(200);

      expect(response.body.user).toBeDefined();
      expect(response.body.user.email).toBe(userData.email);
    });

    it('should handle registration errors', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User'
      };

      supabase.auth.signUp.mockResolvedValue({
        data: null,
        error: { message: 'User already exists' }
      });

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(400);

      expect(response.body.error).toBe('User already exists');
    });
  });

  describe('POST /api/auth/login', () => {
    it('should login user successfully', async () => {
      const loginData = {
        email: 'test@example.com',
        password: 'password123'
      };

      const mockSupabaseUser = {
        id: 'user-123',
        email: loginData.email
      };

      supabase.auth.signInWithPassword.mockResolvedValue({
        data: {
          user: mockSupabaseUser,
          session: { access_token: 'mock-token' }
        },
        error: null
      });

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect(200);

      expect(response.body.user).toBeDefined();
      expect(response.body.token).toBeDefined();
      expect(response.body.session).toBeDefined();

      // Verify JWT token
      const decoded = jwt.verify(response.body.token, JWT_SECRET);
      expect(decoded.id).toBe(mockSupabaseUser.id);
      expect(decoded.email).toBe(mockSupabaseUser.email);
    });

    it('should handle login errors', async () => {
      const loginData = {
        email: 'test@example.com',
        password: 'wrongpassword'
      };

      supabase.auth.signInWithPassword.mockResolvedValue({
        data: null,
        error: { message: 'Invalid credentials' }
      });

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect(400);

      expect(response.body.error).toBe('Invalid credentials');
    });
  });

  describe('POST /api/auth/logout', () => {
    it('should logout user successfully', async () => {
      const token = jwt.sign({ id: 'user-123', email: 'test@example.com' }, JWT_SECRET);

      supabase.auth.signOut.mockResolvedValue({
        error: null
      });

      const response = await request(app)
        .post('/api/auth/logout')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.message).toBe('Logged out successfully');
    });

    it('should handle logout without authentication', async () => {
      const response = await request(app)
        .post('/api/auth/logout')
        .expect(401);

      expect(response.body.error).toBe('Access token required');
    });
  });
});