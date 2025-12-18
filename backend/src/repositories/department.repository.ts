import { pool } from '../config/db.js';
import { DepartmentSql } from '../models/department.model.js';
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
 * Repository xử lý mọi thao tác database cho Department
 */
export class DepartmentRepository {
    
    /**
     * Tìm tất cả phòng ban với phân trang
     */
    async findAll(options: FindAllOptions = {}): Promise<PaginatedResult<DepartmentEntity>> {
        const {
            searchTerm,
            page = 1,
            limit = 10
        } = options;
        
        const offset = (page - 1) * limit;
        
        // Lấy dữ liệu
        const result = await pool.request()
            .input('searchTerm', searchTerm || null)
            .input('offset', offset)
            .input('limit', limit)
            .query(DepartmentSql.findAll);
        
        // Đếm tổng số bản ghi
        const countResult = await pool.request()
            .input('searchTerm', searchTerm || null)
            .query(DepartmentSql.count);
        
        const total = countResult.recordset[0].total;
        const totalPages = Math.ceil(total / limit);
        
        return {
            data: result.recordset.map((row: any) => new DepartmentEntity(row)),
            pagination: {
                page,
                limit,
                total,
                totalPages
            }
        };
    }
    
    /**
     * Tìm phòng ban theo ID
     */
    async findById(departmentId: number): Promise<DepartmentEntity | null> {
        const result = await pool.request()
            .input('departmentId', departmentId)
            .query(DepartmentSql.findById);
        
        if (result.recordset.length === 0) return null;
        
        return new DepartmentEntity(result.recordset[0]);
    }
    
    /**
     * Tìm phòng ban theo tên
     */
    async findByName(name: string): Promise<DepartmentEntity | null> {
        const result = await pool.request()
            .input('name', name)
            .query(DepartmentSql.findByName);
        
        if (result.recordset.length === 0) return null;
        
        return new DepartmentEntity(result.recordset[0]);
    }
    
    /**
     * Kiểm tra tên phòng ban đã tồn tại chưa
     */
    async checkNameExists(name: string, excludeDepartmentId?: number): Promise<boolean> {
        const result = await pool.request()
            .input('name', name)
            .input('excludeDepartmentId', excludeDepartmentId || null)
            .query(DepartmentSql.checkNameExists);
        
        return result.recordset[0].count > 0;
    }
    
    /**
     * Tạo phòng ban mới
     */
    async create(data: Partial<DepartmentEntity>): Promise<DepartmentEntity> {
        const result = await pool.request()
            .input('name', data.name)
            .input('description', data.description || null)
            .input('managerId', data.managerId || null)
            .query(DepartmentSql.create);
        
        return new DepartmentEntity(result.recordset[0]);
    }
    
    /**
     * Cập nhật thông tin phòng ban
     */
    async update(
        departmentId: number,
        data: Partial<DepartmentEntity>
    ): Promise<DepartmentEntity | null> {
        const result = await pool.request()
            .input('departmentId', departmentId)
            .input('name', data.name ?? null)
            .input('description', data.description ?? null)
            .input('managerId', data.managerId ?? null)
            .query(DepartmentSql.update);
        
        if (result.recordset.length === 0) return null;
        
        return new DepartmentEntity(result.recordset[0]);
    }
    
    /**
     * Xóa phòng ban
     */
    async delete(departmentId: number): Promise<boolean> {
        const result = await pool.request()
            .input('departmentId', departmentId)
            .query(DepartmentSql.delete);
        
        return result.rowsAffected[0] > 0;
    }
    
    /**
     * Lấy tất cả phòng ban (không phân trang)
     */
    async getAllSimple(): Promise<DepartmentEntity[]> {
        const result = await pool.request()
            .query(DepartmentSql.getAllSimple);
        
        return result.recordset.map((row: any) => new DepartmentEntity(row));
    }
    
    /**
     * Lấy thống kê nhân viên theo phòng ban
     */
    async getStatistics(): Promise<any[]> {
        const result = await pool.request()
            .query(DepartmentSql.getStatistics);
        
        return result.recordset;
    }
    
    /**
     * Kiểm tra employee có phải là manager của department không
     */
    async isManager(departmentId: number, employeeId: number): Promise<boolean> {
        const result = await pool.request()
            .input('departmentId', departmentId)
            .input('employeeId', employeeId)
            .query(DepartmentSql.isManager);
        
        return result.recordset[0].count > 0;
    }
}
