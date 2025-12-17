import Joi from 'joi';

/**
 * Create employee validation schema
 */
export const createEmployeeSchema = {
    body: Joi.object({
        fullName: Joi.string()
            .required()
            .min(2)
            .max(100)
            .messages({
                'any.required': 'Full name is required',
                'string.min': 'Full name must be at least 2 characters'
            }),
        email: Joi.string()
            .required()
            .email()
            .messages({
                'any.required': 'Email is required',
                'string.email': 'Invalid email format'
            }),
        phone: Joi.string()
            .required()
            .pattern(/^[0-9]{10,11}$/)
            .messages({
                'any.required': 'Phone is required',
                'string.pattern.base': 'Phone must be 10-11 digits'
            }),
        dateOfBirth: Joi.date()
            .required()
            .max('now')
            .messages({
                'any.required': 'Date of birth is required',
                'date.max': 'Invalid date of birth'
            }),
        gender: Joi.string()
            .required()
            .valid('Male', 'Female', 'Other')
            .messages({
                'any.required': 'Gender is required',
                'any.only': 'Gender must be Male, Female, or Other'
            }),
        address: Joi.string()
            .required()
            .max(200)
            .messages({
                'any.required': 'Address is required'
            }),
        departmentId: Joi.number()
            .required()
            .positive()
            .messages({
                'any.required': 'Department is required',
                'number.positive': 'Invalid department ID'
            }),
        position: Joi.string()
            .required()
            .max(100)
            .messages({
                'any.required': 'Position is required'
            }),
        hireDate: Joi.date()
            .required()
            .messages({
                'any.required': 'Hire date is required'
            }),
        salary: Joi.number()
            .required()
            .min(0)
            .messages({
                'any.required': 'Salary is required',
                'number.min': 'Salary must be positive'
            }),
        status: Joi.string()
            .optional()
            .valid('Active', 'Inactive', 'On Leave')
            .default('Active')
    })
};

/**
 * Update employee validation schema
 */
export const updateEmployeeSchema = {
    params: Joi.object({
        id: Joi.number()
            .required()
            .positive()
            .messages({
                'any.required': 'Employee ID is required',
                'number.positive': 'Invalid employee ID'
            })
    }),
    body: Joi.object({
        fullName: Joi.string().optional().min(2).max(100),
        email: Joi.string().optional().email(),
        phone: Joi.string().optional().pattern(/^[0-9]{10,11}$/),
        dateOfBirth: Joi.date().optional().max('now'),
        gender: Joi.string().optional().valid('Male', 'Female', 'Other'),
        address: Joi.string().optional().max(200),
        departmentId: Joi.number().optional().positive(),
        position: Joi.string().optional().max(100),
        salary: Joi.number().optional().min(0),
        status: Joi.string().optional().valid('Active', 'Inactive', 'On Leave')
    }).min(1).messages({
        'object.min': 'At least one field must be provided'
    })
};

/**
 * List employees validation schema
 */
export const listEmployeesSchema = {
    query: Joi.object({
        page: Joi.number().optional().min(1).default(1),
        limit: Joi.number().optional().min(1).max(100).default(10),
        departmentId: Joi.number().optional().positive(),
        status: Joi.string().optional().valid('Active', 'Inactive', 'On Leave'),
        search: Joi.string().optional().max(100)
    })
};

/**
 * Get employee by ID validation schema
 */
export const getEmployeeByIdSchema = {
    params: Joi.object({
        id: Joi.number()
            .required()
            .positive()
            .messages({
                'any.required': 'Employee ID is required',
                'number.positive': 'Invalid employee ID'
            })
    })
};

/**
 * Delete employee validation schema
 */
export const deleteEmployeeSchema = {
    params: Joi.object({
        id: Joi.number()
            .required()
            .positive()
            .messages({
                'any.required': 'Employee ID is required',
                'number.positive': 'Invalid employee ID'
            })
    })
};