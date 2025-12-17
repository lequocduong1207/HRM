import Joi from 'joi';

/**
 * Check-in validation schema
 */
export const checkInSchema = {
    body: Joi.object({
        latitude: Joi.number()
            .required()
            .min(-90)
            .max(90)
            .messages({
                'any.required': 'Latitude is required',
                'number.min': 'Invalid latitude',
                'number.max': 'Invalid latitude'
            }),
        longitude: Joi.number()
            .required()
            .min(-180)
            .max(180)
            .messages({
                'any.required': 'Longitude is required',
                'number.min': 'Invalid longitude',
                'number.max': 'Invalid longitude'
            }),
        note: Joi.string()
            .optional()
            .max(500)
            .messages({
                'string.max': 'Note cannot exceed 500 characters'
            })
    })
};

/**
 * Check-out validation schema
 */
export const checkOutSchema = {
    body: Joi.object({
        latitude: Joi.number()
            .required()
            .min(-90)
            .max(90)
            .messages({
                'any.required': 'Latitude is required',
                'number.min': 'Invalid latitude',
                'number.max': 'Invalid latitude'
            }),
        longitude: Joi.number()
            .required()
            .min(-180)
            .max(180)
            .messages({
                'any.required': 'Longitude is required',
                'number.min': 'Invalid longitude',
                'number.max': 'Invalid longitude'
            }),
        note: Joi.string()
            .optional()
            .max(500)
    })
};

/**
 * Get attendance history validation schema
 */
export const getAttendanceHistorySchema = {
    query: Joi.object({
        page: Joi.number().optional().min(1).default(1),
        limit: Joi.number().optional().min(1).max(100).default(10),
        startDate: Joi.date().optional(),
        endDate: Joi.date()
            .optional()
            .min(Joi.ref('startDate'))
            .messages({
                'date.min': 'End date must be after start date'
            }),
        employeeId: Joi.number().optional().positive()
    })
};

/**
 * Get attendance by ID validation schema
 */
export const getAttendanceByIdSchema = {
    params: Joi.object({
        id: Joi.number()
            .required()
            .positive()
            .messages({
                'any.required': 'Attendance ID is required',
                'number.positive': 'Invalid attendance ID'
            })
    })
};

/**
 * List all attendances validation schema
 */
export const listAttendancesSchema = {
    query: Joi.object({
        page: Joi.number().optional().min(1).default(1),
        limit: Joi.number().optional().min(1).max(100).default(10),
        departmentId: Joi.number().optional().positive(),
        employeeId: Joi.number().optional().positive(),
        startDate: Joi.date().optional(),
        endDate: Joi.date().optional().min(Joi.ref('startDate')),
        status: Joi.string().optional().valid('Present', 'Late', 'Absent')
    })
};

/**
 * Update attendance validation schema
 */
export const updateAttendanceSchema = {
    params: Joi.object({
        id: Joi.number().required().positive()
    }),
    body: Joi.object({
        checkOutTime: Joi.date().optional(),
        note: Joi.string().optional().max(500),
        status: Joi.string().optional().valid('Present', 'Late', 'Absent')
    }).min(1)
};