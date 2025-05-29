// components/PermissionGate.tsx
import React from 'react';
import { usePermission } from '@/hooks/usePermission';

interface PermissionGateProps {
    children: React.ReactNode;
    permission?: string;
    permissions?: string[];
    role?: string;
    roles?: string[];
    requireAll?: boolean;
    fallback?: React.ReactNode;
}

export default function PermissionGate({
    children,
    permission,
    permissions = [],
    role,
    roles = [],
    requireAll = false,
    fallback = null
}: PermissionGateProps) {
    const { hasPermission, hasRole, hasAnyPermission, hasAllPermissions, hasAnyRole, hasAllRoles } = usePermission();

    let hasAccess = false;

    // Check single permission
    if (permission) {
        hasAccess = hasPermission(permission);
    }

    // Check multiple permissions
    if (permissions.length > 0) {
        hasAccess = requireAll ? hasAllPermissions(permissions) : hasAnyPermission(permissions);
    }

    // Check single role
    if (role) {
        hasAccess = hasRole(role);
    }

    // Check multiple roles
    if (roles.length > 0) {
        hasAccess = requireAll ? hasAllRoles(roles) : hasAnyRole(roles);
    }

    // If both permissions and roles are provided, check both
    if ((permission || permissions.length > 0) && (role || roles.length > 0)) {
        const permissionCheck = permission ? hasPermission(permission) : 
                               requireAll ? hasAllPermissions(permissions) : hasAnyPermission(permissions);
        const roleCheck = role ? hasRole(role) : 
                         requireAll ? hasAllRoles(roles) : hasAnyRole(roles);
        
        hasAccess = requireAll ? (permissionCheck && roleCheck) : (permissionCheck || roleCheck);
    }

    return hasAccess ? <>{children}</> : <>{fallback}</>;
}

// components/Can.tsx - Alternative component dengan sintaks yang lebih sederhana
interface CanProps {
    children: React.ReactNode;
    do: string | string[];
    role?: string | string[];
    requireAll?: boolean;
    fallback?: React.ReactNode;
}

export function Can({ children, do: permissions, role, requireAll = false, fallback = null }: CanProps) {
    const permissionArray = Array.isArray(permissions) ? permissions : [permissions];
    const roleArray = role ? (Array.isArray(role) ? role : [role]) : [];

    return (
        <PermissionGate
            permissions={permissionArray}
            roles={roleArray}
            requireAll={requireAll}
            fallback={fallback}
        >
            {children}
        </PermissionGate>
    );
}

// components/Cannot.tsx - Komponen untuk menampilkan konten jika TIDAK memiliki permission
interface CannotProps {
    children: React.ReactNode;
    do: string | string[];
    role?: string | string[];
    requireAll?: boolean;
}

export function Cannot({ children, do: permissions, role, requireAll = false }: CannotProps) {
    const permissionArray = Array.isArray(permissions) ? permissions : [permissions];
    const roleArray = role ? (Array.isArray(role) ? role : [role]) : [];

    const { hasPermission, hasRole, hasAnyPermission, hasAllPermissions, hasAnyRole, hasAllRoles } = usePermission();

    let hasAccess = false;

    // Check permissions
    if (permissionArray.length === 1) {
        hasAccess = hasPermission(permissionArray[0]);
    } else if (permissionArray.length > 1) {
        hasAccess = requireAll ? hasAllPermissions(permissionArray) : hasAnyPermission(permissionArray);
    }

    // Check roles
    if (roleArray.length === 1) {
        hasAccess = hasRole(roleArray[0]);
    } else if (roleArray.length > 1) {
        hasAccess = requireAll ? hasAllRoles(roleArray) : hasAnyRole(roleArray);
    }

    // If both permissions and roles are provided
    if (permissionArray.length > 0 && roleArray.length > 0) {
        const permissionCheck = permissionArray.length === 1 ? hasPermission(permissionArray[0]) : 
                               requireAll ? hasAllPermissions(permissionArray) : hasAnyPermission(permissionArray);
        const roleCheck = roleArray.length === 1 ? hasRole(roleArray[0]) : 
                         requireAll ? hasAllRoles(roleArray) : hasAnyRole(roleArray);
        
        hasAccess = requireAll ? (permissionCheck && roleCheck) : (permissionCheck || roleCheck);
    }

    return !hasAccess ? <>{children}</> : null;
}