import { Types } from 'mongoose';
import { IUser, User } from '../models/user.model';

interface PaginationOptions {
    page?: number;
    limit?: number;
}

export class UserRepository {
    async findById(userId: string): Promise<IUser | null> {
        return User.findById(userId).exec();
    }

    async findAll(options?: PaginationOptions): Promise<{ data: IUser[]; pagination: { page: number; limit: number; total: number } }> {
        const page = options?.page || 1;
        const limit = options?.limit || 10;
        const skip = (page - 1) * limit;

        const [data, total] = await Promise.all([
            User.find().skip(skip).limit(limit).exec(),
            User.countDocuments()
        ]);

        return {
            data,
            pagination: { page, limit, total }
        };
    }

    async findByEmployeeId(employeeId: string | Types.ObjectId): Promise<IUser | null> {
        return User.findOne({ employeeId }).exec();
    }

    async createUser(userData: Partial<IUser>): Promise<IUser> {
        const user = new User(userData);
        return user.save();
    }

    async updateUser(userId: string, updateData: Partial<IUser>): Promise<IUser | null> {
        return User.findByIdAndUpdate(userId, updateData, { new: true }).exec();
    }

    async deleteUser(userId: string): Promise<IUser | null> {
        return User.findByIdAndDelete(userId).exec();
    }

    async checkEmailExists(email: string, excludeUserId?: string): Promise<boolean> {
        const query: any = { email };
        if (excludeUserId) {
            query._id = { $ne: excludeUserId };
        }
        const checkEmail = await User.findOne(query).exec();
        return !!checkEmail;
    }
}