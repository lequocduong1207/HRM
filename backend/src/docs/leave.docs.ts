export const leaveSwaggerDocs = {
    createLeave: {
        tags: ['Leaves'],
        summary: 'Create leave request',
        description: 'Employee creates a new leave request',
        security: [{ bearerAuth: [] }],
        requestBody: {
            required: true,
            content: {
                'application/json': {
                    schema: {
                        type: 'object',
                        required: ['leaveType', 'startDate', 'endDate'],
                        properties: {
                            leaveType: {
                                type: 'string',
                                enum: ['Annual', 'Sick', 'Unpaid', 'Maternity', 'Paternity', 'Other'],
                                example: 'Annual'
                            },
                            startDate: { type: 'string', format: 'date', example: '2026-02-01' },
                            endDate: { type: 'string', format: 'date', example: '2026-02-05' },
                            reason: { type: 'string', example: 'Family vacation' }
                        }
                    }
                }
            }
        },
        responses: {
            201: {
                description: 'Leave request created successfully',
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            properties: {
                                success: { type: 'boolean', example: true },
                                message: { type: 'string', example: 'Leave request created successfully' },
                                data: { $ref: '#/components/schemas/Leave' }
                            }
                        }
                    }
                }
            },
            400: { description: 'Validation error or overlapping leave request' }
        }
    },
    getMyLeaves: {
        tags: ['Leaves'],
        summary: 'Get my leave requests',
        description: 'Get all leave requests of current user',
        security: [{ bearerAuth: [] }],
        parameters: [
            {
                in: 'query',
                name: 'status',
                schema: { 
                    type: 'string',
                    enum: ['Pending', 'Approved', 'Rejected', 'Cancelled']
                },
                description: 'Filter by status'
            },
            {
                in: 'query',
                name: 'startDate',
                schema: { type: 'string', format: 'date' },
                description: 'Start date (YYYY-MM-DD)'
            },
            {
                in: 'query',
                name: 'endDate',
                schema: { type: 'string', format: 'date' },
                description: 'End date (YYYY-MM-DD)'
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
                schema: { type: 'integer', default: 10 },
                description: 'Items per page'
            }
        ],
        responses: {
            200: {
                description: 'Success',
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            properties: {
                                success: { type: 'boolean', example: true },
                                data: {
                                    type: 'array',
                                    items: { $ref: '#/components/schemas/Leave' }
                                }
                            }
                        }
                    }
                }
            }
        }
    },
    getLeaveById: {
        tags: ['Leaves'],
        summary: 'Get leave request by ID',
        description: 'Get details of a leave request',
        security: [{ bearerAuth: [] }],
        parameters: [
            {
                in: 'path',
                name: 'id',
                required: true,
                schema: { type: 'string' },
                description: 'Leave request ID'
            }
        ],
        responses: {
            200: {
                description: 'Success',
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            properties: {
                                success: { type: 'boolean', example: true },
                                data: { $ref: '#/components/schemas/Leave' }
                            }
                        }
                    }
                }
            },
            403: { description: 'No permission to view this leave request' },
            404: { description: 'Leave request not found' }
        }
    },
    updateLeave: {
        tags: ['Leaves'],
        summary: 'Update leave request',
        description: 'Update a pending leave request',
        security: [{ bearerAuth: [] }],
        parameters: [
            {
                in: 'path',
                name: 'id',
                required: true,
                schema: { type: 'string' },
                description: 'Leave request ID'
            }
        ],
        requestBody: {
            required: true,
            content: {
                'application/json': {
                    schema: {
                        type: 'object',
                        properties: {
                            leaveType: {
                                type: 'string',
                                enum: ['Annual', 'Sick', 'Unpaid', 'Maternity', 'Paternity', 'Other']
                            },
                            startDate: { type: 'string', format: 'date' },
                            endDate: { type: 'string', format: 'date' },
                            reason: { type: 'string' }
                        }
                    }
                }
            }
        },
        responses: {
            200: {
                description: 'Leave request updated successfully',
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            properties: {
                                success: { type: 'boolean', example: true },
                                message: { type: 'string', example: 'Leave request updated successfully' },
                                data: { $ref: '#/components/schemas/Leave' }
                            }
                        }
                    }
                }
            },
            400: { description: 'Can only update pending leave requests' },
            403: { description: 'No permission to update this leave request' },
            404: { description: 'Leave request not found' }
        }
    },
    cancelLeave: {
        tags: ['Leaves'],
        summary: 'Cancel leave request',
        description: 'Cancel a leave request',
        security: [{ bearerAuth: [] }],
        parameters: [
            {
                in: 'path',
                name: 'id',
                required: true,
                schema: { type: 'string' },
                description: 'Leave request ID'
            }
        ],
        responses: {
            200: {
                description: 'Leave request cancelled successfully',
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            properties: {
                                success: { type: 'boolean', example: true },
                                message: { type: 'string', example: 'Leave request cancelled successfully' },
                                data: { $ref: '#/components/schemas/Leave' }
                            }
                        }
                    }
                }
            },
            400: { description: 'Cannot cancel this leave request' },
            403: { description: 'No permission to cancel this leave request' },
            404: { description: 'Leave request not found' }
        }
    },
    getAllLeaves: {
        tags: ['Leaves'],
        summary: 'Get all leave requests',
        description: 'Get all leave requests (Admin only)',
        security: [{ bearerAuth: [] }],
        parameters: [
            {
                in: 'query',
                name: 'status',
                schema: { 
                    type: 'string',
                    enum: ['Pending', 'Approved', 'Rejected', 'Cancelled']
                },
                description: 'Filter by status'
            },
            {
                in: 'query',
                name: 'leaveType',
                schema: { type: 'string' },
                description: 'Filter by leave type'
            },
            {
                in: 'query',
                name: 'employeeId',
                schema: { type: 'string' },
                description: 'Filter by employee ID'
            },
            {
                in: 'query',
                name: 'startDate',
                schema: { type: 'string', format: 'date' },
                description: 'Start date (YYYY-MM-DD)'
            },
            {
                in: 'query',
                name: 'endDate',
                schema: { type: 'string', format: 'date' },
                description: 'End date (YYYY-MM-DD)'
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
                schema: { type: 'integer', default: 10 },
                description: 'Items per page'
            }
        ],
        responses: {
            200: {
                description: 'Success',
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            properties: {
                                success: { type: 'boolean', example: true },
                                data: {
                                    type: 'array',
                                    items: { $ref: '#/components/schemas/Leave' }
                                },
                                pagination: {
                                    type: 'object',
                                    properties: {
                                        page: { type: 'integer' },
                                        limit: { type: 'integer' },
                                        total: { type: 'integer' },
                                        totalPages: { type: 'integer' }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    },
    approveOrRejectLeave: {
        tags: ['Leaves'],
        summary: 'Approve or reject leave request',
        description: 'Approve or reject a leave request (Admin only)',
        security: [{ bearerAuth: [] }],
        parameters: [
            {
                in: 'path',
                name: 'id',
                required: true,
                schema: { type: 'string' },
                description: 'Leave request ID'
            }
        ],
        requestBody: {
            required: true,
            content: {
                'application/json': {
                    schema: {
                        type: 'object',
                        required: ['status'],
                        properties: {
                            status: {
                                type: 'string',
                                enum: ['Approved', 'Rejected'],
                                example: 'Approved'
                            },
                            rejectionReason: { type: 'string', example: 'Insufficient leave balance' }
                        }
                    }
                }
            }
        },
        responses: {
            200: {
                description: 'Leave request processed successfully',
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            properties: {
                                success: { type: 'boolean', example: true },
                                message: { type: 'string', example: 'Leave request approved successfully' },
                                data: { $ref: '#/components/schemas/Leave' }
                            }
                        }
                    }
                }
            },
            400: { description: 'Can only approve/reject pending leave requests' },
            404: { description: 'Leave request not found' }
        }
    },
    deleteLeave: {
        tags: ['Leaves'],
        summary: 'Delete leave request',
        description: 'Delete a leave request (Admin only)',
        security: [{ bearerAuth: [] }],
        parameters: [
            {
                in: 'path',
                name: 'id',
                required: true,
                schema: { type: 'string' },
                description: 'Leave request ID'
            }
        ],
        responses: {
            200: {
                description: 'Leave request deleted successfully',
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            properties: {
                                success: { type: 'boolean', example: true },
                                message: { type: 'string', example: 'Leave request deleted successfully' }
                            }
                        }
                    }
                }
            },
            404: { description: 'Leave request not found' }
        }
    },
    getUsedLeaveDays: {
        tags: ['Leaves'],
        summary: 'Get used leave days',
        description: 'Get number of used leave days for current year',
        security: [{ bearerAuth: [] }],
        parameters: [
            {
                in: 'query',
                name: 'year',
                schema: { type: 'integer', default: new Date().getFullYear() },
                description: 'Year (default: current year)'
            }
        ],
        responses: {
            200: {
                description: 'Success',
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            properties: {
                                success: { type: 'boolean', example: true },
                                data: {
                                    type: 'object',
                                    properties: {
                                        year: { type: 'integer', example: 2026 },
                                        usedDays: { type: 'integer', example: 10 }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    },
    getLeaveStatistics: {
        tags: ['Leaves'],
        summary: 'Get leave statistics',
        description: 'Get leave statistics (Admin only)',
        security: [{ bearerAuth: [] }],
        parameters: [
            {
                in: 'query',
                name: 'startDate',
                schema: { type: 'string', format: 'date' },
                description: 'Start date (YYYY-MM-DD)'
            },
            {
                in: 'query',
                name: 'endDate',
                schema: { type: 'string', format: 'date' },
                description: 'End date (YYYY-MM-DD)'
            },
            {
                in: 'query',
                name: 'status',
                schema: { type: 'string' },
                description: 'Filter by status'
            }
        ],
        responses: {
            200: {
                description: 'Success',
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            properties: {
                                success: { type: 'boolean', example: true },
                                data: {
                                    type: 'array',
                                    items: {
                                        type: 'object',
                                        properties: {
                                            leaveType: { type: 'string' },
                                            count: { type: 'integer' },
                                            totalDays: { type: 'integer' }
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
};

export const leaveSchemas = {
    Leave: {
        type: 'object',
        properties: {
            _id: { type: 'string', example: '507f1f77bcf86cd799439011' },
            employeeId: { 
                type: 'object',
                properties: {
                    _id: { type: 'string' },
                    fullName: { type: 'string' },
                    email: { type: 'string' },
                    position: { type: 'string' }
                }
            },
            leaveType: { 
                type: 'string',
                enum: ['Annual', 'Sick', 'Unpaid', 'Maternity', 'Paternity', 'Other'],
                example: 'Annual'
            },
            startDate: { type: 'string', format: 'date-time', example: '2026-02-01T00:00:00.000Z' },
            endDate: { type: 'string', format: 'date-time', example: '2026-02-05T00:00:00.000Z' },
            reason: { type: 'string', example: 'Family vacation' },
            status: {
                type: 'string',
                enum: ['Pending', 'Approved', 'Rejected', 'Cancelled'],
                example: 'Pending'
            },
            approvedBy: {
                type: 'object',
                nullable: true,
                properties: {
                    _id: { type: 'string' },
                    username: { type: 'string' },
                    email: { type: 'string' }
                }
            },
            approvedAt: { type: 'string', format: 'date-time', nullable: true },
            rejectionReason: { type: 'string', nullable: true },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
        }
    }
};
