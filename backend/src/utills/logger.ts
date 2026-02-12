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

    private getTimestamp(): string {
        return new Date().toISOString();
    }

    private getColorCode(level: LogLevel): string {
        const colors = {
            [LogLevel.ERROR]: '\x1b[31m',   // Red
            [LogLevel.WARN]: '\x1b[33m',    // Yellow
            [LogLevel.INFO]: '\x1b[36m',    // Cyan
            [LogLevel.DEBUG]: '\x1b[35m'    // Magenta
        };
        return colors[level] || '\x1b[0m';
    }

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
    error(message: string, error?: Error, data?: any): void {
        this.log({
            level: LogLevel.ERROR,
            message,
            error,
            data
        });
    }
    warn(message: string, data?: any): void {
        this.log({
            level: LogLevel.WARN,
            message,
            data
        });
    }
    info(message: string, data?: any): void {
        this.log({
            level: LogLevel.INFO,
            message,
            data
        });
    }
    debug(message: string, data?: any): void {
        if (this.isDevelopment) {
            this.log({
                level: LogLevel.DEBUG,
                message,
                data
            });
        }
    }
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

export const logger = new Logger();