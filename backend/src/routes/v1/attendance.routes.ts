import { Router } from 'express';
import { AttendanceController } from '../../controllers/attendance.controller.js';
import { protect, admin } from '../../middlewares/auth/protect.middleware.js';

const router = Router();
const attendanceController = new AttendanceController();

// Tất cả routes đều yêu cầu authentication
router.use(protect);

// ========================================
// USER ROUTES - Chấm công cá nhân
// ========================================

/**
 * @route   POST /api/v1/attendances/check-in
 * @desc    Check in (chấm công vào)
 * @access  Private
 */
router.post('/check-in',
    /* 
        #swagger.tags = ['Attendances']
        #swagger.path = '/attendances/check-in'
        #swagger.summary = 'Chấm công vào'
        #swagger.description = 'Check in - chấm công vào ca làm việc'
        #swagger.security = [{ "bearerAuth": [] }]
        #swagger.requestBody = {
            required: false,
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: {
                            location: {
                                type: "string",
                                example: "Office"
                            },
                            notes: {
                                type: "string",
                                example: "On time"
                            }
                        }
                    }
                }
            }
        }
        #swagger.responses[201] = {
            description: "Check-in successful",
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: {
                            success: { type: "boolean", example: true },
                            message: { type: "string", example: "Check-in successful" },
                            data: {
                                type: "object",
                                properties: {
                                    attendanceId: { type: "number", example: 1 },
                                    employeeId: { type: "number", example: 1 },
                                    checkInTime: { type: "string", example: "2024-01-01T08:00:00.000Z" },
                                    location: { type: "string", example: "Office" }
                                }
                            }
                        }
                    }
                }
            }
        }
        #swagger.responses[400] = {
            description: "Already checked in today"
        }
        #swagger.responses[401] = {
            description: "Unauthorized"
        }
    */
    attendanceController.checkIn
);

/**
 * @route   PUT /api/v1/attendances/check-out
 * @desc    Check out (chấm công ra)
 * @access  Private
 */
router.put('/check-out',
    /* 
        #swagger.tags = ['Attendances']
        #swagger.path = '/attendances/check-out'
        #swagger.summary = 'Chấm công ra'
        #swagger.description = 'Check out - chấm công ra ca làm việc'
        #swagger.security = [{ "bearerAuth": [] }]
        #swagger.requestBody = {
            required: false,
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: {
                            location: {
                                type: "string",
                                example: "Office"
                            },
                            notes: {
                                type: "string",
                                example: "Completed tasks"
                            }
                        }
                    }
                }
            }
        }
        #swagger.responses[200] = {
            description: "Check-out successful",
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: {
                            success: { type: "boolean", example: true },
                            message: { type: "string", example: "Check-out successful" },
                            data: {
                                type: "object",
                                properties: {
                                    attendanceId: { type: "number", example: 1 },
                                    checkInTime: { type: "string", example: "2024-01-01T08:00:00.000Z" },
                                    checkOutTime: { type: "string", example: "2024-01-01T17:00:00.000Z" },
                                    workingHours: { type: "number", example: 9 }
                                }
                            }
                        }
                    }
                }
            }
        }
        #swagger.responses[400] = {
            description: "Need to check in first or already checked out"
        }
        #swagger.responses[401] = {
            description: "Unauthorized"
        }
    */
    attendanceController.checkOut
);

/**
 * @route   GET /api/v1/attendances/my-attendances
 * @desc    Lấy lịch sử chấm công của user
 * @access  Private
 */
