import sql from 'mssql';
import { checkConnection } from '../config/db.js';

export class AuthRepository {
    /**
     * Find user by email (PRIMARY LOGIN METHOD)
     */
    async findByEmail(email: string) {
        const pool = await checkConnection();
        const result = await pool
            .request()
            .input('email', sql.NVarChar, email)
            .query(`
                SELECT 
                    u.user_id AS userId,
                    u.username,
                    u.password_hash AS passwordHash,
                    u.email,
                    u.role,
                    u.is_active AS isActive,
                    u.last_login AS lastLogin,
                    u.created_at AS createdAt,
                    u.updated_at AS updatedAt,
                    e.full_name AS fullName,
                    e.employee_id AS employeeId,
                    e.phone,
                    e.position,
                    e.department_id AS departmentId
                FROM users u
                LEFT JOIN employee e ON u.employee_id = e.employee_id
                WHERE u.email = @email
            `);

        return result.recordset[0];
    }

    /**
     * Find user by username (OPTIONAL - for flexibility)
     */
    async findByUsername(username: string) {
        const pool = await checkConnection();
        const result = await pool
            .request()
            .input('username', sql.NVarChar, username)
            .query(`
                SELECT 
                    u.user_id AS userId,
                    u.username,
                    u.password_hash AS passwordHash,
                    u.email,
                    u.role,
                    u.is_active AS isActive,
                    u.last_login AS lastLogin,
                    u.created_at AS createdAt,
                    u.updated_at AS updatedAt,
                    e.full_name AS fullName,
                    e.employee_id AS employeeId,
                    e.phone,
                    e.position,
                    e.department_id AS departmentId
                FROM users u
                LEFT JOIN employee e ON u.employee_id = e.employee_id
                WHERE u.username = @username
            `);

        return result.recordset[0];
    }

    /**
     * Find user by email OR username (FLEXIBLE LOGIN)
     */
    async findByEmailOrUsername(identifier: string) {
        const pool = await checkConnection();
        const result = await pool
            .request()
            .input('identifier', sql.NVarChar, identifier)
            .query(`
                SELECT 
                    u.user_id AS userId,
                    u.username,
                    u.password_hash AS passwordHash,
                    u.email,
                    u.role,
                    u.is_active AS isActive,
                    u.last_login AS lastLogin,
                    u.created_at AS createdAt,
                    u.updated_at AS updatedAt,
                    e.full_name AS fullName,
                    e.employee_id AS employeeId,
                    e.phone,
                    e.position,
                    e.department_id AS departmentId
                FROM users u
                LEFT JOIN employee e ON u.employee_id = e.employee_id
                WHERE u.email = @identifier OR u.username = @identifier
            `);

        return result.recordset[0];
    }

    /**
     * Find user by ID
     */
    async findById(userId: number) {
        const pool = await checkConnection();
        const result = await pool
            .request()
            .input('userId', sql.Int, userId)
            .query(`
                SELECT 
                    u.user_id AS userId,
                    u.username,
                    u.password_hash AS passwordHash,
                    u.email,
                    u.role,
                    u.is_active AS isActive,
                    u.last_login AS lastLogin,
                    u.created_at AS createdAt,
                    u.updated_at AS updatedAt,
                    e.full_name AS fullName,
                    e.employee_id AS employeeId,
                    e.email AS employeeEmail,
                    e.phone,
                    e.position,
                    e.department_id AS departmentId
                FROM users u
                LEFT JOIN employee e ON u.employee_id = e.employee_id
                WHERE u.user_id = @userId
            `);

        return result.recordset[0];
    }

    /**
     * Check if email exists
     */
    async emailExists(email: string): Promise<boolean> {
        const pool = await checkConnection();
        const result = await pool
            .request()
            .input('email', sql.NVarChar, email)
            .query(`
                SELECT COUNT(*) as count
                FROM users
                WHERE email = @email
            `);

        return result.recordset[0].count > 0;
    }

    /**
     * Check if username exists
     */
    async usernameExists(username: string): Promise<boolean> {
        const pool = await checkConnection();
        const result = await pool
            .request()
            .input('username', sql.NVarChar, username)
            .query(`
                SELECT COUNT(*) as count
                FROM users
                WHERE username = @username
            `);

        return result.recordset[0].count > 0;
    }

