import { Router } from 'express';
import { LeaveController } from '../../controllers/leave.controller.js';
import { protect } from '../../middlewares/auth/protect.middleware.js';
import { checkPermission, checkHierarchy, checkOwnership } from '../../middlewares/auth/rbac.middleware.js';
import { PERMISSIONS } from '../../config/permissions.js';
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
router.use(protect);
/**
 * @route   GET /api/v1/leaves/admin/all
 * @desc    Lấy tất cả đơn nghỉ phép (Admin)
 * @access  Private/Admin
 */
router.get('/admin/all',
    /* #swagger.tags = ['Leaves']
       #swagger.summary = 'Get all leave requests'
       #swagger.description = 'Get all leave requests with filtering (Admin only)'
       #swagger.security = [{ "bearerAuth": [] }]
       #swagger.parameters['page'] = { in: 'query', type: 'integer', description: 'Page number' }
       #swagger.parameters['limit'] = { in: 'query', type: 'integer', description: 'Items per page' }
       #swagger.parameters['status'] = { in: 'query', type: 'string', enum: ['pending', 'approved', 'rejected', 'cancelled'] }
       #swagger.parameters['employeeId'] = { in: 'query', type: 'string', description: 'Filter by employee ID' }
       #swagger.parameters['departmentId'] = { in: 'query', type: 'string', description: 'Filter by department ID' }
       #swagger.parameters['startDate'] = { in: 'query', type: 'string', format: 'date', description: 'Filter from date' }
       #swagger.parameters['endDate'] = { in: 'query', type: 'string', format: 'date', description: 'Filter to date' }
       #swagger.responses[200] = { description: 'Success' }
       #swagger.responses[401] = { description: 'Unauthorized' }
       #swagger.responses[403] = { description: 'Forbidden - Admin access required' } */
    checkPermission(PERMISSIONS.LEAVE.READ_ALL),
    validate(getAllLeavesSchema),
    leaveController.getAllLeaves
);

/**
 * @route   GET /api/v1/leaves/admin/statistics
 * @desc    Lấy thống kê nghỉ phép (Admin)
 * @access  Private/Admin
 */
router.get('/admin/statistics',
    /* #swagger.tags = ['Leaves']
       #swagger.summary = 'Get leave statistics'
       #swagger.description = 'Get leave statistics (Admin only)'
       #swagger.security = [{ "bearerAuth": [] }]
       #swagger.parameters['year'] = { in: 'query', type: 'integer', description: 'Year for statistics' }
       #swagger.parameters['month'] = { in: 'query', type: 'integer', description: 'Month for statistics' }
       #swagger.parameters['departmentId'] = { in: 'query', type: 'string', description: 'Filter by department' }
       #swagger.responses[200] = { description: 'Success' }
       #swagger.responses[401] = { description: 'Unauthorized' }
       #swagger.responses[403] = { description: 'Forbidden - Admin access required' } */
    checkPermission(PERMISSIONS.LEAVE.READ_ALL),
    validate(getLeaveStatisticsSchema),
    leaveController.getLeaveStatistics
);

/**
 * @route   PUT /api/v1/leaves/admin/:id/approve
 * @desc    Duyệt hoặc từ chối đơn nghỉ phép (Admin)
 * @access  Private/Admin
 */
router.put('/admin/:id/approve',
    /* #swagger.tags = ['Leaves']
       #swagger.summary = 'Approve or reject leave request'
       #swagger.description = 'Approve or reject a leave request (Admin only)'
       #swagger.security = [{ "bearerAuth": [] }]
       #swagger.parameters['id'] = { in: 'path', required: true, type: 'string', description: 'Leave request ID' }
       #swagger.requestBody = { required: true, content: { "application/json": { schema: { type: "object", required: ["status"], properties: { status: { type: "string", enum: ["approved", "rejected"] }, adminNotes: { type: "string" } } } } } }
       #swagger.responses[200] = { description: 'Leave request updated successfully' }
       #swagger.responses[400] = { description: 'Bad request' }
       #swagger.responses[401] = { description: 'Unauthorized' }
       #swagger.responses[403] = { description: 'Forbidden - Admin access required' }
       #swagger.responses[404] = { description: 'Leave request not found' } */
    checkPermission(PERMISSIONS.LEAVE.APPROVE),
    validate(approveOrRejectLeaveSchema),
    leaveController.approveOrRejectLeave
);

/**
 * @route   DELETE /api/v1/leaves/admin/:id
 * @desc    Xóa đơn nghỉ phép (Admin)
 * @access  Private/Admin
 */
router.delete('/admin/:id',
    /* #swagger.tags = ['Leaves']
       #swagger.summary = 'Delete leave request'
       #swagger.description = 'Delete a leave request (Admin only)'
       #swagger.security = [{ "bearerAuth": [] }]
       #swagger.parameters['id'] = { in: 'path', required: true, type: 'string', description: 'Leave request ID' }
       #swagger.responses[200] = { description: 'Leave request deleted successfully' }
       #swagger.responses[401] = { description: 'Unauthorized' }
       #swagger.responses[403] = { description: 'Forbidden - Admin access required' }
       #swagger.responses[404] = { description: 'Leave request not found' } */
    checkPermission(PERMISSIONS.LEAVE.DELETE),
    checkHierarchy(1), // Chỉ Admin
    validate(getLeaveByIdSchema),
    leaveController.deleteLeave
);

/**
 * @route   POST /api/v1/leaves
 * @desc    Tạo đơn nghỉ phép mới
 * @access  Private
 */
