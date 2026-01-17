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
        /* 
            #swagger.tags = ['Leaves']
            #swagger.summary = 'Create leave request'
            #swagger.description = 'Employee creates a new leave request'
            #swagger.parameters['body'] = {
                in: 'body',
                required: true,
                schema: {
                    type: 'object',
                    required: ['leaveType', 'startDate', 'endDate'],
                    properties: {
                        leaveType: { 
                            type: 'string', 
                            enum: ['Annual', 'Sick', 'Unpaid', 'Maternity', 'Paternity', 'Other'],
                            example: 'Annual' 
                        },
                        startDate: { type: 'string', format: 'date', example: '2026-02-01' },
                        endDate: { type: 'string', format: 'date', example: '2026-02-05' },
                        reason: { type: 'string', example: 'Family vacation' }
                    }
                }
            }
        */
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
        /* 
            #swagger.tags = ['Leaves']
            #swagger.summary = 'Get my leave requests'
            #swagger.description = 'Get all leave requests of current user'
            #swagger.parameters['status'] = {
                in: 'query',
                description: 'Filter by status',
                required: false,
                type: 'string',
                enum: ['Pending', 'Approved', 'Rejected', 'Cancelled']
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
        /* 
            #swagger.tags = ['Leaves']
            #swagger.summary = 'Get leave request by ID'
            #swagger.description = 'Get details of a leave request'
            #swagger.parameters['id'] = {
                in: 'path',
                required: true,
                type: 'string',
                description: 'Leave request ID'
            }
        */
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
        /* 
            #swagger.tags = ['Leaves']
            #swagger.summary = 'Update leave request'
            #swagger.description = 'Update a pending leave request'
            #swagger.parameters['id'] = {
                in: 'path',
                required: true,
                type: 'string',
                description: 'Leave request ID'
            }
            #swagger.parameters['body'] = {
                in: 'body',
                required: true,
                schema: {
                    type: 'object',
                    properties: {
                        leaveType: { 
                            type: 'string', 
                            enum: ['Annual', 'Sick', 'Unpaid', 'Maternity', 'Paternity', 'Other']
                        },
                        startDate: { type: 'string', format: 'date' },
                        endDate: { type: 'string', format: 'date' },
                        reason: { type: 'string' }
                    }
                }
            }
        */
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
        /* 
            #swagger.tags = ['Leaves']
            #swagger.summary = 'Cancel leave request'
            #swagger.description = 'Cancel a leave request'
            #swagger.parameters['id'] = {
                in: 'path',
                required: true,
                type: 'string',
                description: 'Leave request ID'
            }
        */
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
        /* 
            #swagger.tags = ['Leaves']
            #swagger.summary = 'Get all leave requests'
            #swagger.description = 'Get all leave requests (Admin only)'
            #swagger.parameters['status'] = {
                in: 'query',
                description: 'Filter by status',
                required: false,
                type: 'string',
                enum: ['Pending', 'Approved', 'Rejected', 'Cancelled']
            }
            #swagger.parameters['leaveType'] = {
                in: 'query',
                description: 'Filter by leave type',
                required: false,
                type: 'string'
            }
            #swagger.parameters['employeeId'] = {
                in: 'query',
                description: 'Filter by employee ID',
                required: false,
                type: 'string'
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
        /* 
            #swagger.tags = ['Leaves']
            #swagger.summary = 'Approve or reject leave request'
            #swagger.description = 'Approve or reject a leave request (Admin only)'
            #swagger.parameters['id'] = {
                in: 'path',
                required: true,
                type: 'string',
                description: 'Leave request ID'
            }
            #swagger.parameters['body'] = {
                in: 'body',
                required: true,
                schema: {
                    type: 'object',
                    required: ['status'],
                    properties: {
                        status: { 
                            type: 'string', 
                            enum: ['Approved', 'Rejected'],
                            example: 'Approved'
                        },
                        rejectionReason: { type: 'string', example: 'Insufficient leave balance' }
                    }
                }
            }
        */
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
        /* 
            #swagger.tags = ['Leaves']
            #swagger.summary = 'Delete leave request'
            #swagger.description = 'Delete a leave request (Admin only)'
            #swagger.parameters['id'] = {
                in: 'path',
                required: true,
                type: 'string',
                description: 'Leave request ID'
            }
        */
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
        /* 
            #swagger.tags = ['Leaves']
            #swagger.summary = 'Get used leave days'
            #swagger.description = 'Get number of used leave days for current year'
            #swagger.parameters['year'] = {
                in: 'query',
                required: false,
                type: 'integer',
                description: 'Year (default: current year)'
            }
        */
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
        /* 
            #swagger.tags = ['Leaves']
            #swagger.summary = 'Get leave statistics'
            #swagger.description = 'Get leave statistics (Admin only)'
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
            #swagger.parameters['status'] = {
                in: 'query',
                description: 'Filter by status',
                required: false,
                type: 'string'
            }
        */
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
