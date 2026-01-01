import { Schema, model, Document, Types } from "mongoose";

export interface IAttendance extends Document {
    attendanceId?: number;
    employeeId: Types.ObjectId;
    date: Date;
    checkIn?: Date;
    checkOut?: Date;
    isLate?: boolean;
    isEarlyLeave?: boolean;
    notes?: string;
    createdAt: Date;
}

const attendanceSchema = new Schema<IAttendance>(
    {
        attendanceId: {
            type: Number,
            unique: true,
            index: true,
            sparse: true
        },
        employeeId: {
            type: Schema.Types.ObjectId,
            ref: "Employee",
            required: true
        },
        date: {
            type: Date,
            required: true
        },
        checkIn: {
            type: Date
        },
        checkOut: {
            type: Date
        },
        isLate: {
            type: Boolean,
            default: false
        },
        isEarlyLeave: {
            type: Boolean,
            default: false
        },
        notes: {
            type: String,
            trim: true
        }
    },
    {
        timestamps: { createdAt: true, updatedAt: false },
        versionKey: false
    }
);

export const Attendance = model<IAttendance>("Attendance", attendanceSchema);