export class EmployeeEntity {
    employeeId?: string;
    fullName!: string;
    dob?: Date | null;
    gender?: "Male" | "Female" | "Other" | null;
    email?: string | null;
    phone?: string | null;
    address?: string | null;
    nationalId?: string | null;         
    departmentId?: number | null;
    position?: string | null;
    hireDate?: Date | null;
    employmentStatus?: 'active' | 'inactive' | 'terminated' | 'resigned';
    createdAt?: Date;
    updatedAt?: Date;
    
    constructor(data: Partial<EmployeeEntity>) {
        Object.assign(this, data);
    }
    
    /**
     * Kiểm tra nhân viên có đang làm việc không
     */
    isActive(): boolean {
        return this.employmentStatus === 'active';
    }
    
    /**
     * Tính tuổi của nhân viên
     */
    getAge(): number | null {
        if (!this.dob) return null;
        
        const today = new Date();
        const birthDate = new Date(this.dob);
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        
        return age;
    }
    
    /**
     * Tính thâm niên công tác (số năm)
     */
    getYearsOfService(): number | null {
        if (!this.hireDate) return null;
        
        const today = new Date();
        const hireDate = new Date(this.hireDate);
        let years = today.getFullYear() - hireDate.getFullYear();
        const monthDiff = today.getMonth() - hireDate.getMonth();
        
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < hireDate.getDate())) {
            years--;
        }
        
        return years;
    }
    
    /**
     * Lấy tên viết tắt (dùng cho avatar)
     */
    getInitials(): string {
        const names = this.fullName.trim().split(/\s+/);
        if (names.length === 1) return names[0].substring(0, 2).toUpperCase();
        
        return (names[0][0] + names[names.length - 1][0]).toUpperCase();
    }
}