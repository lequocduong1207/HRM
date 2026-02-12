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

const handleCastErrorDB = (err: mongoose.Error.CastError): AppError => {
    const message = `Invalid ${err.path}: ${err.value}`;
    return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err: any): AppError => {
    const field = Object.keys(err.keyValue)[0];
    const value = err.keyValue[field];
    const message = `Duplicate field value: ${field} = '${value}'. Please use another value!`;
    return new AppError(message, 409);
};

const handleValidationErrorDB = (err: mongoose.Error.ValidationError): AppError => {
    const errors = Object.values(err.errors).map(el => el.message);
    const message = `Invalid input data. ${errors.join('. ')}`;
    return new AppError(message, 400);
};

const handleJWTError = (): AppError => {
    return new AppError('Invalid token. Please log in again!', 401);
};

const handleJWTExpiredError = (): AppError => {
    return new AppError('Your token has expired! Please log in again.', 401);
};


const sendErrorDev = (err: any, req: Request, res: Response) => {
    logger.error(`${req.method} ${req.originalUrl}`, err, {
        statusCode: err.statusCode,
        name: err.name
    });
    
    res.status(err.statusCode).json({
        success: false,
        error: err.message,
        statusCode: err.statusCode,
        name: err.name,
        ...(err.errors && { details: err.errors })
    });
};

const sendErrorProd = (err: any, req: Request, res: Response) => {
    if (err.isOperational) {
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
    else {
        logger.error(`Critical Error: ${req.method} ${req.originalUrl}`, err, {
            statusCode: err.statusCode,
            ip: req.ip,
            userAgent: req.get('user-agent')
        });
        
        res.status(500).json({
            success: false,
            error: 'An unexpected error occurred. Please try again later.',
            statusCode: 500
        });
    }
};

export const errorHandler = (
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    let error = { ...err };
    error.message = err.message;
    error.name = err.name;
    error.isOperational = err.isOperational;

    if (err.name === 'CastError') {
        error = handleCastErrorDB(err);
    }

    if (err.code === 11000) {
        error = handleDuplicateFieldsDB(err);
    }

    if (err.name === 'ValidationError') {
        error = handleValidationErrorDB(err);
    }

    if (err.name === 'JsonWebTokenError') {
        error = handleJWTError();
    }

    if (err.name === 'TokenExpiredError') {
        error = handleJWTExpiredError();
    }

    if (process.env.NODE_ENV === 'development') {
        sendErrorDev(error, req, res);
    } else {
        sendErrorProd(error, req, res);
    }
};