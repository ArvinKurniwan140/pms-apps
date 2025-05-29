export const PERMISSIONS = {
    // User Management
    MANAGE_USERS: 'manage users',
    
    // Project Management
    CREATE_PROJECT: 'create project',
    UPDATE_PROJECT: 'update project',
    DELETE_PROJECT: 'delete project',
    
    // Task Management
    ASSIGN_TASKS: 'assign tasks',
    UPDATE_TASKS: 'update tasks',
    COMMENT_TASKS: 'comment tasks',
    
    // Dashboard
    VIEW_DASHBOARD: 'view dashboard',
} as const;

export const ROLES = {
    ADMIN: 'Admin',
    PROJECT_MANAGER: 'Project Manager',
    TEAM_MEMBER: 'Team Member',
} as const;