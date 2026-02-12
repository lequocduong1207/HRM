import { Router } from 'express';
import { AttendanceController } from '../../controllers/attendance.controller.js';
import { protect } from '../../middlewares/auth/protect.middleware.js';
import { checkPermission, checkHierarchy, checkDepartmentAccess } from '../../middlewares/auth/rbac.middleware.js';
import { PERMISSIONS } from '../../config/permissions.js';

const router = Router();
const attendanceController = new AttendanceController();

router.use(protect);
/**
 * @route   POST /api/v1/attendances/check-in
 * @desc    Check in (chấm công vào)
 * @access  Private/Employee
 */
router.post('/check-in',
    /* #swagger.tags = ['Attendances']
       #swagger.summary = 'Chấm công vào'
       #swagger.description = 'Check in - chấm công vào ca làm việc'
       #swagger.security = [{ "bearerAuth": [] }]
       #swagger.requestBody = { required: false, content: { "application/json": { schema: { type: "object", properties: { location: { type: "string" }, notes: { type: "string" } } } } } }
       #swagger.responses[201] = { description: 'Check-in successful' }
       #swagger.responses[400] = { description: 'Already checked in today' }
       #swagger.responses[401] = { description: 'Unauthorized' } */
    attendanceController.checkIn
);

/**
 * @route   PUT /api/v1/attendances/check-out
 * @desc    Check out (chấm công ra)
 * @access  Private
 */
router.put('/check-out',
    /* #swagger.tags = ['Attendances']
       #swagger.summary = 'Chấm công ra'
       #swagger.description = 'Check out - chấm công ra ca làm việc'
       #swagger.security = [{ "bearerAuth": [] }]
       #swagger.requestBody = { required: false, content: { "application/json": { schema: { type: "object", properties: { location: { type: "string" }, notes: { type: "string" } } } } } }
       #swagger.responses[200] = { description: 'Check-out successful' }
       #swagger.responses[400] = { description: 'Need to check in first or already checked out' }
       #swagger.responses[401] = { description: 'Unauthorized' } */
    attendanceController.checkOut
);

/**
 * @route   GET /api/v1/attendances/my-attendances
 * @desc    Lấy lịch sử chấm công của user
 * @access  Private
 */
router.get('/my-attendances',
    /* #swagger.tags = ['Attendances']
       #swagger.summary = 'Lịch sử chấm công của tôi'
       #swagger.description = 'Lấy lịch sử chấm công của user đang đăng nhập'
       #swagger.security = [{ "bearerAuth": [] }]
       #swagger.parameters['startDate'] = { in: 'query', type: 'string', description: 'Ngày bắt đầu (YYYY-MM-DD)' }
       #swagger.parameters['endDate'] = { in: 'query', type: 'string', description: 'Ngày kết thúc (YYYY-MM-DD)' }
       #swagger.parameters['page'] = { in: 'query', type: 'integer', description: 'Số trang' }
       #swagger.parameters['limit'] = { in: 'query', type: 'integer', description: 'Số bản ghi mỗi trang' }
       #swagger.responses[200] = { description: 'Success' }
       #swagger.responses[401] = { description: 'Unauthorized' } */
    attendanceController.getMyAttendances
);

/**
 * @route   GET /api/v1/attendances/today
 * @desc    Kiểm tra trạng thái chấm công hôm nay
 * @access  Private
 */
router.get('/today',
    /* #swagger.tags = ['Attendances']
       #swagger.summary = 'Trạng thái chấm công hôm nay'
       #swagger.description = 'Kiểm tra đã check in/out hôm nay chưa'
       #swagger.security = [{ "bearerAuth": [] }]
       #swagger.responses[200] = { description: 'Success' }
       #swagger.responses[401] = { description: 'Unauthorized' } */
    attendanceController.getTodayAttendance
);

/**
 * @route   GET /api/v1/attendances/my-stats
 * @desc    Lấy thống kê chấm công của user
 * @access  Private
 */
router.get('/my-stats',
    /* #swagger.tags = ['Attendances']
       #swagger.summary = 'Thống kê chấm công của tôi'
       #swagger.description = 'Lấy thống kê chấm công của user đang đăng nhập'
       #swagger.security = [{ "bearerAuth": [] }]
       #swagger.parameters['startDate'] = { in: 'query', type: 'string', description: 'Ngày bắt đầu (YYYY-MM-DD)' }
       #swagger.parameters['endDate'] = { in: 'query', type: 'string', description: 'Ngày kết thúc (YYYY-MM-DD)' }
       #swagger.responses[200] = { description: 'Success' }
       #swagger.responses[401] = { description: 'Unauthorized' } */
    attendanceController.getMyStats
);
/**
 * @route   GET /api/v1/attendances
 * @desc    Lấy tất cả attendances (Admin)
 * @access  Private/Admin
 */
