import { Types } from 'mongoose';
import { LeaveModel, LeaveDocument } from '../models/leave.model.js';

/**
 * Repository xử lý mọi thao tác database cho Leave
 */
export class LeaveRepository {
    /**
     * Tạo đơn nghỉ phép mới
     */
    async create(leaveData: Partial<LeaveDocument>): Promise<LeaveDocument> {
        const leave = new LeaveModel(leaveData);
        return await leave.save();
    }

    /**
     * Tìm đơn nghỉ phép theo ID
     */
    async findById(leaveId: string): Promise<LeaveDocument | null> {
        return await LeaveModel.findById(leaveId)
            .populate('employeeId', 'fullName email position')
            .populate('approvedBy', 'username email');
    }

    /**
     * Tìm tất cả đơn nghỉ phép của nhân viên
     */
    async findByEmployeeId(employeeId: string, options: any): Promise<LeaveDocument[]> {
        const query = LeaveModel.find({ employeeId: employeeId as any })
            .populate('approvedBy', 'username email');

        if (options.status) {
            query.where('status').equals(options.status);
        }

        if (options.startDate && options.endDate) {
            query.where('startDate').gte(options.startDate);
            query.where('endDate').lte(options.endDate);
        }

        if (options.sort) {
            query.sort(options.sort);
        } else {
            query.sort({ createdAt: -1 });
        }

        if (options.limit) {
            query.limit(options.limit);
        }

        if (options.skip) {
            query.skip(options.skip);
        }

        return await query.exec();
    }

    /**
     * Lấy tất cả đơn nghỉ phép (Admin)
     */
    async findAll(options: any): Promise<{ leaves: LeaveDocument[]; total: number }> {
        const query: any = {};

        if (options.status) {
            query.status = options.status;
        }

        if (options.leaveType) {
            query.leaveType = options.leaveType;
        }

        if (options.employeeId) {
            query.employeeId = options.employeeId as any;
        }

        if (options.startDate && options.endDate) {
            query.startDate = { $gte: new Date(options.startDate) };
            query.endDate = { $lte: new Date(options.endDate) };
        }

        const total = await LeaveModel.countDocuments(query);

        const leavesQuery = LeaveModel.find(query)
            .populate('employeeId', 'fullName email position departmentId')
            .populate('approvedBy', 'username email');

        if (options.sort) {
            leavesQuery.sort(options.sort);
        } else {
            leavesQuery.sort({ createdAt: -1 });
        }

        if (options.limit) {
            leavesQuery.limit(options.limit);
        }

        if (options.skip) {
            leavesQuery.skip(options.skip);
        }

        const leaves = await leavesQuery.exec();

        return { leaves, total };
    }

    /**
     * Cập nhật đơn nghỉ phép
     */
    async update(leaveId: string, updateData: Partial<LeaveDocument>): Promise<LeaveDocument | null> {
        return await LeaveModel.findByIdAndUpdate(
            leaveId,
            updateData,
            { new: true, runValidators: true }
        )
            .populate('employeeId', 'fullName email position')
            .populate('approvedBy', 'username email');
    }

    /**
     * Xóa đơn nghỉ phép
     */
    async delete(leaveId: string): Promise<LeaveDocument | null> {
        return await LeaveModel.findByIdAndDelete(leaveId);
    }

    /**
     * Kiểm tra xem có đơn nghỉ phép nào trùng lịch không
     */
    async checkOverlapping(employeeId: string, startDate: Date, endDate: Date, excludeLeaveId?: string): Promise<boolean> {
        const query: any = {
            employeeId: employeeId as any,
            status: { $in: ['Pending', 'Approved'] },
            $or: [
                { startDate: { $lte: endDate }, endDate: { $gte: startDate } }
            ]
        };

        if (excludeLeaveId) {
            query._id = { $ne: excludeLeaveId as any };
        }

        const count = await LeaveModel.countDocuments(query);
        return count > 0;
    }

    /**
     * Đếm số ngày nghỉ phép đã sử dụng
     */
    async countUsedLeaveDays(employeeId: string, year: number): Promise<number> {
        const startOfYear = new Date(year, 0, 1);
        const endOfYear = new Date(year, 11, 31, 23, 59, 59);

        const leaves = await LeaveModel.find({
            employeeId: employeeId as any,
            status: 'Approved',
            startDate: { $gte: startOfYear },
            endDate: { $lte: endOfYear }
        });

        let totalDays = 0;
        leaves.forEach(leave => {
            const start = new Date(leave.startDate);
            const end = new Date(leave.endDate);
            const diffTime = Math.abs(end.getTime() - start.getTime());
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 để bao gồm cả ngày bắt đầu
            totalDays += diffDays;
        });

        return totalDays;
    }

    /**
     * Lấy thống kê nghỉ phép
     */
    async getStatistics(options: any): Promise<any> {
        const match: any = {};

        if (options.startDate && options.endDate) {
            match.startDate = { $gte: new Date(options.startDate) };
            match.endDate = { $lte: new Date(options.endDate) };
        }

        if (options.status) {
            match.status = options.status;
        }

        const stats = await LeaveModel.aggregate([
            { $match: match },
            {
                $group: {
                    _id: '$leaveType',
                    count: { $sum: 1 },
                    totalDays: {
                        $sum: {
                            $divide: [
                                { $subtract: ['$endDate', '$startDate'] },
                                1000 * 60 * 60 * 24
                            ]
                        }
                    }
                }
            },
            {
                $project: {
                    _id: 0,
                    leaveType: '$_id',
                    count: 1,
                    totalDays: { $ceil: { $add: ['$totalDays', 1] } }
                }
            }
        ]);

        return stats;
    }
}
