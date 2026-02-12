import { Router } from 'express';
import { AuditController } from '../../controllers/audit.controller.js';
import { protect } from '../../middlewares/auth/protect.middleware.js';
import { checkPermission, checkHierarchy } from '../../middlewares/auth/rbac.middleware.js';
import { PERMISSIONS } from '../../config/permissions.js';
import { auditSwaggerDocs } from '../../docs/audit.docs.js';

const router = Router();
const auditController = new AuditController();
router.use(protect);

/**
 * @route   GET /api/v1/audit-logs
 * @desc    Get audit logs with filtering
 * @access  Admin only
 */
router.get(
    '/',
    /* 
        #swagger.tags = ['Audit Logs']
        #swagger.path = '/audit-logs'
        #swagger.summary = 'Get audit logs'
        #swagger.description = 'Get audit logs with filtering and pagination (Admin only)'
        #swagger.security = [{ "bearerAuth": [] }]
        #swagger.parameters['page'] = {
            in: 'query',
            description: 'Page number',
            required: false,
            type: 'integer',
            example: 1
        }
        #swagger.parameters['limit'] = {
            in: 'query',
            description: 'Items per page',
            required: false,
            type: 'integer',
            example: 10
        }
        #swagger.parameters['userId'] = {
            in: 'query',
            description: 'Filter by user ID',
            required: false,
            type: 'string'
        }
        #swagger.parameters['action'] = {
            in: 'query',
            description: 'Filter by action',
            required: false,
            type: 'string',
            enum: ['CREATE', 'UPDATE', 'DELETE', 'LOGIN', 'LOGOUT', 'READ']
        }
        #swagger.parameters['resource'] = {
            in: 'query',
            description: 'Filter by resource',
            required: false,
            type: 'string'
        }
        #swagger.parameters['startDate'] = {
            in: 'query',
            description: 'Filter from date',
            required: false,
            type: 'string',
            format: 'date'
        }
        #swagger.parameters['endDate'] = {
            in: 'query',
            description: 'Filter to date',
            required: false,
            type: 'string',
            format: 'date'
        }
        #swagger.responses[200] = {
            description: "Success",
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: {
                            success: { type: "boolean", example: true },
                            data: {
                                type: "object",
                                properties: {
                                    logs: {
                                        type: "array",
                                        items: {
                                            type: "object",
                                            properties: {
                                                _id: { type: "string", example: "507f1f77bcf86cd799439011" },
                                                userId: { type: "string", example: "507f1f77bcf86cd799439012" },
                                                action: { type: "string", example: "CREATE" },
                                                resource: { type: "string", example: "employee" },
                                                resourceId: { type: "string", example: "507f1f77bcf86cd799439013" },
                                                details: { type: "object" },
                                                ipAddress: { type: "string", example: "192.168.1.1" },
                                                userAgent: { type: "string", example: "Mozilla/5.0" },
                                                createdAt: { type: "string", example: "2024-01-01T00:00:00.000Z" }
                                            }
                                        }
                                    },
                                    pagination: {
                                        type: "object",
                                        properties: {
                                            total: { type: "number", example: 100 },
                                            page: { type: "number", example: 1 },
                                            limit: { type: "number", example: 10 },
                                            totalPages: { type: "number", example: 10 }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        #swagger.responses[401] = {
            description: "Unauthorized"
        }
        #swagger.responses[403] = {
            description: "Forbidden - Admin access required"
        }
    */
    checkPermission(PERMISSIONS.AUDIT.READ),
    checkHierarchy(2), // HR Manager trở lên
    auditController.getAuditLogs
);

/**
 * @route   GET /api/v1/audit-logs/statistics
 * @desc    Get audit statistics
 * @access  Admin only
 */
router.get(
    '/statistics',
    /* 
        #swagger.tags = ['Audit Logs']
        #swagger.path = '/audit-logs/statistics'
        #swagger.summary = 'Get audit statistics'
        #swagger.description = 'Get audit log statistics (Admin only)'
        #swagger.security = [{ "bearerAuth": [] }]
        #swagger.parameters['startDate'] = {
            in: 'query',
            description: 'Statistics from date',
            required: false,
            type: 'string',
            format: 'date'
        }
        #swagger.parameters['endDate'] = {
            in: 'query',
            description: 'Statistics to date',
            required: false,
            type: 'string',
            format: 'date'
        }
        #swagger.responses[200] = {
            description: "Success",
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: {
                            success: { type: "boolean", example: true },
                            data: {
                                type: "object",
                                properties: {
                                    totalLogs: { type: "number", example: 1000 },
                                    actionBreakdown: {
                                        type: "object",
                                        properties: {
                                            CREATE: { type: "number", example: 200 },
                                            UPDATE: { type: "number", example: 300 },
                                            DELETE: { type: "number", example: 50 },
                                            LOGIN: { type: "number", example: 400 },
                                            LOGOUT: { type: "number", example: 50 }
                                        }
                                    },
                                    resourceBreakdown: {
                                        type: "object",
                                        properties: {
                                            employee: { type: "number", example: 300 },
                                            user: { type: "number", example: 250 },
                                            attendance: { type: "number", example: 450 }
                                        }
                                    },
                                    topUsers: {
                                        type: "array",
                                        items: {
                                            type: "object",
                                            properties: {
                                                userId: { type: "string" },
                                                count: { type: "number" }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        #swagger.responses[401] = {
            description: "Unauthorized"
        }
        #swagger.responses[403] = {
            description: "Forbidden - Admin access required"
        }
    */
    checkPermission(PERMISSIONS.AUDIT.READ_ALL),
    checkHierarchy(1), // Chỉ Admin
    auditController.getAuditStatistics
);

