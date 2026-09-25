import { apiClient, ApiError } from '@/services/apiClient';
import { User } from '../types';

const CURRENT_USER_KEY = 'autoquizzer_currentUser';

export const loginUser = async (email: string): Promise<User | null> => {
  try {
    const data = await apiClient.post<{ user: User }>('/auth/login', { email });
    const user = data.user;
    sessionStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    return user;
  } catch (error) {
    console.error('Login error:', error);
    return null;
  }
};

export const registerUser = async (email: string): Promise<User | null> => {
  try {
    const data = await apiClient.post<{ user: User }>('/auth/register', { email });
    const user = data.user;
    sessionStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    return user;
  } catch (error) {
    if (error instanceof ApiError && error.status === 409) {
      return null; // User already exists
    }
    console.error('Registration error:', error);
    return null;
  }
};

export const logoutUser = (): void => {
  sessionStorage.removeItem(CURRENT_USER_KEY);
};

export const getCurrentUser = (): User | null => {
  const userJson = sessionStorage.getItem(CURRENT_USER_KEY);
  return userJson ? JSON.parse(userJson) : null;
};
