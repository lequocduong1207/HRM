import { DepartmentRepository } from '../repositories/department.repository.js';
import { AppError } from '../middlewares/error/error-handler.middleware.js';
import { DepartmentEntity } from '../entities/department.entity.js';

/**
 * Interface cho query options
 */
interface FindAllOptions {
    searchTerm?: string;
    page?: number;
    limit?: number;
}

/**
 * Service xử lý business logic cho Department
 */
export class DepartmentService {
    private departmentRepository: DepartmentRepository;

    constructor() {
        this.departmentRepository = new DepartmentRepository();
    }

    /**
     * Lấy tất cả phòng ban với phân trang
     */
    async getAllDepartments(options: FindAllOptions = {}) {
        const result = await this.departmentRepository.findAll(options);
        
        return {
            data: result.data.map(department => department.toJSON()),
            pagination: result.pagination
        };
    }

    /**
     * Lấy phòng ban theo ID
     */
    async getDepartmentById(departmentId: number) {
        const department = await this.departmentRepository.findById(departmentId);
        if (!department) {
            throw new AppError('Department not found', 404);
        }
        return department.toJSON();
    }

    /**
     * Tạo phòng ban mới
     */
    async createDepartment(data: {
        name: string;
        description?: string;
        managerId?: number;
    }) {
        // Validate
        if (!data.name || data.name.trim().length === 0) {
            throw new AppError('Department name is required', 400);
        }

        // Kiểm tra tên phòng ban đã tồn tại
        const nameExists = await this.departmentRepository.checkNameExists(data.name);
        if (nameExists) {
            throw new AppError('Department name already exists', 400);
        }

        // Nếu có managerId, kiểm tra employee có tồn tại không
        // (Sẽ cần import EmployeeRepository nếu muốn validate)
        
        // Tạo department
        const department = await this.departmentRepository.create({
            name: data.name,
            description: data.description,
            managerId: data.managerId
        });

        return department.toJSON();
    }

    /**
     * Cập nhật thông tin phòng ban
     */
    async updateDepartment(departmentId: number, data: Partial<{
        name: string;
        description: string;
        managerId: number;
    }>) {
        // Kiểm tra department tồn tại
        const existingDepartment = await this.departmentRepository.findById(departmentId);
        if (!existingDepartment) {
            throw new AppError('Department not found', 404);
        }

        // Validate name nếu có
        if (data.name !== undefined && (!data.name || data.name.trim().length === 0)) {
            throw new AppError('Department name cannot be empty', 400);
        }

        // Kiểm tra tên mới nếu có
        if (data.name) {
            const nameExists = await this.departmentRepository.checkNameExists(data.name, departmentId);
            if (nameExists) {
                throw new AppError('Department name already exists', 400);
            }
        }

        // Cập nhật department
        const department = await this.departmentRepository.update(departmentId, data);
        
        if (!department) {
            throw new AppError('Failed to update department', 500);
        }

        return department.toJSON();
    }

    /**
     * Xóa phòng ban
     */
    async deleteDepartment(departmentId: number) {
        const department = await this.departmentRepository.findById(departmentId);
        if (!department) {
            throw new AppError('Department not found', 404);
        }

        // Kiểm tra có nhân viên trong phòng ban không
        if (department.hasEmployees()) {
            throw new AppError('Cannot delete department with employees. Please reassign employees first.', 400);
        }

        const success = await this.departmentRepository.delete(departmentId);
        
        if (!success) {
            throw new AppError('Failed to delete department', 500);
        }

        return { message: 'Department deleted successfully' };
    }

    /**
     * Lấy tất cả phòng ban (không phân trang) - dùng cho dropdown
     */
    async getAllSimple() {
        const departments = await this.departmentRepository.getAllSimple();
        return departments.map(department => department.toJSON());
    }

    /**
     * Lấy thống kê nhân viên theo phòng ban
     */
    async getStatistics() {
        return await this.departmentRepository.getStatistics();
    }

    /**
     * Kiểm tra employee có phải là manager của department không
     */
    async isManager(departmentId: number, employeeId: number) {
        return await this.departmentRepository.isManager(departmentId, employeeId);
    }
}
