export const attendanceSwaggerDocs = {
    checkIn: {
        tags: ['Attendances'],
        summary: 'Check in',
        description: 'Employee check-in for attendance',
        security: [{ bearerAuth: [] }],
        requestBody: {
            content: {
                'application/json': {
                    schema: {
                        type: 'object',
                        properties: {
                            location: { type: 'string', example: 'Office' },
                            notes: { type: 'string', example: 'On time' }
                        }
                    }
                }
            }
        },
        responses: {
            201: {
                description: 'Check-in successful',
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            properties: {
                                success: { type: 'boolean', example: true },
                                message: { type: 'string', example: 'Check-in successful' },
                                data: { $ref: '#/components/schemas/Attendance' }
                            }
                        }
                    }
                }
            },
            400: { description: 'Already checked in today' }
        }
    },
    checkOut: {
        tags: ['Attendances'],
        summary: 'Check out',
        description: 'Employee check-out for attendance',
        security: [{ bearerAuth: [] }],
        requestBody: {
            content: {
                'application/json': {
                    schema: {
                        type: 'object',
                        properties: {
                            location: { type: 'string', example: 'Office' },
                            notes: { type: 'string', example: 'Completed tasks' }
                        }
                    }
                }
            }
        },
        responses: {
            200: {
                description: 'Check-out successful',
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            properties: {
                                success: { type: 'boolean', example: true },
                                message: { type: 'string', example: 'Check-out successful' },
                                data: { $ref: '#/components/schemas/Attendance' }
                            }
                        }
                    }
                }
            },
            400: { description: 'Not checked in yet or already checked out' }
        }
    },
    getMyAttendances: {
        tags: ['Attendances'],
        summary: 'Get my attendances',
        description: 'Get attendance history of current user',
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
                description: 'Attendances retrieved successfully',
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            properties: {
                                success: { type: 'boolean', example: true },
                                data: {
                                    type: 'array',
                                    items: { $ref: '#/components/schemas/Attendance' }
                                }
                            }
                        }
                    }
                }
            }
        }
    },
    getTodayAttendance: {
        tags: ['Attendances'],
        summary: 'Get today attendance',
        description: 'Check today attendance status of current user',
        security: [{ bearerAuth: [] }],
        responses: {
            200: {
                description: 'Today attendance status',
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            properties: {
                                success: { type: 'boolean', example: true },
                                data: { $ref: '#/components/schemas/Attendance' }
                            }
                        }
                    }
                }
            }
        }
    },
    getAllAttendances: {
        tags: ['Attendances'],
        summary: 'Get all attendances',
        description: 'Get all attendances (Admin only)',
        security: [{ bearerAuth: [] }],
        parameters: [
            {
                in: 'query',
                name: 'employeeId',
                schema: { type: 'integer' },
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
                description: 'Attendances retrieved successfully',
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            properties: {
                                success: { type: 'boolean', example: true },
                                data: {
                                    type: 'array',
                                    items: { $ref: '#/components/schemas/Attendance' }
                                }
                            }
                        }
                    }
                }
            }
        }
    },
    getAttendanceById: {
        tags: ['Attendances'],
        summary: 'Get attendance by ID',
        description: 'Get detailed attendance information',
        security: [{ bearerAuth: [] }],
        parameters: [
            {
                in: 'path',
                name: 'id',
                required: true,
                schema: { type: 'integer' },
                description: 'Attendance ID'
            }
        ],
        responses: {
            200: {
                description: 'Attendance found',
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            properties: {
                                success: { type: 'boolean', example: true },
                                data: { $ref: '#/components/schemas/Attendance' }
                            }
                        }
                    }
                }
            },
            404: { description: 'Attendance not found' }
        }
    },
    updateAttendance: {
        tags: ['Attendances'],
        summary: 'Update attendance',
        description: 'Update attendance record (Admin only)',
        security: [{ bearerAuth: [] }],
        parameters: [
            {
                in: 'path',
                name: 'id',
                required: true,
                schema: { type: 'integer' },
                description: 'Attendance ID'
            }
        ],
        requestBody: {
            required: true,
            content: {
                'application/json': {
                    schema: {
                        type: 'object',
                        properties: {
                            checkInTime: { type: 'string', format: 'date-time' },
                            checkOutTime: { type: 'string', format: 'date-time' },
                            status: { 
                                type: 'string', 
                                enum: ['present', 'late', 'absent', 'leave'] 
                            },
                            location: { type: 'string' },
                            notes: { type: 'string' }
                        }
                    }
                }
            }
        },
        responses: {
            200: {
                description: 'Attendance updated successfully',
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            properties: {
                                success: { type: 'boolean', example: true },
                                message: { type: 'string', example: 'Attendance updated successfully' },
                                data: { $ref: '#/components/schemas/Attendance' }
                            }
                        }
                    }
                }
            },
            404: { description: 'Attendance not found' }
        }
    },
    deleteAttendance: {
        tags: ['Attendances'],
        summary: 'Delete attendance',
        description: 'Delete attendance record (Admin only)',
        security: [{ bearerAuth: [] }],
        parameters: [
            {
                in: 'path',
                name: 'id',
                required: true,
                schema: { type: 'integer' },
                description: 'Attendance ID'
            }
        ],
        responses: {
            200: {
                description: 'Attendance deleted successfully',
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            properties: {
                                success: { type: 'boolean', example: true },
                                message: { type: 'string', example: 'Attendance deleted successfully' }
                            }
                        }
                    }
                }
            },
            404: { description: 'Attendance not found' }
        }
    },
    getAttendanceSummary: {
        tags: ['Attendances'],
        summary: 'Get attendance summary report',
        description: 'Get attendance summary report (Admin only)',
        security: [{ bearerAuth: [] }],
        parameters: [
            {
                in: 'query',
                name: 'employeeId',
                schema: { type: 'integer' },
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
            }
        ],
        responses: {
            200: {
                description: 'Summary retrieved successfully',
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            properties: {
                                success: { type: 'boolean', example: true },
                                data: {
                                    type: 'object',
                                    properties: {
                                        totalDays: { type: 'integer' },
                                        presentDays: { type: 'integer' },
                                        lateDays: { type: 'integer' },
                                        absentDays: { type: 'integer' },
                                        leaveDays: { type: 'integer' }
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
