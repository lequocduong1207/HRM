import { IUser } from "../models/user.model.js";
import { UserRepository } from "../repositories/user.repository.js";
import { hashPassword } from "../utills/password.js";
import { checkConnection } from "../config/db.js";
import dotenv from "dotenv";
dotenv.config();

async function createAdmin() {
    try {
        // Kiểm tra kết nối database
        await checkConnection();
        
        const userRepository = new UserRepository();
        
        // Kiểm tra xem admin đã tồn tại chưa bằng email
        const existingAdmin = await userRepository.checkEmailExists("admin@hrm.com");
        if (existingAdmin) {
            console.log("Admin account already exists!");
            return;
        }

        // Hash password
        const passwordHash = await hashPassword("12345678");

        // Tạo admin object với đầy đủ properties
        const admin: Partial<IUser> = {
            email: "admin@hrm.com",
            fullName: "System Administrator",
            passwordHash: passwordHash,
            role: 'admin',
            isActive: true,
        };

        // Lưu vào database
        const createdAdmin = await userRepository.createUser(admin);
        console.log("✅ Admin account created successfully!", createdAdmin);
        process.exit(0);
        
    } catch (error) {
        console.error("❌ Error creating admin:", error);
        process.exit(1);
    }
}

// Chạy function
createAdmin();