router.get('/',
    /* #swagger.tags = ['Attendances']
       #swagger.summary = 'Lấy tất cả chấm công (Admin)'
       #swagger.description = 'Lấy tất cả bản ghi chấm công - chỉ admin'
       #swagger.security = [{ "bearerAuth": [] }]
       #swagger.parameters['employeeId'] = { in: 'query', type: 'integer', description: 'Lọc theo employee ID' }
       #swagger.parameters['startDate'] = { in: 'query', type: 'string', description: 'Ngày bắt đầu (YYYY-MM-DD)' }
       #swagger.parameters['endDate'] = { in: 'query', type: 'string', description: 'Ngày kết thúc (YYYY-MM-DD)' }
       #swagger.parameters['page'] = { in: 'query', type: 'integer', description: 'Số trang' }
       #swagger.parameters['limit'] = { in: 'query', type: 'integer', description: 'Số bản ghi mỗi trang' }
       #swagger.responses[200] = { description: 'Success' }
       #swagger.responses[401] = { description: 'Unauthorized' }
       #swagger.responses[403] = { description: 'Forbidden - Admin access required' } */
    checkPermission(PERMISSIONS.ATTENDANCE.READ_ALL),
    attendanceController.getAllAttendances
);

/**
 * @route   GET /api/v1/attendances/report/summary
 * @desc    Báo cáo tổng hợp chấm công (Admin)
 * @access  Private/Admin
 */
router.get('/report/summary',
    /* #swagger.tags = ['Attendances']
       #swagger.summary = 'Báo cáo tổng hợp chấm công (Admin)'
       #swagger.description = 'Lấy báo cáo thống kê chấm công - chỉ admin'
       #swagger.security = [{ "bearerAuth": [] }]
       #swagger.parameters['employeeId'] = { in: 'query', type: 'integer', description: 'Lọc theo employee ID' }
       #swagger.parameters['startDate'] = { in: 'query', type: 'string', description: 'Ngày bắt đầu (YYYY-MM-DD)' }
       #swagger.parameters['endDate'] = { in: 'query', type: 'string', description: 'Ngày kết thúc (YYYY-MM-DD)' }
       #swagger.responses[200] = { description: 'Success' }
       #swagger.responses[401] = { description: 'Unauthorized' }
       #swagger.responses[403] = { description: 'Forbidden - Admin access required' } */
    checkPermission(PERMISSIONS.ATTENDANCE.READ_ALL),
    attendanceController.getAttendanceSummary
);

/**
 * @route   GET /api/v1/attendances/:id
 * @desc    Lấy chi tiết attendance
 * @access  Private
 */
router.get('/:id',
    /* #swagger.tags = ['Attendances']
       #swagger.summary = 'Lấy chi tiết chấm công'
       #swagger.description = 'Lấy thông tin chi tiết một bản ghi chấm công'
       #swagger.security = [{ "bearerAuth": [] }]
       #swagger.parameters['id'] = { in: 'path', required: true, type: 'integer', description: 'Attendance ID' }
       #swagger.responses[200] = { description: 'Success' }
       #swagger.responses[404] = { description: 'Attendance not found' }
       #swagger.responses[401] = { description: 'Unauthorized' } */
    attendanceController.getAttendanceById
);

/**
 * @route   PUT /api/v1/attendances/:id
 * @desc    Cập nhật attendance (Admin)
 * @access  Private/Admin
 */
router.put('/:id',
    /* #swagger.tags = ['Attendances']
       #swagger.summary = 'Cập nhật chấm công (Admin)'
       #swagger.description = 'Cập nhật thông tin chấm công - chỉ admin'
       #swagger.security = [{ "bearerAuth": [] }]
       #swagger.parameters['id'] = { in: 'path', required: true, type: 'integer', description: 'Attendance ID' }
       #swagger.requestBody = { required: true, content: { "application/json": { schema: { type: "object", properties: { checkInTime: { type: "string", format: "time" }, checkOutTime: { type: "string", format: "time" }, notes: { type: "string" } } } } } }
       #swagger.responses[200] = { description: 'Attendance updated successfully' }
       #swagger.responses[404] = { description: 'Attendance not found' }
       #swagger.responses[401] = { description: 'Unauthorized' }
       #swagger.responses[403] = { description: 'Forbidden - Admin access required' } */
    checkPermission(PERMISSIONS.ATTENDANCE.UPDATE),
    checkHierarchy(2), // HR Manager trở lên
    attendanceController.updateAttendance
);

/**
 * @route   DELETE /api/v1/attendances/:id
 * @desc    Xóa attendance (Admin)
 * @access  Private/Admin
 */
router.delete('/:id',
    /* #swagger.tags = ['Attendances']
       #swagger.summary = 'Xóa chấm công (Admin)'
       #swagger.description = 'Xóa bản ghi chấm công - chỉ admin'
       #swagger.security = [{ "bearerAuth": [] }]
       #swagger.parameters['id'] = { in: 'path', required: true, type: 'integer', description: 'Attendance ID' }
       #swagger.responses[200] = { description: 'Attendance deleted successfully' }
       #swagger.responses[404] = { description: 'Attendance not found' }
       #swagger.responses[401] = { description: 'Unauthorized' }
       #swagger.responses[403] = { description: 'Forbidden - Admin access required' } */
    checkPermission(PERMISSIONS.ATTENDANCE.DELETE),
    checkHierarchy(1), // Chỉ Admin
    attendanceController.deleteAttendance
);

export default router;