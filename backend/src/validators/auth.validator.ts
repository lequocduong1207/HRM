import Joi from 'joi';

/**
 * 🔐 STRONG PASSWORD POLICY
 * 
 * Password requirements:
 * - Minimum 8 characters (khuyến nghị 12+)
 * - At least 1 uppercase letter (A-Z)
 * - At least 1 lowercase letter (a-z)
 * - At least 1 digit (0-9)
 * - At least 1 special character (@$!%*?&)
 * - No spaces allowed
 * 
 * Why? Makes password ~6 million times harder to crack!
 */
const strongPassword = Joi.string()
    .min(8)
    .max(128)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/)
    .required()
    .messages({
        'string.min': 'Password must be at least 8 characters long',
        'string.max': 'Password must not exceed 128 characters',
        'string.pattern.base': 
            'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&)',
        'any.required': 'Password is required'
    });

/**
 * Login validation schema
 * Note: Login uses relaxed password validation (backward compatible)
 */
export const loginSchema = {
    body: Joi.object({
        email: Joi.string()
            .required()
            .email()
            .trim()
            .lowercase()
            .messages({
                'any.required': 'Email is required',
                'string.email': 'Invalid email format'
            }),
        password: Joi.string()
            .required()
            .min(6)
            .messages({
                'any.required': 'Password is required',
                'string.min': 'Password must be at least 6 characters'
            })
    })
};

/**
 * Register validation schema
 * ✅ Applies STRONG PASSWORD policy for new users
 */
export const registerSchema = {
    body: Joi.object({
        email: Joi.string()
            .required()
            .email()
            .trim()
            .lowercase()
            .max(150)
            .messages({
                'any.required': 'Email is required',
                'string.email': 'Invalid email format',
                'string.max': 'Email must not exceed 150 characters'
            }),
        
        password: strongPassword,
        
        confirmPassword: Joi.string()
            .required()
            .valid(Joi.ref('password'))
            .messages({
                'any.required': 'Confirm password is required',
                'any.only': 'Passwords do not match'
            }),
        
        fullName: Joi.string()
            .required()
            .trim()
            .min(2)
            .max(150)
            .pattern(/^[a-zA-ZÀ-ỹ\s]+$/)
            .messages({
                'any.required': 'Full name is required',
                'string.min': 'Full name must be at least 2 characters',
                'string.max': 'Full name must not exceed 150 characters',
                'string.pattern.base': 'Full name can only contain letters and spaces'
            })
    })
};

/**
 * Change password validation schema
 */
export const changePasswordSchema = {
    body: Joi.object({
        currentPassword: Joi.string()
            .required()
            .messages({
                'any.required': 'Current password is required'
            }),
        
        newPassword: strongPassword,
        
        confirmNewPassword: Joi.string()
            .required()
            .valid(Joi.ref('newPassword'))
            .messages({
                'any.required': 'Confirm new password is required',
                'any.only': 'New passwords do not match'
            })
    })
};

/**
 * Reset password validation schema
 */
export const resetPasswordSchema = {
    body: Joi.object({
        token: Joi.string()
            .required()
            .messages({
                'any.required': 'Reset token is required'
            }),
        
        password: strongPassword,
        
        confirmPassword: Joi.string()
            .required()
            .valid(Joi.ref('password'))
            .messages({
                'any.required': 'Confirm password is required',
                'any.only': 'Passwords do not match'
            })
    })
};

/**
 * 🚨 Common Password Checker
 * Prevents use of commonly breached passwords
 */
export const isCommonPassword = (password: string): boolean => {
    const commonPasswords = [
        '123456', 'password', '12345678', 'qwerty', '123456789',
        '12345', '1234', '111111', '1234567', 'dragon',
        '123123', 'baseball', 'iloveyou', 'trustno1', '1234567890',
        'sunshine', 'master', 'welcome', 'shadow', 'ashley',
        'football', 'jesus', 'michael', 'ninja', 'mustang',
        'password123', 'admin123', 'letmein', 'monkey', 'abc123'
    ];
    
    return commonPasswords.includes(password.toLowerCase());
};

/**
 * 📊 Password Strength Estimator
 */
export const estimatePasswordStrength = (password: string): {
    score: number;
    label: string;
    crackTime: string;
} => {
    let score = 0;
    
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[@$!%*?&]/.test(password)) score++;
    
    score = Math.min(score, 4);
    
    const labels = ['Very Weak', 'Weak', 'Fair', 'Strong', 'Very Strong'];
    const times = ['Instant', 'Minutes', 'Hours', 'Days', 'Years'];
    
    return {
        score,
        label: labels[score],
        crackTime: times[score]
    };
};