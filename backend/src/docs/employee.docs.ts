export const employeeSwaggerDocs = {
    getAllEmployees: {
        tags: ['Employees'],
        summary: 'Get all employees',
        description: 'Get all employees with filtering and pagination',
        security: [{ bearerAuth: [] }],
        parameters: [
            {
                in: 'query',
                name: 'searchTerm',
                schema: { type: 'string' },
                description: 'Search by name, email, or phone'
            },
            {
                in: 'query',
                name: 'departmentId',
                schema: { type: 'integer' },
                description: 'Filter by department ID'
            },
            {
                in: 'query',
                name: 'employmentStatus',
                schema: { 
                    type: 'string',
                    enum: ['active', 'inactive', 'terminated', 'resigned']
                },
                description: 'Filter by employment status'
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
                description: 'Employees retrieved successfully',
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            properties: {
                                success: { type: 'boolean', example: true },
                                data: {
                                    type: 'array',
                                    items: { $ref: '#/components/schemas/Employee' }
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
    getEmployeeById: {
        tags: ['Employees'],
        summary: 'Get employee by ID',
        description: 'Get detailed information of an employee',
        security: [{ bearerAuth: [] }],
        parameters: [
            {
                in: 'path',
                name: 'id',
                required: true,
                schema: { type: 'integer' },
                description: 'Employee ID'
            }
        ],
        responses: {
            200: { description: 'Employee found' },
            404: { description: 'Employee not found' }
        }
    },
    createEmployee: {
        tags: ['Employees'],
        summary: 'Create new employee',
        description: 'Create a new employee record',
        security: [{ bearerAuth: [] }],
        requestBody: {
            required: true,
            content: {
                'application/json': {
                    schema: {
                        type: 'object',
                        required: ['fullName'],
                        properties: {
                            fullName: { type: 'string', example: 'Nguyen Van A' },
                            dob: { type: 'string', format: 'date', example: '1990-01-01' },
                            gender: { type: 'string', enum: ['Male', 'Female', 'Other'], example: 'Male' },
                            email: { type: 'string', format: 'email', example: 'nguyenvana@company.com' },
                            phone: { type: 'string', example: '0901234567' },
                            address: { type: 'string', example: 'Ha Noi, Vietnam' },
                            nationalId: { type: 'string', example: '001234567890' },
                            departmentId: { type: 'integer', example: 1 },
                            position: { type: 'string', example: 'Software Engineer' },
                            hireDate: { type: 'string', format: 'date', example: '2024-01-01' },
                            employmentStatus: { 
                                type: 'string', 
                                enum: ['active', 'inactive', 'terminated', 'resigned'], 
                                example: 'active' 
                            }
                        }
                    }
                }
            }
        },
        responses: {
            201: { description: 'Employee created successfully' },
            400: { description: 'Validation error' }
        }
    },
    updateEmployee: {
        tags: ['Employees'],
        summary: 'Update employee',
        description: 'Update employee information',
        security: [{ bearerAuth: [] }],
        parameters: [
            {
                in: 'path',
                name: 'id',
                required: true,
                schema: { type: 'integer' },
                description: 'Employee ID'
            }
        ],
        requestBody: {
            required: true,
            content: {
                'application/json': {
                    schema: {
                        type: 'object',
                        properties: {
                            fullName: { type: 'string' },
                            dob: { type: 'string', format: 'date' },
                            gender: { type: 'string', enum: ['Male', 'Female', 'Other'] },
                            email: { type: 'string', format: 'email' },
                            phone: { type: 'string' },
                            address: { type: 'string' },
                            nationalId: { type: 'string' },
                            departmentId: { type: 'integer' },
                            position: { type: 'string' },
                            hireDate: { type: 'string', format: 'date' },
                            employmentStatus: { 
                                type: 'string', 
                                enum: ['active', 'inactive', 'terminated', 'resigned'] 
                            }
                        }
                    }
                }
            }
        },
        responses: {
            200: { description: 'Employee updated successfully' },
            404: { description: 'Employee not found' }
        }
    },
    updateEmploymentStatus: {
        tags: ['Employees'],
        summary: 'Update employment status',
        description: 'Update employee employment status',
        security: [{ bearerAuth: [] }],
        parameters: [
            {
                in: 'path',
                name: 'id',
                required: true,
                schema: { type: 'integer' },
                description: 'Employee ID'
            }
        ],
        requestBody: {
            required: true,
            content: {
                'application/json': {
                    schema: {
                        type: 'object',
                        required: ['employmentStatus'],
                        properties: {
                            employmentStatus: {
                                type: 'string',
                                enum: ['active', 'inactive', 'terminated', 'resigned'],
                                example: 'active'
                            }
                        }
                    }
                }
            }
        },
        responses: {
            200: { description: 'Employment status updated successfully' }
        }
    },
    deleteEmployee: {
        tags: ['Employees'],
        summary: 'Delete employee',
        description: 'Soft delete an employee',
        security: [{ bearerAuth: [] }],
        parameters: [
            {
                in: 'path',
                name: 'id',
                required: true,
                schema: { type: 'integer' },
                description: 'Employee ID'
            }
        ],
        responses: {
            200: { description: 'Employee deleted successfully' },
            404: { description: 'Employee not found' }
        }
    },
    getEmployeesByDepartment: {
        tags: ['Employees'],
        summary: 'Get employees by department',
        description: 'Get all employees in a specific department',
        security: [{ bearerAuth: [] }],
        parameters: [
            {
                in: 'path',
                name: 'departmentId',
                required: true,
                schema: { type: 'integer' },
                description: 'Department ID'
            },
            {
                in: 'query',
                name: 'employmentStatus',
                schema: { 
                    type: 'string',
                    enum: ['active', 'inactive', 'terminated', 'resigned']
                },
                description: 'Filter by employment status'
            }
        ],
        responses: {
            200: { description: 'Employees retrieved successfully' }
        }
    },
    getStatisticsByDepartment: {
        tags: ['Employees'],
        summary: 'Get employee statistics by department',
        description: 'Get employee count and statistics grouped by department',
        security: [{ bearerAuth: [] }],
        responses: {
            200: {
                description: 'Statistics retrieved successfully',
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
                                            departmentId: { type: 'integer' },
                                            departmentName: { type: 'string' },
                                            employeeCount: { type: 'integer' },
                                            activeCount: { type: 'integer' },
                                            inactiveCount: { type: 'integer' }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    },
    getRecentEmployees: {
        tags: ['Employees'],
        summary: 'Get recent employees',
        description: 'Get list of recently hired employees',
        security: [{ bearerAuth: [] }],
        parameters: [
            {
                in: 'query',
                name: 'limit',
                schema: { type: 'integer', default: 5 },
                description: 'Number of employees to return'
            }
        ],
        responses: {
            200: { description: 'Recent employees retrieved successfully' }
        }
    },
    getBirthdaysInMonth: {
        tags: ['Employees'],
        summary: 'Get employees birthdays',
        description: 'Get list of employees with birthdays in specified month',
        security: [{ bearerAuth: [] }],
        parameters: [
            {
                in: 'query',
                name: 'month',
                schema: { type: 'integer', minimum: 1, maximum: 12 },
                description: 'Month (1-12)'
            },
            {
                in: 'query',
                name: 'year',
                schema: { type: 'integer', example: 2024 },
                description: 'Year'
            }
        ],
        responses: {
            200: { description: 'Birthdays retrieved successfully' }
        }
    },
    getUpcomingWorkAnniversaries: {
        tags: ['Employees'],
        summary: 'Get work anniversaries',
        description: 'Get list of employees with upcoming work anniversaries',
        security: [{ bearerAuth: [] }],
        parameters: [
            {
                in: 'query',
                name: 'month',
                schema: { type: 'integer', minimum: 1, maximum: 12 },
                description: 'Month (1-12)'
            }
        ],
        responses: {
            200: { description: 'Work anniversaries retrieved successfully' }
        }
    },
    searchEmployees: {
        tags: ['Employees'],
        summary: 'Search employees',
        description: 'Search employees by name, email, phone, etc.',
        security: [{ bearerAuth: [] }],
        parameters: [
            {
                in: 'query',
                name: 'q',
                required: true,
                schema: { type: 'string' },
                description: 'Search query'
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
            200: { description: 'Search results' },
            400: { description: 'Search term is required' }
        }
    },
    getOverview: {
        tags: ['Employees'],
        summary: 'Get employee overview',
        description: 'Get overview statistics of all employees',
        security: [{ bearerAuth: [] }],
        responses: {
            200: {
                description: 'Overview retrieved successfully',
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            properties: {
                                success: { type: 'boolean', example: true },
                                data: {
                                    type: 'object',
                                    properties: {
                                        totalEmployees: { type: 'integer', example: 100 },
                                        activeEmployees: { type: 'integer', example: 95 },
                                        inactiveEmployees: { type: 'integer', example: 3 },
                                        terminatedEmployees: { type: 'integer', example: 2 }
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
