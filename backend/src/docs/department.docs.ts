/**
 * Department Swagger Documentation
 */

export const departmentSwaggerDocs = {
    // GET /api/v1/departments
    getAllDepartments: {
        tags: ['Departments'],
        summary: 'Lấy danh sách phòng ban',
        description: 'Lấy tất cả phòng ban với phân trang và tìm kiếm',
        security: [{ bearerAuth: [] }],
        parameters: [
            {
                name: 'searchTerm',
                in: 'query',
                description: 'Từ khóa tìm kiếm theo tên phòng ban',
                required: false,
                schema: {
                    type: 'string',
                    example: 'IT'
                }
            },
            {
                name: 'page',
                in: 'query',
                description: 'Số trang',
                required: false,
                schema: {
                    type: 'integer',
                    default: 1,
                    example: 1
                }
            },
            {
                name: 'limit',
                in: 'query',
                description: 'Số lượng bản ghi mỗi trang',
                required: false,
                schema: {
                    type: 'integer',
                    default: 10,
                    example: 10
                }
            }
        ],
        responses: {
            200: {
                description: 'Lấy danh sách thành công',
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            properties: {
                                success: { type: 'boolean', example: true },
                                data: {
                                    type: 'array',
                                    items: { $ref: '#/components/schemas/Department' }
                                },
                                pagination: {
                                    type: 'object',
                                    properties: {
                                        currentPage: { type: 'integer', example: 1 },
                                        totalPages: { type: 'integer', example: 3 },
                                        totalItems: { type: 'integer', example: 25 },
                                        itemsPerPage: { type: 'integer', example: 10 }
                                    }
                                }
                            }
                        }
                    }
                }
            },
            401: {
                description: 'Unauthorized',
                content: {
                    'application/json': {
                        schema: { $ref: '#/components/schemas/Error' }
                    }
                }
            }
        }
    },

    // GET /api/v1/departments/simple
    getAllSimple: {
        tags: ['Departments'],
        summary: 'Lấy danh sách phòng ban đơn giản',
        description: 'Lấy tất cả phòng ban không phân trang (dùng cho dropdown)',
        security: [{ bearerAuth: [] }],
        responses: {
            200: {
                description: 'Lấy danh sách thành công',
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
                                            departmentId: { type: 'integer', example: 1 },
                                            name: { type: 'string', example: 'IT Department' },
                                            description: { type: 'string', example: 'Information Technology' },
                                            managerId: { type: 'integer', example: 5 },
                                            managerName: { type: 'string', example: 'John Doe' },
                                            employeeCount: { type: 'integer', example: 15 }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            },
            401: {
                description: 'Unauthorized',
                content: {
                    'application/json': {
                        schema: { $ref: '#/components/schemas/Error' }
                    }
                }
            }
        }
    },

    // GET /api/v1/departments/statistics
    getStatistics: {
        tags: ['Departments'],
        summary: 'Lấy thống kê phòng ban',
        description: 'Lấy thống kê số lượng nhân viên theo từng phòng ban',
        security: [{ bearerAuth: [] }],
        responses: {
            200: {
                description: 'Lấy thống kê thành công',
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
                                            departmentId: { type: 'integer', example: 1 },
                                            departmentName: { type: 'string', example: 'IT Department' },
                                            employeeCount: { type: 'integer', example: 15 },
                                            activeCount: { type: 'integer', example: 14 },
                                            inactiveCount: { type: 'integer', example: 1 }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            },
            401: {
                description: 'Unauthorized',
                content: {
                    'application/json': {
                        schema: { $ref: '#/components/schemas/Error' }
                    }
                }
            },
            403: {
                description: 'Forbidden - Admin only',
                content: {
                    'application/json': {
                        schema: { $ref: '#/components/schemas/Error' }
                    }
                }
            }
        }
    },

    // GET /api/v1/departments/:id
    getDepartmentById: {
        tags: ['Departments'],
        summary: 'Lấy chi tiết phòng ban',
        description: 'Lấy thông tin chi tiết của một phòng ban theo ID',
        security: [{ bearerAuth: [] }],
        parameters: [
            {
                name: 'id',
                in: 'path',
                description: 'ID phòng ban',
                required: true,
                schema: {
                    type: 'integer',
                    example: 1
                }
            }
        ],
        responses: {
            200: {
                description: 'Lấy thông tin thành công',
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            properties: {
                                success: { type: 'boolean', example: true },
                                data: { $ref: '#/components/schemas/Department' }
                            }
                        }
                    }
                }
            },
            404: {
                description: 'Department not found',
                content: {
                    'application/json': {
                        schema: { $ref: '#/components/schemas/Error' }
                    }
                }
            },
            401: {
                description: 'Unauthorized',
                content: {
                    'application/json': {
                        schema: { $ref: '#/components/schemas/Error' }
                    }
                }
            }
        }
    },

    // POST /api/v1/departments
    createDepartment: {
        tags: ['Departments'],
        summary: 'Tạo phòng ban mới',
        description: 'Tạo một phòng ban mới (chỉ admin)',
        security: [{ bearerAuth: [] }],
        requestBody: {
            required: true,
            content: {
                'application/json': {
                    schema: {
                        type: 'object',
                        required: ['name'],
                        properties: {
                            name: {
                                type: 'string',
                                example: 'IT Department',
                                description: 'Tên phòng ban'
                            },
                            description: {
                                type: 'string',
                                example: 'Information Technology Department',
                                description: 'Mô tả phòng ban'
                            },
                            managerId: {
                                type: 'integer',
                                example: 5,
                                description: 'ID nhân viên làm trưởng phòng'
                            }
                        }
                    }
                }
            }
        },
        responses: {
            201: {
                description: 'Tạo phòng ban thành công',
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            properties: {
                                success: { type: 'boolean', example: true },
                                message: { type: 'string', example: 'Department created successfully' },
                                data: { $ref: '#/components/schemas/Department' }
                            }
                        }
                    }
                }
            },
            400: {
                description: 'Bad request - Validation error or name already exists',
                content: {
                    'application/json': {
                        schema: { $ref: '#/components/schemas/Error' }
                    }
                }
            },
            401: {
                description: 'Unauthorized',
                content: {
                    'application/json': {
                        schema: { $ref: '#/components/schemas/Error' }
                    }
                }
            },
            403: {
                description: 'Forbidden - Admin only',
                content: {
                    'application/json': {
                        schema: { $ref: '#/components/schemas/Error' }
                    }
                }
            }
        }
    },

    // PUT /api/v1/departments/:id
    updateDepartment: {
        tags: ['Departments'],
        summary: 'Cập nhật phòng ban',
        description: 'Cập nhật thông tin phòng ban (chỉ admin)',
        security: [{ bearerAuth: [] }],
        parameters: [
            {
                name: 'id',
                in: 'path',
                description: 'ID phòng ban',
                required: true,
                schema: {
                    type: 'integer',
                    example: 1
                }
            }
        ],
        requestBody: {
            required: true,
            content: {
                'application/json': {
                    schema: {
                        type: 'object',
                        properties: {
                            name: {
                                type: 'string',
                                example: 'IT Department Updated',
                                description: 'Tên phòng ban'
                            },
                            description: {
                                type: 'string',
                                example: 'Updated description',
                                description: 'Mô tả phòng ban'
                            },
                            managerId: {
                                type: 'integer',
                                example: 10,
                                description: 'ID nhân viên làm trưởng phòng'
                            }
                        }
                    }
                }
            }
        },
        responses: {
            200: {
                description: 'Cập nhật thành công',
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            properties: {
                                success: { type: 'boolean', example: true },
                                message: { type: 'string', example: 'Department updated successfully' },
                                data: { $ref: '#/components/schemas/Department' }
                            }
                        }
                    }
                }
            },
            400: {
                description: 'Bad request - Validation error or name already exists',
                content: {
                    'application/json': {
                        schema: { $ref: '#/components/schemas/Error' }
                    }
                }
            },
            404: {
                description: 'Department not found',
                content: {
                    'application/json': {
                        schema: { $ref: '#/components/schemas/Error' }
                    }
                }
            },
            401: {
                description: 'Unauthorized',
                content: {
                    'application/json': {
                        schema: { $ref: '#/components/schemas/Error' }
                    }
                }
            },
            403: {
                description: 'Forbidden - Admin only',
                content: {
                    'application/json': {
                        schema: { $ref: '#/components/schemas/Error' }
                    }
                }
            }
        }
    },

    // DELETE /api/v1/departments/:id
    deleteDepartment: {
        tags: ['Departments'],
        summary: 'Xóa phòng ban',
        description: 'Xóa một phòng ban (chỉ admin, không được có nhân viên)',
        security: [{ bearerAuth: [] }],
        parameters: [
            {
                name: 'id',
                in: 'path',
                description: 'ID phòng ban',
                required: true,
                schema: {
                    type: 'integer',
                    example: 1
                }
            }
        ],
        responses: {
            200: {
                description: 'Xóa thành công',
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            properties: {
                                success: { type: 'boolean', example: true },
                                message: { type: 'string', example: 'Department deleted successfully' }
                            }
                        }
                    }
                }
            },
            400: {
                description: 'Bad request - Department has employees',
                content: {
                    'application/json': {
                        schema: { $ref: '#/components/schemas/Error' }
                    }
                }
            },
            404: {
                description: 'Department not found',
                content: {
                    'application/json': {
                        schema: { $ref: '#/components/schemas/Error' }
                    }
                }
            },
            401: {
                description: 'Unauthorized',
                content: {
                    'application/json': {
                        schema: { $ref: '#/components/schemas/Error' }
                    }
                }
            },
            403: {
                description: 'Forbidden - Admin only',
                content: {
                    'application/json': {
                        schema: { $ref: '#/components/schemas/Error' }
                    }
                }
            }
        }
    }
};
