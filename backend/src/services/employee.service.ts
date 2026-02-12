import { EmployeeRepository } from '../repositories/employee.repository.js';
import { EmployeeDocument, EmployeeModel } from '../models/employee.model.js';
import { AppError } from '../middlewares/error/error-handler.middleware.js';
import mongoose from 'mongoose';
import { DepartmentRepository } from '../repositories/department.repository.js';
import { DepartmentModel } from '../models/department.model.js';
import { User } from '../models/user.model.js';

export class EmployeeService {
    private EmployeeRepository: EmployeeRepository;
    private departmentRepository: DepartmentRepository;

    constructor() {
        this.EmployeeRepository = new EmployeeRepository();
        this.departmentRepository = new DepartmentRepository();
    }

    async getEmployeeById(employeeId: string) {
        const employee = await this.EmployeeRepository.findById(employeeId);
        if (!employee) {
            throw new AppError('Employee not found', 404);
        }
        return employee;
    }

    async getAllEmployees(options?: { 
        page?: number; 
        limit?: number; 
        departmentId?: string;
        searchTerm?: string;
        employmentStatus?: string;
    }) {
        const employees = await this.EmployeeRepository.findAll(options);
        return employees;
    }

    async createEmployee(data: Partial<EmployeeDocument>) {
        const session = await mongoose.startSession();

        try {
        session.startTransaction();

        const employeeData = new EmployeeModel(data);
        const employee = await employeeData.save({ session });

        await DepartmentModel.findByIdAndUpdate(
            data.departmentId,
            { $inc: { employeeCount: 1 } },
            { session }
        );

        await session.commitTransaction();
        return employee;

        } catch (err) {
        await session.abortTransaction();
        throw err;

        } finally {
        session.endSession();
        }
    }

    async updateEmployee(employeeId: string, data: Partial<EmployeeDocument>) {
        const session = await mongoose.startSession();

        try {
            session.startTransaction();

            // Lấy thông tin nhân viên hiện tại
            const currentEmployee = await this.EmployeeRepository.findById(employeeId);
            if (!currentEmployee) {
                throw new AppError('Employee not found', 404);
            }

            // Nếu có thay đổi phòng ban
            if (data.departmentId && data.departmentId.toString() !== currentEmployee.departmentId.toString()) {
                // Giảm employeeCount của phòng ban cũ
                await DepartmentModel.findByIdAndUpdate(
                    currentEmployee.departmentId,
                    { $inc: { employeeCount: -1 } },
                    { session }
                );

                // Tăng employeeCount của phòng ban mới
                await DepartmentModel.findByIdAndUpdate(
                    data.departmentId,
                    { $inc: { employeeCount: 1 } },
                    { session }
                );
            }

            // Cập nhật nhân viên
            const updatedEmployee = await EmployeeModel.findByIdAndUpdate(
                employeeId,
                data,
                { new: true, runValidators: true, session }
            );

            if (!updatedEmployee) {
                throw new AppError('Employee not found', 404);
            }

            await session.commitTransaction();
            return updatedEmployee;

        } catch (err) {
            await session.abortTransaction();
            throw err;

        } finally {
            session.endSession();
        }
    }

    async deleteEmployee(employeeId: string) {
        const session = await mongoose.startSession();

        try {
            session.startTransaction();

            // Lấy thông tin nhân viên trước khi xóa
            const employee = await this.EmployeeRepository.findById(employeeId);
            if (!employee) {
                throw new AppError('Employee not found', 404);
            }

            // Vô hiệu hóa User liên kết (nếu có)
            if (employee.userId) {
                await User.findByIdAndUpdate(
                    employee.userId,
                    { 
                        isActive: false, 
                        employeeId: null 
                    },
                    { session }
                );
            }

            // Xóa nhân viên
            const deleted = await EmployeeModel.findByIdAndDelete(employeeId, { session });
            if (!deleted) {
                throw new AppError('Employee not found', 404);
            }

            // Giảm employeeCount của phòng ban
            await DepartmentModel.findByIdAndUpdate(
                employee.departmentId,
                { $inc: { employeeCount: -1 } },
                { session }
            );

            await session.commitTransaction();
            return deleted;

        } catch (err) {
            await session.abortTransaction();
            throw err;

        } finally {
            session.endSession();
        }
    }

    async updateEmployeeStatus(employeeId: string, isActive: boolean) {
        const updatedEmployee = await this.EmployeeRepository.updateStatus(employeeId, isActive);
        if (!updatedEmployee) {
            throw new AppError('Employee not found', 404);
        }
        return updatedEmployee;
    }

    async getEmployeesByDepartment(
        departmentId: string, 
        employmentStatus?: string,
        options?: { page?: number; limit?: number }
    ) {
        const result = await this.EmployeeRepository.findByDepartment(
            departmentId,
            { ...options, employmentStatus }
        );
        return result;
    }

    async getStatisticsByDepartment() {
        const stats = await this.EmployeeRepository.getStatisticsByDepartment();
        return stats;
    }

    async getRecentEmployees(limit: number) {
        const employees = await this.EmployeeRepository.findRecent(limit);
        return employees;
    }

    async searchEmployees(keyword: string, page?: number, limit?: number) {
        const employees = await this.EmployeeRepository.search(keyword, { page, limit });
        return employees;
    }

    async getOverView() {
        const overview = await this.EmployeeRepository.getOverview();
        return overview;
    }
}
