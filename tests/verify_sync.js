
// Verification Script for User Sync Logic
// Simulates a request to syncUser

import { UserController } from '../backend/src/controllers/UserController.js';
import UserService from '../backend/src/services/UserService.js';
import User from '../backend/src/models/UserModels.js';

// Mock Express Request/Response
const mockReq = {
  user: {
    id: 'test-uuid-1234',
    email: 'test@student.com',
    role: 'student',
    name: 'Test Student'
  }
};

const mockRes = {
  status: function(code) {
    this.statusCode = code;
    return this;
  },
  json: function(data) {
    this.body = data;
    return this;
  }
};

// Mock UserService directly since we can't connect to real Supabase
// We override the syncUserFromAuth method for testing
const originalSync = UserService.prototype.syncUserFromAuth;
UserService.prototype.syncUserFromAuth = async (authUser) => {
  console.log('Mock Service: Syncing user...', authUser);
  return new User({
    id: authUser.id,
    email: authUser.email,
    name: authUser.user_metadata.name,
    role: authUser.user_metadata.role,
    created_at: new Date(),
    updated_at: new Date()
  });
};

async function runTest() {
  console.log('Starting Verification Test...');

  const userController = new UserController();

  try {
    await userController.syncUser(mockReq, mockRes);

    if (mockRes.statusCode === 200 && mockRes.body.success === true) {
        console.log('✅ Test Passed: syncUser controller returned 200 OK');
        console.log('Response:', mockRes.body);
    } else {
        console.error('❌ Test Failed: Unexpected response', mockRes);
    }
  } catch (e) {
      console.error('❌ Test Failed with Exception:', e);
  }
}

runTest();
