import swaggerAutogen from 'swagger-autogen';
import path from 'path';
import { fileURLToPath } from 'url';
import { authSwaggerDocs } from '../docs/auth.docs.js';

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
    '@definitions': {
        RegisterRequest: authSwaggerDocs.register.requestBody.content['application/json'].schema,
        LoginRequest: authSwaggerDocs.login.requestBody.content['application/json'].schema,
        RegisterResponse: authSwaggerDocs.register.responses[201].content['application/json'].schema
    }
};

const outputFile = path.join(__dirname, '../swagger-output.json');

const routes = [
    path.join(__dirname, '../routes/v1/auth.routes.ts'),
    path.join(__dirname, '../routes/v1/user.routes.ts'),
    path.join(__dirname, '../routes/v1/employee.routes.ts'),
    path.join(__dirname, '../routes/v1/attendance.routes.ts'),
];

swaggerAutogen({ openapi: '3.0.0' })(outputFile, routes, doc);