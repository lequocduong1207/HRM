import { Document, Schema, model } from 'mongoose';

export interface DepartmentDocument extends Document {
  name: string;
  description?: string;
  managerId?: Schema.Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

const DepartmentSchema = new Schema<DepartmentDocument>(
  {
    name: {
        type: String,
        required: true,
        maxlength: 100,
        trim: true,
    },
    description: {
        type: String,
        maxlength: 500,
        trim: true,
    },
    managerId: {    
        type: Schema.Types.ObjectId,
        ref: 'Employee',
        unique: true,
        sparse: true,
    },
  },
    { timestamps: true }
);

// Virtual field để populate employees
DepartmentSchema.virtual('employees', {
  ref: 'Employee',
  localField: '_id',
  foreignField: 'departmentId'
});

// Enable virtuals in JSON
DepartmentSchema.set('toJSON', { virtuals: true });
DepartmentSchema.set('toObject', { virtuals: true });

export const DepartmentModel = model<DepartmentDocument>('Department', DepartmentSchema);
