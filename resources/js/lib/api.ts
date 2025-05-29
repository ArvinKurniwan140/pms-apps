import axios, { AxiosResponse } from 'axios';
import { AuthResponse, ApiResponse } from '@/types';

const API_URL = '/api'; // Karena same origin dengan Laravel

export const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
});

// Get token dari localStorage
const getToken = (): string | null => {
    if (typeof window !== 'undefined') {
        return localStorage.getItem('pms_token');
    }
    return null;
};

// Set token ke localStorage
const setToken = (token: string): void => {
    if (typeof window !== 'undefined') {
        localStorage.setItem('pms_token', token);
    }
};

// Remove token dari localStorage
const removeToken = (): void => {
    if (typeof window !== 'undefined') {
        localStorage.removeItem('pms_token');
    }
};

// Request interceptor untuk menambahkan token
api.interceptors.request.use(
    (config) => {
        const token = getToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor untuk handle token expired
api.interceptors.response.use(
    (response: AxiosResponse) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && error.response?.data?.error_code === 'TOKEN_EXPIRED' && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const refreshResponse = await api.post('/auth/refresh');
                const newToken = refreshResponse.data.data.token;
                
                setToken(newToken);
                
                // Retry original request dengan token baru
                originalRequest.headers.Authorization = `Bearer ${newToken}`;
                return api(originalRequest);
            } catch (refreshError) {
                // Refresh token juga expired, redirect ke login
                removeToken();
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export { getToken, setToken, removeToken };