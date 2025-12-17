export class AttendanceEntity {
    attendanceId?: number;          
    employeeId!: number;            
    date!: Date;                    
    checkIn?: string | null;        
    checkOut?: string | null;      
    totalHours?: number | null;     
    isLate?: boolean;               
    isEarlyLeave?: boolean;         
    note?: string | null;           
    createdAt?: Date;               
    
    constructor(data: Partial<AttendanceEntity>) {
        Object.assign(this, data);
    }
    
    /**
     * Kiểm tra xem bản ghi đã hoàn thành chưa (có cả check-in và check-out)
     */
    isComplete(): boolean {
        return !!(this.checkIn && this.checkOut);
    }
    
    /**
     * Tính tổng giờ làm việc
     */
    calculateTotalHours(): number | null {
        if (!this.checkIn || !this.checkOut) return null;
        
        const checkInTime = new Date(`1970-01-01T${this.checkIn}`);
        const checkOutTime = new Date(`1970-01-01T${this.checkOut}`);
        
        const diff = checkOutTime.getTime() - checkInTime.getTime();
        return diff / (1000 * 60 * 60); // Convert milliseconds to hours
    }
}