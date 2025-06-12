import { useAuth } from '@/contexts/AuthContext';

export const usePermissions = () => {
    const { hasRole, hasPermission, hasAnyRole, hasAnyPermission, user } = useAuth();

    // Permission checks based on the new structure
    const canManageUsers = () => hasPermission('manage-users');
    const canCreateProject = () => hasPermission('create-project');
    const canUpdateProject = () => hasPermission('update-project');
    const canDeleteProject = () => hasPermission('delete-project');
    const canAssignTasks = () => hasPermission('assign-tasks');
    const canUpdateTasks = () => hasPermission('update-tasks');
    const canCommentTasks = () => hasPermission('comment-tasks');
    const canViewDashboard = () => hasPermission('view-dashboard');
    const canViewProjects = () => hasPermission('view-projects');
    const canViewTasks = () => hasPermission('view-tasks');
    const canDeleteTasks = () => hasPermission('delete-tasks');
    const canManageRoles = () => hasPermission('manage-roles');

    // Role checks
    const isAdmin = () => hasRole('Admin');
    const isProjectManager = () => hasRole('Project Manager');
    const isTeamMember = () => hasRole('Team Member');
    const isManagerOrAdmin = () => hasAnyRole(['Admin', 'Project Manager']);

    // Combined permission checks for common use cases
    const canManageProjects = () => canCreateProject() || canUpdateProject() || canDeleteProject();
    const canManageTasks = () => canAssignTasks() || canUpdateTasks() || canDeleteTasks();
    const hasBasicAccess = () => canViewDashboard() && canViewProjects() && canViewTasks();

    return {
        // Role checks
        isAdmin,
        isProjectManager,
        isTeamMember,
        isManagerOrAdmin,

        // Individual permission checks
        canManageUsers,
        canManageRoles,
        canCreateProject,
        canUpdateProject,
        canDeleteProject,
        canAssignTasks,
        canUpdateTasks,
        canDeleteTasks,
        canCommentTasks,
        canViewDashboard,
        canViewProjects,
        canViewTasks,

        // Combined permission checks
        canManageProjects,
        canManageTasks,
        hasBasicAccess,

        // General utilities
        hasRole,
        hasPermission,
        hasAnyRole,
        hasAnyPermission,
        user,
    };
};