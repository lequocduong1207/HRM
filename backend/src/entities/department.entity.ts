export class DepartmentEntity {
    departmentId?: number;
    name!: string;
    description?: string | null;
    managerId?: number | null;
    managerName?: string | null;  // Joined from employee table
    employeeCount?: number;        // Count of employees in department
    createdAt?: Date;
    updatedAt?: Date;
    
    constructor(data: Partial<DepartmentEntity>) {
        Object.assign(this, data);
    }

    toJSON() {
        return {
            departmentId: this.departmentId,
            name: this.name,
            description: this.description,
            managerId: this.managerId,
            managerName: this.managerName,
            employeeCount: this.employeeCount,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt
        };
    }
    
    /**
     * Kiểm tra phòng ban có trưởng phòng chưa
     */
    hasManager(): boolean {
        return this.managerId !== null && this.managerId !== undefined;
    }
    
    /**
     * Kiểm tra phòng ban có nhân viên không
     */
    hasEmployees(): boolean {
        return (this.employeeCount ?? 0) > 0;
    }
}
