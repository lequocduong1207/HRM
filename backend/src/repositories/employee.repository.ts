import { Types } from 'mongoose';
import { EmployeeDocument, EmployeeModel } from '../models/employee.model';

interface PaginationOptions {
    page?: number;
    limit?: number;
    departmentId?: string;
}

export class EmployeeRepository {
    /**
     * Find employee by ID
     */
    async findById(employeeId: string): Promise<EmployeeDocument | null> {
        // Validate ObjectId format
        if (!Types.ObjectId.isValid(employeeId)) {
            return null;
        }
        const employee = await EmployeeModel.findById(employeeId);
        return employee;
    }

    /**
     * Find all employees with pagination
     */
    async findAll(options?: PaginationOptions): Promise<{
        data: EmployeeDocument[];
        pagination: { page: number; limit: number; total: number };
    }> {
        const page = options?.page || 1;
        const limit = options?.limit || 10;
        const skip = (page - 1) * limit;

        const query: any = {};
        if (options?.departmentId) {
            query.departmentId = new Types.ObjectId(options.departmentId);
        }

        const [data, total] = await Promise.all([
            EmployeeModel.find(query).skip(skip).limit(limit).exec(),
            EmployeeModel.countDocuments(query)
        ]);

        return {
            data,
            pagination: { page, limit, total }
        };
    }

    /**
     * Create employee
     */
    async create(data: Partial<EmployeeDocument>): Promise<EmployeeDocument> {
        const employee = new EmployeeModel(data);
        await employee.save();
        return employee;
    }

    /**
     * Update employee
     */
    async update(employeeId: string, data: Partial<EmployeeDocument>): Promise<EmployeeDocument | null> {
        // Validate ObjectId format
        if (!Types.ObjectId.isValid(employeeId)) {
            return null;
        }

        const employee = await EmployeeModel.findByIdAndUpdate(
            employeeId,
            data,
            { new: true, runValidators: true }
        );

        return employee;
    }

    /**
     * Delete employee
     */
    async delete(employeeId: string): Promise<EmployeeDocument | null> {
        // Validate ObjectId format
        if (!Types.ObjectId.isValid(employeeId)) {
            return null;
        }

        const employee = await EmployeeModel.findByIdAndDelete(employeeId);
        return employee;
    }

    /**
     * Check if employee exists
     */
    async exists(employeeId: string): Promise<boolean> {
        if (!Types.ObjectId.isValid(employeeId)) {
            return false;
        }
        const count = await EmployeeModel.countDocuments({ _id: employeeId });
        return count > 0;
    }
}