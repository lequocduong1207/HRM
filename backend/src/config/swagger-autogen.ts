import swaggerAutogen from 'swagger-autogen';
import path from 'path';
import { fileURLToPath } from 'url';
import { authSwaggerDocs } from '../docs/auth.docs.js';
import { employeeSwaggerDocs } from '../docs/employee.docs.js';
import { userSwaggerDocs } from '../docs/user.docs.js';
import { attendanceSwaggerDocs } from '../docs/attendance.docs.js';
import { departmentSwaggerDocs } from '../docs/department.docs.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const doc = {
    info: {
        title: 'HRM API Documentation',
        version: '1.0.0',
        description: 'API documentation for Human Resource Management System'
    },
    host: `localhost:${process.env.PORT || 5000}`,
    basePath: '/api/v1',
    schemes: ['http', 'https'],
    consumes: ['application/json'],
    produces: ['application/json'],
    tags: [
        { name: 'Auth', description: 'Authentication endpoints' },
        { name: 'Users', description: 'User management endpoints (Admin only)' },
        { name: 'Employees', description: 'Employee management endpoints' },
        { name: 'Attendances', description: 'Attendance management endpoints' },
        { name: 'Departments', description: 'Department management endpoints' }
    ],
    securityDefinitions: {
        bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT'
        }
    },
    components: {
        schemas: {
            // ========================================
            // AUTH SCHEMAS
            // ========================================
            RegisterRequest: authSwaggerDocs.register.requestBody.content['application/json'].schema,
            LoginRequest: authSwaggerDocs.login.requestBody.content['application/json'].schema,
            RegisterResponse: authSwaggerDocs.register.responses[201].content['application/json'].schema,
            UpdateProfileRequest: authSwaggerDocs.updateProfile.requestBody.content['application/json'].schema,
            ChangePasswordRequest: authSwaggerDocs.changePassword.requestBody.content['application/json'].schema,
            ForgotPasswordRequest: authSwaggerDocs.forgotPassword.requestBody.content['application/json'].schema,
            ResetPasswordRequest: authSwaggerDocs.resetPassword.requestBody.content['application/json'].schema,
            RefreshTokenRequest: authSwaggerDocs.refreshToken.requestBody.content['application/json'].schema,
            
            // ========================================
            // EMPLOYEE SCHEMAS
            // ========================================
            EmployeeCreateRequest: employeeSwaggerDocs.createEmployee.requestBody.content['application/json'].schema,
            EmployeeUpdateRequest: employeeSwaggerDocs.updateEmployee.requestBody.content['application/json'].schema,
            EmploymentStatusUpdateRequest: employeeSwaggerDocs.updateEmploymentStatus.requestBody.content['application/json'].schema,
            Employee: {
                type: 'object',
                properties: {
                    employeeId: { type: 'integer', example: 1 },
                    fullName: { type: 'string', example: 'Nguyen Van A' },
                    dob: { type: 'string', format: 'date', example: '1990-01-01' },
                    gender: { type: 'string', enum: ['Male', 'Female', 'Other'], example: 'Male' },
                    email: { type: 'string', format: 'email', example: 'nguyenvana@company.com' },
                    phone: { type: 'string', example: '0901234567' },
                    address: { type: 'string', example: 'Ha Noi, Vietnam' },
                    nationalId: { type: 'string', example: '001234567890' },
                    departmentId: { type: 'integer', example: 1 },
                    departmentName: { type: 'string', example: 'IT Department' },
                    position: { type: 'string', example: 'Software Engineer' },
                    hireDate: { type: 'string', format: 'date', example: '2024-01-01' },
                    employmentStatus: { type: 'string', enum: ['active', 'inactive', 'terminated', 'resigned'], example: 'active' },
                    createdAt: { type: 'string', format: 'date-time' },
                    updatedAt: { type: 'string', format: 'date-time' }
                }
            },
            
            // ========================================
            // USER SCHEMAS
            // ========================================
            UserCreateRequest: userSwaggerDocs.createUser.requestBody.content['application/json'].schema,
            UserUpdateRequest: userSwaggerDocs.updateUser.requestBody.content['application/json'].schema,
            User: {
                type: 'object',
                properties: {
                    userId: { type: 'integer', example: 1 },
                    username: { type: 'string', example: 'john.doe' },
                    email: { type: 'string', format: 'email', example: 'john.doe@example.com' },
                    role: { type: 'string', enum: ['admin', 'user'], example: 'user' },
                    employeeId: { type: 'integer', example: 1 },
                    employee: { $ref: '#/components/schemas/Employee' },
                    createdAt: { type: 'string', format: 'date-time' },
                    updatedAt: { type: 'string', format: 'date-time' }
                }
            },
            
            // ========================================
            // ATTENDANCE SCHEMAS
            // ========================================
            AttendanceCheckInRequest: attendanceSwaggerDocs.checkIn.requestBody.content['application/json'].schema,
            AttendanceCheckOutRequest: attendanceSwaggerDocs.checkOut.requestBody.content['application/json'].schema,
            AttendanceUpdateRequest: attendanceSwaggerDocs.updateAttendance.requestBody.content['application/json'].schema,
            Attendance: {
                type: 'object',
                properties: {
                    attendanceId: { type: 'integer', example: 1 },
                    employeeId: { type: 'integer', example: 1 },
                    date: { type: 'string', format: 'date', example: '2024-12-17' },
                    checkInTime: { type: 'string', format: 'date-time', example: '2024-12-17T08:00:00Z' },
                    checkOutTime: { type: 'string', format: 'date-time', example: '2024-12-17T17:00:00Z' },
                    status: { type: 'string', enum: ['present', 'late', 'absent', 'leave'], example: 'present' },
                    location: { type: 'string', example: 'Office' },
                    notes: { type: 'string', example: 'On time' },
                    createdAt: { type: 'string', format: 'date-time' },
                    updatedAt: { type: 'string', format: 'date-time' }
                }
            },
            
            // ========================================
            // DEPARTMENT SCHEMAS
            // ========================================
            DepartmentCreateRequest: departmentSwaggerDocs.createDepartment.requestBody.content['application/json'].schema,
            DepartmentUpdateRequest: departmentSwaggerDocs.updateDepartment.requestBody.content['application/json'].schema,
            Department: {
                type: 'object',
                properties: {
                    departmentId: { type: 'integer', example: 1 },
                    name: { type: 'string', example: 'IT Department' },
                    description: { type: 'string', example: 'Information Technology Department' },
                    managerId: { type: 'integer', example: 5 },
                    managerName: { type: 'string', example: 'John Doe' },
                    employeeCount: { type: 'integer', example: 15 },
                    createdAt: { type: 'string', format: 'date-time' },
                    updatedAt: { type: 'string', format: 'date-time' }
                }
            },
            
            // ========================================
            // ERROR SCHEMA
            // ========================================
            Error: {
                type: 'object',
                properties: {
                    success: { type: 'boolean', example: false },
                    message: { type: 'string', example: 'Error message' }
                }
            }
        },
        '@definitions': {
            // ========================================
            // AUTH DEFINITIONS
            // ========================================
            Login: authSwaggerDocs.login,
            Register: authSwaggerDocs.register,
            GetCurrentUser: authSwaggerDocs.getCurrentUser,
            UpdateProfile: authSwaggerDocs.updateProfile,
            ChangePassword: authSwaggerDocs.changePassword,
            ForgotPassword: authSwaggerDocs.forgotPassword,
            ResetPassword: authSwaggerDocs.resetPassword,
            RefreshToken: authSwaggerDocs.refreshToken,
            Logout: authSwaggerDocs.logout,
            VerifyEmail: authSwaggerDocs.verifyEmail,
            ResendVerification: authSwaggerDocs.resendVerification,
            CheckEmail: authSwaggerDocs.checkEmail,
            CheckUsername: authSwaggerDocs.checkUsername,
            
            // ========================================
            // EMPLOYEE DEFINITIONS
            // ========================================
            GetAllEmployees: employeeSwaggerDocs.getAllEmployees,
            CreateEmployee: employeeSwaggerDocs.createEmployee,
            GetEmployeeById: employeeSwaggerDocs.getEmployeeById,
            UpdateEmployee: employeeSwaggerDocs.updateEmployee,
            UpdateEmploymentStatus: employeeSwaggerDocs.updateEmploymentStatus,
            DeleteEmployee: employeeSwaggerDocs.deleteEmployee,
            GetEmployeesByDepartment: employeeSwaggerDocs.getEmployeesByDepartment,
            GetStatisticsByDepartment: employeeSwaggerDocs.getStatisticsByDepartment,
            GetRecentEmployees: employeeSwaggerDocs.getRecentEmployees,
            GetBirthdaysInMonth: employeeSwaggerDocs.getBirthdaysInMonth,
            GetUpcomingWorkAnniversaries: employeeSwaggerDocs.getUpcomingWorkAnniversaries,
            SearchEmployees: employeeSwaggerDocs.searchEmployees,
            GetEmployeeOverview: employeeSwaggerDocs.getOverview,
            
            // ========================================
            // USER DEFINITIONS
            // ========================================
            GetAllUsers: userSwaggerDocs.getAllUsers,
            CreateUser: userSwaggerDocs.createUser,
            GetUserById: userSwaggerDocs.getUserById,
            UpdateUser: userSwaggerDocs.updateUser,
            DeleteUser: userSwaggerDocs.deleteUser,
            
            // ========================================
            // ATTENDANCE DEFINITIONS
            // ========================================
            CheckIn: attendanceSwaggerDocs.checkIn,
            CheckOut: attendanceSwaggerDocs.checkOut,
            GetMyAttendances: attendanceSwaggerDocs.getMyAttendances,
            GetTodayAttendance: attendanceSwaggerDocs.getTodayAttendance,
            GetAllAttendances: attendanceSwaggerDocs.getAllAttendances,
            GetAttendanceById: attendanceSwaggerDocs.getAttendanceById,
            UpdateAttendance: attendanceSwaggerDocs.updateAttendance,
            DeleteAttendance: attendanceSwaggerDocs.deleteAttendance,
            GetAttendanceSummary: attendanceSwaggerDocs.getAttendanceSummary,
            
            // ========================================
            // DEPARTMENT DEFINITIONS
            // ========================================
            GetAllDepartments: departmentSwaggerDocs.getAllDepartments,
            GetAllDepartmentsSimple: departmentSwaggerDocs.getAllSimple,
            GetDepartmentStatistics: departmentSwaggerDocs.getStatistics,
            GetDepartmentById: departmentSwaggerDocs.getDepartmentById,
            CreateDepartment: departmentSwaggerDocs.createDepartment,
            UpdateDepartment: departmentSwaggerDocs.updateDepartment,
            DeleteDepartment: departmentSwaggerDocs.deleteDepartment
        }
    }
};

const outputFile = path.join(__dirname, '../swagger-output.json');

const routes = [
    path.join(__dirname, '../routes/v1/auth.routes.ts'),
    path.join(__dirname, '../routes/v1/user.routes.ts'),
    path.join(__dirname, '../routes/v1/employee.routes.ts'),
    path.join(__dirname, '../routes/v1/attendance.routes.ts'),
    path.join(__dirname, '../routes/v1/department.routes.ts'),
];

swaggerAutogen({ openapi: '3.0.0' })(outputFile, routes, doc);