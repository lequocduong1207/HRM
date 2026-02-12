import { Request, Response } from 'express';
import { asyncHandler, AppError } from '../middlewares/index.js';
import * as authService from '../services/auth.service.js';
import { AuditService } from '../services/audit.service.js';

export class AuthController {
    /**
     * @route   POST /api/v1/auth/login
     * @desc    Login user with email
     * @access  Public
     */
    login = asyncHandler(async (req: Request, res: Response) => {
        const { email, password } = req.body;
        
        // Get IP address and user agent for audit logging
        const ipAddress = (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() || req.ip || 'unknown';
        const userAgent = req.headers['user-agent'];

        const result = await authService.login(email, password, ipAddress, userAgent);

        // Set HTTP-only cookie
        res.cookie('token', result.token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        res.status(200).json({
            success: true,
            message: 'Login successful',
            data: {
                user: result.user,
                token: result.token,
                refreshToken: result.refreshToken
            }
        });
    });

    /**
     * @route   POST /api/v1/auth/logout
     * @desc    Logout user
     * @access  Private
     */
    logout = asyncHandler(async (req: Request, res: Response) => {
        const user = req.user!;
        const ipAddress = (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() || req.ip || 'unknown';
        const userAgent = req.headers['user-agent'];
        
        // Clear refresh token from database
        await authService.logout(user.userId);
        
        // 📝 Audit log - Logout
        await AuditService.log({
            action: 'LOGOUT',
            userId: user.userId,
            userEmail: user.email,
            userRole: user.role,
            ipAddress,
            userAgent,
            description: `User logged out`,
            success: true
        });
        
        // Clear cookie
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict'
        });

        res.status(200).json({
            success: true,
            message: 'Logout successful'
        });
    });

    /**
     * @route   GET /api/v1/auth/me
     * @desc    Get current logged in user
     * @access  Private
     */
    getCurrentUser = asyncHandler(async (req: Request, res: Response) => {
        const userId = req.user!.userId;

        const user = await authService.getUserById(userId);

        if (!user) {
            throw new AppError('User not found', 404);
        }

        res.status(200).json({
            success: true,
            data: user
        });
    });

    /**
     * @route   GET /api/v1/auth/profile
     * @desc    Get current user profile with employee info
     * @access  Private
     */
    getProfile = asyncHandler(async (req: Request, res: Response) => {
        const userId = req.user!.userId;

        const profile = await authService.getUserProfile(userId);

        if (!profile) {
            throw new AppError('Profile not found', 404);
        }

        res.status(200).json({
            success: true,
            data: profile
        });
    });

    /**
     * @route   PUT /api/v1/auth/update-profile
     * @desc    Update user profile
     * @access  Private
     */
    updateProfile = asyncHandler(async (req: Request, res: Response) => {
        const userId = req.user!.userId;
        const { fullName, phone } = req.body;

        const updatedUser = await authService.updateProfile(userId, {
            fullName,
            phone
        });

        res.status(200).json({
            success: true,
            message: 'Profile updated successfully',
            data: updatedUser
        });
    });

    /**
     * @route   POST /api/v1/auth/change-password
     * @desc    Change user password
     * @access  Private
     */
    changePassword = asyncHandler(async (req: Request, res: Response) => {
        const userId = req.user!.userId;
        const user = req.user!;
        const { currentPassword, newPassword } = req.body;
        const ipAddress = (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() || req.ip || 'unknown';
        const userAgent = req.headers['user-agent'];

        await authService.changePassword(userId, currentPassword, newPassword);
        
        // 📝 Audit log - Password changed
        await AuditService.log({
            action: 'PASSWORD_CHANGED',
            userId: user.userId,
            userEmail: user.email,
            userRole: user.role,
            ipAddress,
            userAgent,
            description: `Password changed successfully`,
            success: true
        });

        res.status(200).json({
            success: true,
            message: 'Password changed successfully'
        });
    });

    /**
     * @route   POST /api/v1/auth/forgot-password
     * @desc    Send password reset email
     * @access  Public
     */
    forgotPassword = asyncHandler(async (req: Request, res: Response) => {
        const { email } = req.body;
        const ipAddress = (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() || req.ip || 'unknown';
        const userAgent = req.headers['user-agent'];

        await authService.forgotPassword(email);
        
        // 📝 Audit log - Password reset requested
        await AuditService.log({
            action: 'PASSWORD_RESET_REQUESTED',
            userEmail: email,
            ipAddress,
            userAgent,
            description: `Password reset requested for ${email}`,
            success: true
        });

        res.status(200).json({
            success: true,
            message: 'Password reset email sent. Please check your inbox.'
        });
    });

    /**
     * @route   POST /api/v1/auth/reset-password/:token
     * @desc    Reset password using token
     * @access  Public
     */
    resetPassword = asyncHandler(async (req: Request, res: Response) => {
        const { token } = req.params;
        const { password } = req.body;
        const ipAddress = (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() || req.ip || 'unknown';
        const userAgent = req.headers['user-agent'];

        await authService.resetPassword(token, password);
        
        // 📝 Audit log - Password reset completed
        await AuditService.log({
            action: 'PASSWORD_RESET_COMPLETED',
            ipAddress,
            userAgent,
            description: `Password reset completed using token`,
            success: true
        });

        res.status(200).json({
            success: true,
            message: 'Password reset successfully. You can now login with your new password.'
        });
    });

    /**
     * @route   POST /api/v1/auth/refresh-token
     * @desc    Get new access token using refresh token
     * @access  Public
     */
    refreshToken = asyncHandler(async (req: Request, res: Response) => {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            throw new AppError('Refresh token is required', 400);
        }

        const result = await authService.refreshAccessToken(refreshToken);

        // Update cookie with new token
        res.cookie('token', result.token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        res.status(200).json({
            success: true,
            message: 'Token refreshed successfully',
            data: {
                token: result.token
            }
        });
    });

    /**
     * @route   GET /api/v1/auth/verify-email/:token
     * @desc    Verify user email
     * @access  Public
     */
    verifyEmail = asyncHandler(async (req: Request, res: Response) => {
        const { token } = req.params;

        await authService.verifyEmail(token);

        res.status(200).json({
            success: true,
            message: 'Email verified successfully. You can now login.'
        });
    });

    /**
     * @route   POST /api/v1/auth/resend-verification
     * @desc    Resend email verification
     * @access  Public
     */
    resendVerification = asyncHandler(async (req: Request, res: Response) => {
        const { email } = req.body;

        await authService.resendVerificationEmail(email);

        res.status(200).json({
            success: true,
            message: 'Verification email sent. Please check your inbox.'
        });
    });

    /**
     * @route   POST /api/v1/auth/check-email
     * @desc    Check if email exists
     * @access  Public
     */
    checkEmail = asyncHandler(async (req: Request, res: Response) => {
        const { email } = req.body;

        const exists = await authService.checkEmailExists(email);

        res.status(200).json({
            success: true,
            data: {
                exists
            }
        });
    });

    /**
     * @route   POST /api/v1/auth/check-username
     * @desc    Check if username exists
     * @access  Public
     */
    checkUsername = asyncHandler(async (req: Request, res: Response) => {
        const { username } = req.body;

        const exists = await authService.checkUsernameExists(username);

        res.status(200).json({
            success: true,
            data: {
                exists
            }
        });
    });
}