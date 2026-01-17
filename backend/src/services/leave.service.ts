import { LeaveRepository } from '../repositories/leave.repository.js';
import { AppError } from '../middlewares/error/error-handler.middleware.js';
import { Types } from 'mongoose';

export class LeaveService {
    private leaveRepository: LeaveRepository;

    constructor() {
        this.leaveRepository = new LeaveRepository();
    }

    /**
     * Tạo đơn nghỉ phép mới
     */
    async createLeave(employeeId: string, data: any) {
        const { leaveType, startDate, endDate, reason } = data;

        // Validate dates
        const start = new Date(startDate);
        const end = new Date(endDate);

        if (start > end) {
            throw new AppError('Start date must be before end date', 400);
        }

        if (start < new Date()) {
            throw new AppError('Cannot create leave request for past dates', 400);
        }

        // Kiểm tra xem có đơn nghỉ phép nào trùng lịch không
        const hasOverlap = await this.leaveRepository.checkOverlapping(
            employeeId,
            start,
            end
        );

        if (hasOverlap) {
            throw new AppError('You already have a leave request for this period', 400);
        }

        const leaveData: any = {
            employeeId,
            leaveType,
            startDate: start,
            endDate: end,
            reason,
            status: 'Pending'
        };

        return await this.leaveRepository.create(leaveData);
    }

    /**
     * Lấy tất cả đơn nghỉ phép của nhân viên
     */
    async getMyLeaves(employeeId: string, options: any) {
        return await this.leaveRepository.findByEmployeeId(employeeId, options);
    }

    /**
     * Lấy chi tiết đơn nghỉ phép
     */
    async getLeaveById(leaveId: string, userId?: string) {
        if (!Types.ObjectId.isValid(leaveId)) {
            throw new AppError('Invalid leave ID', 400);
        }

        const leave = await this.leaveRepository.findById(leaveId);
        if (!leave) {
            throw new AppError('Leave request not found', 404);
        }

        // Nếu có userId, kiểm tra quyền truy cập
        if (userId && leave.employeeId.toString() !== userId) {
            throw new AppError('You do not have permission to view this leave request', 403);
        }

        return leave;
    }

    /**
     * Cập nhật đơn nghỉ phép (chỉ khi đơn còn ở trạng thái Pending)
     */
    async updateLeave(leaveId: string, employeeId: string, data: any) {
        if (!Types.ObjectId.isValid(leaveId)) {
            throw new AppError('Invalid leave ID', 400);
        }

        const leave = await this.leaveRepository.findById(leaveId);
        if (!leave) {
            throw new AppError('Leave request not found', 404);
        }

        if (leave.employeeId.toString() !== employeeId) {
            throw new AppError('You do not have permission to update this leave request', 403);
        }

        if (leave.status !== 'Pending') {
            throw new AppError('Can only update pending leave requests', 400);
        }

        // Validate dates nếu có cập nhật
        if (data.startDate || data.endDate) {
            const start = data.startDate ? new Date(data.startDate) : leave.startDate;
            const end = data.endDate ? new Date(data.endDate) : leave.endDate;

            if (start > end) {
                throw new AppError('Start date must be before end date', 400);
            }

            // Kiểm tra trùng lịch (loại trừ đơn hiện tại)
            const hasOverlap = await this.leaveRepository.checkOverlapping(
                employeeId,
                start,
                end,
                leaveId
            );

            if (hasOverlap) {
                throw new AppError('You already have a leave request for this period', 400);
            }
        }

        return await this.leaveRepository.update(leaveId, data);
    }

    /**
     * Hủy đơn nghỉ phép
     */
    async cancelLeave(leaveId: string, employeeId: string) {
        if (!Types.ObjectId.isValid(leaveId)) {
            throw new AppError('Invalid leave ID', 400);
        }

        const leave = await this.leaveRepository.findById(leaveId);
        if (!leave) {
            throw new AppError('Leave request not found', 404);
        }

        if (leave.employeeId.toString() !== employeeId) {
            throw new AppError('You do not have permission to cancel this leave request', 403);
        }

        if (leave.status === 'Cancelled') {
            throw new AppError('Leave request is already cancelled', 400);
        }

        if (leave.status === 'Rejected') {
            throw new AppError('Cannot cancel rejected leave request', 400);
        }

        return await this.leaveRepository.update(leaveId, { status: 'Cancelled' });
    }

    /**
     * Lấy tất cả đơn nghỉ phép (Admin)
     */
    async getAllLeaves(options: any) {
        return await this.leaveRepository.findAll(options);
    }

    /**
     * Duyệt/Từ chối đơn nghỉ phép (Admin)
     */
    async approveOrRejectLeave(leaveId: string, approverId: string, data: any) {
        if (!Types.ObjectId.isValid(leaveId)) {
            throw new AppError('Invalid leave ID', 400);
        }

        const leave = await this.leaveRepository.findById(leaveId);
        if (!leave) {
            throw new AppError('Leave request not found', 404);
        }

        if (leave.status !== 'Pending') {
            throw new AppError('Can only approve/reject pending leave requests', 400);
        }

        const { status, rejectionReason } = data;

        if (!['Approved', 'Rejected'].includes(status)) {
            throw new AppError('Invalid status. Must be Approved or Rejected', 400);
        }

        if (status === 'Rejected' && !rejectionReason) {
            throw new AppError('Rejection reason is required when rejecting leave request', 400);
        }

        const updateData: any = {
            status,
            approvedBy: approverId as any,
            approvedAt: new Date()
        };

        if (status === 'Rejected' && rejectionReason) {
            updateData.rejectionReason = rejectionReason;
        }

        return await this.leaveRepository.update(leaveId, updateData);
    }

    /**
     * Xóa đơn nghỉ phép (Admin)
     */
    async deleteLeave(leaveId: string) {
        if (!Types.ObjectId.isValid(leaveId)) {
            throw new AppError('Invalid leave ID', 400);
        }

        const leave = await this.leaveRepository.findById(leaveId);
        if (!leave) {
            throw new AppError('Leave request not found', 404);
        }

        return await this.leaveRepository.delete(leaveId);
    }

    /**
     * Lấy số ngày nghỉ phép đã sử dụng
     */
    async getUsedLeaveDays(employeeId: string, year: number) {
        return await this.leaveRepository.countUsedLeaveDays(employeeId, year);
    }

    /**
     * Lấy thống kê nghỉ phép
     */
    async getLeaveStatistics(options: any) {
        return await this.leaveRepository.getStatistics(options);
    }
}
