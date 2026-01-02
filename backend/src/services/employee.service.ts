import { EmployeeRepository } from '../repositories/employee.repository.js';
import { EmployeeDocument } from '../models/employee.model.js';
import { AppError } from '../middlewares/error/error-handler.middleware.js';

export class EmployeeService {
    private EmployeeRepository: EmployeeRepository;

    constructor() {
        this.EmployeeRepository = new EmployeeRepository();
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
        const employee = await this.EmployeeRepository.create(data);
        return employee;
    }

    async updateEmployee(employeeId: string, data: Partial<EmployeeDocument>) {
        const updatedEmployee = await this.EmployeeRepository.update(employeeId, data);
        if (!updatedEmployee) {
            throw new AppError('Employee not found', 404);
        }
        return updatedEmployee;
    }

    async deleteEmployee(employeeId: string) {
        const deleted = await this.EmployeeRepository.delete(employeeId);
        if (!deleted) {
            throw new AppError('Employee not found', 404);
        }
        return deleted;
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
        const employees = await this.EmployeeRepository.findByDepartment(
            departmentId,
            { ...options, employmentStatus }
        );
        return employees;
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
