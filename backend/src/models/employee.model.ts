import { Schema, model, Document } from 'mongoose';

export interface EmployeeDocument extends Document {
  fullName: string;
  dob?: Date;
  gender?: string;
  email?: string;
  phone?: string;
  address?: string;
  nationalId?: string;
  departmentId: Schema.Types.ObjectId;
  position?: string;
  hireDate?: Date;
  employmentStatus?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const EmployeeSchema = new Schema<EmployeeDocument>(
  {
    fullName: {
      type: String,
      required: true,
      maxlength: 150,
      trim: true,
    },
    dob: {
      type: Date,
    },
    gender: {
      type: String,
      maxlength: 10,
    },
    email: {
      type: String,
      maxlength: 150,
      unique: true,
      sparse: true,
    },
    phone: {
      type: String,
      maxlength: 30,
    },
    address: {
      type: String,
    },
    nationalId: {
      type: String,
      maxlength: 20,
      unique: true,
      sparse: true,
    },
    departmentId: {
      type: Schema.Types.ObjectId,
      ref: 'Department',
      required: true,
    },
    position: {
      type: String,
      maxlength: 80,
    },
    hireDate: {
      type: Date,
    },
    employmentStatus: {
      type: String,
      maxlength: 20,
      default: 'ACTIVE',
    },
  },
  {
    timestamps: {
      createdAt: 'createdAt',
      updatedAt: 'updatedAt',
    },
    collection: 'employees',
  }
);

export const EmployeeModel = model<EmployeeDocument>('Employee', EmployeeSchema);
