export const auditSwaggerDocs = {
    getAuditLogs: {
        tags: ['Audit Logs'],
        summary: 'Get audit logs',
        description: 'Get audit logs with filtering and pagination (Admin only)',
        security: [{ bearerAuth: [] }],
        parameters: [
            {
                in: 'query',
                name: 'userId',
                schema: { type: 'string' },
                description: 'Filter by user ID'
            },
            {
                in: 'query',
                name: 'action',
                schema: { 
                    type: 'string',
                    enum: [
                        'USER_LOGIN', 'USER_LOGOUT', 'USER_CREATED', 'USER_UPDATED', 'USER_DELETED',
                        'EMPLOYEE_CREATED', 'EMPLOYEE_UPDATED', 'EMPLOYEE_DELETED',
                        'DEPARTMENT_CREATED', 'DEPARTMENT_UPDATED', 'DEPARTMENT_DELETED',
                        'ATTENDANCE_CREATED', 'ATTENDANCE_UPDATED', 'ATTENDANCE_DELETED',
                        'LEAVE_CREATED', 'LEAVE_APPROVED', 'LEAVE_REJECTED', 'LEAVE_CANCELLED'
                    ]
                },
                description: 'Filter by action type'
            },
            {
                in: 'query',
                name: 'severity',
                schema: { 
                    type: 'string',
                    enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']
                },
                description: 'Filter by severity level'
            },
            {
                in: 'query',
                name: 'resource',
                schema: { type: 'string' },
                description: 'Filter by resource name'
            },
            {
                in: 'query',
                name: 'startDate',
                schema: { type: 'string', format: 'date' },
                description: 'Filter from date',
                example: '2026-01-01'
            },
            {
                in: 'query',
                name: 'endDate',
                schema: { type: 'string', format: 'date' },
                description: 'Filter to date',
                example: '2026-01-31'
            },
            {
                in: 'query',
                name: 'success',
                schema: { type: 'boolean' },
                description: 'Filter by success status'
            },
            {
                in: 'query',
                name: 'page',
                schema: { type: 'integer', default: 1 },
                description: 'Page number'
            },
            {
                in: 'query',
                name: 'limit',
                schema: { type: 'integer', default: 50 },
                description: 'Items per page'
            }
        ],
        responses: {
            200: {
                description: 'Audit logs retrieved successfully',
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            properties: {
                                success: { type: 'boolean', example: true },
                                message: { type: 'string', example: 'Audit logs retrieved successfully' },
                                data: {
                                    type: 'array',
                                    items: { $ref: '#/components/schemas/AuditLog' }
                                },
                                pagination: {
                                    type: 'object',
                                    properties: {
                                        total: { type: 'integer' },
                                        page: { type: 'integer' },
                                        limit: { type: 'integer' },
                                        totalPages: { type: 'integer' }
                                    }
                                }
                            }
                        }
                    }
                }
            },
            401: { description: 'Unauthorized' },
            403: { description: 'Forbidden - Admin only' }
        }
    },
    getAuditStatistics: {
        tags: ['Audit Logs'],
        summary: 'Get audit statistics',
        description: 'Get audit log statistics (Admin only)',
        security: [{ bearerAuth: [] }],
        parameters: [
            {
                in: 'query',
                name: 'startDate',
                schema: { type: 'string', format: 'date' },
                description: 'Start date for statistics'
            },
            {
                in: 'query',
                name: 'endDate',
                schema: { type: 'string', format: 'date' },
                description: 'End date for statistics'
            }
        ],
        responses: {
            200: {
                description: 'Audit statistics retrieved successfully',
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            properties: {
                                success: { type: 'boolean', example: true },
                                message: { type: 'string' },
                                data: {
                                    type: 'object',
                                    properties: {
                                        totalLogs: { type: 'integer' },
                                        byAction: { type: 'object' },
                                        bySeverity: { type: 'object' },
                                        byUser: { type: 'object' },
                                        successRate: { type: 'number' }
                                    }
                                }
                            }
                        }
                    }
                }
            },
            401: { description: 'Unauthorized' },
            403: { description: 'Forbidden - Admin only' }
        }
    },
    getSuspiciousActivities: {
        tags: ['Audit Logs'],
        summary: 'Get suspicious activities',
        description: 'Get potentially suspicious activities (Admin only)',
        security: [{ bearerAuth: [] }],
        responses: {
            200: {
                description: 'Suspicious activities retrieved successfully',
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            properties: {
                                success: { type: 'boolean', example: true },
                                message: { type: 'string' },
                                data: {
                                    type: 'array',
                                    items: { $ref: '#/components/schemas/AuditLog' }
                                }
                            }
                        }
                    }
                }
            },
            401: { description: 'Unauthorized' },
            403: { description: 'Forbidden - Admin only' }
        }
    },
    getUserAuditLogs: {
        tags: ['Audit Logs'],
        summary: 'Get user audit logs',
        description: 'Get audit logs for a specific user',
        security: [{ bearerAuth: [] }],
        parameters: [
            {
                in: 'path',
                name: 'userId',
                required: true,
                schema: { type: 'string' },
                description: 'User ID'
            }
        ],
        responses: {
            200: {
                description: 'User audit logs retrieved successfully',
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            properties: {
                                success: { type: 'boolean', example: true },
                                message: { type: 'string' },
                                data: {
                                    type: 'array',
                                    items: { $ref: '#/components/schemas/AuditLog' }
                                }
                            }
                        }
                    }
                }
            },
            401: { description: 'Unauthorized' },
            403: { description: 'Forbidden' }
        }
    }
};

// Schema components
export const auditSchemas = {
    AuditLog: {
        type: 'object',
        properties: {
            _id: { type: 'string' },
            userId: {
                type: 'object',
                properties: {
                    _id: { type: 'string' },
                    fullName: { type: 'string' },
                    email: { type: 'string' }
                }
            },
            action: { type: 'string' },
            resourceType: { type: 'string' },
            resourceId: { type: 'string' },
            severity: { 
                type: 'string',
                enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']
            },
            ipAddress: { type: 'string' },
            userAgent: { type: 'string' },
            success: { type: 'boolean' },
            details: { type: 'object' },
            createdAt: { type: 'string', format: 'date-time' }
        }
    }
};
