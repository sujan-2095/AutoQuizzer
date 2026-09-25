import { userRepository } from '../repositories/userRepository.js';

export const authService = {
  async register(email) {
    if (!email || typeof email !== 'string') {
      const error = new Error('Email is required');
      error.status = 400;
      throw error;
    }

    const trimmedEmail = email.trim().toLowerCase();

    // Check if user already exists
    const existing = userRepository.findByEmail(trimmedEmail);
    if (existing) {
      const error = new Error('User already exists');
      error.status = 409;
      throw error;
    }

    const newUser = userRepository.createUser(trimmedEmail);
    return newUser;
  },

  async login(email) {
    if (!email || typeof email !== 'string') {
      const error = new Error('Email is required');
      error.status = 400;
      throw error;
    }

    const trimmedEmail = email.trim().toLowerCase();
    const user = userRepository.findByEmail(trimmedEmail);

    if (!user) {
      const error = new Error('User not found');
      error.status = 404;
      throw error;
    }

    return user;
  },

  async getUserByEmail(email) {
    if (!email || typeof email !== 'string') {
      const error = new Error('Email is required');
      error.status = 400;
      throw error;
    }

    const trimmedEmail = email.trim().toLowerCase();
    const user = userRepository.findByEmail(trimmedEmail);

    if (!user) {
      const error = new Error('User not found');
      error.status = 404;
      throw error;
    }

    return user;
  },
};

export default authService;
