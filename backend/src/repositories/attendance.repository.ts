import { Types } from 'mongoose';
import { Attendance } from '../models/attendance.model.js';

/**
 * Repository xử lý mọi thao tác database cho Attendance
 */
export class AttendanceRepository {
    async checkInTime(userId: string, data: { location?: string; notes?: string }) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const attendance = new Attendance({
            employeeId: new Types.ObjectId(userId),
            date: today,
            checkIn: new Date(),
            notes: data.notes
        });
        return await attendance.save();
    }

    async checkOutTime(attendanceId: number, data: { location?: string; notes?: string }) {
        const attendance = await Attendance.findOne({ attendanceId });  
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
        return await Attendance.findOne({
            employeeId: new Types.ObjectId(userId),
            date: { $gte: today, $lt: tomorrow }
        });
    }   

    async findByUserId(userId: string, options: any) {
        const query = Attendance.find({ employeeId: new Types.ObjectId(userId) });  
        if (options.sort) {
            query.sort(options.sort);
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
        const query = Attendance.find();
        if (options.sort) {
            query.sort(options.sort);
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