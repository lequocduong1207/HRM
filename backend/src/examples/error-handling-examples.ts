/**
 * Error Handling Examples
 * 
 * This file demonstrates best practices for error handling
 * in the HRM system.
 */

import { Request, Response, NextFunction } from 'express';
import { AppError } from '../middlewares/error/error-handler.middleware.js';
import { asyncHandler } from '../middlewares/error/async-handler.middleware.js';
import { logger } from '../utills/logger.js';

// ============================================================================
// EXAMPLE 1: Basic Error Throwing
// ============================================================================

export const getUserById = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    
    // Simulate user lookup
    const user = null; // await userRepository.findById(id);
    
    // If not found, throw operational error
    if (!user) {
        throw new AppError('User not found', 404);
    }
    
    res.json({ success: true, data: user });
});

// ============================================================================
// EXAMPLE 2: Validation Errors
// ============================================================================

export const createUser = asyncHandler(async (req: Request, res: Response) => {
    const { email, password, name } = req.body;
    
    // Manual validation (prefer Joi validators)
    if (!email || !password || !name) {
        throw new AppError('Email, password, and name are required', 400);
    }
    
    // Check if email already exists
    const existingUser = null; // await userRepository.findByEmail(email);
    if (existingUser) {
        throw new AppError(`Email '${email}' is already registered`, 409);
    }
    
    // Create user
    // const newUser = await userRepository.create({ email, password, name });
    
    res.status(201).json({ 
        success: true, 
        message: 'User created successfully'
    });
});

// ============================================================================
// EXAMPLE 3: Authorization Errors
// ============================================================================

export const deleteUser = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const currentUser = (req as any).user; // From auth middleware
    
    const userToDelete: any = null; // await userRepository.findById(id);
    
    if (!userToDelete) {
        throw new AppError('User not found', 404);
    }
    
    // Check if user has permission
    if (currentUser.role !== 'admin' && currentUser.id !== id) {
        throw new AppError('You do not have permission to delete this user', 403);
    }
    
    // Prevent deleting admin users
    if (userToDelete.role === 'admin') {
        throw new AppError('Cannot delete admin users', 403);
    }
    
    // await userRepository.delete(id);
    
    res.json({ 
        success: true, 
        message: 'User deleted successfully' 
    });
});

// ============================================================================
// EXAMPLE 4: Business Logic Errors
// ============================================================================

export const checkIn = asyncHandler(async (req: Request, res: Response) => {
    const { employeeId } = req.body;
    const today = new Date();
    
    // Check if employee exists
    const employee: any = null; // await employeeRepository.findById(employeeId);
    if (!employee) {
        throw new AppError('Employee not found', 404);
    }
    
    // Check if employee is active
    if (!employee.isActive) {
        throw new AppError('Employee account is inactive', 403);
    }
    
    // Check if already checked in today
    const existingAttendance: any = null; // await attendanceRepository.findByEmployeeAndDate(employeeId, today);
    if (existingAttendance && existingAttendance.checkInTime) {
        throw new AppError('You have already checked in today', 400);
    }
    
    // Create attendance record
    // const attendance = await attendanceRepository.create({ ... });
    
    res.json({ 
        success: true, 
        message: 'Checked in successfully'
    });
});

// ============================================================================
// EXAMPLE 5: Service Layer Error Handling
// ============================================================================

export class UserService {
    /**
     * Service methods should throw AppErrors for business logic violations
     */
    async updateUser(userId: string, updates: any) {
        // Find user
        const user: any = null; // await userRepository.findById(userId);
        
        if (!user) {
            throw new AppError('User not found', 404);
        }
        
        // Validate email uniqueness if being updated
        if (updates.email && updates.email !== user.email) {
            const existingUser = null; // await userRepository.findByEmail(updates.email);
            if (existingUser) {
                throw new AppError('Email already in use', 409);
            }
        }
        
        // Prevent role changes for non-admins
        if (updates.role && updates.role !== user.role) {
            throw new AppError('You cannot change your own role', 403);
        }
        
        // Update user
        // return await userRepository.update(userId, updates);
        return user;
    }
}

// ============================================================================
// EXAMPLE 6: Logging Errors with Context
// ============================================================================

export const processPayment = asyncHandler(async (req: Request, res: Response) => {
    const { orderId, amount, paymentMethod } = req.body;
    
    try {
        // Simulate payment processing
        // const result = await paymentGateway.process({ orderId, amount });
        
        logger.info('Payment processed successfully', {
            orderId,
            amount,
            method: paymentMethod
        });
        
        res.json({ success: true, message: 'Payment processed' });
    } catch (error: any) {
        // Log error with context (don't expose to client)
        logger.error('Payment processing failed', error, {
            orderId,
            amount,
            method: paymentMethod,
            errorCode: error.code
        });
        
        // Throw user-friendly error
        throw new AppError('Payment processing failed. Please try again.', 500);
    }
});

// ============================================================================
// EXAMPLE 7: Async Error in Promise Chain
// ============================================================================

