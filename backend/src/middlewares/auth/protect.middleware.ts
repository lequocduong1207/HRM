import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AppError } from '../error/error-handler.middleware.js';
import { asyncHandler } from '../error/async-handler.middleware.js';

interface JwtPayload {
    userId: number;
    username: string;
    role: string;
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
        // 1. Get token from header
        const authHeader = req.headers.authorization;
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new AppError('Not authorized, no token', 401);
        }

        const token = authHeader.split(' ')[1];

        // 2. Verify token
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET as string
        ) as JwtPayload;

        // 3. Attach user to request
        req.user = decoded;

        next();
    }
);

export const admin = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        if (!req.user) {
            throw new AppError('Not authorized, no token', 401);
        }

        if (req.user.role !== 'admin') {
            throw new AppError('Not authorized, admin access required', 403);
        } 

        next();
    }
);