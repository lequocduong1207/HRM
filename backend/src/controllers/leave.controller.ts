import { Request, Response } from 'express';
import { LeaveService } from '../services/leave.service.js';
import { asyncHandler } from '../middlewares/error/async-handler.middleware.js';

export class LeaveController {
    private leaveService: LeaveService;

    constructor() {
        this.leaveService = new LeaveService();
    }

    /**
     * @route   POST /api/v1/leaves
     * @desc    Tạo đơn nghỉ phép mới
     * @access  Private
     */
    createLeave = asyncHandler(async (req: Request, res: Response) => {
        const userId = req.user!.userId;
        const leaveData = req.body;

        const leave = await this.leaveService.createLeave(userId, leaveData);

        res.status(201).json({
            success: true,
            message: 'Leave request created successfully',
            data: leave
        });
    });

    /**
     * @route   GET /api/v1/leaves/my-leaves
     * @desc    Lấy danh sách đơn nghỉ phép của nhân viên
     * @access  Private
     */
    getMyLeaves = asyncHandler(async (req: Request, res: Response) => {
        const userId = req.user!.userId;
        const { status, startDate, endDate, page, limit } = req.query;

        const options = {
            status: status as string,
            startDate: startDate as string,
            endDate: endDate as string,
            page: page ? parseInt(page as string) : 1,
            limit: limit ? parseInt(limit as string) : 10,
            skip: page && limit ? (parseInt(page as string) - 1) * parseInt(limit as string) : 0
        };

        const leaves = await this.leaveService.getMyLeaves(userId, options);

        res.status(200).json({
            success: true,
            data: leaves
        });
    });

    /**
     * @route   GET /api/v1/leaves/:id
     * @desc    Lấy chi tiết đơn nghỉ phép
     * @access  Private
     */
    getLeaveById = asyncHandler(async (req: Request, res: Response) => {
        const { id } = req.params;
        const userId = req.user!.userId;
        const isAdmin = req.user!.role === 'admin';

        const leave = await this.leaveService.getLeaveById(id, isAdmin ? undefined : userId);

        res.status(200).json({
            success: true,
            data: leave
        });
    });

    /**
     * @route   PUT /api/v1/leaves/:id
     * @desc    Cập nhật đơn nghỉ phép
     * @access  Private
     */
    updateLeave = asyncHandler(async (req: Request, res: Response) => {
        const { id } = req.params;
        const userId = req.user!.userId;
        const updateData = req.body;

        const leave = await this.leaveService.updateLeave(id, userId, updateData);

        res.status(200).json({
            success: true,
            message: 'Leave request updated successfully',
            data: leave
        });
    });

    /**
     * @route   PUT /api/v1/leaves/:id/cancel
     * @desc    Hủy đơn nghỉ phép
     * @access  Private
     */
    cancelLeave = asyncHandler(async (req: Request, res: Response) => {
        const { id } = req.params;
        const userId = req.user!.userId;

        const leave = await this.leaveService.cancelLeave(id, userId);

        res.status(200).json({
            success: true,
            message: 'Leave request cancelled successfully',
            data: leave
        });
    });

    /**
     * @route   GET /api/v1/leaves
     * @desc    Lấy tất cả đơn nghỉ phép (Admin)
     * @access  Private/Admin
     */
    getAllLeaves = asyncHandler(async (req: Request, res: Response) => {
        const { status, leaveType, employeeId, startDate, endDate, page, limit } = req.query;

        const options = {
            status: status as string,
            leaveType: leaveType as string,
            employeeId: employeeId as string,
            startDate: startDate as string,
            endDate: endDate as string,
            page: page ? parseInt(page as string) : 1,
            limit: limit ? parseInt(limit as string) : 10,
            skip: page && limit ? (parseInt(page as string) - 1) * parseInt(limit as string) : 0
        };

        const result = await this.leaveService.getAllLeaves(options);

        res.status(200).json({
            success: true,
            data: result.leaves,
            pagination: {
                page: options.page,
                limit: options.limit,
                total: result.total,
                totalPages: Math.ceil(result.total / options.limit)
            }
        });
    });

    /**
     * @route   PUT /api/v1/leaves/:id/approve
     * @desc    Duyệt hoặc từ chối đơn nghỉ phép (Admin)
     * @access  Private/Admin
     */
    approveOrRejectLeave = asyncHandler(async (req: Request, res: Response) => {
        const { id } = req.params;
        const userId = req.user!.userId;
        const { status, rejectionReason } = req.body;

        const leave = await this.leaveService.approveOrRejectLeave(id, userId, {
            status,
            rejectionReason
        });

        res.status(200).json({
            success: true,
            message: `Leave request ${status.toLowerCase()} successfully`,
            data: leave
        });
    });

    /**
     * @route   DELETE /api/v1/leaves/:id
     * @desc    Xóa đơn nghỉ phép (Admin)
     * @access  Private/Admin
     */
    deleteLeave = asyncHandler(async (req: Request, res: Response) => {
        const { id } = req.params;

        await this.leaveService.deleteLeave(id);

        res.status(200).json({
            success: true,
            message: 'Leave request deleted successfully'
        });
    });

    /**
     * @route   GET /api/v1/leaves/my-leaves/used-days
     * @desc    Lấy số ngày nghỉ phép đã sử dụng
     * @access  Private
     */
    getUsedLeaveDays = asyncHandler(async (req: Request, res: Response) => {
        const userId = req.user!.userId;
        const year = req.query.year ? parseInt(req.query.year as string) : new Date().getFullYear();

        const usedDays = await this.leaveService.getUsedLeaveDays(userId, year);

        res.status(200).json({
            success: true,
            data: {
                year,
                usedDays
            }
        });
    });

    /**
     * @route   GET /api/v1/leaves/statistics
     * @desc    Lấy thống kê nghỉ phép (Admin)
     * @access  Private/Admin
     */
    getLeaveStatistics = asyncHandler(async (req: Request, res: Response) => {
        const { startDate, endDate, status } = req.query;

        const statistics = await this.leaveService.getLeaveStatistics({
            startDate: startDate as string,
            endDate: endDate as string,
            status: status as string
        });

        res.status(200).json({
            success: true,
            data: statistics
        });
    });
}
