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