router.get('/my-attendances',
    /* 
        #swagger.tags = ['Attendances']
        #swagger.path = '/attendances/my-attendances'
        #swagger.summary = 'Lịch sử chấm công của tôi'
        #swagger.description = 'Lấy lịch sử chấm công của user đang đăng nhập'
        #swagger.security = [{ "bearerAuth": [] }]
        #swagger.parameters['startDate'] = {
            in: 'query',
            description: 'Ngày bắt đầu (YYYY-MM-DD)',
            required: false,
            type: 'string',
            example: '2024-01-01'
        }
        #swagger.parameters['endDate'] = {
            in: 'query',
            description: 'Ngày kết thúc (YYYY-MM-DD)',
            required: false,
            type: 'string',
            example: '2024-01-31'
        }
        #swagger.parameters['page'] = {
            in: 'query',
            description: 'Số trang',
            required: false,
            type: 'integer',
            example: 1
        }
        #swagger.parameters['limit'] = {
            in: 'query',
            description: 'Số bản ghi mỗi trang',
            required: false,
            type: 'integer',
            example: 10
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
                                    data: {
                                        type: "array",
                                        items: {
                                            type: "object",
                                            properties: {
                                                attendanceId: { type: "number", example: 1 },
                                                date: { type: "string", example: "2024-01-01" },
                                                checkInTime: { type: "string", example: "08:00:00" },
                                                checkOutTime: { type: "string", example: "17:00:00" },
                                                workingHours: { type: "number", example: 9 }
                                            }
                                        }
                                    },
                                    pagination: {
                                        type: "object",
                                        properties: {
                                            page: { type: "number", example: 1 },
                                            limit: { type: "number", example: 10 },
                                            total: { type: "number", example: 100 },
                                            totalPages: { type: "number", example: 10 }
                                        }
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
    */
    attendanceController.getMyAttendances
);

/**
 * @route   GET /api/v1/attendances/today
 * @desc    Kiểm tra trạng thái chấm công hôm nay
 * @access  Private
 */