    /**
     * Create new user
     */
    async createUser(data: {
        username: string;
        password: string;
        email: string;
        fullName: string;
        role: string;
    }) {
        const pool = await checkConnection();
        
        // Start transaction
        const transaction = pool.transaction();
        await transaction.begin();

        try {
            // Create employee first
            const employeeResult = await transaction
                .request()
                .input('fullName', sql.NVarChar, data.fullName)
                .input('email', sql.NVarChar, data.email)
                .query(`
                    INSERT INTO employee (full_name, email, employment_status, created_at)
                    OUTPUT INSERTED.employee_id AS employeeId
                    VALUES (@fullName, @email, 'active', GETDATE())
                `);

            const employeeId = employeeResult.recordset[0].employeeId;

            // Create user
            const userResult = await transaction
                .request()
                .input('username', sql.NVarChar, data.username)
                .input('password', sql.NVarChar, data.password)
                .input('email', sql.NVarChar, data.email)
                .input('role', sql.NVarChar, data.role)
                .input('employeeId', sql.Int, employeeId)
                .query(`
                    INSERT INTO users (username, password_hash, email, role, employee_id, is_active, created_at)
                    OUTPUT INSERTED.user_id AS userId, INSERTED.username, INSERTED.email, INSERTED.role
                    VALUES (@username, @password, @email, @role, @employeeId, 1, GETDATE())
                `);

            await transaction.commit();

            return {
                ...userResult.recordset[0],
                fullName: data.fullName,
                employeeId
            };
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }

    /**
     * Update last login
     */
    async updateLastLogin(userId: number): Promise<void> {
        const pool = await checkConnection();
        await pool
            .request()
            .input('userId', sql.Int, userId)
            .query(`
                UPDATE users
                SET last_login = GETDATE(), updated_at = GETDATE()
                WHERE user_id = @userId
            `);
    }

    /**
     * Update password
     */
    async updatePassword(userId: number, hashedPassword: string): Promise<void> {
        const pool = await checkConnection();
        await pool
            .request()
            .input('userId', sql.Int, userId)
            .input('password', sql.NVarChar, hashedPassword)
            .query(`
                UPDATE users
                SET password_hash = @password, updated_at = GETDATE()
                WHERE user_id = @userId
            `);
    }

    /**
     * Save reset token
     */
    async saveResetToken(userId: number, token: string): Promise<void> {
        const pool = await checkConnection();
        const expiresAt = new Date(Date.now() + 3600000); // 1 hour

        await pool
            .request()
            .input('userId', sql.Int, userId)
            .input('token', sql.NVarChar, token)
            .input('expiresAt', sql.DateTime, expiresAt)
            .query(`
                INSERT INTO PasswordResetTokens (UserId, Token, ExpiresAt, CreatedAt)
                VALUES (@userId, @token, @expiresAt, GETDATE())
            `);
    }

    /**
     * Validate reset token
     */
    async validateResetToken(userId: number, token: string): Promise<boolean> {
        const pool = await checkConnection();
        const result = await pool
            .request()
            .input('userId', sql.Int, userId)
            .input('token', sql.NVarChar, token)
            .query(`
                SELECT * FROM PasswordResetTokens
                WHERE UserId = @userId 
                  AND Token = @token
                  AND ExpiresAt > GETDATE()
                  AND UsedAt IS NULL
            `);

        return result.recordset.length > 0;
    }

    /**
     * Delete reset token
     */
    async deleteResetToken(userId: number): Promise<void> {
        const pool = await checkConnection();
        await pool
            .request()
            .input('userId', sql.Int, userId)
            .query(`
                UPDATE PasswordResetTokens
                SET UsedAt = GETDATE()
                WHERE UserId = @userId AND UsedAt IS NULL
            `);
    }

    /**
     * Verify email
     */
    async verifyEmail(userId: number): Promise<void> {
        const pool = await checkConnection();
        await pool
            .request()
            .input('userId', sql.Int, userId)
            .query(`
                UPDATE Users
                SET EmailVerified = 1, UpdatedAt = GETDATE()
                WHERE UserId = @userId
            `);
    }
}