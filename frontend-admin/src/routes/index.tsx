import { lazy, Suspense } from 'react';
import type { RouteObject } from 'react-router';
import AppLayout from '../layout/AppLayout';
import AdminRoute from '../components/auth/AdminRoute';

// Lazy load pages for better performance
const Home = lazy(() => import('../pages/Dashboard/Home'));
const SignIn = lazy(() => import('../pages/AuthPages/SignIn'));
const NotFound = lazy(() => import('../pages/OtherPage/NotFound'));

// Employee Management
const EmployeeList = lazy(() => import('../pages/Employees/EmployeeList'));
const AddEmployee = lazy(() => import('../pages/Employees/AddEmployee'));
const EditEmployee = lazy(() => import('../pages/Employees/EditEmployee'));
const DepartmentList = lazy(() => import('../pages/Employees/DepartmentList'));

// Attendance
const AttendanceList = lazy(() => import('../pages/Attendance/AttendanceList'));
const AttendanceHistory = lazy(() => import('../pages/Attendance/AttendanceHistory'));

// Leave Management (future)
const LeaveRequest = lazy(() => import('../pages/Leave/LeaveRequest'));
const LeaveApproval = lazy(() => import('../pages/Leave/LeaveApproval'));

// Settings
const UserManagement = lazy(() => import('../pages/Settings/UserManagement'));

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
 */
export const routes: RouteObject[] = [
    // Protected Admin Routes
    {
        element: (
            <AdminRoute>
                <AppLayout />
            </AdminRoute>
        ),
        children: [
            {
                index: true,
                path: '/',
                element: withSuspense(Home),
            },
            
            // Employee Management
            {
                path: '/employees',
                element: withSuspense(EmployeeList),
            },
            {
                path: '/employees/add',
                element: withSuspense(AddEmployee),
            },
            {
                path: '/employees/edit/:id',
                element: withSuspense(EditEmployee),
            },
            {
                path: '/departments',
                element: withSuspense(DepartmentList),
            },
            
            // Attendance
            {
                path: '/attendance',
                element: withSuspense(AttendanceList),
            },
            {
                path: '/attendance/history',
                element: withSuspense(AttendanceHistory),
            },
            
            // Leave Management (future)
            {
                path: '/leave',
                element: withSuspense(LeaveRequest),
            },
            {
                path: '/leave/approval',
                element: withSuspense(LeaveApproval),
            },
            {
                path: '/leave/history',
                element: withSuspense(AttendanceHistory), // Reuse for now
            },
            
            // Settings
            {
                path: '/users',
                element: withSuspense(UserManagement),
            },
            {
                path: '/settings',
                element: withSuspense(UserManagement),
            },
        ],
    },
    
    // Public Routes
    {
        path: '/signin',
        element: withSuspense(SignIn),
    },
    
    // Fallback Route
    {
        path: '*',
        element: withSuspense(NotFound),
    },
];
