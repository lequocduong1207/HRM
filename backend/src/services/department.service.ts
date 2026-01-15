import { DepartmentRepository } from '../repositories/department.repository.js';
import { AppError } from '../middlewares/error/error-handler.middleware.js';

export class DepartmentService {
    private departmentRepository: DepartmentRepository;

    constructor() {
        this.departmentRepository = new DepartmentRepository();
    }

    async createDepartment(data: { name: string; description?: string; managerId?: string }) {
        const department = await this.departmentRepository.create(data);
        return department;
    }

    async updateDepartment(departmentId: string, data: { name?: string; description?: string; managerId?: string }) {
        const updatedDepartment = await this.departmentRepository.update(departmentId, data);
        if (!updatedDepartment) {
            throw new AppError('Department not found', 404);
        }
        return updatedDepartment;
    }

    async getDepartmentById(departmentId: string) {
        const department = await this.departmentRepository.findById(departmentId);
        if (!department) {
            throw new AppError('Department not found', 404);
        }
        return department;
    }

    async getAllDepartments(options?: { searchTerm?: string; page?: number; limit?: number }) {
        const result = await this.departmentRepository.findAll(options);
        return result;
    }

    async getAllSimple() {
        const departments = await this.departmentRepository.findAll();
        return departments;
    }

    async getStatistics() {
        const statistics = await this.departmentRepository.getStatistics();
        return statistics;
    }

    async deleteDepartment(departmentId: string) {
        // Check if department exists and is not deleted
        const department = await this.departmentRepository.findById(departmentId);
        if (!department) {
            throw new AppError('Department not found', 404);
        }

        // Check if department has employees
        const employeeCount = await this.departmentRepository.countEmployeesByDepartment(departmentId);
        if (employeeCount > 0) {
            throw new AppError(
                `Cannot delete department. There are ${employeeCount} employee(s) in this department. Please reassign them first.`, 
                400
            );
        }

        const deleted = await this.departmentRepository.delete(departmentId);
        if (!deleted) {
            throw new AppError('Failed to delete department', 500);
        }
        return deleted;
    }

    async getDepartmentWithEmployees(departmentId: string) {
        const department = await this.departmentRepository.findWithEmployees(departmentId);
        if (!department) {
            throw new AppError('Department not found', 404);
        }   
        return department;
    }

    async getDepartmentsOverview() {
        const overview = await this.departmentRepository.getOverview();
        return overview;
    }

    async restoreDepartment(departmentId: string) {
        const restored = await this.departmentRepository.restore(departmentId);
        if (!restored) {
            throw new AppError('Department not found or already active', 404);
        }
        return restored;
    }

}