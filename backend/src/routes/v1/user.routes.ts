import { Router } from 'express';
import { UserController } from '../../controllers/user.controller.js';
import { protect, admin } from '../../middlewares/auth/protect.middleware.js';

const router = Router();
const userController = new UserController();

// Tất cả routes đều yêu cầu admin
router.use(protect, admin);

/**
 * @route   POST /api/v1/users
 * @desc    Tạo user mới
 * @access  Private/Admin
 */
router.post('/', 
    /* 
        #swagger.tags = ['Users']
        #swagger.path = '/users'
        #swagger.summary = 'Tạo user mới'
        #swagger.description = 'Tạo tài khoản user mới (chỉ admin)'
        #swagger.security = [{ "bearerAuth": [] }]
        #swagger.requestBody = {
            required: true,
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        required: ["email", "password", "role"],
                        properties: {
                            email: {
                                type: "string",
                                format: "email",
                                example: "john.doe@example.com"
                            },
                            password: {
                                type: "string",
                                example: "Password123!"
                            },
                            role: {
                                type: "string",
                                enum: ["admin", "user"],
                                example: "user"
                            },
                            employeeId: {
                                type: "number",
                                example: 1
                            }
                        }
                    }
                }
            }
        }
        #swagger.responses[201] = {
            description: "User created successfully",
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: {
                            success: { type: "boolean", example: true },
                            message: { type: "string", example: "User created successfully" },
                            data: {
                                type: "object",
                                properties: {
                                    userId: { type: "number", example: 1 },
                                    username: { type: "string", example: "john_doe" },
                                    role: { type: "string", example: "user" },
                                    employeeId: { type: "number", example: 1 }
                                }
                            }
                        }
                    }
                }
            }
        }
        #swagger.responses[400] = {
            description: "Bad request"
        }
        #swagger.responses[401] = {
            description: "Unauthorized"
        }
        #swagger.responses[403] = {
            description: "Forbidden - Admin access required"
        }
    */
    userController.createUser
);

/**
 * @route   GET /api/v1/users
 * @desc    Lấy tất cả users
 * @access  Private/Admin
 */
router.get('/', 
    /* 
        #swagger.tags = ['Users']
        #swagger.path = '/users'
        #swagger.summary = 'Lấy danh sách users'
        #swagger.description = 'Lấy tất cả users (chỉ admin)'
        #swagger.security = [{ "bearerAuth": [] }]
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
                                        userId: { type: "number", example: 1 },
                                        username: { type: "string", example: "john_doe" },
                                        role: { type: "string", example: "user" },
                                        employeeId: { type: "number", example: 1 },
                                        createdAt: { type: "string", example: "2024-01-01T00:00:00.000Z" }
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
    userController.getAllUsers
);

/**
 * @route   GET /api/v1/users/:id
 * @desc    Lấy user theo ID
 * @access  Private/Admin
 */
router.get('/:id', 
    /* 
        #swagger.tags = ['Users']
        #swagger.path = '/users/:id'
        #swagger.summary = 'Lấy user theo ID'
        #swagger.description = 'Lấy thông tin chi tiết user (chỉ admin)'
        #swagger.security = [{ "bearerAuth": [] }]
        #swagger.parameters['id'] = {
            in: 'path',
            description: 'User ID',
            required: true,
            type: 'integer'
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
                                    userId: { type: "number", example: 1 },
                                    username: { type: "string", example: "john_doe" },
                                    role: { type: "string", example: "user" },
                                    employeeId: { type: "number", example: 1 }
                                }
                            }
                        }
                    }
                }
            }
        }
        #swagger.responses[404] = {
            description: "User not found"
        }
        #swagger.responses[401] = {
            description: "Unauthorized"
        }
        #swagger.responses[403] = {
            description: "Forbidden - Admin access required"
        }
    */
    userController.getUserById
);

/**
 * @route   PUT /api/v1/users/:id
 * @desc    Cập nhật user
 * @access  Private/Admin
 */
router.put('/:id', 
    /* 
        #swagger.tags = ['Users']
        #swagger.path = '/users/:id'
        #swagger.summary = 'Cập nhật user'
        #swagger.description = 'Cập nhật thông tin user (chỉ admin)'
        #swagger.security = [{ "bearerAuth": [] }]
        #swagger.parameters['id'] = {
            in: 'path',
            description: 'User ID',
            required: true,
            type: 'integer'
        }
        #swagger.requestBody = {
            required: true,
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: {
                            username: {
                                type: "string",
                                example: "john_doe_updated"
                            },
                            password: {
                                type: "string",
                                example: "NewPassword123!"
                            },
                            role: {
                                type: "string",
                                enum: ["admin", "user"],
                                example: "user"
                            },
                            employeeId: {
                                type: "number",
                                example: 1
                            }
                        }
                    }
                }
            }
        }
        #swagger.responses[200] = {
            description: "User updated successfully",
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: {
                            success: { type: "boolean", example: true },
                            message: { type: "string", example: "User updated successfully" },
                            data: {
                                type: "object",
                                properties: {
                                    userId: { type: "number", example: 1 },
                                    username: { type: "string", example: "john_doe_updated" },
                                    role: { type: "string", example: "user" }
                                }
                            }
                        }
                    }
                }
            }
        }
        #swagger.responses[404] = {
            description: "User not found"
        }
        #swagger.responses[400] = {
            description: "Bad request"
        }
        #swagger.responses[401] = {
            description: "Unauthorized"
        }
        #swagger.responses[403] = {
            description: "Forbidden - Admin access required"
        }
    */
    userController.updateUser
);

/**
 * @route   DELETE /api/v1/users/:id
 * @desc    Xóa user
 * @access  Private/Admin
 */
router.delete('/:id', 
    /* 
        #swagger.tags = ['Users']
        #swagger.path = '/users/:id'
        #swagger.summary = 'Xóa user'
        #swagger.description = 'Xóa user (soft delete - chỉ admin)'
        #swagger.security = [{ "bearerAuth": [] }]
        #swagger.parameters['id'] = {
            in: 'path',
            description: 'User ID',
            required: true,
            type: 'integer'
        }
        #swagger.responses[200] = {
            description: "User deleted successfully",
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: {
                            success: { type: "boolean", example: true },
                            message: { type: "string", example: "User deleted successfully" }
                        }
                    }
                }
            }
        }
        #swagger.responses[404] = {
            description: "User not found"
        }
        #swagger.responses[401] = {
            description: "Unauthorized"
        }
        #swagger.responses[403] = {
            description: "Forbidden - Admin access required"
        }
    */
    userController.deleteUser
);

export default router;
