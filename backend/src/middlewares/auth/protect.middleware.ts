import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AppError } from '../error/error-handler.middleware.js';
import { asyncHandler } from '../error/async-handler.middleware.js';

interface JwtPayload {
    userId: string;  
    email: string;
    role?: string;   
    roleId: string;  
    departmentId?: string; 
}

declare global {
    namespace Express {
        interface Request {
            user?: JwtPayload;
        }
    }
}

export const protect = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const authHeader = req.headers.authorization;
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new AppError('Not authorized, no token', 401);
        }

        const token = authHeader.split(' ')[1];

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET as string
        ) as JwtPayload;

        req.user = decoded;

        next();
    }
);

export const admin = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        if (!req.user) {
            throw new AppError('Not authorized, no token', 401);
        }

        if (req.user.role && req.user.role !== 'admin') {
            throw new AppError('Not authorized, admin access required', 403);
        }

        next();
    }
);