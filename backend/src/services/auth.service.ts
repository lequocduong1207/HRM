import { AppError } from '../middlewares/index.js';
import { AuthRepository } from '../repositories/auth.repository.js';
import {
    hashPassword,
    comparePassword,
    generateToken,
    generateRefreshToken,
    generatePasswordResetToken,
    generateEmailVerificationToken,
    verifyToken,
    verifyRefreshToken
} from '../utills/index.js';

const authRepo = new AuthRepository();

interface RegisterData {
    username: string;
    password: string;
    email: string;
    fullName: string;
}

interface UserData {
    userId: number;
    username: string;
    email: string;
    fullName: string;
    role: string;
}

interface LoginResult {
    user: UserData;
    token: string;
    refreshToken: string;
}

/**
 * Register new user
 */
export const register = async (data: RegisterData): Promise<LoginResult> => {
    // Check if email exists
    const emailExists = await authRepo.emailExists(data.email);
    if (emailExists) {
        throw new AppError('Email already exists', 409);
    }

    // Check if username exists
    const usernameExists = await authRepo.usernameExists(data.username);
    if (usernameExists) {
        throw new AppError('Username already exists', 409);
    }

    // Hash password
    const hashedPassword = await hashPassword(data.password);

    // Create user
    const user = await authRepo.createUser({
        username: data.username,
        password: hashedPassword,
        email: data.email,
        fullName: data.fullName,
        role: 'employee'
    });

    // Generate tokens
    const token = generateToken({
        userId: user.userId,
        username: user.username,
        role: user.role
    });

    const refreshToken = generateRefreshToken({
        userId: user.userId,
        username: user.username,
        role: user.role
    });

    // Generate email verification token
    const verificationToken = generateEmailVerificationToken(user.userId);
    // TODO: Send verification email
    console.log(`Verification token for ${user.email}: ${verificationToken}`);

    return {
        user: {
            userId: user.userId,
            username: user.username,
            email: user.email,
            fullName: user.fullName,
            role: user.role
        },
        token,
        refreshToken
    };
};

/**
 * Login user with email
 */
export const login = async (email: string, password: string): Promise<LoginResult> => {
    // Find user by email
    const user = await authRepo.findByEmail(email);
    if (!user) {
        throw new AppError('Invalid email or password', 401);
    }

    // Check if user is active
    if (!user.isActive) {
        throw new AppError('Account is inactive', 403);
    }

    // Verify password
    const isPasswordValid = await comparePassword(password, user.passwordHash);
    if (!isPasswordValid) {
        throw new AppError('Invalid email or password', 401);
    }

    // Update last login
    await authRepo.updateLastLogin(user.userId);

    // Generate tokens
    const token = generateToken({
        userId: user.userId,
        username: user.username,
        role: user.role
    });

    const refreshToken = generateRefreshToken({
        userId: user.userId,
        username: user.username,
        role: user.role
    });

    return {
        user: {
            userId: user.userId,
            username: user.username,
            email: user.email,
            fullName: user.fullName,
            role: user.role
        },
        token,
        refreshToken
    };
};

/**
 * Login with email OR username (FLEXIBLE)
 */
export const loginFlexible = async (identifier: string, password: string): Promise<LoginResult> => {
    // Find user by email or username
    const user = await authRepo.findByEmailOrUsername(identifier);
    if (!user) {
        throw new AppError('Invalid credentials', 401);
    }

    // Check if user is active
    if (!user.isActive) {
        throw new AppError('Account is inactive', 403);
    }

    // Verify password
    const isPasswordValid = await comparePassword(password, user.passwordHash);
    if (!isPasswordValid) {
        throw new AppError('Invalid credentials', 401);
    }

    // Update last login
    await authRepo.updateLastLogin(user.userId);

    // Generate tokens
    const token = generateToken({
        userId: user.userId,
        username: user.username,
        role: user.role
    });

    const refreshToken = generateRefreshToken({
        userId: user.userId,
        username: user.username,
        role: user.role
    });

    return {
        user: {
            userId: user.userId,
            username: user.username,
            email: user.email,
            fullName: user.fullName,
            role: user.role
        },
        token,
        refreshToken
    };
};

/**
 * Get user by ID
 */
