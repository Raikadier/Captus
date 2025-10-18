// User controller - handles HTTP requests for users
import UserService from '../services/userService.js';

class UserController {
  constructor(supabase) {
    this.userService = new UserService(supabase);
  }

  // GET /api/users/profile
  async getProfile(req, res) {
    try {
      const userId = req.user.id;
      const user = await this.userService.getUserById(userId);
      res.json(user);
    } catch (error) {
      console.error('Error getting user profile:', error);
      res.status(500).json({ error: 'Failed to retrieve user profile' });
    }
  }

  // PUT /api/users/profile
  async updateProfile(req, res) {
    try {
      const userId = req.user.id;
      const updateData = req.body;

      const user = await this.userService.updateUser(userId, updateData);
      res.json(user);
    } catch (error) {
      console.error('Error updating user profile:', error);
      res.status(500).json({ error: 'Failed to update user profile' });
    }
  }

  // GET /api/users/stats
  async getUserStats(req, res) {
    try {
      const userId = req.user.id;
      const stats = await this.userService.getUserStats(userId);
      res.json(stats);
    } catch (error) {
      console.error('Error getting user stats:', error);
      res.status(500).json({ error: 'Failed to retrieve user statistics' });
    }
  }

  // POST /api/users/sync (for syncing from Supabase auth)
  async syncUserFromAuth(req, res) {
    try {
      const authUser = req.body.authUser;
      if (!authUser) {
        return res.status(400).json({ error: 'Auth user data required' });
      }

      const user = await this.userService.syncUserFromAuth(authUser);
      res.json(user);
    } catch (error) {
      console.error('Error syncing user from auth:', error);
      res.status(500).json({ error: 'Failed to sync user' });
    }
  }
}

export default UserController;