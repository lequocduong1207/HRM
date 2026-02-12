import bcrypt from 'bcryptjs';
import jwt, { SignOptions } from 'jsonwebtoken';
import crypto from 'crypto';

export interface JwtPayload {
    userId: string;  
    email: string;
    role: string;
}

export const hashPassword = async (password: string): Promise<string> => {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
};

export const comparePassword = async (
    password: string,
    hashedPassword: string
): Promise<boolean> => {
    const isMatch = await bcrypt.compare(password, hashedPassword);
    return isMatch;
};

export const generateToken = (payload: JwtPayload): string => {
    if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET is not defined in environment variables');
    }

    const options: SignOptions = {
        expiresIn: (process.env.JWT_EXPIRES_IN || '7d') as any
    };

    const token = jwt.sign(
        payload,
        process.env.JWT_SECRET,
        options
    );
    return token;
};

export const generateRefreshToken = (payload: JwtPayload): string => {
    if (!process.env.JWT_REFRESH_SECRET) {
        throw new Error('JWT_REFRESH_SECRET is not defined in environment variables');
    }

    const options: SignOptions = {
        expiresIn: (process.env.JWT_REFRESH_EXPIRES_IN || '30d') as any
    };

    const refreshToken = jwt.sign(
        payload,
        process.env.JWT_REFRESH_SECRET,
        options
    );
    return refreshToken;
};

export const verifyToken = (token: string): any => {
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
        return decoded;
    } catch (error) {
        throw new Error('Invalid token');
    }
};

export const verifyRefreshToken = (token: string): any => {
    try {
        const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET as string);
        return decoded;
    } catch (error) {
        throw new Error('Invalid refresh token');
    }
};

export const generateRandomToken = (length: number = 32): string => {
    return crypto.randomBytes(length).toString('hex');
};

export const generatePasswordResetToken = (userId: string): string => {
    const token = jwt.sign(
        { userId, type: 'password_reset' },
        process.env.JWT_SECRET as string,
        { expiresIn: '1h' }
    );
    return token;
};

export const generateEmailVerificationToken = (userId: string): string => {
    const token = jwt.sign(
        { userId, type: 'email_verification' },
        process.env.JWT_SECRET as string,
        { expiresIn: '24h' }
    );
    return token;
};

export const decodeToken = (token: string): any => {
    return jwt.decode(token);
};

export const isTokenExpired = (token: string): boolean => {
    try {
        const decoded: any = jwt.decode(token);
        if (!decoded || !decoded.exp) {
            return true;
        }
        const currentTime = Math.floor(Date.now() / 1000);
        return decoded.exp < currentTime;
    } catch (error) {
        return true;
    }
};

export const generateRandomPassword = (length: number = 12): string => {
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
    let password = '';
    
    for (let i = 0; i < length; i++) {
        const randomIndex = crypto.randomInt(0, charset.length);
        password += charset[randomIndex];
    }
    
    return password;
};

export const validatePasswordStrength = (password: string): {
    isValid: boolean;
    errors: string[];
} => {
    const errors: string[] = [];

    if (password.length < 8) {
        errors.push('Password must be at least 8 characters long');
    }

    if (!/[a-z]/.test(password)) {
        errors.push('Password must contain at least one lowercase letter');
    }

    if (!/[A-Z]/.test(password)) {
        errors.push('Password must contain at least one uppercase letter');
    }

    if (!/[0-9]/.test(password)) {
        errors.push('Password must contain at least one number');
    }

    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
        errors.push('Password must contain at least one special character');
    }

    return {
        isValid: errors.length === 0,
        errors
    };
};