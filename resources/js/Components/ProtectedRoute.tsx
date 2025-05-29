import React, { ReactNode, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { router } from '@inertiajs/react';

interface ProtectedRouteProps {
    children: ReactNode;
    requiredRole?: string;
    requiredPermission?: string;
    requiredRoles?: string[];
    requiredPermissions?: string[];
    requireAll?: boolean; // true = AND logic, false = OR logic
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
    children,
    requiredRole,
    requiredPermission,
    requiredRoles = [],
    requiredPermissions = [],
    requireAll = false,
}) => {
    const { isAuthenticated, hasRole, hasPermission, hasAnyRole, hasAnyPermission, isLoading } = useAuth();

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.visit('/login', { replace: true });
        }
    }, [isAuthenticated, isLoading]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading...</p>
                </div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <p className="text-gray-600">Redirecting to login...</p>
                </div>
            </div>
        );
    }

    // Check single role
    if (requiredRole && !hasRole(requiredRole)) {
        router.visit('/unauthorized', { replace: true });
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <p className="text-gray-600">Access denied. Redirecting...</p>
                </div>
            </div>
        );
    }

    // Check single permission
    if (requiredPermission && !hasPermission(requiredPermission)) {
        router.visit('/unauthorized', { replace: true });
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <p className="text-gray-600">Access denied. Redirecting...</p>
                </div>
            </div>
        );
    }

    // Check multiple roles
    if (requiredRoles.length > 0) {
        const roleCheck = requireAll 
            ? requiredRoles.every(role => hasRole(role))
            : hasAnyRole(requiredRoles);
        
        if (!roleCheck) {
            router.visit('/unauthorized', { replace: true });
            return (
                <div className="flex items-center justify-center min-h-screen">
                    <div className="text-center">
                        <p className="text-gray-600">Access denied. Redirecting...</p>
                    </div>
                </div>
            );
        }
    }

    // Check multiple permissions
    if (requiredPermissions.length > 0) {
        const permissionCheck = requireAll
            ? requiredPermissions.every(permission => hasPermission(permission))
            : hasAnyPermission(requiredPermissions);
        
        if (!permissionCheck) {
            router.visit('/unauthorized', { replace: true });
            return (
                <div className="flex items-center justify-center min-h-screen">
                    <div className="text-center">
                        <p className="text-gray-600">Access denied. Redirecting...</p>
                    </div>
                </div>
            );
        }
    }

    return <>{children}</>;
};