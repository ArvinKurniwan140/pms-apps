import api from '../utils/api';
import { AuthResponse, LoginCredentials, RegisterCredentials, User } from '../types/auth';

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  async register(credentials: RegisterCredentials): Promise<AuthResponse> {
    const response = await api.post('/auth/register', credentials);
    return response.data;
  },

  async logout(): Promise<void> {
    await api.post('/auth/logout');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  async getCurrentUser(): Promise<{ success: boolean; data: User }> {
    const response = await api.get('/auth/me');
    return response.data;
  },

  async refreshToken(): Promise<{ success: boolean; data: { token: string } }> {
    const response = await api.post('/auth/refresh');
    return response.data;
  },

  async changePassword(data: {
    current_password: string;
    new_password: string;
    new_password_confirmation: string;
  }): Promise<{ success: boolean; message: string }> {
    const response = await api.post('/auth/change-password', data);
    return response.data;
  }
};