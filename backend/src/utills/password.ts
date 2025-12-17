import bcrypt from 'bcryptjs';
import jwt, { SignOptions } from 'jsonwebtoken';
import crypto from 'crypto';

export interface JwtPayload {
    userId: number;
    username: string;
    role: string;
}

/**
 * Hash password using bcrypt
 * @param password - Plain text password
 * @returns Hashed password
 */
export const hashPassword = async (password: string): Promise<string> => {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
};

/**
 * Compare password with hashed password
 * @param password - Plain text password
 * @param hashedPassword - Hashed password from database
 * @returns True if passwords match
 */
export const comparePassword = async (
    password: string,
    hashedPassword: string
): Promise<boolean> => {
    const isMatch = await bcrypt.compare(password, hashedPassword);
    return isMatch;
};

/**
 * Generate JWT access token
 * @param payload - Token payload (userId, username, role)
 * @returns JWT token
 */
export const generateToken = (payload: JwtPayload): string => {
    const options: SignOptions = {
        expiresIn: 60 * 60 * 24 * 7  
    };

    const token = jwt.sign(
        payload,
        process.env.JWT_SECRET as string,
        options
    );
    return token;
};

/**
 * Generate JWT refresh token
 * @param payload - Token payload (userId, username, role)
 * @returns JWT refresh token
 */
export const generateRefreshToken = (payload: JwtPayload): string => {
    const options: SignOptions = {
        expiresIn: 60 * 60 * 24 * 7
    };

    const refreshToken = jwt.sign(
        payload,
        process.env.JWT_REFRESH_SECRET as string,
        options
    );
    return refreshToken;
};

/**
 * Verify JWT token
 * @param token - JWT token
 * @returns Decoded token payload
 */
export const verifyToken = (token: string): any => {
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
        return decoded;
    } catch (error) {
        throw new Error('Invalid token');
    }
};

/**
 * Verify refresh token
 * @param token - JWT refresh token
 * @returns Decoded token payload
 */
export const verifyRefreshToken = (token: string): any => {
    try {
        const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET as string);
        return decoded;
    } catch (error) {
        throw new Error('Invalid refresh token');
    }
};

/**
 * Generate random token (for email verification, password reset)
 * @param length - Token length (default: 32)
 * @returns Random token string
 */
export const generateRandomToken = (length: number = 32): string => {
    return crypto.randomBytes(length).toString('hex');
};

/**
 * Generate password reset token
 * @param userId - User ID
 * @returns JWT token for password reset
 */
export const generatePasswordResetToken = (userId: number): string => {
    const token = jwt.sign(
        { userId, type: 'password_reset' },
        process.env.JWT_SECRET as string,
        { expiresIn: '1h' }
    );
    return token;
};

/**
 * Generate email verification token
 * @param userId - User ID
 * @returns JWT token for email verification
 */
export const generateEmailVerificationToken = (userId: number): string => {
    const token = jwt.sign(
        { userId, type: 'email_verification' },
        process.env.JWT_SECRET as string,
        { expiresIn: '24h' }
    );
    return token;
};

/**
 * Decode token without verification (use for checking expiration)
 * @param token - JWT token
 * @returns Decoded token payload
 */
export const decodeToken = (token: string): any => {
    return jwt.decode(token);
};

/**
 * Check if token is expired
 * @param token - JWT token
 * @returns True if token is expired
 */
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

/**
 * Generate strong random password
 * @param length - Password length (default: 12)
 * @returns Random password
 */
export const generateRandomPassword = (length: number = 12): string => {
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
    let password = '';
    
    for (let i = 0; i < length; i++) {
        const randomIndex = crypto.randomInt(0, charset.length);
        password += charset[randomIndex];
    }
    
    return password;
};

/**
 * Validate password strength
 * @param password - Password to validate
 * @returns Object with validation result
 */
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