export const bulkUpdateEmployees = asyncHandler(async (req: Request, res: Response) => {
    const { employeeIds, updates } = req.body;
    
    if (!Array.isArray(employeeIds) || employeeIds.length === 0) {
        throw new AppError('Employee IDs array is required', 400);
    }
    
    // Process updates
    const results = await Promise.all(
        employeeIds.map(async (id) => {
            try {
                // return await employeeRepository.update(id, updates);
                return { id, success: true };
            } catch (error: any) {
                logger.warn(`Failed to update employee ${id}`, { error: error.message });
                return { id, success: false, error: error.message };
            }
        })
    );
    
    const successCount = results.filter(r => r.success).length;
    const failCount = results.filter(r => !r.success).length;
    
    logger.info('Bulk update completed', { 
        total: employeeIds.length,
        success: successCount,
        failed: failCount 
    });
    
    res.json({
        success: true,
        message: `Updated ${successCount} employees, ${failCount} failed`,
        results
    });
});

// ============================================================================
// EXAMPLE 8: Conditional Error Messages
// ============================================================================

export const login = asyncHandler(async (req: Request, res: Response) => {
    const { email, password } = req.body;
    
    // Find user
    const user: any = null; // await userRepository.findByEmail(email);
    
    // Generic error for security (don't reveal if email exists)
    if (!user) {
        // Log attempt
        logger.warn('Failed login attempt', { email, reason: 'user_not_found' });
        throw new AppError('Invalid email or password', 401);
    }
    
    // Check password
    const isValid = false; // await comparePassword(password, user.password);
    if (!isValid) {
        logger.warn('Failed login attempt', { email, reason: 'invalid_password' });
        throw new AppError('Invalid email or password', 401);
    }
    
    // Check if account is locked
    if (user.isLocked) {
        logger.warn('Locked account login attempt', { email });
        throw new AppError('Account is locked. Please contact support.', 403);
    }
    
    // Success
    logger.info('User logged in', { userId: user.id, email });
    
    res.json({ 
        success: true, 
        message: 'Login successful',
        // token: generateToken(user)
    });
});

// ============================================================================
// EXAMPLE 9: Multiple Error Checks
// ============================================================================

export const assignManagerToDepartment = asyncHandler(async (req: Request, res: Response) => {
    const { departmentId, managerId } = req.body;
    
    // Validate inputs
    if (!departmentId || !managerId) {
        throw new AppError('Department ID and Manager ID are required', 400);
    }
    
    // Check if department exists
    const department: any = null; // await departmentRepository.findById(departmentId);
    if (!department) {
        throw new AppError('Department not found', 404);
    }
    
    // Check if manager exists
    const manager: any = null; // await employeeRepository.findById(managerId);
    if (!manager) {
        throw new AppError('Manager not found', 404);
    }
    
    // Check if manager is active
    if (!manager.isActive) {
        throw new AppError('Cannot assign inactive employee as manager', 400);
    }
    
    // Check if manager already assigned
    if (department.managerId && department.managerId.toString() === managerId) {
        throw new AppError('This employee is already the manager', 400);
    }
    
    // Check if manager is already managing another department
    const otherDept: any = null; // await departmentRepository.findByManager(managerId);
    if (otherDept) {
        throw new AppError(
            `This employee is already managing department '${otherDept.name}'`,
            400
        );
    }
    
    // Assign manager
    // await departmentRepository.update(departmentId, { managerId });
    
    logger.info('Manager assigned to department', {
        departmentId,
        managerId,
        departmentName: department.name
    });
    
    res.json({
        success: true,
        message: 'Manager assigned successfully'
    });
});

// ============================================================================
// EXAMPLE 10: Error Recovery
// ============================================================================

export const syncDataWithExternalAPI = asyncHandler(async (req: Request, res: Response) => {
    let retries = 3;
    let lastError: Error | null = null;
    
    // Retry logic
    while (retries > 0) {
        try {
            // const data = await externalAPI.fetchData();
            // await database.saveData(data);
            
            logger.info('Data sync successful');
            
            return res.json({
                success: true,
                message: 'Data synchronized successfully'
            });
        } catch (error: any) {
            lastError = error;
            retries--;
            
            logger.warn(`Data sync failed, retries left: ${retries}`, {
                error: error.message
            });
            
            if (retries > 0) {
                // Wait before retry
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
        }
    }
    
    // All retries failed
    logger.error('Data sync failed after all retries', lastError!);
    throw new AppError('Failed to synchronize data. Please try again later.', 500);
});

// ============================================================================
// EXAMPLE 11: Custom Error Response Format
// ============================================================================

export const uploadFile = asyncHandler(async (req: Request, res: Response) => {
    const file = (req as any).file; // From multer middleware
    
    if (!file) {
        throw new AppError('No file uploaded', 400);
    }
    
    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!allowedTypes.includes(file.mimetype)) {
        throw new AppError(
            `Invalid file type. Allowed types: ${allowedTypes.join(', ')}`,
            400
        );
    }
    
    // Validate file size (5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
        throw new AppError('File size exceeds 5MB limit', 400);
    }
    
    // Process upload
    // const fileUrl = await uploadToS3(file);
    
    logger.info('File uploaded', {
        filename: file.originalname,
        size: file.size,
        mimetype: file.mimetype
    });
    
    res.json({
        success: true,
        message: 'File uploaded successfully',
        // data: { url: fileUrl }
    });
});

// ============================================================================
// BEST PRACTICES SUMMARY
// ============================================================================

/**
 * 1. Always use AppError for operational errors
 * 2. Provide clear, user-friendly error messages
 * 3. Use appropriate HTTP status codes
 * 4. Log errors with context for debugging
 * 5. Never expose sensitive information in errors
 * 6. Validate input early
 * 7. Use asyncHandler wrapper for async routes
 * 8. Handle both operational and programming errors
 * 9. Consider using generic messages for security (e.g., login)
 * 10. Implement retry logic for external services
 */