/**
 * @route   GET /api/v1/audit-logs/suspicious
 * @desc    Get suspicious activities
 * @access  Admin only
 */
router.get(
    '/suspicious',
    /* 
        #swagger.tags = ['Audit Logs']
        #swagger.path = '/audit-logs/suspicious'
        #swagger.summary = 'Get suspicious activities'
        #swagger.description = 'Get potentially suspicious activities (Admin only)'
        #swagger.security = [{ "bearerAuth": [] }]
        #swagger.parameters['severity'] = {
            in: 'query',
            description: 'Filter by severity level',
            required: false,
            type: 'string',
            enum: ['low', 'medium', 'high', 'critical']
        }
        #swagger.parameters['limit'] = {
            in: 'query',
            description: 'Number of results',
            required: false,
            type: 'integer',
            example: 50
        }
        #swagger.responses[200] = {
            description: "Success",
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: {
                            success: { type: "boolean", example: true },
                            data: {
                                type: "array",
                                items: {
                                    type: "object",
                                    properties: {
                                        _id: { type: "string", example: "507f1f77bcf86cd799439011" },
                                        userId: { type: "string" },
                                        action: { type: "string" },
                                        resource: { type: "string" },
                                        severity: { type: "string", example: "high" },
                                        reason: { type: "string", example: "Multiple failed login attempts" },
                                        ipAddress: { type: "string" },
                                        createdAt: { type: "string" }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        #swagger.responses[401] = {
            description: "Unauthorized"
        }
        #swagger.responses[403] = {
            description: "Forbidden - Admin access required"
        }
    */
    checkPermission(PERMISSIONS.AUDIT.READ_ALL),
    checkHierarchy(1), // Chỉ Admin
    auditController.getSuspiciousActivities
);

/**
 * @route   GET /api/v1/audit-logs/user/:userId
 * @desc    Get audit logs for specific user
 * @access  Admin or own user
 */
router.get(
    '/user/:userId',
    /* 
        #swagger.tags = ['Audit Logs']
        #swagger.path = '/audit-logs/user/{userId}'
        #swagger.summary = 'Get user audit logs'
        #swagger.description = 'Get audit logs for a specific user (Admin or own user)'
        #swagger.security = [{ "bearerAuth": [] }]
        #swagger.parameters['userId'] = {
            in: 'path',
            description: 'User ID',
            required: true,
            type: 'string',
            example: '507f1f77bcf86cd799439011'
        }
        #swagger.parameters['page'] = {
            in: 'query',
            description: 'Page number',
            required: false,
            type: 'integer',
            example: 1
        }
        #swagger.parameters['limit'] = {
            in: 'query',
            description: 'Items per page',
            required: false,
            type: 'integer',
            example: 20
        }
        #swagger.parameters['action'] = {
            in: 'query',
            description: 'Filter by action',
            required: false,
            type: 'string'
        }
        #swagger.responses[200] = {
            description: "Success",
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: {
                            success: { type: "boolean", example: true },
                            data: {
                                type: "object",
                                properties: {
                                    logs: {
                                        type: "array",
                                        items: {
                                            type: "object",
                                            properties: {
                                                _id: { type: "string" },
                                                userId: { type: "string" },
                                                action: { type: "string" },
                                                resource: { type: "string" },
                                                resourceId: { type: "string" },
                                                ipAddress: { type: "string" },
                                                createdAt: { type: "string" }
                                            }
                                        }
                                    },
                                    pagination: {
                                        type: "object",
                                        properties: {
                                            total: { type: "number" },
                                            page: { type: "number" },
                                            limit: { type: "number" },
                                            totalPages: { type: "number" }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        #swagger.responses[401] = {
            description: "Unauthorized"
        }
        #swagger.responses[403] = {
            description: "Forbidden - Not authorized to view this user's logs"
        }
        #swagger.responses[404] = {
            description: "User not found"
        }
    */
    auditController.getUserAuditLogs
);

export default router;
