export interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at: string;
    profile_photo?: string;
    roles: string[];
    permissions: string[];
    created_at: string;
    updated_at: string;
}

export interface Project {
    id: number;
    name: string;
    description: string;
    start_date: string;
    end_date: string;
    status: 'planning' | 'active' | 'completed' | 'cancelled';
    created_by: number;
    created_at: string;
    updated_at: string;
    creator?: User;
    members?: ProjectMember[];
    tasks?: Task[];
}

export interface Task {
    id: number;
    project_id: number;
    title: string;
    description: string;
    assigned_to?: number;
    priority: 'low' | 'medium' | 'high';
    status: 'todo' | 'in_progress' | 'done';
    due_date?: string;
    created_by: number;
    created_at: string;
    updated_at: string;
    project?: Project;
    assignee?: User;
    creator?: User;
    comments?: Comment[];
}

export interface Comment {
    id: number;
    task_id: number;
    user_id: number;
    content: string;
    created_at: string;
    updated_at: string;
    user?: User;
    task?: Task;
}

export interface ProjectMember {
    id: number;
    project_id: number;
    user_id: number;
    role: 'manager' | 'member';
    joined_at: string;
    user?: User;
    project?: Project;
}

export interface Role {
    id: number;
    name: string;
    permissions: Permission[];
}

export interface Permission {
    id: number;
    name: string;
}

// Auth Types
export interface AuthResponse {
    success: boolean;
    message: string;
    data: {
        user: User;
        token: string;
        token_type: string;
        expires_in: number;
    };
    errors?: Record<string, string>;
}

export interface ApiResponse<T = any> {
    success: boolean;
    message: string;
    data?: T;
    error?: string;
}

export interface LoginCredentials {
    email: string;
    password: string;
    remember?: boolean;
}

export interface RegisterCredentials {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
}

export type PageProps<T extends Record<string, unknown> = Record<string, unknown>> = T & {
    auth: {
        user: User;
    };
};