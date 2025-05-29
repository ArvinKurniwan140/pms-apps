export interface User {
  id: number;
  name: string;
  email: string;
  profile_photo?: string;
  roles: string[];
  permissions: string[];
  created_at: string;
  updated_at: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    token: string;
    token_type: string;
    expires_in: number;
  };
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  hasRole: (role: string) => boolean;
  hasPermission: (permission: string) => boolean;
  loading: boolean;
}