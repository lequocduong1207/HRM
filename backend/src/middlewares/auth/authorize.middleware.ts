import { Request, Response, NextFunction } from 'express';
import { AppError } from '../error/error-handler.middleware.js';

type Role = 'admin' | 'hr_manager' | 'manager' | 'employee';

export const authorize = (...roles: Role[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!req.user) {
            throw new AppError('Not authenticated', 401);
        }

        if (!roles.includes(req.user.role as Role)) {
            throw new AppError(
                `Role '${req.user.role}' is not authorized to access this route`,
                403
            );
        }

        next();
    };
};