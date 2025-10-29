// Unit tests for UserService
import UserService from '../backend/src/services/userService.js';
import User from '../backend/src/models/user.js';

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
      }))
    })),
    upsert: jest.fn(() => ({
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
};

describe('UserService', () => {
  let userService;

  beforeEach(() => {
    userService = new UserService(mockSupabase);
    jest.clearAllMocks();
  });

  describe('getUserById', () => {
    it('should return user for valid id', async () => {
      const userId = 'user-123';
      const mockUserData = {
        id: userId,
        email: 'test@example.com',
        name: 'Test User'
      };

      mockSupabase.from.mockReturnValue({
        select: jest.fn(() => ({
          eq: jest.fn(() => ({
            single: jest.fn(() => ({
              data: mockUserData,
              error: null
            }))
          }))
        }))
      });

      const result = await userService.getUserById(userId);

      expect(result).toBeInstanceOf(User);
      expect(result.id).toBe(userId);
      expect(result.email).toBe('test@example.com');
    });

    it('should throw error for non-existent user', async () => {
      const userId = 'non-existent';

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

      await expect(userService.getUserById(userId)).rejects.toThrow('User not found');
    });
  });

  describe('syncUserFromAuth', () => {
    it('should sync user from Supabase auth', async () => {
      const authUser = {
        id: 'user-123',
        email: 'test@example.com',
        user_metadata: { name: 'Test User' },
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z'
      };

      const mockUserData = {
        id: authUser.id,
        email: authUser.email,
        name: 'Test User'
      };

      mockSupabase.from.mockReturnValue({
        upsert: jest.fn(() => ({
          select: jest.fn(() => ({
            single: jest.fn(() => ({
              data: mockUserData,
              error: null
            }))
          }))
        }))
      });

      const result = await userService.syncUserFromAuth(authUser);

      expect(result).toBeInstanceOf(User);
      expect(result.id).toBe(authUser.id);
      expect(result.name).toBe('Test User');
    });
  });

  describe('updateUser', () => {
    it('should update user successfully', async () => {
      const userId = 'user-123';
      const updateData = { name: 'Updated Name' };

      const existingUser = {
        id: userId,
        email: 'test@example.com',
        name: 'Original Name'
      };

      const updatedUser = {
        ...existingUser,
        ...updateData,
        updated_at: new Date()
      };

      // Mock getUserById
      userService.getUserById = jest.fn(() => Promise.resolve(User.fromDatabase(existingUser)));

      mockSupabase.from.mockReturnValue({
        update: jest.fn(() => ({
          eq: jest.fn(() => ({
            select: jest.fn(() => ({
              single: jest.fn(() => ({
                data: updatedUser,
                error: null
              }))
            }))
          }))
        }))
      });

      const result = await userService.updateUser(userId, updateData);

      expect(result.name).toBe('Updated Name');
    });

    it('should throw error for invalid user data', async () => {
      const userId = 'user-123';
      const updateData = { email: 'invalid-email' }; // Invalid email

      const existingUser = {
        id: userId,
        email: 'test@example.com',
        name: 'Test User'
      };

      userService.getUserById = jest.fn(() => Promise.resolve(User.fromDatabase(existingUser)));

      await expect(userService.updateUser(userId, updateData)).rejects.toThrow('Validation failed');
    });
  });

  describe('getUserStats', () => {
    it('should return user statistics', async () => {
      const userId = 'user-123';

      const mockTasks = [
        { id: 1, completed: true },
        { id: 2, completed: false },
        { id: 3, completed: true }
      ];

      const mockStreak = {
        user_id: userId,
        current_streak: 5
      };

      // Mock tasks query
      mockSupabase.from
        .mockReturnValueOnce({
          select: jest.fn(() => ({
            eq: jest.fn(() => ({
              data: mockTasks,
              error: null
            }))
          }))
        })
        // Mock streak query
        .mockReturnValueOnce({
          select: jest.fn(() => ({
            eq: jest.fn(() => ({
              single: jest.fn(() => ({
                data: mockStreak,
                error: null
              }))
            }))
          }))
        });

      const result = await userService.getUserStats(userId);

      expect(result.totalTasks).toBe(3);
      expect(result.completedTasks).toBe(2);
      expect(result.pendingTasks).toBe(1);
      expect(result.currentStreak).toBe(5);
    });
  });
});
