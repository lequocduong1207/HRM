import { Types } from 'mongoose';
import { Attendance } from '../models/attendance.model.js';
import { User } from '../models/user.model.js';
import { EmployeeModel } from '../models/employee.model.js';

export class AttendanceRepository {
    async checkInTime(userId: string, data: { location?: string; notes?: string }) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        // Find employee by userId first
        let employee = await EmployeeModel.findOne({ userId: new Types.ObjectId(userId) } as any);
        
        // If not found, try through user.employeeId
        if (!employee) {
            const user = await User.findById(userId);
            if (user?.employeeId) {
                employee = await EmployeeModel.findById(user.employeeId);
            } else if (user?.email) {
                employee = await EmployeeModel.findOne({ email: user.email });
            }
        }
        
        if (!employee) {
            throw new Error('Employee record not found for this user');
        }
        
        const attendance = new Attendance({
            employeeId: employee._id,
            date: today,
            checkIn: new Date(),
            notes: data.notes
        });
        return await attendance.save();
    }

    async checkOutTime(attendanceId: string, data: { location?: string; notes?: string }) {
        const attendance = await Attendance.findById(attendanceId);  
        if (!attendance) {
            throw new Error('Attendance record not found');
        }

        attendance.checkOut = new Date();
        if (data.notes) {
            attendance.notes = data.notes;
        }
        return await attendance.save();
    }

    async getTodayAttendance(userId: string) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        
        // Find employee by userId
        let employee = await EmployeeModel.findOne({ userId: userId } as any);
        
        if (!employee) {
            const user = await User.findById(userId);
            if (user?.employeeId) {
                employee = await EmployeeModel.findById(user.employeeId);
            } else if (user?.email) {
                employee = await EmployeeModel.findOne({ email: user.email });
            }
        }
        
        if (!employee) {
            return null;
        }
        
        return await Attendance.findOne({
            employeeId: employee._id,
            date: { $gte: today, $lt: tomorrow }
        });
    }   

    async findByUserId(userId: string, options: any) {
        // Find employee by userId
        let employee = await EmployeeModel.findOne({ userId: new Types.ObjectId(userId) } as any);
        
        if (!employee) {
            const user = await User.findById(userId);
            if (user?.employeeId) {
                employee = await EmployeeModel.findById(user.employeeId);
            } else if (user?.email) {
                employee = await EmployeeModel.findOne({ email: user.email });
            }
        }
        
        if (!employee) {
            return [];
        }
        
        const filter: any = { employeeId: employee._id };
        
        // Filter by date range
        if (options.startDate || options.endDate) {
            filter.date = {};
            if (options.startDate) {
                filter.date.$gte = new Date(options.startDate);
            }
            if (options.endDate) {
                filter.date.$lte = new Date(options.endDate);
            }
        }
        
        const query = Attendance.find(filter);
        
        if (options.sort) {
            query.sort(options.sort);
        } else {
            query.sort({ date: -1 }); // Default sort by date descending
        }

        if (options.limit) {
            query.limit(options.limit);
        }
        if (options.skip) {
            query.skip(options.skip);
        }
        return await query.exec();
    }

    async findAll(options: any) {
        const filter: any = {};
        
        // Filter by employeeId
        if (options.employeeId) {
            filter.employeeId = new Types.ObjectId(options.employeeId.toString());
        }
        
        // Filter by date range
        if (options.startDate || options.endDate) {
            filter.date = {};
            if (options.startDate) {
                filter.date.$gte = new Date(options.startDate);
            }
            if (options.endDate) {
                filter.date.$lte = new Date(options.endDate);
            }
        }
        
        const query = Attendance.find(filter).populate('employeeId', 'fullName email');
        
        if (options.sort) {
            query.sort(options.sort);
        } else {
            query.sort({ date: -1 }); // Default sort by date descending
        }
        
        if (options.limit) {
            query.limit(options.limit);
        }
        if (options.skip) {
            query.skip(options.skip);
        }
        
        return await query.exec();
    }

    async findById(attendanceId: number) {
        return await Attendance.findOne({ attendanceId });
    }

    async create(attendanceData: any) {
        const attendance = new Attendance(attendanceData);
        return await attendance.save();
    }

    async update(attendanceId: number, updateData: any) {
        const attendance = await Attendance.findOneAndUpdate(
            { attendanceId },
            updateData,
            { new: true }
        );
        return attendance;
    }

    async delete(attendanceId: number) {
        return await Attendance.findOneAndDelete({ attendanceId });
    }

    async getSummary(options: any) {
        const match: any = {};
        if (options.startDate && options.endDate) {
            match.date = {
                $gte: new Date(options.startDate),
                $lte: new Date(options.endDate)
            };
        }
        if (options.employeeId) {
            match.employeeId = new Types.ObjectId(options.employeeId);
        }
        const summary = await Attendance.aggregate([
            { $match: match },
            {
                $group: {
                    _id: "$employeeId",
                    totalDays: { $sum: 1 },
                    lateDays: { $sum: { $cond: ["$isLate", 1, 0] } },
                    earlyLeaveDays: { $sum: { $cond: ["$isEarlyLeave", 1, 0] } }
                }
            }
        ]);
        return summary;
    }
}