import { Schema, model, Document } from 'mongoose';

export interface LeaveDocument extends Document {
  employeeId: Schema.Types.ObjectId;
  leaveType: string;
  startDate: Date;
  endDate: Date;
  reason?: string;
  status: string;
  approvedBy?: Schema.Types.ObjectId;
  approvedAt?: Date;
  rejectionReason?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const LeaveSchema = new Schema<LeaveDocument>(
  {
    employeeId: {
      type: Schema.Types.ObjectId,
      ref: 'Employee',
      required: true,
    },
    leaveType: {
      type: String,
      required: true,
      enum: ['Annual', 'Sick', 'Unpaid', 'Maternity', 'Paternity', 'Other'],
      maxlength: 50,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    reason: {
      type: String,
      maxlength: 500,
    },
    status: {
      type: String,
      required: true,
      enum: ['Pending', 'Approved', 'Rejected', 'Cancelled'],
      default: 'Pending',
    },
    approvedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    approvedAt: {
      type: Date,
    },
    rejectionReason: {
      type: String,
      maxlength: 500,
    },
  },
  {
    timestamps: {
      createdAt: 'createdAt',
      updatedAt: 'updatedAt',
    },
    collection: 'leave_requests',
  }
);

// Index để tìm kiếm nhanh
LeaveSchema.index({ employeeId: 1, startDate: -1 });
LeaveSchema.index({ status: 1, createdAt: -1 });

export const LeaveModel = model<LeaveDocument>('Leave', LeaveSchema);
