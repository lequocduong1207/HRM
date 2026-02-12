import { Types } from 'mongoose';
import { EmployeeDocument, EmployeeModel } from '../models/employee.model';

interface PaginationOptions {
    page?: number;
    limit?: number;
    departmentId?: string;
    searchTerm?: string;
    employmentStatus?: string;
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
        const employee = await EmployeeModel.findById(employeeId).populate('departmentId');
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

        if (options?.employmentStatus) {
            query.employmentStatus = options.employmentStatus;
        }

        if (options?.searchTerm) {
            const regex = new RegExp(options.searchTerm, 'i');
            query.$or = [
                { fullName: regex },
                { email: regex },
                { phone: regex },
                { position: regex }
            ];
        }

        const [data, total] = await Promise.all([
            EmployeeModel.find(query).populate('departmentId').skip(skip).limit(limit).exec(),
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

    async updateStatus(employeeId: string, isActive: boolean): Promise<EmployeeDocument | null> {
        // Validate ObjectId format
        if (!Types.ObjectId.isValid(employeeId)) {
            return null;
        }
        const employee = await EmployeeModel.findByIdAndUpdate(
            employeeId,
            { isActive },
            { new: true, runValidators: true }
        );
        return employee;
    }

    async findByDepartment(departmentId: string, options?: PaginationOptions): Promise<{
        data: EmployeeDocument[];
        pagination?: { page: number; limit: number; total: number };
    }> {
        if (!Types.ObjectId.isValid(departmentId)) {
            return {
                data: [],
                pagination: options?.page ? { page: 1, limit: 10, total: 0 } : undefined
            };
        }
        
        const query: any = { departmentId: new Types.ObjectId(departmentId) };
        
        if (options?.employmentStatus) {
            query.employmentStatus = options.employmentStatus;
        }

        // Nếu không có pagination options, trả về tất cả
        if (!options?.page && !options?.limit) {
            const data = await EmployeeModel.find(query).populate('departmentId').exec();
            return { data };
        }

        // Có pagination
        const page = options.page || 1;
        const limit = options.limit || 10;
        const skip = (page - 1) * limit;

        const [data, total] = await Promise.all([
            EmployeeModel.find(query).populate('departmentId').skip(skip).limit(limit).exec(),
            EmployeeModel.countDocuments(query)
        ]);
        return {
            data,
            pagination: { page, limit, total }
        };
    }

    async getStatisticsByDepartment(): Promise<any[]> {
        const statistics = await EmployeeModel.aggregate([
            {
                $group: {
                    _id: '$departmentId',
                    totalEmployees: { $sum: 1 },
                    activeEmployees: {
                        $sum: { $cond: [{ $eq: ['$isActive', true] }, 1, 0] }
                    }
                }
            },
            {
                $lookup: {
                    from: 'departments',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'department'
                }
            },
            {
                $unwind: { path: '$department', preserveNullAndEmptyArrays: true }
            },
            {
                $project: {
                    _id: 0,
                    departmentId: '$_id',
                    departmentName: '$department.name',
                    totalEmployees: 1,
                    activeEmployees: 1
                }
            }
        ]);
        return statistics;
    }

    async findRecent(limit: number): Promise<EmployeeDocument[]> {
        const employees = await EmployeeModel.find()
            .populate('departmentId')
            .sort({ createdAt: -1 })
            .limit(limit)
            .exec();
        return employees;
    }

    async search(keyword: string, options?: PaginationOptions): Promise<{
        data: EmployeeDocument[];
        pagination: { page: number; limit: number; total: number };
    }> {
        const page = options?.page || 1;
        const limit = options?.limit || 10;
        const skip = (page - 1) * limit;
        const regex = new RegExp(keyword, 'i');

        const query = {
            $or: [
                { fullName: regex },
                { email: regex },
                { phone: regex },
                { position: regex }
            ]
        };
        const [data, total] = await Promise.all([
            EmployeeModel.find(query).populate('departmentId').skip(skip).limit(limit).exec(),
            EmployeeModel.countDocuments(query)
        ]);
        return {
            data,
            pagination: { page, limit, total }
        };
    }

    async getOverview(): Promise<{ totalEmployees: number; activeEmployees: number; inactiveEmployees: number }> {
        const totalEmployees = await EmployeeModel.countDocuments();
        const activeEmployees = await EmployeeModel.countDocuments({ isActive: true });
        const inactiveEmployees = totalEmployees - activeEmployees;
        return { totalEmployees, activeEmployees, inactiveEmployees };
    }
}