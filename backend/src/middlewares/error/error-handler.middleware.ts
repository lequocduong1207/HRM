import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { logger } from '../../utills/logger.js';

export class AppError extends Error {
    statusCode: number;
    status: string;
    isOperational: boolean;

    constructor(message: string, statusCode: number) {
        super(message);
        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
        this.isOperational = true;
        Error.captureStackTrace(this, this.constructor);
    }
}

/**
 * Handle Mongoose Cast Error (Invalid ObjectId)
 */
const handleCastErrorDB = (err: mongoose.Error.CastError): AppError => {
    const message = `Invalid ${err.path}: ${err.value}`;
    return new AppError(message, 400);
};

/**
 * Handle Mongoose Duplicate Key Error
 */
const handleDuplicateFieldsDB = (err: any): AppError => {
    const field = Object.keys(err.keyValue)[0];
    const value = err.keyValue[field];
    const message = `Duplicate field value: ${field} = '${value}'. Please use another value!`;
    return new AppError(message, 409);
};

/**
 * Handle Mongoose Validation Error
 */
const handleValidationErrorDB = (err: mongoose.Error.ValidationError): AppError => {
    const errors = Object.values(err.errors).map(el => el.message);
    const message = `Invalid input data. ${errors.join('. ')}`;
    return new AppError(message, 400);
};

/**
 * Handle JWT Errors
 */
const handleJWTError = (): AppError => {
    return new AppError('Invalid token. Please log in again!', 401);
};

const handleJWTExpiredError = (): AppError => {
    return new AppError('Your token has expired! Please log in again.', 401);
};

/**
 * Send error response for development
 */
const sendErrorDev = (err: any, req: Request, res: Response) => {
    // Log error with logger (includes stack trace control)
    logger.error(`${req.method} ${req.originalUrl}`, err, {
        statusCode: err.statusCode,
        name: err.name
    });
    
    // Send response (NO stack trace to client for security)
    res.status(err.statusCode).json({
        success: false,
        error: err.message,
        statusCode: err.statusCode,
        // Include error details but NOT stack
        name: err.name,
        ...(err.errors && { details: err.errors })
    });
};

/**
 * Send error response for production
 */
const sendErrorProd = (err: any, req: Request, res: Response) => {
    // Operational, trusted error: send message to client
    if (err.isOperational) {
        // Log operational error
        logger.warn(`Operational Error: ${req.method} ${req.originalUrl}`, {
            statusCode: err.statusCode,
            message: err.message
        });

        res.status(err.statusCode).json({
            success: false,
            error: err.message,
            statusCode: err.statusCode
        });
    } 
    // Programming or other unknown error: don't leak error details
    else {
        // Log critical error with request context
        logger.error(`Critical Error: ${req.method} ${req.originalUrl}`, err, {
            statusCode: err.statusCode,
            ip: req.ip,
            userAgent: req.get('user-agent')
        });
        
        // Send generic message
        res.status(500).json({
            success: false,
            error: 'An unexpected error occurred. Please try again later.',
            statusCode: 500
        });
    }
};

/**
 * Global error handling middleware
 */
export const errorHandler = (
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';
    
    // Handle different error types
    let error = { ...err };
    error.message = err.message;
    error.name = err.name;
    error.isOperational = err.isOperational;

    // Mongoose bad ObjectId
    if (err.name === 'CastError') {
        error = handleCastErrorDB(err);
    }

    // Mongoose duplicate key
    if (err.code === 11000) {
        error = handleDuplicateFieldsDB(err);
    }

    // Mongoose validation error
    if (err.name === 'ValidationError') {
        error = handleValidationErrorDB(err);
    }

    // JWT errors
    if (err.name === 'JsonWebTokenError') {
        error = handleJWTError();
    }

    if (err.name === 'TokenExpiredError') {
        error = handleJWTExpiredError();
    }

    // Send appropriate response
    if (process.env.NODE_ENV === 'development') {
        sendErrorDev(error, req, res);
    } else {
        sendErrorProd(error, req, res);
    }
};