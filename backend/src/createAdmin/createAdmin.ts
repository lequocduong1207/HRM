import { UserRepository } from "../repositories/user.repository.js";
import { UserEntity } from "../entities/user.entity.js";
import { hashPassword } from "../utills/password.js";
import { poolConnect } from "../config/db.js";

async function createAdmin() {
    try {
        // Đợi kết nối database
        await poolConnect;
        console.log("✅ Database connected!");
        
        const userRepository = new UserRepository();
        
        // Kiểm tra xem admin đã tồn tại chưa bằng email
        const existingAdmin = await userRepository.findByEmail("admin@hrm.com");
        if (existingAdmin) {
            console.log("Admin account already exists!");
            return;
        }

        // Hash password
        const passwordHash = await hashPassword("12345678");

        // Tạo admin object với đầy đủ properties
        const admin: Partial<UserEntity> = {
            username: "admin",
            email: "admin@hrm.com",
            passwordHash: passwordHash,
            role: 'admin',
            employeeId: null,
            isActive: true,
            lastLogin: null
        };

        // Lưu vào database
        const createdAdmin = await userRepository.create(admin as {
                username: string;
                email: string;
                passwordHash: string;
                role: string;
                employeeId?: number;
        });
        console.log("✅ Admin account created successfully!", createdAdmin);
        process.exit(0);
        
    } catch (error) {
        console.error("❌ Error creating admin:", error);
        process.exit(1);
    }
}

// Chạy function
createAdmin();