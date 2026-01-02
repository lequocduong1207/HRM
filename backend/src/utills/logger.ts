/**
 * Simple Logger Utility
 * For production, consider using Winston or Pino
 */

export enum LogLevel {
    ERROR = 'ERROR',
    WARN = 'WARN',
    INFO = 'INFO',
    DEBUG = 'DEBUG'
}

interface LogOptions {
    level: LogLevel;
    message: string;
    data?: any;
    error?: Error;
}

class Logger {
    private isDevelopment = process.env.NODE_ENV === 'development';

    /**
     * Format timestamp
     */
    private getTimestamp(): string {
        return new Date().toISOString();
    }

    /**
     * Get color code for log level
     */
    private getColorCode(level: LogLevel): string {
        const colors = {
            [LogLevel.ERROR]: '\x1b[31m',   // Red
            [LogLevel.WARN]: '\x1b[33m',    // Yellow
            [LogLevel.INFO]: '\x1b[36m',    // Cyan
            [LogLevel.DEBUG]: '\x1b[35m'    // Magenta
        };
        return colors[level] || '\x1b[0m';
    }

    /**
     * Core log method
     */
    private log(options: LogOptions): void {
        const { level, message, data, error } = options;
        const timestamp = this.getTimestamp();
        const colorCode = this.getColorCode(level);
        const resetCode = '\x1b[0m';

        // Format log message
        const logPrefix = `${colorCode}[${timestamp}] [${level}]${resetCode}`;
        
        console.log(`${logPrefix} ${message}`);

        // Log additional data in development
        if (this.isDevelopment && data) {
            console.log(`${colorCode}Data:${resetCode}`, JSON.stringify(data, null, 2));
        }

        // Log error details
        if (error) {
            console.log(`${colorCode}Error:${resetCode}`, error.message);
            
            // Only show stack in development
            if (this.isDevelopment && process.env.SHOW_STACK_TRACE === 'true') {
                console.log(`${colorCode}Stack:${resetCode}`, error.stack);
            }
        }
    }

    /**
     * Log error
     */
    error(message: string, error?: Error, data?: any): void {
        this.log({
            level: LogLevel.ERROR,
            message,
            error,
            data
        });
    }

    /**
     * Log warning
     */
    warn(message: string, data?: any): void {
        this.log({
            level: LogLevel.WARN,
            message,
            data
        });
    }

    /**
     * Log info
     */
    info(message: string, data?: any): void {
        this.log({
            level: LogLevel.INFO,
            message,
            data
        });
    }

    /**
     * Log debug (only in development)
     */
    debug(message: string, data?: any): void {
        if (this.isDevelopment) {
            this.log({
                level: LogLevel.DEBUG,
                message,
                data
            });
        }
    }

    /**
     * Log request
     */
    request(method: string, url: string, statusCode: number, duration?: number): void {
        const message = `${method} ${url} - ${statusCode}${duration ? ` (${duration}ms)` : ''}`;
        
        if (statusCode >= 500) {
            this.error(message);
        } else if (statusCode >= 400) {
            this.warn(message);
        } else {
            this.info(message);
        }
    }
}

// Export singleton instance
export const logger = new Logger();

/**
 * Example Usage:
 * 
 * logger.error('Database connection failed', error);
 * logger.warn('Deprecated API endpoint used', { endpoint: '/old-api' });
 * logger.info('User logged in', { userId: '123' });
 * logger.debug('Cache hit', { key: 'user:123' });
 * logger.request('GET', '/api/users', 200, 45);
 */
