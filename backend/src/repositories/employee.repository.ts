import { pool } from '../config/db.js';
import { EmployeeSql } from '../models/employee.model.js';
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
 * Interface cho kết quả phân trang
 */
interface PaginatedResult<T> {
    data: T[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

/**
 * Repository xử lý mọi thao tác database cho Employee
 */
export class EmployeeRepository {
    
    /**
     * Tìm tất cả nhân viên với phân trang và filter
     */
    async findAll(options: FindAllOptions = {}): Promise<PaginatedResult<EmployeeEntity>> {
        const {
            searchTerm,
            departmentId,
            employmentStatus,
            page = 1,
            limit = 10
        } = options;
        
        const offset = (page - 1) * limit;
        
        // Lấy dữ liệu
        const result = await pool.request()
            .input('searchTerm', searchTerm || null)
            .input('departmentId', departmentId || null)
            .input('employmentStatus', employmentStatus || null)
            .input('offset', offset)
            .input('limit', limit)
            .query(EmployeeSql.findAll);
        
        // Đếm tổng số bản ghi
        const countResult = await pool.request()
            .input('searchTerm', searchTerm || null)
            .input('departmentId', departmentId || null)
            .input('employmentStatus', employmentStatus || null)
            .query(EmployeeSql.count);
        
        const total = countResult.recordset[0].total;
        const totalPages = Math.ceil(total / limit);
        
        return {
            data: result.recordset.map((row: any) => new EmployeeEntity(row)),
            pagination: {
                page,
                limit,
                total,
                totalPages
            }
        };
    }
    
    /**
     * Tìm nhân viên theo ID
     */
    async findById(employeeId: number): Promise<EmployeeEntity | null> {
        const result = await pool.request()
            .input('employeeId', employeeId)
            .query(EmployeeSql.findById);
        
        if (result.recordset.length === 0) return null;
        
        return new EmployeeEntity(result.recordset[0]);
    }
    
    /**
     * Tìm nhân viên theo email
     */
    async findByEmail(email: string): Promise<EmployeeEntity | null> {
        const result = await pool.request()
            .input('email', email)
            .query(EmployeeSql.findByEmail);
        
        if (result.recordset.length === 0) return null;
        
        return new EmployeeEntity(result.recordset[0]);
    }
    
    /**
     * Kiểm tra email đã tồn tại chưa
     * @param email - Email cần kiểm tra
     * @param excludeEmployeeId - Bỏ qua employee ID này (dùng khi update)
     */
    async checkEmailExists(email: string, excludeEmployeeId?: number): Promise<boolean> {
        const result = await pool.request()
            .input('email', email)
            .input('excludeEmployeeId', excludeEmployeeId || null)
            .query(EmployeeSql.checkEmailExists);
        
        return result.recordset[0].count > 0;
    }
    
    /**
     * Kiểm tra CCCD/CMND đã tồn tại chưa
     */
    async checkNationalIdExists(nationalId: string, excludeEmployeeId?: number): Promise<boolean> {
        const result = await pool.request()
            .input('nationalId', nationalId)
            .input('excludeEmployeeId', excludeEmployeeId || null)
            .query(EmployeeSql.checkNationalIdExists);
        
        return result.recordset[0].count > 0;
    }
    
    /**
     * Tạo nhân viên mới
     */
    async create(data: Partial<EmployeeEntity>): Promise<EmployeeEntity> {
        const result = await pool.request()
            .input('fullName', data.fullName)
            .input('dob', data.dob || null)
            .input('gender', data.gender || null)
            .input('email', data.email || null)
            .input('phone', data.phone || null)
            .input('address', data.address || null)
            .input('nationalId', data.nationalId || null)
            .input('departmentId', data.departmentId || null)
            .input('position', data.position || null)
            .input('hireDate', data.hireDate || null)
            .input('employmentStatus', data.employmentStatus || 'active')
            .query(EmployeeSql.create);
        
        return new EmployeeEntity(result.recordset[0]);
    }
    
    /**
     * Cập nhật thông tin nhân viên
     */
    async update(
        employeeId: number,
        data: Partial<EmployeeEntity>
    ): Promise<EmployeeEntity | null> {
        const result = await pool.request()
            .input('employeeId', employeeId)
            .input('fullName', data.fullName ?? null)
            .input('dob', data.dob ?? null)
            .input('gender', data.gender ?? null)
            .input('email', data.email ?? null)
            .input('phone', data.phone ?? null)
            .input('address', data.address ?? null)
            .input('nationalId', data.nationalId ?? null)
            .input('departmentId', data.departmentId ?? null)  // Cho phép set NULL
            .input('position', data.position ?? null)
            .input('hireDate', data.hireDate ?? null)
            .input('employmentStatus', data.employmentStatus ?? null)
            .query(EmployeeSql.update);
        
        if (result.recordset.length === 0) return null;
        
        return new EmployeeEntity(result.recordset[0]);
    }
    
    /**
     * Cập nhật trạng thái làm việc
     */
    async updateEmploymentStatus(
        employeeId: number,
        status: 'active' | 'inactive' | 'terminated' | 'resigned'
    ): Promise<EmployeeEntity | null> {
        const result = await pool.request()
            .input('employeeId', employeeId)
            .input('employmentStatus', status)
            .query(EmployeeSql.updateEmploymentStatus);
        
        if (result.recordset.length === 0) return null;
        
        return new EmployeeEntity(result.recordset[0]);
    }
    
    /**
     * Xóa mềm nhân viên (soft delete)
     */
    async softDelete(employeeId: number): Promise<boolean> {
        const result = await pool.request()
            .input('employeeId', employeeId)
            .query(EmployeeSql.softDelete);
        
        return result.rowsAffected[0] > 0;
    }
    
    /**
     * Xóa vĩnh viễn nhân viên (hard delete)
     * ⚠️ Nguy hiểm: Xóa toàn bộ dữ liệu liên quan
     */
    async hardDelete(employeeId: number): Promise<boolean> {
        const result = await pool.request()
            .input('employeeId', employeeId)
            .query(EmployeeSql.hardDelete);
        
        return result.rowsAffected[0] > 0;
    }
    
    /**
     * Lấy danh sách nhân viên theo phòng ban
     */
    async findByDepartment(
        departmentId: number,
        employmentStatus?: 'active' | 'inactive' | 'terminated' | 'resigned'
    ): Promise<EmployeeEntity[]> {
        const result = await pool.request()
            .input('departmentId', departmentId)
            .input('employmentStatus', employmentStatus || null)
            .query(EmployeeSql.findByDepartment);
        
        return result.recordset.map((row: any) => new EmployeeEntity(row));
    }
    
    /**
     * Lấy thống kê nhân viên theo phòng ban
     */
    async getStatisticsByDepartment(): Promise<any[]> {
        const result = await pool.request()
            .query(EmployeeSql.getStatisticsByDepartment);
        
        return result.recordset;
    }
    
    /**
     * Lấy nhân viên mới nhất (cho dashboard)
     */
    async getRecentEmployees(limit: number = 5): Promise<EmployeeEntity[]> {
        const result = await pool.request()
            .input('limit', limit)
            .query(EmployeeSql.getRecentEmployees);
        
        return result.recordset.map((row: any) => new EmployeeEntity(row));
    }
    
    /**
     * Lấy danh sách sinh nhật trong tháng
     */
    async getBirthdaysInMonth(month: number, year: number): Promise<EmployeeEntity[]> {
        const result = await pool.request()
            .input('month', month)
            .input('year', year)
            .query(EmployeeSql.getBirthdaysInMonth);
        
        return result.recordset.map((row: any) => new EmployeeEntity(row));
    }
    
    /**
     * Lấy danh sách kỷ niệm làm việc sắp tới
     */
    async getUpcomingWorkAnniversaries(month: number): Promise<any[]> {
        const result = await pool.request()
            .input('month', month)
            .query(EmployeeSql.getUpcomingWorkAnniversaries);
        
        return result.recordset;
    }
    
    /**
     * Tìm kiếm nhân viên nâng cao
     */
    async search(
        searchTerm: string,
        page: number = 1,
        limit: number = 10
    ): Promise<PaginatedResult<EmployeeEntity>> {
        const offset = (page - 1) * limit;
        
        const result = await pool.request()
            .input('searchTerm', searchTerm)
            .input('offset', offset)
            .input('limit', limit)
            .query(EmployeeSql.search);
        
        // Đếm tổng (cần thêm count query riêng cho search)
        const countResult = await pool.request()
            .input('searchTerm', searchTerm || null)
            .input('departmentId', null)
            .input('employmentStatus', null)
            .query(EmployeeSql.count);
        
        const total = countResult.recordset[0].total;
        const totalPages = Math.ceil(total / limit);
        
        return {
            data: result.recordset.map((row: any) => new EmployeeEntity(row)),
            pagination: {
                page,
                limit,
                total,
                totalPages
            }
        };
    }
    
    /**
     * Lấy tổng quan nhân viên (cho dashboard)
     */
    async getOverview(): Promise<any> {
        const result = await pool.request()
            .query(EmployeeSql.getOverview);
        
        return result.recordset[0];
    }
}