router.get('/today',
    /* 
        #swagger.tags = ['Attendances']
        #swagger.path = '/attendances/today'
        #swagger.summary = 'Trạng thái chấm công hôm nay'
        #swagger.description = 'Kiểm tra đã check in/out hôm nay chưa'
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
                                    attendanceId: { type: "number", example: 1 },
                                    checkInTime: { type: "string", example: "08:00:00" },
                                    checkOutTime: { type: "string", example: null },
                                    hasCheckedIn: { type: "boolean", example: true },
                                    hasCheckedOut: { type: "boolean", example: false }
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
    attendanceController.getTodayAttendance
);

// ========================================
// ADMIN ROUTES - Quản lý chấm công
// ========================================

/**
 * @route   GET /api/v1/attendances
 * @desc    Lấy tất cả attendances (Admin)
 * @access  Private/Admin
 */
router.get('/',
    /* 
        #swagger.tags = ['Attendances']
        #swagger.path = '/attendances'
        #swagger.summary = 'Lấy tất cả chấm công (Admin)'
        #swagger.description = 'Lấy tất cả bản ghi chấm công - chỉ admin'
        #swagger.security = [{ "bearerAuth": [] }]
        #swagger.parameters['employeeId'] = {
            in: 'query',
            description: 'Lọc theo employee ID',
            required: false,
            type: 'integer'
        }
        #swagger.parameters['startDate'] = {
            in: 'query',
            description: 'Ngày bắt đầu (YYYY-MM-DD)',
            required: false,
            type: 'string'
        }
        #swagger.parameters['endDate'] = {
            in: 'query',
            description: 'Ngày kết thúc (YYYY-MM-DD)',
            required: false,
            type: 'string'
        }
        #swagger.parameters['page'] = {
            in: 'query',
            description: 'Số trang',
            required: false,
            type: 'integer'
        }
        #swagger.parameters['limit'] = {
            in: 'query',
            description: 'Số bản ghi mỗi trang',
            required: false,
            type: 'integer'
        }
        #swagger.responses[200] = {
            description: "Success"
        }
        #swagger.responses[401] = {
            description: "Unauthorized"
        }
        #swagger.responses[403] = {
            description: "Forbidden - Admin access required"
        }
    */
    admin,
    attendanceController.getAllAttendances
);

/**
 * @route   GET /api/v1/attendances/report/summary
 * @desc    Báo cáo tổng hợp chấm công (Admin)
 * @access  Private/Admin
 */
router.get('/report/summary',
    /* 
        #swagger.tags = ['Attendances']
        #swagger.path = '/attendances/report/summary'
        #swagger.summary = 'Báo cáo tổng hợp chấm công (Admin)'
        #swagger.description = 'Lấy báo cáo thống kê chấm công - chỉ admin'
        #swagger.security = [{ "bearerAuth": [] }]
        #swagger.parameters['employeeId'] = {
            in: 'query',
            description: 'Lọc theo employee ID',
            required: false,
            type: 'integer'
        }
        #swagger.parameters['startDate'] = {
            in: 'query',
            description: 'Ngày bắt đầu (YYYY-MM-DD)',
            required: false,
            type: 'string'
        }
        #swagger.parameters['endDate'] = {
            in: 'query',
            description: 'Ngày kết thúc (YYYY-MM-DD)',
            required: false,
            type: 'string'
        }
        #swagger.responses[200] = {
            description: "Success"
        }
        #swagger.responses[401] = {
            description: "Unauthorized"
        }
        #swagger.responses[403] = {
            description: "Forbidden - Admin access required"
        }
    */
    admin,
    attendanceController.getAttendanceSummary
);

/**
 * @route   GET /api/v1/attendances/:id
 * @desc    Lấy chi tiết attendance
 * @access  Private
 */
router.get('/:id',
    /* 
        #swagger.tags = ['Attendances']
        #swagger.path = '/attendances/{id}'
        #swagger.summary = 'Lấy chi tiết chấm công'
        #swagger.description = 'Lấy thông tin chi tiết một bản ghi chấm công'
        #swagger.security = [{ "bearerAuth": [] }]
        #swagger.parameters['id'] = {
            in: 'path',
            description: 'Attendance ID',
            required: true,
            type: 'integer'
        }
        #swagger.responses[200] = {
            description: "Success"
        }
        #swagger.responses[404] = {
            description: "Attendance not found"
        }
        #swagger.responses[401] = {
            description: "Unauthorized"
        }
    */
    attendanceController.getAttendanceById
);

/**
 * @route   PUT /api/v1/attendances/:id
 * @desc    Cập nhật attendance (Admin)
 * @access  Private/Admin
 */
router.put('/:id',
    /* 
        #swagger.tags = ['Attendances']
        #swagger.path = '/attendances/{id}'
        #swagger.summary = 'Cập nhật chấm công (Admin)'
        #swagger.description = 'Cập nhật thông tin chấm công - chỉ admin'
        #swagger.security = [{ "bearerAuth": [] }]
        #swagger.parameters['id'] = {
            in: 'path',
            description: 'Attendance ID',
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
                            checkInTime: {
                                type: "string",
                                format: "time",
                                example: "08:00:00"
                            },
                            checkOutTime: {
                                type: "string",
                                format: "time",
                                example: "17:00:00"
                            },
                            notes: {
                                type: "string",
                                example: "Manual adjustment"
                            }
                        }
                    }
                }
            }
        }
        #swagger.responses[200] = {
            description: "Attendance updated successfully"
        }
        #swagger.responses[404] = {
            description: "Attendance not found"
        }
        #swagger.responses[401] = {
            description: "Unauthorized"
        }
        #swagger.responses[403] = {
            description: "Forbidden - Admin access required"
        }
    */
    admin,
    attendanceController.updateAttendance
);

/**
 * @route   DELETE /api/v1/attendances/:id
 * @desc    Xóa attendance (Admin)
 * @access  Private/Admin
 */
router.delete('/:id',
    /* 
        #swagger.tags = ['Attendances']
        #swagger.path = '/attendances/{id}'
        #swagger.summary = 'Xóa chấm công (Admin)'
        #swagger.description = 'Xóa bản ghi chấm công - chỉ admin'
        #swagger.security = [{ "bearerAuth": [] }]
        #swagger.parameters['id'] = {
            in: 'path',
            description: 'Attendance ID',
            required: true,
            type: 'integer'
        }
        #swagger.responses[200] = {
            description: "Attendance deleted successfully"
        }
        #swagger.responses[404] = {
            description: "Attendance not found"
        }
        #swagger.responses[401] = {
            description: "Unauthorized"
        }
        #swagger.responses[403] = {
            description: "Forbidden - Admin access required"
        }
    */
    admin,
    attendanceController.deleteAttendance
);

export default router;