router.post('/',
    /* #swagger.tags = ['Leaves']
       #swagger.summary = 'Create leave request'
       #swagger.description = 'Employee creates a new leave request'
       #swagger.security = [{ "bearerAuth": [] }]
       #swagger.requestBody = { required: true, content: { "application/json": { schema: { type: "object", required: ["leaveType", "startDate", "endDate", "reason"], properties: { leaveType: { type: "string", enum: ["annual", "sick", "unpaid", "maternity", "paternity", "other"] }, startDate: { type: "string", format: "date" }, endDate: { type: "string", format: "date" }, reason: { type: "string" } } } } } }
       #swagger.responses[201] = { description: 'Leave request created successfully' }
       #swagger.responses[400] = { description: 'Bad request - Invalid dates or insufficient leave balance' }
       #swagger.responses[401] = { description: 'Unauthorized' } */
    validate(createLeaveSchema),
    leaveController.createLeave
);

/**
 * @route   GET /api/v1/leaves/my-leaves/used-days
 * @desc    Lấy số ngày nghỉ phép đã sử dụng
 * @access  Private
 */
router.get('/my-leaves/used-days',
    /* #swagger.tags = ['Leaves']
       #swagger.summary = 'Get used leave days'
       #swagger.description = 'Get the number of leave days used by employee'
       #swagger.security = [{ "bearerAuth": [] }]
       #swagger.parameters['year'] = { in: 'query', type: 'integer', description: 'Year to calculate' }
       #swagger.parameters['leaveType'] = { in: 'query', type: 'string', enum: ['annual', 'sick', 'unpaid', 'maternity', 'paternity', 'other'], description: 'Filter by leave type' }
       #swagger.responses[200] = { description: 'Success' }
       #swagger.responses[401] = { description: 'Unauthorized' } */
    validate(getUsedLeaveDaysSchema),
    leaveController.getUsedLeaveDays
);

/**
 * @route   GET /api/v1/leaves/my-leaves
 * @desc    Lấy danh sách đơn nghỉ phép của nhân viên
 * @access  Private
 */
router.get('/my-leaves',
    /* #swagger.tags = ['Leaves']
       #swagger.summary = 'Get my leave requests'
       #swagger.description = 'Get all leave requests of current user'
       #swagger.security = [{ "bearerAuth": [] }]
       #swagger.parameters['status'] = { in: 'query', type: 'string', enum: ['pending', 'approved', 'rejected', 'cancelled'], description: 'Filter by status' }
       #swagger.parameters['year'] = { in: 'query', type: 'integer', description: 'Filter by year' }
       #swagger.parameters['leaveType'] = { in: 'query', type: 'string', description: 'Filter by leave type' }
       #swagger.responses[200] = { description: 'Success' }
       #swagger.responses[401] = { description: 'Unauthorized' } */
    validate(getMyLeavesSchema),
    leaveController.getMyLeaves
);

/**
 * @route   GET /api/v1/leaves/:id
 * @desc    Lấy chi tiết đơn nghỉ phép
 * @access  Private
 */
router.get('/:id',
    /* #swagger.tags = ['Leaves']
       #swagger.summary = 'Get leave request details'
       #swagger.description = 'Get details of a specific leave request'
       #swagger.security = [{ "bearerAuth": [] }]
       #swagger.parameters['id'] = { in: 'path', required: true, type: 'string', description: 'Leave request ID' }
       #swagger.responses[200] = { description: 'Success' }
       #swagger.responses[401] = { description: 'Unauthorized' }
       #swagger.responses[404] = { description: 'Leave request not found' } */
    validate(getLeaveByIdSchema),
    leaveController.getLeaveById
);

/**
 * @route   PUT /api/v1/leaves/:id/cancel
 * @desc    Hủy đơn nghỉ phép
 * @access  Private
 */
router.put('/:id/cancel',
    /* #swagger.tags = ['Leaves']
       #swagger.summary = 'Cancel leave request'
       #swagger.description = 'Employee cancels their leave request'
       #swagger.security = [{ "bearerAuth": [] }]
       #swagger.parameters['id'] = { in: 'path', required: true, type: 'string', description: 'Leave request ID' }
       #swagger.responses[200] = { description: 'Leave request cancelled successfully' }
       #swagger.responses[400] = { description: 'Bad request - Cannot cancel this leave request' }
       #swagger.responses[401] = { description: 'Unauthorized' }
       #swagger.responses[404] = { description: 'Leave request not found' } */
    validate(getLeaveByIdSchema),
    leaveController.cancelLeave
);

/**
 * @route   PUT /api/v1/leaves/:id
 * @desc    Cập nhật đơn nghỉ phép
 * @access  Private
 */
router.put('/:id',
    /* #swagger.tags = ['Leaves']
       #swagger.summary = 'Update leave request'
       #swagger.description = 'Employee updates their leave request (only if pending)'
       #swagger.security = [{ "bearerAuth": [] }]
       #swagger.parameters['id'] = { in: 'path', required: true, type: 'string', description: 'Leave request ID' }
       #swagger.requestBody = { required: true, content: { "application/json": { schema: { type: "object", properties: { leaveType: { type: "string", enum: ["annual", "sick", "unpaid", "maternity", "paternity", "other"] }, startDate: { type: "string", format: "date" }, endDate: { type: "string", format: "date" }, reason: { type: "string" } } } } } }
       #swagger.responses[200] = { description: 'Leave request updated successfully' }
       #swagger.responses[400] = { description: 'Bad request - Cannot update this leave request' }
       #swagger.responses[401] = { description: 'Unauthorized' }
       #swagger.responses[404] = { description: 'Leave request not found' } */
    validate(updateLeaveSchema),
    leaveController.updateLeave
);

export default router;
