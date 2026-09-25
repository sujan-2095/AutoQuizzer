import { authService } from '../services/authService.js';

export const authController = {
  async register(req, res, next) {
    try {
      const { email } = req.body;
      const newUser = await authService.register(email);
      res.status(201).json({ user: newUser });
    } catch (error) {
      if (error.status) {
        return res.status(error.status).json({ error: error.message });
      }
      console.error('Registration error:', error);
      res.status(500).json({ error: 'Failed to register user' });
    }
  },

  async login(req, res, next) {
    try {
      const { email } = req.body;
      const user = await authService.login(email);
      res.json({ user });
    } catch (error) {
      if (error.status) {
        return res.status(error.status).json({ error: error.message });
      }
      console.error('Login error:', error);
      res.status(500).json({ error: 'Failed to login' });
    }
  },

  async getUser(req, res, next) {
    try {
      const { email } = req.params;
      const user = await authService.getUserByEmail(email);
      res.json({ user });
    } catch (error) {
      if (error.status) {
        return res.status(error.status).json({ error: error.message });
      }
      console.error('Get user error:', error);
      res.status(500).json({ error: 'Failed to get user' });
    }
  },
};

export default authController;
