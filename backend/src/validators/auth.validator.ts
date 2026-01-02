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