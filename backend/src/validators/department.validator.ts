import Joi from 'joi';

/**
 * Create department validation schema
 */
export const createDepartmentSchema = {
    body: Joi.object({
        name: Joi.string()
            .required()
            .min(2)
            .max(100)
            .messages({
                'any.required': 'Department name is required',
                'string.min': 'Department name must be at least 2 characters',
                'string.max': 'Department name cannot exceed 100 characters'
            }),
        description: Joi.string()
            .optional()
            .allow(null, '')
            .max(500)
            .messages({
                'string.max': 'Description cannot exceed 500 characters'
            }),
        managerId: Joi.number()
            .optional()
            .allow(null)
            .integer()
            .positive()
            .messages({
                'number.base': 'Manager ID must be a number',
                'number.integer': 'Manager ID must be an integer',
                'number.positive': 'Manager ID must be a positive number'
            })
    })
};

/**
 * Update department validation schema
 */
export const updateDepartmentSchema = {
    body: Joi.object({
        name: Joi.string()
            .optional()
            .min(2)
            .max(100)
            .messages({
                'string.min': 'Department name must be at least 2 characters',
                'string.max': 'Department name cannot exceed 100 characters'
            }),
        description: Joi.string()
            .optional()
            .allow(null, '')
            .max(500)
            .messages({
                'string.max': 'Description cannot exceed 500 characters'
            }),
        managerId: Joi.number()
            .optional()
            .allow(null)
            .integer()
            .positive()
            .messages({
                'number.base': 'Manager ID must be a number',
                'number.integer': 'Manager ID must be an integer',
                'number.positive': 'Manager ID must be a positive number'
            })
    })
};

/**
 * Department ID parameter validation
 */
export const departmentIdSchema = {
    params: Joi.object({
        id: Joi.number()
            .required()
            .integer()
            .positive()
            .messages({
                'any.required': 'Department ID is required',
                'number.base': 'Department ID must be a number',
                'number.integer': 'Department ID must be an integer',
                'number.positive': 'Department ID must be a positive number'
            })
    })
};
