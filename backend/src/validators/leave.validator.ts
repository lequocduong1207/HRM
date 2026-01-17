import Joi from 'joi';

/**
 * Create leave request validation schema
 */
export const createLeaveSchema = {
    body: Joi.object({
        leaveType: Joi.string()
            .required()
            .valid('Annual', 'Sick', 'Unpaid', 'Maternity', 'Paternity', 'Other')
            .messages({
                'any.required': 'Leave type is required',
                'any.only': 'Invalid leave type'
            }),
        startDate: Joi.date()
            .required()
            .min('now')
            .messages({
                'any.required': 'Start date is required',
                'date.min': 'Start date must be in the future'
            }),
        endDate: Joi.date()
            .required()
            .greater(Joi.ref('startDate'))
            .messages({
                'any.required': 'End date is required',
                'date.greater': 'End date must be after start date'
            }),
        reason: Joi.string()
            .optional()
            .max(500)
            .messages({
                'string.max': 'Reason cannot exceed 500 characters'
            })
    })
};

/**
 * Update leave request validation schema
 */
export const updateLeaveSchema = {
    params: Joi.object({
        id: Joi.string()
            .required()
            .pattern(/^[0-9a-fA-F]{24}$/)
            .messages({
                'any.required': 'Leave ID is required',
                'string.pattern.base': 'Invalid leave ID format'
            })
    }),
    body: Joi.object({
        leaveType: Joi.string()
            .optional()
            .valid('Annual', 'Sick', 'Unpaid', 'Maternity', 'Paternity', 'Other')
            .messages({
                'any.only': 'Invalid leave type'
            }),
        startDate: Joi.date()
            .optional()
            .messages({
                'date.base': 'Invalid start date format'
            }),
        endDate: Joi.date()
            .optional()
            .when('startDate', {
                is: Joi.exist(),
                then: Joi.date().greater(Joi.ref('startDate')),
                otherwise: Joi.date()
            })
            .messages({
                'date.greater': 'End date must be after start date'
            }),
        reason: Joi.string()
            .optional()
            .max(500)
            .messages({
                'string.max': 'Reason cannot exceed 500 characters'
            })
    }).min(1).messages({
        'object.min': 'At least one field must be provided for update'
    })
};

/**
 * Get leave by ID validation schema
 */
export const getLeaveByIdSchema = {
    params: Joi.object({
        id: Joi.string()
            .required()
            .pattern(/^[0-9a-fA-F]{24}$/)
            .messages({
                'any.required': 'Leave ID is required',
                'string.pattern.base': 'Invalid leave ID format'
            })
    })
};

/**
 * Get my leaves validation schema
 */
export const getMyLeavesSchema = {
    query: Joi.object({
        status: Joi.string()
            .optional()
            .valid('Pending', 'Approved', 'Rejected', 'Cancelled')
            .messages({
                'any.only': 'Invalid status'
            }),
        startDate: Joi.date().optional(),
        endDate: Joi.date()
            .optional()
            .min(Joi.ref('startDate'))
            .messages({
                'date.min': 'End date must be after start date'
            }),
        page: Joi.number()
            .optional()
            .min(1)
            .default(1),
        limit: Joi.number()
            .optional()
            .min(1)
            .max(100)
            .default(10)
    })
};

/**
 * Get all leaves validation schema (Admin)
 */
export const getAllLeavesSchema = {
    query: Joi.object({
        status: Joi.string()
            .optional()
            .valid('Pending', 'Approved', 'Rejected', 'Cancelled')
            .messages({
                'any.only': 'Invalid status'
            }),
        leaveType: Joi.string()
            .optional()
            .valid('Annual', 'Sick', 'Unpaid', 'Maternity', 'Paternity', 'Other')
            .messages({
                'any.only': 'Invalid leave type'
            }),
        employeeId: Joi.string()
            .optional()
            .pattern(/^[0-9a-fA-F]{24}$/)
            .messages({
                'string.pattern.base': 'Invalid employee ID format'
            }),
        startDate: Joi.date().optional(),
        endDate: Joi.date()
            .optional()
            .min(Joi.ref('startDate'))
            .messages({
                'date.min': 'End date must be after start date'
            }),
        page: Joi.number()
            .optional()
            .min(1)
            .default(1),
        limit: Joi.number()
            .optional()
            .min(1)
            .max(100)
            .default(10)
    })
};

/**
 * Approve or reject leave validation schema (Admin)
 */
export const approveOrRejectLeaveSchema = {
    params: Joi.object({
        id: Joi.string()
            .required()
            .pattern(/^[0-9a-fA-F]{24}$/)
            .messages({
                'any.required': 'Leave ID is required',
                'string.pattern.base': 'Invalid leave ID format'
            })
    }),
    body: Joi.object({
        status: Joi.string()
            .required()
            .valid('Approved', 'Rejected')
            .messages({
                'any.required': 'Status is required',
                'any.only': 'Status must be either Approved or Rejected'
            }),
        rejectionReason: Joi.string()
            .when('status', {
                is: 'Rejected',
                then: Joi.required(),
                otherwise: Joi.optional()
            })
            .max(500)
            .messages({
                'any.required': 'Rejection reason is required when rejecting leave',
                'string.max': 'Rejection reason cannot exceed 500 characters'
            })
    })
};

/**
 * Get used leave days validation schema
 */
export const getUsedLeaveDaysSchema = {
    query: Joi.object({
        year: Joi.number()
            .optional()
            .min(2000)
            .max(2100)
            .default(new Date().getFullYear())
            .messages({
                'number.min': 'Invalid year',
                'number.max': 'Invalid year'
            })
    })
};

/**
 * Get leave statistics validation schema (Admin)
 */
export const getLeaveStatisticsSchema = {
    query: Joi.object({
        startDate: Joi.date().optional(),
        endDate: Joi.date()
            .optional()
            .min(Joi.ref('startDate'))
            .messages({
                'date.min': 'End date must be after start date'
            }),
        status: Joi.string()
            .optional()
            .valid('Pending', 'Approved', 'Rejected', 'Cancelled')
            .messages({
                'any.only': 'Invalid status'
            })
    })
};
