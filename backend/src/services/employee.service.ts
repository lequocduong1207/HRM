import { EmployeeRepository } from '../repositories/employee.repository.js';
import { AppError } from '../middlewares/error/error-handler.middleware.js';
import { EmployeeEntity } from '../entities/employee.entity.js';

/**
 * Interface cho query options
 */
interface FindAllOptions {
    searchTerm?: string;
    departmentId?: number;
    employmentStatus?: 'active' | 'inactive' | 'terminated' | 'resigned';
    page?: number;
    limit?: number;
}

/**
 * Service xử lý business logic cho Employee
 */
export class EmployeeService {
    private employeeRepository: EmployeeRepository;

    constructor() {
        this.employeeRepository = new EmployeeRepository();
    }

    /**
     * Lấy tất cả nhân viên với filter và phân trang
     */
    async getAllEmployees(options: FindAllOptions = {}) {
        const result = await this.employeeRepository.findAll(options);
        
        return {
            data: result.data.map(employee => employee.toJSON()),
            pagination: result.pagination
        };
    }

    /**
     * Lấy nhân viên theo ID
     */
    async getEmployeeById(employeeId: number) {
        const employee = await this.employeeRepository.findById(employeeId);
        if (!employee) {
            throw new AppError('Employee not found', 404);
        }
        return employee.toJSON();
    }

    /**
     * Tạo nhân viên mới
     */
    async createEmployee(data: {
        fullName: string;
        dob?: Date;
        gender?: 'Male' | 'Female' | 'Other';
        email?: string;
        phone?: string;
        address?: string;
        nationalId?: string;
        departmentId?: number;
        position?: string;
        hireDate?: Date;
        employmentStatus?: 'active' | 'inactive' | 'terminated' | 'resigned';
    }) {
        // Validate
        if (!data.fullName || data.fullName.trim().length === 0) {
            throw new AppError('Full name is required', 400);
        }

        // Validate email format nếu có
        if (data.email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(data.email)) {
                throw new AppError('Invalid email format', 400);
            }

            // Kiểm tra email đã tồn tại
            const emailExists = await this.employeeRepository.checkEmailExists(data.email);
            if (emailExists) {
                throw new AppError('Email already exists', 400);
            }
        }

        // Kiểm tra CCCD/CMND đã tồn tại nếu có
        if (data.nationalId) {
            const nationalIdExists = await this.employeeRepository.checkNationalIdExists(data.nationalId);
            if (nationalIdExists) {
                throw new AppError('National ID already exists', 400);
            }
        }

        // Validate gender
        if (data.gender && !['Male', 'Female', 'Other'].includes(data.gender)) {
            throw new AppError('Invalid gender. Must be Male, Female, or Other', 400);
        }

        // Validate employment status
        const validStatuses = ['active', 'inactive', 'terminated', 'resigned'];
        if (data.employmentStatus && !validStatuses.includes(data.employmentStatus)) {
            throw new AppError(`Invalid employment status. Must be one of: ${validStatuses.join(', ')}`, 400);
        }

        // Tạo employee
        const employee = await this.employeeRepository.create({
            fullName: data.fullName,
            dob: data.dob,
            gender: data.gender,
            email: data.email,
            phone: data.phone,
            address: data.address,
            nationalId: data.nationalId,
            departmentId: data.departmentId,
            position: data.position,
            hireDate: data.hireDate || new Date(),
            employmentStatus: data.employmentStatus || 'active'
        });

