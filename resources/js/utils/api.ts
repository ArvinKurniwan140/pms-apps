import axios, { AxiosError, AxiosResponse } from 'axios';

// Untuk Vite, gunakan VITE_ prefix, bukan NEXT_PUBLIC_
const API_URL = import.meta.env.VITE_API_URL || '/api';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-Requested-With': 'XMLHttpRequest', // Important for Laravel
  },
  withCredentials: true, // Important for CSRF
  timeout: 10000, // 10 second timeout
});

// Flag untuk mencegah multiple refresh calls
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value: any) => void;
  reject: (error: any) => void;
}> = [];

const processQueue = (error: AxiosError | null, token: string | null = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token);
    }
  });
  
  failedQueue = [];
};

// Request interceptor untuk menambahkan token
api.interceptors.request.use(
  (config) => {
    // Get token from localStorage (akan diganti dengan context nanti)
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Add CSRF token if available
    const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
    if (csrfToken) {
      config.headers['X-CSRF-TOKEN'] = csrfToken;
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor untuk handle token expired
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as any;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // Jika sedang refresh, queue request ini
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(token => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api.request(originalRequest);
        }).catch(err => {
          return Promise.reject(err);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      if (error.response?.data?.error_code === 'TOKEN_EXPIRED') {
        try {
          const refreshResponse = await api.post('/auth/refresh');
          const newToken = refreshResponse.data.data.token;
          
          localStorage.setItem('token', newToken);
          
          // Process queued requests
          processQueue(null, newToken);
          
          // Retry original request dengan token baru
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return api.request(originalRequest);
        } catch (refreshError) {
          // Refresh token juga expired, hapus token dan redirect ke login
          processQueue(refreshError as AxiosError, null);
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          
          // Dispatch event untuk AuthContext
          window.dispatchEvent(new CustomEvent('auth:logout'));
          
          // Only redirect if not already on login page
          if (!window.location.pathname.includes('/login')) {
            window.location.href = '/login';
          }
        } finally {
          isRefreshing = false;
        }
      } else {
        // Token invalid, hapus dan redirect
        processQueue(error, null);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        
        // Dispatch event untuk AuthContext
        window.dispatchEvent(new CustomEvent('auth:logout'));
        
        if (!window.location.pathname.includes('/login')) {
          window.location.href = '/login';
        }
      }
    }

    return Promise.reject(error);
  }
);

export default api;