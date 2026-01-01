import { Types } from 'mongoose';
import { IUser, User } from '../models/user.model';

export class AuthRepository {
    async emailExists(email: string): Promise<boolean> {
        const count = await User.countDocuments({ email });
        return count > 0;
    }

    async createUser(data: {
        email: string;
        password: string;   
        fullName: string;
        role: string;
    }): Promise<IUser> {
        const user = new User({
            email: data.email,
            passwordHash: data.password,
            fullName: data.fullName,
            role: data.role
        });
        return await user.save();
    }

    async findByEmail(email: string): Promise<IUser | null> {
        return await User.findOne({ email });
    }

    async findById(userId: string): Promise<IUser | null> {
        return await User.findById(userId);
    }

    async updateLastLogin(userId: string): Promise<void> {
        await User.findByIdAndUpdate(userId, { lastLogin: new Date() });
    }   

    async updateProfile(
        userId: string,
        data: { fullName?: string; phone?: string }
    ): Promise<IUser | null> {
        return await User.findByIdAndUpdate(
            userId,
            { $set: data },
            { new: true }
        );
    }

    async updatePassword(
        userId: string,
        hashedPassword: string
    ): Promise<void> {
        await User.findByIdAndUpdate(userId, { passwordHash: hashedPassword });
    }

    async findByResetToken(token: string): Promise<IUser | null> {
        return await User.findOne({ 
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: new Date() }
        });
    }

    async deleteResetToken(userId: string): Promise<void> {
        await User.findByIdAndUpdate(
            userId,
            { resetPasswordToken: null, resetPasswordExpires: null }
        );
    }

    async validateResetToken(
        userId: string,
        token: string
    ): Promise<boolean> {
        const user = await User.findOne({
            _id: userId,
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: new Date() }
        });
        return !!user;
    }

    async updateResetToken(
        userId: string,
        token: string,
        expires: Date
    ): Promise<void> {
        await User.findByIdAndUpdate(
            userId,
            {
                resetPasswordToken: token,
                resetPasswordExpires: expires
            }
        );
    }

    async saveResetToken(userId: string, token: string): Promise<void> {
        const expires = new Date(Date.now() + 3600000); // 1 hour from now
        await User.findByIdAndUpdate(
            userId,
            {
                resetPasswordToken: token,
                resetPasswordExpires: expires
            }
        );
    }
}