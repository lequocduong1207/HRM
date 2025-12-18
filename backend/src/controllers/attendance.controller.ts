import { Request, Response } from 'express';
import { AttendanceService } from '../services/attendance.service.js';
import { asyncHandler } from '../middlewares/error/async-handler.middleware.js';

export class AttendanceController {
    private attendanceService: AttendanceService;

    constructor() {
        this.attendanceService = new AttendanceService();
    }

    /**
     * @route   POST /api/v1/attendances/check-in
     * @desc    Check in (chấm công vào)
     * @access  Private
     */
    checkIn = asyncHandler(async (req: Request, res: Response) => {
        /* 
            #swagger.tags = ['Attendances']
            #swagger.summary = 'Check in'
            #swagger.description = 'Employee check-in for attendance'
            #swagger.parameters['body'] = {
                in: 'body',
                required: false,
                schema: {
                    type: 'object',
                    properties: {
                        location: { type: 'string', example: 'Office' },
                        notes: { type: 'string', example: 'On time' }
                    }
                }
            }
        */
        const userId = req.user!.userId;
        const { location, notes } = req.body;

        const attendance = await this.attendanceService.checkIn(userId, {
            location,
            notes
        });

        res.status(201).json({
            success: true,
            message: 'Check-in successful',
            data: attendance
        });
    });

    /**
     * @route   PUT /api/v1/attendances/check-out
     * @desc    Check out (chấm công ra)
     * @access  Private
     */
    checkOut = asyncHandler(async (req: Request, res: Response) => {
        /* 
            #swagger.tags = ['Attendances']
            #swagger.summary = 'Check out'
            #swagger.description = 'Employee check-out for attendance'
            #swagger.parameters['body'] = {
                in: 'body',
                required: false,
                schema: {
                    type: 'object',
                    properties: {
                        location: { type: 'string', example: 'Office' },
                        notes: { type: 'string', example: 'Completed tasks' }
                    }
                }
            }
        */
        const userId = req.user!.userId;
        const { location, notes } = req.body;

        const attendance = await this.attendanceService.checkOut(userId, {
            location,
            notes
        });

        res.status(200).json({
            success: true,
            message: 'Check-out successful',
            data: attendance
        });
    });

    /**
     * @route   GET /api/v1/attendances/my-attendances
     * @desc    Lấy lịch sử chấm công của user
     * @access  Private
     */
    getMyAttendances = asyncHandler(async (req: Request, res: Response) => {
        /* 
            #swagger.tags = ['Attendances']
            #swagger.summary = 'Get my attendances'
            #swagger.description = 'Get attendance history of current user'
            #swagger.parameters['startDate'] = {
                in: 'query',
                description: 'Start date (YYYY-MM-DD)',
                required: false,
                type: 'string'
            }
            #swagger.parameters['endDate'] = {
                in: 'query',
                description: 'End date (YYYY-MM-DD)',
                required: false,
                type: 'string'
            }
            #swagger.parameters['page'] = {
                in: 'query',
                required: false,
                type: 'integer'
            }
            #swagger.parameters['limit'] = {
                in: 'query',
                required: false,
                type: 'integer'
            }
        */
        const userId = req.user!.userId;
        const { startDate, endDate, page, limit } = req.query;

        const result = await this.attendanceService.getMyAttendances(userId, {
            startDate: startDate as string,
            endDate: endDate as string,
            page: page ? parseInt(page as string) : undefined,
            limit: limit ? parseInt(limit as string) : undefined
        });

        res.status(200).json({
            success: true,
            data: result
        });
    });

    /**
     * @route   GET /api/v1/attendances/today
     * @desc    Kiểm tra trạng thái chấm công hôm nay
     * @access  Private
     */
    getTodayAttendance = asyncHandler(async (req: Request, res: Response) => {
        /* 
            #swagger.tags = ['Attendances']
            #swagger.summary = 'Get today attendance'
            #swagger.description = 'Check today attendance status of current user'
        */
        const userId = req.user!.userId;

        const attendance = await this.attendanceService.getTodayAttendance(userId);

        res.status(200).json({
            success: true,
            data: attendance
        });
    });

