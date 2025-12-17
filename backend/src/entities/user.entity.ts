export class UserEntity {
    userId?: number;                   
    username!: string;                  
    email!: string;                     
    passwordHash!: string;              
    role!: 'admin' | 'hr_manager' | 'manager' | 'employee' | string;  
    employeeId?: number | null;         
    isActive!: boolean;                 
    lastLogin?: Date | null;           
    createdAt?: Date;                   
    updatedAt?: Date;                  
    
    constructor(data: Partial<UserEntity>) {
        Object.assign(this, data);
    }

    /**
     * Chuyển đổi sang JSON response (ẩn password)
     */
    toJSON() {
        return {
            userId: this.userId,
            username: this.username,
            email: this.email,
            role: this.role,
            employeeId: this.employeeId,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt
        };
    }
    
    /**
     * Kiểm tra xem user có phải admin không
     */
    isAdmin(): boolean {
        return this.role === 'admin';
    }
    
    /**
     * Kiểm tra xem user có quyền quản lý nhân sự không
     */
    canManageEmployees(): boolean {
        return this.role === 'admin' || this.role === 'hr_manager';
    }
    
    /**
     * Kiểm tra xem user có quyền phê duyệt nghỉ phép không
     */
    canApproveLeave(): boolean {
        return this.role === 'admin' || 
               this.role === 'hr_manager' || 
               this.role === 'manager';
    }
    
    /**
     * Kiểm tra xem user có quyền xem báo cáo lương không
     */
    canViewSalaryReports(): boolean {
        return this.role === 'admin' || this.role === 'hr_manager';
    }
    
    /**
     * Kiểm tra xem user có phải manager không
     */
    isManager(): boolean {
        return this.role === 'manager';
    }
    
    /**
     * Kiểm tra xem user có phải nhân viên thường không
     */
    isEmployee(): boolean {
        return this.role === 'employee';
    }
    
    /**
     * Trả về thông tin user an toàn (không bao gồm password)
     * Dùng khi trả về API response
     */
    toSafeObject(): Omit<UserEntity, 'passwordHash'> {
        const { passwordHash, ...safeData } = this;
        return safeData as Omit<UserEntity, 'passwordHash'>;
    }
    
    /**
     * Cập nhật thời gian đăng nhập
     */
    updateLastLogin(): void {
        this.lastLogin = new Date();
    }
    
    /**
     * Kiểm tra tài khoản có bị khóa không
     */
    isLocked(): boolean {
        return !this.isActive;
    }
}