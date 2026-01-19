import { Router } from 'express';
import { RoleController } from '../../controllers/role.controller.js';
import { protect } from '../../middlewares/auth/protect.middleware.js';
import { checkHierarchy } from '../../middlewares/auth/rbac.middleware.js';

const router = Router();
const roleController = new RoleController();

// Tất cả routes yêu cầu admin (hierarchy = 1)
router.use(protect, checkHierarchy(1));

/**
 * @route   GET /api/v1/roles/permissions/all
 * @desc    Lấy tất cả available permissions
 * @access  Private/Admin
 */
router.get('/permissions/all', roleController.getAllPermissions);

/**
 * @route   GET /api/v1/roles/system
 * @desc    Lấy system roles
 * @access  Private/Admin
 */
router.get('/system', roleController.getSystemRoles);

/**
 * @route   GET /api/v1/roles/custom
 * @desc    Lấy custom roles
 * @access  Private/Admin
 */
router.get('/custom', roleController.getCustomRoles);

/**
 * @route   GET /api/v1/roles
 * @desc    Lấy tất cả roles
 * @access  Private/Admin
 */
router.get('/', roleController.getAllRoles);

/**
 * @route   POST /api/v1/roles
 * @desc    Tạo role mới
 * @access  Private/Admin
 */
router.post('/', roleController.createRole);

/**
 * @route   GET /api/v1/roles/name/:name
 * @desc    Lấy role theo tên
 * @access  Private/Admin
 */
router.get('/name/:name', roleController.getRoleByName);

/**
 * @route   GET /api/v1/roles/:id
 * @desc    Lấy role theo ID
 * @access  Private/Admin
 */
router.get('/:id', roleController.getRoleById);

/**
 * @route   PUT /api/v1/roles/:id
 * @desc    Cập nhật role
 * @access  Private/Admin
 */
router.put('/:id', roleController.updateRole);

/**
 * @route   DELETE /api/v1/roles/:id
 * @desc    Xóa role
 * @access  Private/Admin
 */
router.delete('/:id', roleController.deleteRole);

/**
 * @route   GET /api/v1/roles/:id/permissions
 * @desc    Lấy permissions của role
 * @access  Private/Admin
 */
router.get('/:id/permissions', roleController.getRolePermissions);

/**
 * @route   POST /api/v1/roles/:id/permissions
 * @desc    Thêm permissions vào role
 * @access  Private/Admin
 */
router.post('/:id/permissions', roleController.addPermissions);

/**
 * @route   DELETE /api/v1/roles/:id/permissions
 * @desc    Xóa permissions khỏi role
 * @access  Private/Admin
 */
router.delete('/:id/permissions', roleController.removePermissions);

/**
 * @route   GET /api/v1/roles/:id/users/count
 * @desc    Lấy số lượng users theo role
 * @access  Private/Admin
 */
router.get('/:id/users/count', roleController.getUserCount);

export default router;
