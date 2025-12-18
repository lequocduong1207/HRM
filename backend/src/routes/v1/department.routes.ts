import { Router } from 'express';
import { DepartmentController } from '../../controllers/department.controller.js';
import { protect, admin } from '../../middlewares/auth/protect.middleware.js';
import { validate } from '../../middlewares/index.js';
import { createDepartmentSchema, updateDepartmentSchema, departmentIdSchema } from '../../validators/department.validator.js';

const router = Router();
const departmentController = new DepartmentController();

// ========================================
// PROTECTED ROUTES
// ========================================

router.use(protect);

/**
 * @route   GET /api/v1/departments/simple
 * @desc    Lấy tất cả phòng ban (không phân trang)
 * @access  Private
 */
router.get('/simple',
    /* 
        #swagger.tags = ['Departments']
        #swagger.path = '/departments/simple'
        #swagger.summary = 'Danh sách phòng ban (dropdown)'
        #swagger.description = 'Lấy tất cả phòng ban không phân trang cho dropdown'
        #swagger.security = [{ "bearerAuth": [] }]
    */
    departmentController.getAllSimple
);

/**
 * @route   GET /api/v1/departments/statistics
 * @desc    Lấy thống kê nhân viên theo phòng ban
 * @access  Private/Admin
 */
router.get('/statistics',
    /* 
        #swagger.tags = ['Departments']
        #swagger.path = '/departments/statistics'
        #swagger.summary = 'Thống kê phòng ban'
        #swagger.description = 'Lấy thống kê số lượng nhân viên theo phòng ban'
        #swagger.security = [{ "bearerAuth": [] }]
    */
    admin,
    departmentController.getStatistics
);

/**
 * @route   GET /api/v1/departments/:id
 * @desc    Lấy phòng ban theo ID
 * @access  Private
 */
router.get('/:id',
    /* 
        #swagger.tags = ['Departments']
        #swagger.path = '/departments/{id}'
        #swagger.summary = 'Chi tiết phòng ban'
        #swagger.description = 'Lấy thông tin chi tiết của một phòng ban'
        #swagger.security = [{ "bearerAuth": [] }]
    */
    validate(departmentIdSchema),
    departmentController.getDepartmentById
);

/**
 * @route   GET /api/v1/departments
 * @desc    Lấy tất cả phòng ban (có phân trang)
 * @access  Private
 */
router.get('/',
    /* 
        #swagger.tags = ['Departments']
        #swagger.path = '/departments'
        #swagger.summary = 'Danh sách phòng ban'
        #swagger.description = 'Lấy tất cả phòng ban có phân trang'
        #swagger.security = [{ "bearerAuth": [] }]
    */
    departmentController.getAllDepartments
);

/**
 * @route   POST /api/v1/departments
 * @desc    Tạo phòng ban mới
 * @access  Private/Admin
 */
router.post('/',
    /* 
        #swagger.tags = ['Departments']
        #swagger.path = '/departments'
        #swagger.summary = 'Tạo phòng ban mới'
        #swagger.description = 'Tạo một phòng ban mới'
        #swagger.security = [{ "bearerAuth": [] }]
    */
    admin,
    validate(createDepartmentSchema),
    departmentController.createDepartment
);

/**
 * @route   PUT /api/v1/departments/:id
 * @desc    Cập nhật thông tin phòng ban
 * @access  Private/Admin
 */
router.put('/:id',
    /* 
        #swagger.tags = ['Departments']
        #swagger.path = '/departments/{id}'
        #swagger.summary = 'Cập nhật phòng ban'
        #swagger.description = 'Cập nhật thông tin phòng ban'
        #swagger.security = [{ "bearerAuth": [] }]
    */
    admin,
    validate({ ...departmentIdSchema, ...updateDepartmentSchema }),
    departmentController.updateDepartment
);

/**
 * @route   DELETE /api/v1/departments/:id
 * @desc    Xóa phòng ban
 * @access  Private/Admin
 */
router.delete('/:id',
    /* 
        #swagger.tags = ['Departments']
        #swagger.path = '/departments/{id}'
        #swagger.summary = 'Xóa phòng ban'
        #swagger.description = 'Xóa một phòng ban'
        #swagger.security = [{ "bearerAuth": [] }]
    */
    admin,
    validate(departmentIdSchema),
    departmentController.deleteDepartment
);

export default router;
