import { Router } from 'express';
import { LeaveController } from '../../controllers/leave.controller.js';
import { protect, admin } from '../../middlewares/auth/protect.middleware.js';
import { validate } from '../../middlewares/validation/validate.middleware.js';
import { leaveSwaggerDocs } from '../../docs/leave.docs.js';
import {
    createLeaveSchema,
    updateLeaveSchema,
    getLeaveByIdSchema,
    getMyLeavesSchema,
    getAllLeavesSchema,
    approveOrRejectLeaveSchema,
    getUsedLeaveDaysSchema,
    getLeaveStatisticsSchema
} from '../../validators/leave.validator.js';

const router = Router();
const leaveController = new LeaveController();

// Tất cả routes đều yêu cầu authentication
router.use(protect);

// ========================================
// ADMIN ROUTES - Quản lý tất cả đơn nghỉ phép
// Đặt trước employee routes để tránh conflict với dynamic params
// ========================================

/**
 * @route   GET /api/v1/leaves/admin/all
 * @desc    Lấy tất cả đơn nghỉ phép (Admin)
 * @access  Private/Admin
 * #swagger.tags = ['Leaves']
 * #swagger.summary = 'Get all leave requests'
 * #swagger.description = 'Get all leave requests with filtering (Admin only)'
 * #swagger.security = [{ "bearerAuth": [] }]
 */
router.get('/admin/all',
    admin,
    validate(getAllLeavesSchema),
    leaveController.getAllLeaves
);

/**
 * @route   GET /api/v1/leaves/admin/statistics
 * @desc    Lấy thống kê nghỉ phép (Admin)
 * @access  Private/Admin
 * #swagger.tags = ['Leaves']
 * #swagger.summary = 'Get leave statistics'
 * #swagger.description = 'Get leave statistics (Admin only)'
 * #swagger.security = [{ "bearerAuth": [] }]
 */
router.get('/admin/statistics',
    admin,
    validate(getLeaveStatisticsSchema),
    leaveController.getLeaveStatistics
);

/**
 * @route   PUT /api/v1/leaves/admin/:id/approve
 * @desc    Duyệt hoặc từ chối đơn nghỉ phép (Admin)
 * @access  Private/Admin
 * #swagger.tags = ['Leaves']
 * #swagger.summary = 'Approve or reject leave request'
 * #swagger.description = 'Approve or reject a leave request (Admin only)'
 * #swagger.security = [{ "bearerAuth": [] }]
 */
router.put('/admin/:id/approve',
    admin,
    validate(approveOrRejectLeaveSchema),
    leaveController.approveOrRejectLeave
);

/**
 * @route   DELETE /api/v1/leaves/admin/:id
 * @desc    Xóa đơn nghỉ phép (Admin)
 * @access  Private/Admin
 * #swagger.tags = ['Leaves']
 * #swagger.summary = 'Delete leave request'
 * #swagger.description = 'Delete a leave request (Admin only)'
 * #swagger.security = [{ "bearerAuth": [] }]
 */
router.delete('/admin/:id',
    admin,
    validate(getLeaveByIdSchema),
    leaveController.deleteLeave
);

// ========================================
// EMPLOYEE ROUTES - Quản lý nghỉ phép cá nhân
// ========================================

/**
 * @route   POST /api/v1/leaves
 * @desc    Tạo đơn nghỉ phép mới
 * @access  Private
 * #swagger.tags = ['Leaves']
 * #swagger.summary = 'Create leave request'
 * #swagger.description = 'Employee creates a new leave request'
 * #swagger.security = [{ "bearerAuth": [] }]
 */
router.post('/',
    validate(createLeaveSchema),
    leaveController.createLeave
);

/**
 * @route   GET /api/v1/leaves/my-leaves/used-days
 * @desc    Lấy số ngày nghỉ phép đã sử dụng
 * @access  Private
 * #swagger.tags = ['Leaves']
 * #swagger.summary = 'Get used leave days'
 * #swagger.description = 'Get the number of leave days used by employee'
 * #swagger.security = [{ "bearerAuth": [] }]
 */
router.get('/my-leaves/used-days',
    validate(getUsedLeaveDaysSchema),
    leaveController.getUsedLeaveDays
);

/**
 * @route   GET /api/v1/leaves/my-leaves
 * @desc    Lấy danh sách đơn nghỉ phép của nhân viên
 * @access  Private
 * #swagger.tags = ['Leaves']
 * #swagger.summary = 'Get my leave requests'
 * #swagger.description = 'Get all leave requests of current user'
 * #swagger.security = [{ "bearerAuth": [] }]
 */
router.get('/my-leaves',
    validate(getMyLeavesSchema),
    leaveController.getMyLeaves
);

/**
 * @route   GET /api/v1/leaves/:id
 * @desc    Lấy chi tiết đơn nghỉ phép
 * @access  Private
 * #swagger.tags = ['Leaves']
 * #swagger.summary = 'Get leave request details'
 * #swagger.description = 'Get details of a specific leave request'
 * #swagger.security = [{ "bearerAuth": [] }]
 */
router.get('/:id',
    validate(getLeaveByIdSchema),
    leaveController.getLeaveById
);

/**
 * @route   PUT /api/v1/leaves/:id/cancel
 * @desc    Hủy đơn nghỉ phép
 * @access  Private
 * #swagger.tags = ['Leaves']
 * #swagger.summary = 'Cancel leave request'
 * #swagger.description = 'Employee cancels their leave request'
 * #swagger.security = [{ "bearerAuth": [] }]
 */
router.put('/:id/cancel',
    validate(getLeaveByIdSchema),
    leaveController.cancelLeave
);

/**
 * @route   PUT /api/v1/leaves/:id
 * @desc    Cập nhật đơn nghỉ phép
 * @access  Private
 * #swagger.tags = ['Leaves']
 * #swagger.summary = 'Update leave request'
 * #swagger.description = 'Employee updates their leave request'
 * #swagger.security = [{ "bearerAuth": [] }]
 */
router.put('/:id',
    validate(updateLeaveSchema),
    leaveController.updateLeave
);

export default router;
