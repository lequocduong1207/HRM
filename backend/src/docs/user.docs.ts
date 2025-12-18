export const userSwaggerDocs = {
    createUser: {
        tags: ['Users'],
        summary: 'Create new user',
        description: 'Create a new user account (Admin only)',
        security: [{ bearerAuth: [] }],
        requestBody: {
            required: true,
            content: {
                'application/json': {
                    schema: {
                        type: 'object',
                        required: ['email', 'password', 'role'],
                        properties: {
                            email: {
                                type: 'string',
                                format: 'email',
                                example: 'john.doe@example.com'
                            },
                            password: {
                                type: 'string',
                                example: 'Password123!'
                            },
                            role: {
                                type: 'string',
                                enum: ['admin', 'user'],
                                example: 'user'
                            },
                            employeeId: {
                                type: 'integer',
                                example: 1
                            }
                        }
                    }
                }
            }
        },
        responses: {
            201: {
                description: 'User created successfully',
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            properties: {
                                success: { type: 'boolean', example: true },
                                message: { type: 'string', example: 'User created successfully' },
                                data: { $ref: '#/components/schemas/User' }
                            }
                        }
                    }
                }
            },
            400: { description: 'Validation error' }
        }
    },
    getAllUsers: {
        tags: ['Users'],
        summary: 'Get all users',
        description: 'Get all users (Admin only)',
        security: [{ bearerAuth: [] }],
        responses: {
            200: {
                description: 'Users retrieved successfully',
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            properties: {
                                success: { type: 'boolean', example: true },
                                data: {
                                    type: 'object',
                                    properties: {
                                        data: {
                                            type: 'array',
                                            items: { $ref: '#/components/schemas/User' }
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
            }
        }
    },
    getUserById: {
        tags: ['Users'],
        summary: 'Get user by ID',
        description: 'Get detailed information of a user (Admin only)',
        security: [{ bearerAuth: [] }],
        parameters: [
            {
                in: 'path',
                name: 'id',
                required: true,
                schema: { type: 'integer' },
                description: 'User ID'
            }
        ],
        responses: {
            200: {
                description: 'User found',
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            properties: {
                                success: { type: 'boolean', example: true },
                                data: { $ref: '#/components/schemas/User' }
                            }
                        }
                    }
                }
            },
            404: { description: 'User not found' }
        }
    },
    updateUser: {
        tags: ['Users'],
        summary: 'Update user',
        description: 'Update user information (Admin only)',
        security: [{ bearerAuth: [] }],
        parameters: [
            {
                in: 'path',
                name: 'id',
                required: true,
                schema: { type: 'integer' },
                description: 'User ID'
            }
        ],
        requestBody: {
            required: true,
            content: {
                'application/json': {
                    schema: {
                        type: 'object',
                        properties: {
                            email: {
                                type: 'string',
                                format: 'email'
                            },
                            password: {
                                type: 'string'
                            },
                            role: {
                                type: 'string',
                                enum: ['admin', 'user']
                            },
                            employeeId: {
                                type: 'integer'
                            }
                        }
                    }
                }
            }
        },
        responses: {
            200: {
                description: 'User updated successfully',
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            properties: {
                                success: { type: 'boolean', example: true },
                                message: { type: 'string', example: 'User updated successfully' },
                                data: { $ref: '#/components/schemas/User' }
                            }
                        }
                    }
                }
            },
            404: { description: 'User not found' }
        }
    },
    deleteUser: {
        tags: ['Users'],
        summary: 'Delete user',
        description: 'Delete a user account (Admin only)',
        security: [{ bearerAuth: [] }],
        parameters: [
            {
                in: 'path',
                name: 'id',
                required: true,
                schema: { type: 'integer' },
                description: 'User ID'
            }
        ],
        responses: {
            200: {
                description: 'User deleted successfully',
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            properties: {
                                success: { type: 'boolean', example: true },
                                message: { type: 'string', example: 'User deleted successfully' }
                            }
                        }
                    }
                }
            },
            404: { description: 'User not found' }
        }
    }
};
