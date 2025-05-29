import React, { ReactNode } from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface RoleBasedComponentProps {
    children: ReactNode;
    allowedRoles?: string[];
    allowedPermissions?: string[];
    requireAll?: boolean;
    fallback?: ReactNode;
}

export const RoleBasedComponent: React.FC<RoleBasedComponentProps> = ({
    children,
    allowedRoles = [],
    allowedPermissions = [],
    requireAll = false,
    fallback = null,
}) => {
    const { hasAnyRole, hasAnyPermission, hasRole, hasPermission } = useAuth();

    let hasAccess = true;

    // Check roles
    if (allowedRoles.length > 0) {
        hasAccess = requireAll 
            ? allowedRoles.every(role => hasRole(role))
            : hasAnyRole(allowedRoles);
    }

    // Check permissions
    if (hasAccess && allowedPermissions.length > 0) {
        const permissionCheck = requireAll
            ? allowedPermissions.every(permission => hasPermission(permission))
            : hasAnyPermission(allowedPermissions);
        
        hasAccess = hasAccess && permissionCheck;
    }

    return hasAccess ? <>{children}</> : <>{fallback}</>;
};

// Shorthand components untuk role spesifik
export const AdminOnly: React.FC<{ children: ReactNode; fallback?: ReactNode }> = ({ 
    children, 
    fallback = null 
}) => (
    <RoleBasedComponent allowedRoles={['admin']} fallback={fallback}>
        {children}
    </RoleBasedComponent>
);

export const ManagerOnly: React.FC<{ children: ReactNode; fallback?: ReactNode }> = ({ 
    children, 
    fallback = null 
}) => (
    <RoleBasedComponent 
        allowedRoles={['admin', 'project-manager']} 
        fallback={fallback}
    >
        {children}
    </RoleBasedComponent>
);

export const MemberOnly: React.FC<{ children: ReactNode; fallback?: ReactNode }> = ({ 
    children, 
    fallback = null 
}) => (
    <RoleBasedComponent 
        allowedRoles={['admin', 'project-manager', 'team-member']} 
        fallback={fallback}
    >
        {children}
    </RoleBasedComponent>
);