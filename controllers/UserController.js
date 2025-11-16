import { UserService } from "../service/UserService.js";

const userService = new UserService();

export class UserController {
  constructor() {
    // Middleware para inyectar usuario en el servicio
    this.injectUser = (req, res, next) => {
      if (req.user) {
        userService.setCurrentUser(req.user);
      }
      next();
    };
  }

  async register(req, res) {
    const result = await userService.register(req.body);
    res.status(result.success ? 201 : 400).json(result);
  }

  async login(req, res) {
    const { username, password } = req.body;
    const result = await userService.login(username, password);
    res.status(result.success ? 200 : 401).json(result);
  }

  async getProfile(req, res) {
    const result = await userService.getProfile();
    res.status(result.success ? 200 : 401).json(result);
  }

  async updateProfile(req, res) {
    const result = await userService.updateProfile(req.body);
    res.status(result.success ? 200 : 400).json(result);
  }

  async changePassword(req, res) {
    const { currentPassword, newPassword } = req.body;
    const result = await userService.changePassword(currentPassword, newPassword);
    res.status(result.success ? 200 : 400).json(result);
  }

  async isEmailRegistered(req, res) {
    const { email } = req.body;
    const result = await userService.isEmailRegistered(email);
    res.status(200).json(result);
  }
}