import bcrypt from 'bcryptjs';
import { UserRepository } from '../repositories/user.repository.js';
import { EmployeeRepository } from '../repositories/employee.repository.js';
import { AppError } from '../middlewares/error/error-handler.middleware.js';

export class UserService {
    private userRepository: UserRepository;
    private employeeRepository: EmployeeRepository;

    constructor() {
        this.userRepository = new UserRepository();
        this.employeeRepository = new EmployeeRepository();
    }

    /**
     * Tạo user mới (chỉ admin)
     */
    async createUser(data: {
        email: string;
        password: string;
        role: string;
        employeeId?: number;
    }) {
        // Validate
        if (!data.email || !data.password) {
            throw new AppError('Email and password are required', 400);
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) {
            throw new AppError('Invalid email format', 400);
        }

        if (!['admin', 'user'].includes(data.role)) {
            throw new AppError('Invalid role. Must be admin or user', 400);
        }

        // Kiểm tra email đã tồn tại
        const exists = await this.userRepository.checkEmailExists(data.email);
        if (exists) {
            throw new AppError('Email already exists', 400);
        }

        // Nếu có employeeId, kiểm tra employee có tồn tại không và lấy thông tin
        let employee = null;
        if (data.employeeId) {
            employee = await this.employeeRepository.findById(data.employeeId);
            if (!employee) {
                throw new AppError('Employee not found', 404);
            }
            
            // Kiểm tra employee đã có user chưa
            const existingUser = await this.userRepository.findByEmployeeId(data.employeeId);
            if (existingUser) {
                throw new AppError('Employee already has a user account', 400);
            }
        }

        // Hash password
        const passwordHash = await bcrypt.hash(data.password, 10);

        // Tạo username từ email (phần trước @)
        const username = data.email.split('@')[0];

        // Tạo user
        const user = await this.userRepository.create({
            username,
            email: data.email,
            passwordHash,
            role: data.role,
            employeeId: data.employeeId
        });

        return user.toJSON();
    }

    /**
     * Lấy tất cả users
     */
    async getAllUsers() {
        const result = await this.userRepository.findAll();
        
        return {
            data: result.data.map(user => user.toJSON()),
            pagination: result.pagination
        };
    }

    /**
     * Lấy user theo ID
     */
    async getUserById(userId: number) {
        const user = await this.userRepository.findById(userId);
        if (!user) {
            throw new AppError('User not found', 404);
        }
        return user.toJSON();
    }

    /**
     * Cập nhật user
     */
    async updateUser(userId: number, data: {
        email?: string;
        password?: string;
        role?: string;
        employeeId?: number;
    }) {
        // Kiểm tra user tồn tại
        const existingUser = await this.userRepository.findById(userId);
        if (!existingUser) {
            throw new AppError('User not found', 404);
        }

        // Kiểm tra email mới
        if (data.email) {
            // Validate email format
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(data.email)) {
                throw new AppError('Invalid email format', 400);
            }

            const exists = await this.userRepository.checkEmailExists(data.email, userId);
            if (exists) {
                throw new AppError('Email already exists', 400);
            }
        }

        // Validate role
        if (data.role && !['admin', 'user'].includes(data.role)) {
            throw new AppError('Invalid role. Must be admin or user', 400);
        }

        // Kiểm tra employeeId
        if (data.employeeId) {
            const employee = await this.employeeRepository.findById(data.employeeId);
            if (!employee) {
                throw new AppError('Employee not found', 404);
            }

            // Kiểm tra employee đã có user khác chưa
            const existingUserWithEmployee = await this.userRepository.findByEmployeeId(data.employeeId);
            if (existingUserWithEmployee && existingUserWithEmployee.userId !== userId) {
                throw new AppError('Employee already has another user account', 400);
            }
        }

        // Hash password mới nếu có
        let passwordHash;
        if (data.password) {
            passwordHash = await bcrypt.hash(data.password, 10);
        }

        // Nếu có email mới, tạo username mới từ email
        let username;
        if (data.email) {
            username = data.email.split('@')[0];
        }

        const user = await this.userRepository.update(userId, {
            username,
            email: data.email,
            passwordHash,
            role: data.role,
            employeeId: data.employeeId
        });

        return user?.toJSON();
    }

    /**
     * Xóa user
     */
    async deleteUser(userId: number) {
        const user = await this.userRepository.findById(userId);
        if (!user) {
            throw new AppError('User not found', 404);
        }

        // Không cho phép xóa chính mình (optional - tùy logic)
        // if (userId === req.user.userId) {
        //     throw new AppError('Cannot delete your own account', 400);
        // }

        await this.userRepository.delete(userId);
        return { message: 'User deleted successfully' };
    }
}