        return employee.toJSON();
    }

    /**
     * Cập nhật thông tin nhân viên
     */
    async updateEmployee(employeeId: number, data: Partial<{
        fullName: string;
        dob: Date;
        gender: 'Male' | 'Female' | 'Other';
        email: string;
        phone: string;
        address: string;
        nationalId: string;
        departmentId: number;
        position: string;
        hireDate: Date;
        employmentStatus: 'active' | 'inactive' | 'terminated' | 'resigned';
    }>) {
        // Kiểm tra employee tồn tại
        const existingEmployee = await this.employeeRepository.findById(employeeId);
        if (!existingEmployee) {
            throw new AppError('Employee not found', 404);
        }

        // Validate full name nếu có
        if (data.fullName !== undefined && (!data.fullName || data.fullName.trim().length === 0)) {
            throw new AppError('Full name cannot be empty', 400);
        }

        // Validate và kiểm tra email mới nếu có
        if (data.email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(data.email)) {
                throw new AppError('Invalid email format', 400);
            }

            const emailExists = await this.employeeRepository.checkEmailExists(data.email, employeeId);
            if (emailExists) {
                throw new AppError('Email already exists', 400);
            }
        }

        // Kiểm tra CCCD/CMND mới nếu có
        if (data.nationalId) {
            const nationalIdExists = await this.employeeRepository.checkNationalIdExists(data.nationalId, employeeId);
            if (nationalIdExists) {
                throw new AppError('National ID already exists', 400);
            }
        }

        // Validate gender
        if (data.gender && !['Male', 'Female', 'Other'].includes(data.gender)) {
            throw new AppError('Invalid gender. Must be Male, Female, or Other', 400);
        }

        // Validate employment status
        const validStatuses = ['active', 'inactive', 'terminated', 'resigned'];
        if (data.employmentStatus && !validStatuses.includes(data.employmentStatus)) {
            throw new AppError(`Invalid employment status. Must be one of: ${validStatuses.join(', ')}`, 400);
        }

        // Cập nhật employee
        const employee = await this.employeeRepository.update(employeeId, data);
        
        if (!employee) {
            throw new AppError('Failed to update employee', 500);
        }

        return employee.toJSON();
    }

    /**
     * Cập nhật trạng thái làm việc
     */
    async updateEmploymentStatus(
        employeeId: number,
        status: 'active' | 'inactive' | 'terminated' | 'resigned'
    ) {
        // Kiểm tra employee tồn tại
        const existingEmployee = await this.employeeRepository.findById(employeeId);
        if (!existingEmployee) {
            throw new AppError('Employee not found', 404);
        }

        // Validate status
        const validStatuses = ['active', 'inactive', 'terminated', 'resigned'];
        if (!validStatuses.includes(status)) {
            throw new AppError(`Invalid employment status. Must be one of: ${validStatuses.join(', ')}`, 400);
        }

        const employee = await this.employeeRepository.updateEmploymentStatus(employeeId, status);
        
        if (!employee) {
            throw new AppError('Failed to update employment status', 500);
        }

        return employee.toJSON();
    }

    /**
     * Xóa nhân viên (soft delete)
     */
    async deleteEmployee(employeeId: number) {
        const employee = await this.employeeRepository.findById(employeeId);
        if (!employee) {
            throw new AppError('Employee not found', 404);
        }

        const success = await this.employeeRepository.softDelete(employeeId);
        
        if (!success) {
            throw new AppError('Failed to delete employee', 500);
        }

        return { message: 'Employee deleted successfully' };
    }

    /**
     * Lấy nhân viên theo phòng ban
     */
    async getEmployeesByDepartment(
        departmentId: number,
        employmentStatus?: 'active' | 'inactive' | 'terminated' | 'resigned'
    ) {
        const employees = await this.employeeRepository.findByDepartment(departmentId, employmentStatus);
        return employees.map(employee => employee.toJSON());
    }

    /**
     * Lấy thống kê nhân viên theo phòng ban
     */
    async getStatisticsByDepartment() {
        return await this.employeeRepository.getStatisticsByDepartment();
    }

    /**
     * Lấy nhân viên mới nhất
     */
    async getRecentEmployees(limit: number = 5) {
        const employees = await this.employeeRepository.getRecentEmployees(limit);
        return employees.map(employee => employee.toJSON());
    }

    /**
     * Lấy danh sách sinh nhật trong tháng
     */
    async getBirthdaysInMonth(month?: number, year?: number) {
        const now = new Date();
        const targetMonth = month || now.getMonth() + 1;
        const targetYear = year || now.getFullYear();

        if (targetMonth < 1 || targetMonth > 12) {
            throw new AppError('Invalid month. Must be between 1 and 12', 400);
        }

        const employees = await this.employeeRepository.getBirthdaysInMonth(targetMonth, targetYear);
        return employees.map(employee => employee.toJSON());
    }

    /**
     * Lấy danh sách kỷ niệm làm việc sắp tới
     */
    async getUpcomingWorkAnniversaries(month?: number) {
        const now = new Date();
        const targetMonth = month || now.getMonth() + 1;

        if (targetMonth < 1 || targetMonth > 12) {
            throw new AppError('Invalid month. Must be between 1 and 12', 400);
        }

        return await this.employeeRepository.getUpcomingWorkAnniversaries(targetMonth);
    }

    /**
     * Tìm kiếm nhân viên
     */
    async searchEmployees(searchTerm: string, page: number = 1, limit: number = 10) {
        if (!searchTerm || searchTerm.trim().length === 0) {
            throw new AppError('Search term is required', 400);
        }

        const result = await this.employeeRepository.search(searchTerm, page, limit);
        
        return {
            data: result.data.map(employee => employee.toJSON()),
            pagination: result.pagination
        };
    }

    /**
     * Lấy tổng quan nhân viên
     */
    async getOverview() {
        return await this.employeeRepository.getOverview();
    }
}
