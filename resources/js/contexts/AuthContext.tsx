import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, AuthResponse, LoginCredentials, RegisterCredentials } from '@/types';
import { api, getToken, setToken, removeToken } from '@/lib/api';

interface AuthContextType {
    user: User | null;
    token: string | null;
    login: (credentials: LoginCredentials) => Promise<AuthResponse>;
    register: (credentials: RegisterCredentials) => Promise<AuthResponse>;
    logout: () => Promise<void>;
    refreshToken: () => Promise<void>;
    isAuthenticated: boolean;
    isLoading: boolean;
    hasRole: (role: string) => boolean;
    hasPermission: (permission: string) => boolean;
    hasAnyRole: (roles: string[]) => boolean;
    hasAnyPermission: (permissions: string[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
    initialUser?: User;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ 
    children, 
    initialUser 
}) => {
    const [user, setUser] = useState<User | null>(initialUser || null);
    const [token, setTokenState] = useState<string | null>(getToken());
    const [isLoading, setIsLoading] = useState(false);

    const isAuthenticated = !!user && !!token;

    // Load user data saat pertama kali mount jika ada token
    useEffect(() => {
        if (token && !user) {
            fetchUser();
        }
    }, [token, user]);

    const fetchUser = async () => {
        try {
            setIsLoading(true);
            const response = await api.get('/auth/me');
            if (response.data.success) {
                setUser(response.data.data);
            }
        } catch (error) {
            console.error('Failed to fetch user:', error);
            handleLogout();
        } finally {
            setIsLoading(false);
        }
    };

    const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
        try {
            setIsLoading(true);
            const response = await api.post('/auth/login', credentials);
            
            if (response.data.success) {
                const { user: userData, token: userToken } = response.data.data;
                setUser(userData);
                setToken(userToken);
                setTokenState(userToken);
            }
            
            return response.data;
        } catch (error: any) {
            throw error.response?.data || { success: false, message: 'Login failed' };
        } finally {
            setIsLoading(false);
        }
    };

    const register = async (credentials: RegisterCredentials): Promise<AuthResponse> => {
        try {
            setIsLoading(true);
            const response = await api.post('/auth/register', credentials);
            
            if (response.data.success) {
                const { user: userData, token: userToken } = response.data.data;
                setUser(userData);
                setToken(userToken);
                setTokenState(userToken);
            }
            
            return response.data;
        } catch (error: any) {
            throw error.response?.data || { success: false, message: 'Registration failed' };
        } finally {
            setIsLoading(false);
        }
    };

    const logout = async (): Promise<void> => {
        try {
            await api.post('/auth/logout');
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            handleLogout();
        }
    };

    const handleLogout = () => {
        setUser(null);
        setTokenState(null);
        removeToken();
    };

    const refreshToken = async (): Promise<void> => {
        try {
            const response = await api.post('/auth/refresh');
            if (response.data.success) {
                const newToken = response.data.data.token;
                setToken(newToken);
                setTokenState(newToken);
            }
        } catch (error) {
            console.error('Token refresh failed:', error);
            handleLogout();
        }
    };

    // Role and permission helpers
    const hasRole = (role: string): boolean => {
        return user?.roles?.includes(role) || false;
    };

    const hasPermission = (permission: string): boolean => {
        return user?.permissions?.includes(permission) || false;
    };

    const hasAnyRole = (roles: string[]): boolean => {
        return roles.some(role => hasRole(role));
    };

    const hasAnyPermission = (permissions: string[]): boolean => {
        return permissions.some(permission => hasPermission(permission));
    };

    const value: AuthContextType = {
        user,
        token,
        login,
        register,
        logout,
        refreshToken,
        isAuthenticated,
        isLoading,
        hasRole,
        hasPermission,
        hasAnyRole,
        hasAnyPermission,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};