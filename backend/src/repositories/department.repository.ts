import { Types } from 'mongoose';
import { DepartmentModel } from '../models/department.model.js';

interface PaginationOptions {
    page?: number;
    limit?: number;
    searchTerm?: string;
    includeDeleted?: boolean;
}

export class DepartmentRepository {
    async getOverview() {
        const totalDepartments = await DepartmentModel.countDocuments({ isDeleted: false });
        return { totalDepartments };
    }

    async create(data: { name: string; description?: string; managerId?: string }) {
        const departmentData: any = {
            name: data.name,
            description: data.description
        };
        
        if (data.managerId && Types.ObjectId.isValid(data.managerId)) {
            departmentData.managerId = new Types.ObjectId(data.managerId);
        }
        
        const department = new DepartmentModel(departmentData);
        return await department.save();
    }

    async update(departmentId: string, data: { name?: string; description?: string; managerId?: string }) {
        if (!Types.ObjectId.isValid(departmentId)) {
            return null;
        }
        
        const updateData: any = {
            name: data.name,
            description: data.description
        };
        
        if (data.managerId && Types.ObjectId.isValid(data.managerId)) {
            updateData.managerId = new Types.ObjectId(data.managerId);
        }
        
        return await DepartmentModel.findByIdAndUpdate(
            departmentId, 
            updateData, 
            { new: true, runValidators: true }
        ).populate('managerId');
    }

    async findById(departmentId: string) {
        if (!Types.ObjectId.isValid(departmentId)) {
            return null;
        }
        return await DepartmentModel.findOne({ 
            _id: departmentId, 
            isDeleted: false 
        }).populate('managerId');
    }

    async findAll(options?: PaginationOptions) {
        if (!options) {
            // Simple mode - no pagination, only active departments for filters
            return await DepartmentModel.find({ isDeleted: false })
                .populate('managerId')
                .sort({ name: 1 });
        }
        
        const page = options.page || 1;
        const limit = options.limit || 10;
        const skip = (page - 1) * limit;
        
        const query: any = {};
        // When using pagination, allow includeDeleted option for admin management
        if (!options.includeDeleted) {
            query.isDeleted = false;
        }
        
        if (options.searchTerm) {
            const regex = new RegExp(options.searchTerm, 'i');
            query.$or = [
                { name: regex },
                { description: regex }
            ];
        }
        
        const [data, total] = await Promise.all([
            DepartmentModel.find(query)
                .populate('managerId')
                .populate('employees')
                .skip(skip)
                .limit(limit)
                .sort({ name: 1 })
                .exec(),
            DepartmentModel.countDocuments(query)
        ]);
        
        return {
            data,
            pagination: { page, limit, total }
        };
    }

    async delete(departmentId: string) {
        if (!Types.ObjectId.isValid(departmentId)) {
            return null;
        }
        return await DepartmentModel.findOneAndUpdate(
            { _id: departmentId, isDeleted: false },
            { isDeleted: true, deletedAt: new Date() },
            { new: true }
        );
    }

    async findWithEmployees(departmentId: string) {
        if (!Types.ObjectId.isValid(departmentId)) {
            return null;
        }
        return await DepartmentModel.findOne({ 
            _id: departmentId, 
            isDeleted: false 
        })
            .populate('managerId')
            .populate('employees');
    }

    async getStatistics() {
        const departments = await DepartmentModel.find({ isDeleted: false }).populate('employees');
        
        const statistics = await Promise.all(
            departments.map(async (dept) => {
                const employeeCount = await DepartmentModel.db.model('Employee').countDocuments({
                    departmentId: dept._id
                });
                
                return {
                    departmentId: dept._id,
                    departmentName: dept.name,
                    employeeCount
                };
            })
        );
        
        return statistics;
    }

    async countEmployeesByDepartment(departmentId: string) {
        if (!Types.ObjectId.isValid(departmentId)) {
            return 0;
        }
        return await DepartmentModel.db.model('Employee').countDocuments({
            departmentId: new Types.ObjectId(departmentId)
        });
    }

    async restore(departmentId: string) {
        if (!Types.ObjectId.isValid(departmentId)) {
            return null;
        }
        return await DepartmentModel.findOneAndUpdate(
            { _id: departmentId, isDeleted: true },
            { isDeleted: false, deletedAt: null },
            { new: true }
        );
    }
}