    /**
     * @route   GET /api/v1/attendances
     * @desc    Lấy tất cả attendances (Admin/Manager)
     * @access  Private/Admin
     */
    getAllAttendances = asyncHandler(async (req: Request, res: Response) => {
        /* 
            #swagger.tags = ['Attendances']
            #swagger.summary = 'Get all attendances'
            #swagger.description = 'Get all attendances (Admin only)'
            #swagger.parameters['employeeId'] = {
                in: 'query',
                description: 'Filter by employee ID',
                required: false,
                type: 'integer'
            }
            #swagger.parameters['startDate'] = {
                in: 'query',
                description: 'Start date (YYYY-MM-DD)',
                required: false,
                type: 'string'
            }
            #swagger.parameters['endDate'] = {
                in: 'query',
                description: 'End date (YYYY-MM-DD)',
                required: false,
                type: 'string'
            }
            #swagger.parameters['page'] = {
                in: 'query',
                required: false,
                type: 'integer'
            }
            #swagger.parameters['limit'] = {
                in: 'query',
                required: false,
                type: 'integer'
            }
        */
        const { employeeId, startDate, endDate, page, limit } = req.query;

        const result = await this.attendanceService.getAllAttendances({
            employeeId: employeeId ? parseInt(employeeId as string) : undefined,
            startDate: startDate as string,
            endDate: endDate as string,
            page: page ? parseInt(page as string) : undefined,
            limit: limit ? parseInt(limit as string) : undefined
        });

        res.status(200).json({
            success: true,
            data: result
        });
    });

    /**
     * @route   GET /api/v1/attendances/:id
     * @desc    Lấy chi tiết attendance
     * @access  Private
     */
    getAttendanceById = asyncHandler(async (req: Request, res: Response) => {
        /* 
            #swagger.tags = ['Attendances']
            #swagger.summary = 'Get attendance by ID'
            #swagger.description = 'Get detailed attendance information'
            #swagger.parameters['id'] = {
                in: 'path',
                description: 'Attendance ID',
                required: true,
                type: 'integer'
            }
        */
        const attendanceId = parseInt(req.params.id);

        const attendance = await this.attendanceService.getAttendanceById(attendanceId);

        res.status(200).json({
            success: true,
            data: attendance
        });
    });

    /**
     * @route   PUT /api/v1/attendances/:id
     * @desc    Cập nhật attendance (Admin)
     * @access  Private/Admin
     */
    updateAttendance = asyncHandler(async (req: Request, res: Response) => {
        /* 
            #swagger.tags = ['Attendances']
            #swagger.summary = 'Update attendance'
            #swagger.description = 'Update attendance record (Admin only)'
            #swagger.parameters['id'] = {
                in: 'path',
                description: 'Attendance ID',
                required: true,
                type: 'integer'
            }
            #swagger.parameters['body'] = {
                in: 'body',
                required: true,
                schema: {
                    type: 'object',
                    properties: {
                        checkInTime: { type: 'string', format: 'date-time' },
                        checkOutTime: { type: 'string', format: 'date-time' },
                        status: { type: 'string', enum: ['present', 'late', 'absent', 'leave'] },
                        location: { type: 'string' },
                        notes: { type: 'string' }
                    }
                }
            }
        */
        const attendanceId = parseInt(req.params.id);

        const attendance = await this.attendanceService.updateAttendance(attendanceId, req.body);

        res.status(200).json({
            success: true,
            message: 'Attendance updated successfully',
            data: attendance
        });
    });

    /**
     * @route   DELETE /api/v1/attendances/:id
     * @desc    Xóa attendance (Admin)
     * @access  Private/Admin
     */
    deleteAttendance = asyncHandler(async (req: Request, res: Response) => {
        /* 
            #swagger.tags = ['Attendances']
            #swagger.summary = 'Delete attendance'
            #swagger.description = 'Delete attendance record (Admin only)'
            #swagger.parameters['id'] = {
                in: 'path',
                description: 'Attendance ID',
                required: true,
                type: 'integer'
            }
        */
        const attendanceId = parseInt(req.params.id);

        await this.attendanceService.deleteAttendance(attendanceId);

        res.status(200).json({
            success: true,
            message: 'Attendance deleted successfully'
        });
    });

    /**
     * @route   GET /api/v1/attendances/report/summary
     * @desc    Báo cáo tổng hợp chấm công (Admin)
     * @access  Private/Admin
     */
    getAttendanceSummary = asyncHandler(async (req: Request, res: Response) => {
        /* 
            #swagger.tags = ['Attendances']
            #swagger.summary = 'Get attendance summary report'
            #swagger.description = 'Get attendance summary report (Admin only)'
            #swagger.parameters['employeeId'] = {
                in: 'query',
                description: 'Filter by employee ID',
                required: false,
                type: 'integer'
            }
            #swagger.parameters['startDate'] = {
                in: 'query',
                description: 'Start date (YYYY-MM-DD)',
                required: false,
                type: 'string'
            }
            #swagger.parameters['endDate'] = {
                in: 'query',
                description: 'End date (YYYY-MM-DD)',
                required: false,
                type: 'string'
            }
        */
        const { employeeId, startDate, endDate } = req.query;

        const summary = await this.attendanceService.getAttendanceSummary({
            employeeId: employeeId ? parseInt(employeeId as string) : undefined,
            startDate: startDate as string,
            endDate: endDate as string
        });

        res.status(200).json({
            success: true,
            data: summary
        });
    });
}
