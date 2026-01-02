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
        const deleted = await this.departmentRepository.delete(departmentId);
        if (!deleted) {
            throw new AppError('Department not found', 404);
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

}