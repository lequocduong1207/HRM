import { Router } from 'express';
import { protect, validate } from '../../middlewares/index.js';
import * as authController from '../../controllers/auth.controller.js';
import { loginSchema } from '../../validators/index.js';

const router = Router();

// ========================================
// PUBLIC ROUTES
// ========================================

/**
 * @route   POST /api/v1/auth/login
 * @desc    Login with email
 * @access  Public
 */
router.post('/login',
    /* 
        #swagger.tags = ['Auth']
        #swagger.path = '/auth/login'
        #swagger.summary = 'Đăng nhập'
        #swagger.description = 'Đăng nhập với email và password'
        #swagger.requestBody = {
            required: true,
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        required: ["email", "password"],
                        properties: {
                            email: {
                                type: "string",
                                format: "email",
                                example: "admin@example.com"
                            },
                            password: {
                                type: "string",
                                example: "Admin@123"
                            }
                        }
                    }
                }
            }
        }
        #swagger.responses[200] = {
            description: "Login successful",
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: {
                            success: { type: "boolean", example: true },
                            message: { type: "string", example: "Login successful" },
                            data: {
                                type: "object",
                                properties: {
                                    user: {
                                        type: "object",
                                        properties: {
                                            userId: { type: "number", example: 1 },
                                            username: { type: "string", example: "admin" },
                                            email: { type: "string", example: "admin@example.com" },
                                            role: { type: "string", example: "admin" }
                                        }
                                    },
                                    token: { type: "string", example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." },
                                    refreshToken: { type: "string", example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." }
                                }
                            }
                        }
                    }
                }
            }
        }
        #swagger.responses[401] = {
            description: "Invalid credentials"
        }
    */
    validate(loginSchema),
    authController.login
);

/**
 * @route   POST /api/v1/auth/refresh-token
 * @desc    Refresh access token
 * @access  Public
 */
router.post('/refresh-token',
    /* 
        #swagger.tags = ['Auth']
        #swagger.path = '/auth/refresh-token'
        #swagger.summary = 'Làm mới token'
        #swagger.description = 'Lấy access token mới từ refresh token'
        #swagger.requestBody = {
            required: true,
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        required: ["refreshToken"],
                        properties: {
                            refreshToken: {
                                type: "string",
                                example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                            }
                        }
                    }
                }
            }
        }
        #swagger.responses[200] = {
            description: "Token refreshed successfully",
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: {
                            success: { type: "boolean", example: true },
                            message: { type: "string", example: "Token refreshed successfully" },
                            data: {
                                type: "object",
                                properties: {
                                    token: { type: "string", example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." }
                                }
                            }
                        }
                    }
                }
            }
        }
        #swagger.responses[400] = {
            description: "Refresh token is required"
        }
        #swagger.responses[401] = {
            description: "Invalid refresh token"
        }
    */
    authController.refreshToken
);

// ========================================
// PROTECTED ROUTES
// ========================================

router.use(protect);

/**
 * @route   GET /api/v1/auth/me
 * @desc    Get current user
 * @access  Private
 */
router.get('/me',
    /* 
        #swagger.tags = ['Auth']
        #swagger.path = '/auth/me'
        #swagger.summary = 'Lấy thông tin user hiện tại'
        #swagger.description = 'Lấy thông tin user đang đăng nhập'
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
                                type: "object",
                                properties: {
                                    userId: { type: "number", example: 1 },
                                    username: { type: "string", example: "admin" },
                                    email: { type: "string", example: "admin@example.com" },
                                    role: { type: "string", example: "admin" },
                                    fullName: { type: "string", example: "Admin User" }
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
        #swagger.responses[404] = {
            description: "User not found"
        }
    */
    authController.getCurrentUser
);

/**
 * @route   PUT /api/v1/auth/update-profile
 * @desc    Update profile
 * @access  Private
 */
router.put('/update-profile',
    /* 
        #swagger.tags = ['Auth']
        #swagger.path = '/auth/update-profile'
        #swagger.summary = 'Cập nhật profile'
        #swagger.description = 'Cập nhật thông tin profile của user'
        #swagger.security = [{ "bearerAuth": [] }]
        #swagger.requestBody = {
            required: true,
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: {
                            fullName: {
                                type: "string",
                                example: "John Doe Updated"
                            },
                            phone: {
                                type: "string",
                                example: "0123456789"
                            }
                        }
                    }
                }
            }
        }
        #swagger.responses[200] = {
            description: "Profile updated successfully",
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: {
                            success: { type: "boolean", example: true },
                            message: { type: "string", example: "Profile updated successfully" },
                            data: {
                                type: "object",
                                properties: {
                                    userId: { type: "number", example: 1 },
                                    fullName: { type: "string", example: "John Doe Updated" },
                                    phone: { type: "string", example: "0123456789" }
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
    */
    authController.updateProfile
);

/**
 * @route   POST /api/v1/auth/logout
 * @desc    Logout
 * @access  Private
 */
router.post('/logout',
    /* 
        #swagger.tags = ['Auth']
        #swagger.path = '/auth/logout'
        #swagger.summary = 'Đăng xuất'
        #swagger.description = 'Đăng xuất và xóa token'
        #swagger.security = [{ "bearerAuth": [] }]
        #swagger.responses[200] = {
            description: "Logout successful",
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: {
                            success: { type: "boolean", example: true },
                            message: { type: "string", example: "Logout successful" }
                        }
                    }
                }
            }
        }
        #swagger.responses[401] = {
            description: "Unauthorized"
        }
    */
    authController.logout
);

export default router;