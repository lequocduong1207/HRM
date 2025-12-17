import Joi from 'joi';

/**
 * Login validation schema (EMAIL)
 */
export const loginSchema = {
    body: Joi.object({
        email: Joi.string()
            .required()
            .email()
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
 * Login validation schema (FLEXIBLE - email or username)
 */
export const loginFlexibleSchema = {
    body: Joi.object({
        identifier: Joi.string()
            .required()
            .messages({
                'any.required': 'Email or username is required'
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
 */
export const registerSchema = {
    body: Joi.object({
        username: Joi.string()
            .required()
            .min(3)
            .max(50)
            .alphanum()
            .messages({
                'any.required': 'Username is required',
                'string.alphanum': 'Username must contain only letters and numbers'
            }),
        password: Joi.string()
            .required()
            .min(6)
            .max(100)
            .messages({
                'any.required': 'Password is required',
                'string.min': 'Password must be at least 6 characters'
            }),
        confirmPassword: Joi.string()
            .required()
            .valid(Joi.ref('password'))
            .messages({
                'any.required': 'Confirm password is required',
                'any.only': 'Passwords do not match'
            }),
        email: Joi.string()
            .required()
            .email()
            .messages({
                'any.required': 'Email is required',
                'string.email': 'Invalid email format'
            }),
        fullName: Joi.string()
            .required()
            .min(2)
            .max(100)
            .messages({
                'any.required': 'Full name is required'
            })
    })
};

// ... rest of validators