export const getUserById = async (userId: number): Promise<UserData | null> => {
    const user = await authRepo.findById(userId);
    
    if (!user) {
        return null;
    }

    return {
        userId: user.userId,
        username: user.username,
        email: user.email,
        fullName: user.fullName,
        role: user.role
    };
};

/**
 * Change password
 */
export const changePassword = async (
    userId: number,
    currentPassword: string,
    newPassword: string
): Promise<void> => {
    // Get user
    const user = await authRepo.findById(userId);
    if (!user) {
        throw new AppError('User not found', 404);
    }

    // Verify current password
    const isPasswordValid = await comparePassword(currentPassword, user.passwordHash);
    if (!isPasswordValid) {
        throw new AppError('Current password is incorrect', 401);
    }

    // Hash new password
    const hashedPassword = await hashPassword(newPassword);

    // Update password
    await authRepo.updatePassword(userId, hashedPassword);
};

/**
 * Forgot password
 */
export const forgotPassword = async (email: string): Promise<void> => {
    const user = await authRepo.findByEmail(email);
    if (!user) {
        // Don't reveal if email exists
        return;
    }

    // Generate reset token
    const resetToken = generatePasswordResetToken(user.UserId);

    // Save reset token to database
    await authRepo.saveResetToken(user.UserId, resetToken);

    // TODO: Send email with reset link
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
    console.log(`Reset URL for ${email}: ${resetUrl}`);
};

/**
 * Reset password
 */
export const resetPassword = async (token: string, newPassword: string): Promise<void> => {
    // Verify token
    let decoded;
    try {
        decoded = verifyToken(token);
    } catch (error) {
        throw new AppError('Invalid or expired reset token', 400);
    }

    if (!decoded.userId || decoded.type !== 'password_reset') {
        throw new AppError('Invalid token type', 400);
    }

    // Check if token exists in database
    const isValidToken = await authRepo.validateResetToken(decoded.userId, token);
    if (!isValidToken) {
        throw new AppError('Invalid or expired reset token', 400);
    }

    // Hash new password
    const hashedPassword = await hashPassword(newPassword);

    // Update password
    await authRepo.updatePassword(decoded.userId, hashedPassword);

    // Delete reset token
    await authRepo.deleteResetToken(decoded.userId);
};

/**
 * Refresh access token
 */
export const refreshAccessToken = async (refreshToken: string): Promise<{ token: string }> => {
    // Verify refresh token
    let decoded;
    try {
        decoded = verifyRefreshToken(refreshToken);
    } catch (error) {
        throw new AppError('Invalid refresh token', 401);
    }

    // Generate new access token
    const token = generateToken({
        userId: decoded.userId,
        username: decoded.username,
        role: decoded.role
    });

    return { token };
};

/**
 * Verify email
 */
export const verifyEmail = async (token: string): Promise<void> => {
    // Verify token
    let decoded;
    try {
        decoded = verifyToken(token);
    } catch (error) {
        throw new AppError('Invalid verification token', 400);
    }

    if (!decoded.userId || decoded.type !== 'email_verification') {
        throw new AppError('Invalid token type', 400);
    }

    // Update email verified status
    await authRepo.verifyEmail(decoded.userId);
};

/**
 * Resend verification email
 */
export const resendVerificationEmail = async (email: string): Promise<void> => {
    const user = await authRepo.findByEmail(email);
    if (!user) {
        return;
    }

    if (user.EmailVerified) {
        throw new AppError('Email already verified', 400);
    }

    // Generate verification token
    const verificationToken = generateEmailVerificationToken(user.UserId);

    // TODO: Send verification email
    const verifyUrl = `${process.env.FRONTEND_URL}/verify-email/${verificationToken}`;
    console.log(`Verification URL for ${email}: ${verifyUrl}`);
};

/**
 * Update user profile
 */
export const updateProfile = async (
    userId: number,
    data: { fullName?: string; phone?: string }
) => {
    // Implementation
};

/**
 * Check if email exists
 */
export const checkEmailExists = async (email: string): Promise<boolean> => {
    return await authRepo.emailExists(email);
};

/**
 * Check if username exists
 */
export const checkUsernameExists = async (username: string): Promise<boolean> => {
    return await authRepo.usernameExists(username);
};