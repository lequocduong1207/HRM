import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import { AppError } from '../error/error-handler.middleware.js';

interface ValidationSchema {
    body?: Joi.ObjectSchema;
    query?: Joi.ObjectSchema;
    params?: Joi.ObjectSchema;
}

export const validate = (schema: ValidationSchema) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const errors: string[] = [];

        // Validate body
        if (schema.body) {
            const { error } = schema.body.validate(req.body);
            if (error) {
                errors.push(...error.details.map(d => d.message));
            }
        }

        // Validate query
        if (schema.query) {
            const { error } = schema.query.validate(req.query);
            if (error) {
                errors.push(...error.details.map(d => d.message));
            }
        }

        // Validate params
        if (schema.params) {
            const { error } = schema.params.validate(req.params);
            if (error) {
                errors.push(...error.details.map(d => d.message));
            }
        }

        if (errors.length > 0) {
            throw new AppError(errors.join(', '), 400);
        }

        next();
    };
};