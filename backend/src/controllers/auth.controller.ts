import { Request, Response } from 'express';
import { asyncHandler, AppError } from '../middlewares/index.js';
import * as authService from '../services/auth.service.js';

/**
 * @route   POST /api/v1/auth/login
 * @desc    Login user with email
 * @access  Public
 */
export const login = asyncHandler(async (req: Request, res: Response) => {
    /* 
        #swagger.tags = ['Auth']
        #swagger.summary = 'Login user'
        #swagger.description = 'Login with email and password'
        #swagger.parameters['body'] = {
            in: 'body',
            required: true,
            schema: { $ref: '#/definitions/authSwaggerDocs/login/requestBody/content/application~1json/schema' }
        }
    */
    
    const { email, password } = req.body;

    const result = await authService.login(email, password);

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
export const logout = asyncHandler(async (req: Request, res: Response) => {
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
export const getCurrentUser = asyncHandler(async (req: Request, res: Response) => {
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
 * @route   PUT /api/v1/auth/update-profile
 * @desc    Update user profile
 * @access  Private
 */
export const updateProfile = asyncHandler(async (req: Request, res: Response) => {
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
export const changePassword = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const { currentPassword, newPassword } = req.body;

    await authService.changePassword(userId, currentPassword, newPassword);

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
export const forgotPassword = asyncHandler(async (req: Request, res: Response) => {
    const { email } = req.body;

    await authService.forgotPassword(email);

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
export const resetPassword = asyncHandler(async (req: Request, res: Response) => {
    const { token } = req.params;
    const { password } = req.body;

    await authService.resetPassword(token, password);

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
export const refreshToken = asyncHandler(async (req: Request, res: Response) => {
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
export const verifyEmail = asyncHandler(async (req: Request, res: Response) => {
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
export const resendVerification = asyncHandler(async (req: Request, res: Response) => {
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
export const checkEmail = asyncHandler(async (req: Request, res: Response) => {
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
export const checkUsername = asyncHandler(async (req: Request, res: Response) => {
    const { username } = req.body;

    const exists = await authService.checkUsernameExists(username);

    res.status(200).json({
        success: true,
        data: {
            exists
        }
    });
});