import { lazy, Suspense } from 'react';
import type { RouteObject } from 'react-router';
import { Outlet } from 'react-router';
import RoleGuard from '../guards/RoleGuard';
import RoleBasedRedirect from '../components/auth/RoleBasedRedirect';
import { adminRoutes } from './AdminRoutes';
import { employeeRoutes } from './EmployeeRoutes';

// Lazy load pages for better performance
const SignIn = lazy(() => import('../pages/AuthPages/SignIn'));
const NotFound = lazy(() => import('../pages/OtherPage/NotFound'));
const Unauthorized = lazy(() => import('../pages/OtherPage/Unauthorized'));

// Loading fallback component
const PageLoader = () => (
    <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>
);

// Wrap lazy loaded components with Suspense
const withSuspense = (Component: React.LazyExoticComponent<any>) => (
    <Suspense fallback={<PageLoader />}>
        <Component />
    </Suspense>
);

/**
 * Application Routes Configuration
 * Role-based routing:
 * - Admin routes: /admin/* (admin, hr_manager, department_manager)
 * - Employee routes: /employee/* (employee)
 */
export const routes: RouteObject[] = [
    // Root - Redirect based on role
    {
        path: '/',
        element: <RoleBasedRedirect />,
    },
    
    // Admin Routes (Protected by RoleGuard)
    {
        element: (
            <RoleGuard allowedRoles={['admin', 'hr_manager', 'department_manager']}>
                <Outlet />
            </RoleGuard>
        ),
        children: adminRoutes,
    },
    
    // Employee Routes (Protected by RoleGuard)
    {
        element: (
            <RoleGuard allowedRoles={['employee']}>
                <Outlet />
            </RoleGuard>
        ),
        children: employeeRoutes,
    },
    
    // Public Routes
    {
        path: '/signin',
        element: withSuspense(SignIn),
    },
    
    // Error Routes
    {
        path: '/unauthorized',
        element: withSuspense(Unauthorized),
    },
    
    // Fallback Route
    {
        path: '*',
        element: withSuspense(NotFound),
    },
];

