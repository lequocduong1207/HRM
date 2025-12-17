import { pool } from '../config/db.js';
import { UserSql } from '../models/user.model.js';
import { UserEntity } from '../entities/user.entity.js';

/**
 * Interface cho query options
 */
interface FindAllOptions {
    role?: 'admin' | 'hr_manager' | 'manager' | 'employee';
    isActive?: boolean;
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
 * Repository xử lý mọi thao tác database cho User
 */
export class UserRepository {
    
    /**
     * Tìm tất cả users với phân trang và filter
     */
    async findAll(options: FindAllOptions = {}): Promise<PaginatedResult<UserEntity>> {
        const {
            role,
            isActive,
            searchTerm,
            page = 1,
            limit = 10
        } = options;
        
        const offset = (page - 1) * limit;
        
        // Lấy dữ liệu
        const result = await pool.request()
            .input('role', role || null)
            .input('isActive', isActive ?? null)
            .input('searchTerm', searchTerm || null)
            .input('offset', offset)
            .input('limit', limit)
            .query(UserSql.findAll);
        
        // Đếm tổng số bản ghi
        const countResult = await pool.request()
            .input('role', role || null)
            .input('isActive', isActive ?? null)
            .input('searchTerm', searchTerm || null)
            .query(UserSql.count);
        
        const total = countResult.recordset[0].total;
        const totalPages = Math.ceil(total / limit);
        
        return {
            data: result.recordset.map((row: any) => new UserEntity(row)),
            pagination: {
                page,
                limit,
                total,
                totalPages
            }
        };
    }
    
    /**
     * Tìm user theo ID
     */
    async findById(userId: number): Promise<UserEntity | null> {
        const result = await pool.request()
            .input('userId', userId)
            .query(UserSql.findById);
        
        if (result.recordset.length === 0) return null;
        
        return new UserEntity(result.recordset[0]);
    }
    
    /**
     * Tìm user theo username (dùng cho đăng nhập)
     */
    async findByUsername(username: string): Promise<UserEntity | null> {
        const result = await pool.request()
            .input('username', username)
            .query(UserSql.findByUsername);
        
        if (result.recordset.length === 0) return null;
        
        return new UserEntity(result.recordset[0]);
    }
    
    /**
     * Tìm user theo email (dùng cho đăng nhập)
     */
    async findByEmail(email: string): Promise<UserEntity | null> {
        const result = await pool.request()
            .input('email', email)
            .query(UserSql.findByEmail);
        
        if (result.recordset.length === 0) return null;
        
        return new UserEntity(result.recordset[0]);
    }
    
    /**
     * Tìm user theo employeeId
     */
    async findByEmployeeId(employeeId: number): Promise<UserEntity | null> {
        const result = await pool.request()
            .input('employeeId', employeeId)
            .query(UserSql.findByEmployeeId);
        
        if (result.recordset.length === 0) return null;
        
        return new UserEntity(result.recordset[0]);
    }
    
    /**
     * Kiểm tra username đã tồn tại chưa
     * @param username - Username cần kiểm tra
     * @param excludeUserId - Bỏ qua user ID này (dùng khi update)
     */
    async checkUsernameExists(username: string, excludeUserId?: number): Promise<boolean> {
        const result = await pool.request()
            .input('username', username)
            .input('excludeUserId', excludeUserId || null)
            .query(UserSql.checkUsernameExists);
        
        return result.recordset[0].count > 0;
    }

    /**
     * Kiểm tra email đã tồn tại chưa
     * @param email - Email cần kiểm tra
     * @param excludeUserId - Bỏ qua user ID này (dùng khi update)
     */
    async checkEmailExists(email: string, excludeUserId?: number): Promise<boolean> {
        const result = await pool.request()
            .input('email', email)
            .input('excludeUserId', excludeUserId || null)
            .query(UserSql.checkEmailExists);
        
        return result.recordset[0].count > 0;
    }
    
    /**
     * Tạo user mới
     */
    async create(data: {
        username: string;
        email: string;
        passwordHash: string;
        role: string;
        employeeId?: number;
    }): Promise<UserEntity> {
        const result = await pool.request()
            .input('username', data.username)
            .input('email', data.email)
            .input('passwordHash', data.passwordHash)
            .input('role', data.role)
            .input('employeeId', data.employeeId || null)
            .input('isActive', true)
            .query(UserSql.create);
        
        return new UserEntity(result.recordset[0]);
    }
    
    /**
     * Cập nhật thông tin user
     */
    async update(
        userId: number,
        data: Partial<UserEntity>
    ): Promise<UserEntity | null> {
        const result = await pool.request()
            .input('userId', userId)
            .input('username', data.username ?? null)
            .input('role', data.role ?? null)
            .input('employeeId', data.employeeId ?? null)  // Cho phép set NULL
            .input('isActive', data.isActive ?? null)
            .query(UserSql.update);
        
        if (result.recordset.length === 0) return null;
        
        return new UserEntity(result.recordset[0]);
    }
    
    /**
     * Cập nhật mật khẩu
     */
    async updatePassword(userId: number, passwordHash: string): Promise<UserEntity | null> {
        const result = await pool.request()
            .input('userId', userId)
            .input('passwordHash', passwordHash)
            .query(UserSql.updatePassword);
        
        if (result.recordset.length === 0) return null;
        
        return new UserEntity(result.recordset[0]);
    }
    
    /**
     * Cập nhật thời gian đăng nhập cuối
     */
    async updateLastLogin(userId: number): Promise<void> {
        await pool.request()
            .input('userId', userId)
            .query(UserSql.updateLastLogin);
    }
    
    /**
     * Kích hoạt/vô hiệu hóa tài khoản
     */
    async updateActiveStatus(userId: number, isActive: boolean): Promise<UserEntity | null> {
        const result = await pool.request()
            .input('userId', userId)
            .input('isActive', isActive)
            .query(UserSql.updateActiveStatus);
        
        if (result.recordset.length === 0) return null;
        
        return new UserEntity(result.recordset[0]);
    }
    
    /**
     * Xóa user
     */
    async delete(userId: number): Promise<boolean> {
        const result = await pool.request()
            .input('userId', userId)
            .query(UserSql.delete);
        
        return result.rowsAffected[0] > 0;
    }
    
    /**
     * Lấy thống kê users theo role
     */
    async getStatisticsByRole(): Promise<any[]> {
        const result = await pool.request()
            .query(UserSql.getStatisticsByRole);
        
        return result.recordset;
    }
    
    /**
     * Lấy users không có employeeId (chưa liên kết)
     */
    async findUnlinkedAccounts(): Promise<UserEntity[]> {
        const result = await pool.request()
            .query(UserSql.findUnlinkedAccounts);
        
        return result.recordset.map((row: any) => new UserEntity(row));
    }
    
    /**
     * Lấy users đăng nhập gần đây
     */
    async getRecentLogins(limit: number = 10): Promise<any[]> {
        const result = await pool.request()
            .input('limit', limit)
            .query(UserSql.getRecentLogins);
        
        return result.recordset;
    }
    
    /**
     * Lấy tổng quan users (cho dashboard)
     */
    async getOverview(): Promise<any> {
        const result = await pool.request()
            .query(UserSql.getOverview);
        
        return result.recordset[0];
    }
}