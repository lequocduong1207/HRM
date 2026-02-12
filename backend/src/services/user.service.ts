import bcrypt from 'bcryptjs';
import { Types } from 'mongoose';
import { UserRole } from '../models/user.model.js';
import { UserRepository } from '../repositories/user.repository.js';
import { EmployeeRepository } from '../repositories/employee.repository.js';
import { EmployeeModel } from '../models/employee.model.js';
import { Role } from '../models/role.model.js';
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
        fullName: string;
        role: string;
        employeeId?: string;
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

        // Kiểm tra email đã tồn tại
        const exists = await this.userRepository.checkEmailExists(data.email);
        if (exists) {
            throw new AppError('Email already exists', 400);
        }

        // Tìm role theo tên
        const role = await Role.findByName(data.role);
        if (!role) {
            throw new AppError(`Role '${data.role}' not found`, 400);
        }

        // Nếu có employeeId, kiểm tra employee có tồn tại không
        if (data.employeeId) {
            const employee = await this.employeeRepository.findById(data.employeeId);
            if (!employee) {
                throw new AppError('Employee not found', 404);
            }

            // Kiểm tra employee đã có user khác chưa
            const existingUserWithEmployee = await this.userRepository.findByEmployeeId(data.employeeId);
            if (existingUserWithEmployee) {
                throw new AppError('Employee already has a user account', 400);
            }
        }

        // Hash password
        const passwordHash = await bcrypt.hash(data.password, 10);

        // Tạo user
        const user = await this.userRepository.createUser({
            email: data.email,
            passwordHash,
            fullName: data.fullName,
            roleId: role._id,
            employeeId: data.employeeId ? new Types.ObjectId(data.employeeId) : undefined
        });

        // Nếu không có employeeId, tìm employee theo email và link lại
        let employeeToLink = data.employeeId ? await this.employeeRepository.findById(data.employeeId) : null;
        
        if (!employeeToLink) {
            // Tìm employee theo email
            const employees = await EmployeeModel.find({ email: data.email });
            if (employees.length > 0) {
                employeeToLink = employees[0];
            }
        }

        // Cập nhật userId cho employee
        if (employeeToLink) {
            await EmployeeModel.findByIdAndUpdate(
                employeeToLink._id,
                { userId: user._id } as any,
                { new: true }
            );
        }

        return user.toJSON();
    }

    /**
     * Lấy tất cả users
     */
    async getAllUsers(options?: { page?: number; limit?: number }) {
        const result = await this.userRepository.findAll(options);
        
        return result;
    }

    /**
     * Lấy user theo ID
     */
    async getUserById(userId: string) {
        const user = await this.userRepository.findById(userId);
        if (!user) {
            throw new AppError('User not found', 404);
        }
        return user.toJSON();
    }

    /**
     * Cập nhật user
     */
    async updateUser(userId: string, data: {
        email?: string;
        password?: string;
        fullName?: string;
        role?: string;
        employeeId?: string;
    }) {
        // Kiểm tra user tồn tại
        const existingUser = await this.userRepository.findById(userId);
        if (!existingUser) {
            throw new AppError('User not found', 404);
        }

        // Kiểm tra email mới
        if (data.email && data.email !== existingUser.email) {
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

        // Kiểm tra employeeId
        if (data.employeeId) {
            const employee = await this.employeeRepository.findById(data.employeeId);
            if (!employee) {
                throw new AppError('Employee not found', 404);
            }

            // Kiểm tra employee đã có user khác chưa
            const existingUserWithEmployee = await this.userRepository.findByEmployeeId(data.employeeId);
            if (existingUserWithEmployee && existingUserWithEmployee._id.toString() !== userId.toString()) {
                throw new AppError('Employee already has another user account', 400);
            }
        }

        // Hash password mới nếu có
        let passwordHash;
        if (data.password) {
            passwordHash = await bcrypt.hash(data.password, 10);
        }

        // Tìm roleId nếu có role
        let roleId;
        if (data.role) {
            const role = await Role.findByName(data.role);
            if (!role) {
                throw new AppError(`Role '${data.role}' not found`, 400);
            }
            roleId = role._id;
        }

        const updateData: Partial<typeof existingUser> = {};
        if (data.email) updateData.email = data.email;
        if (passwordHash) updateData.passwordHash = passwordHash;
        if (data.fullName) updateData.fullName = data.fullName;
        if (roleId) updateData.roleId = roleId;
        if (data.employeeId !== undefined) {
            updateData.employeeId = data.employeeId ? new Types.ObjectId(data.employeeId) : undefined;
        }

        const user = await this.userRepository.updateUser(userId, updateData);

        return user?.toJSON();
    }

    /**
     * Xóa user
     */
    async deleteUser(userId: string) {
        const user = await this.userRepository.findById(userId);
        if (!user) {
            throw new AppError('User not found', 404);
        }

        await this.userRepository.deleteUser(userId);
        return { message: 'User deleted successfully' };
    }
}
