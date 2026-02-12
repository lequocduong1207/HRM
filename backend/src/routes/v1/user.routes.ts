import { Router } from 'express';
import { UserController } from '../../controllers/user.controller.js';
import { protect } from '../../middlewares/auth/protect.middleware.js';
import { checkPermission, checkHierarchy, checkCanManageUser } from '../../middlewares/auth/rbac.middleware.js';
import { PERMISSIONS } from '../../config/permissions.js';

const router = Router();
const userController = new UserController();

// Tất cả routes đều yêu cầu authentication
router.use(protect);

/**
 * @route   POST /api/v1/users
 * @desc    Tạo user mới
 * @access  Private/Admin
 */
router.post('/', 
    /* #swagger.tags = ['Users']
       #swagger.summary = 'Tạo user mới'
       #swagger.description = 'Tạo tài khoản user mới (chỉ admin)'
       #swagger.security = [{ "bearerAuth": [] }]
       #swagger.requestBody = { required: true, content: { "application/json": { schema: { type: "object", required: ["email", "password", "role"], properties: { email: { type: "string", format: "email" }, password: { type: "string" }, role: { type: "string", enum: ["admin", "user"] }, employeeId: { type: "number" } } } } } }
       #swagger.responses[201] = { description: 'User created successfully' }
       #swagger.responses[400] = { description: 'Bad request' }
       #swagger.responses[401] = { description: 'Unauthorized' }
       #swagger.responses[403] = { description: 'Forbidden - Admin access required' } */
    checkPermission(PERMISSIONS.USER.CREATE),
    checkHierarchy(1), // Chỉ Admin
    userController.createUser
);

/**
 * @route   GET /api/v1/users
 * @desc    Lấy tất cả users
 * @access  Private/Admin
 */
router.get('/', 
    /* #swagger.tags = ['Users']
       #swagger.summary = 'Lấy danh sách users'
       #swagger.description = 'Lấy tất cả users (chỉ admin)'
       #swagger.security = [{ "bearerAuth": [] }]
       #swagger.responses[200] = { description: 'Success' }
       #swagger.responses[401] = { description: 'Unauthorized' }
       #swagger.responses[403] = { description: 'Forbidden - Admin access required' } */
    checkPermission(PERMISSIONS.USER.READ_ALL),
    checkHierarchy(2), // HR Manager trở lên
    userController.getAllUsers
);

/**
 * @route   GET /api/v1/users/:id
 * @desc    Lấy user theo ID
 * @access  Private/Admin
 */
router.get('/:id', 
    /* #swagger.tags = ['Users']
       #swagger.summary = 'Lấy user theo ID'
       #swagger.description = 'Lấy thông tin chi tiết user (chỉ admin)'
       #swagger.security = [{ "bearerAuth": [] }]
       #swagger.parameters['id'] = { in: 'path', required: true, type: 'integer', description: 'User ID' }
       #swagger.responses[200] = { description: 'Success' }
       #swagger.responses[404] = { description: 'User not found' }
       #swagger.responses[401] = { description: 'Unauthorized' }
       #swagger.responses[403] = { description: 'Forbidden - Admin access required' } */
    checkPermission(PERMISSIONS.USER.READ),
    checkHierarchy(2), // HR Manager trở lên
    userController.getUserById
);

/**
 * @route   PUT /api/v1/users/:id
 * @desc    Cập nhật user
 * @access  Private/Admin
 */
router.put('/:id', 
    /* #swagger.tags = ['Users']
       #swagger.summary = 'Cập nhật user'
       #swagger.description = 'Cập nhật thông tin user (chỉ admin)'
       #swagger.security = [{ "bearerAuth": [] }]
       #swagger.parameters['id'] = { in: 'path', required: true, type: 'integer', description: 'User ID' }
       #swagger.requestBody = { required: true, content: { "application/json": { schema: { type: "object", properties: { username: { type: "string" }, password: { type: "string" }, role: { type: "string", enum: ["admin", "user"] }, employeeId: { type: "number" } } } } } }
       #swagger.responses[200] = { description: 'User updated successfully' }
       #swagger.responses[404] = { description: 'User not found' }
       #swagger.responses[400] = { description: 'Bad request' }
       #swagger.responses[401] = { description: 'Unauthorized' }
       #swagger.responses[403] = { description: 'Forbidden - Admin access required' } */
    checkPermission(PERMISSIONS.USER.UPDATE),
    checkCanManageUser(), // Kiểm tra quyền quản lý user
    userController.updateUser
);

/**
 * @route   DELETE /api/v1/users/:id
 * @desc    Xóa user
 * @access  Private/Admin
 */
router.delete('/:id', 
    /* #swagger.tags = ['Users']
       #swagger.summary = 'Xóa user'
       #swagger.description = 'Xóa user (soft delete - chỉ admin)'
       #swagger.security = [{ "bearerAuth": [] }]
       #swagger.parameters['id'] = { in: 'path', required: true, type: 'integer', description: 'User ID' }
       #swagger.responses[200] = { description: 'User deleted successfully' }
       #swagger.responses[404] = { description: 'User not found' }
       #swagger.responses[401] = { description: 'Unauthorized' }
       #swagger.responses[403] = { description: 'Forbidden - Admin access required' } */
    checkPermission(PERMISSIONS.USER.DELETE),
    checkHierarchy(1), // Chỉ Admin
    userController.deleteUser
);

export default router;
