/**
 * Date & Time Utilities
 */

export const formatDate = (date: string | Date, formatString: string = 'yyyy-MM-dd'): string => {
    try {
        const dateObj = typeof date === 'string' ? new Date(date) : date;
        if (isNaN(dateObj.getTime())) return '';
        
        // Simple format implementation (can be replaced with date-fns later)
        const year = dateObj.getFullYear();
        const month = String(dateObj.getMonth() + 1).padStart(2, '0');
        const day = String(dateObj.getDate()).padStart(2, '0');
        const hours = String(dateObj.getHours()).padStart(2, '0');
        const minutes = String(dateObj.getMinutes()).padStart(2, '0');
        const seconds = String(dateObj.getSeconds()).padStart(2, '0');
        
        if (formatString === 'yyyy-MM-dd') {
            return `${year}-${month}-${day}`;
        } else if (formatString === 'yyyy-MM-dd HH:mm:ss') {
            return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
        } else if (formatString === 'HH:mm') {
            return `${hours}:${minutes}`;
        }
        
        return dateObj.toISOString().split('T')[0];
    } catch (error) {
        return '';
    }
};

export const formatDateTime = (date: string | Date): string => {
    return formatDate(date, 'yyyy-MM-dd HH:mm:ss');
};

export const formatTime = (date: string | Date): string => {
    return formatDate(date, 'HH:mm');
};

/**
 * String Utilities
 */

export const capitalize = (str: string): string => {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export const truncate = (str: string, length: number = 50): string => {
    return str.length > length ? str.substring(0, length) + '...' : str;
};

/**
 * Number Utilities
 */

export const formatCurrency = (amount: number, currency: string = 'VND'): string => {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency,
    }).format(amount);
};

export const formatNumber = (num: number): string => {
    return new Intl.NumberFormat('vi-VN').format(num);
};

/**
 * Validation Utilities
 */

export const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

export const isValidPhone = (phone: string): boolean => {
    const phoneRegex = /^[0-9]{10,11}$/;
    return phoneRegex.test(phone.replace(/[\s-]/g, ''));
};

/**
 * Array Utilities
 */

export const uniqueBy = <T>(arr: T[], key: keyof T): T[] => {
    return [...new Map(arr.map(item => [item[key], item])).values()];
};

export const groupBy = <T>(arr: T[], key: keyof T): Record<string, T[]> => {
    return arr.reduce((acc, item) => {
        const groupKey = String(item[key]);
        if (!acc[groupKey]) {
            acc[groupKey] = [];
        }
        acc[groupKey].push(item);
        return acc;
    }, {} as Record<string, T[]>);
};

/**
 * Storage Utilities
 */

export const storage = {
    get: <T = any>(key: string): T | null => {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : null;
        } catch (error) {
            console.error('Error reading from localStorage:', error);
            return null;
        }
    },
    
    set: <T = any>(key: string, value: T): void => {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
            console.error('Error writing to localStorage:', error);
        }
    },
    
    remove: (key: string): void => {
        try {
            localStorage.removeItem(key);
        } catch (error) {
            console.error('Error removing from localStorage:', error);
        }
    },
    
    clear: (): void => {
        try {
            localStorage.clear();
        } catch (error) {
            console.error('Error clearing localStorage:', error);
        }
    },
};

/**
 * Debounce Utility
 */

export const debounce = <T extends (...args: any[]) => any>(
    func: T,
    delay: number
): ((...args: Parameters<T>) => void) => {
    let timeoutId: NodeJS.Timeout;
    
    return (...args: Parameters<T>) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func(...args), delay);
    };
};

/**
 * Error Handling
 */

export const getErrorMessage = (error: any): string => {
    if (typeof error === 'string') return error;
    if (error?.response?.data?.error) return error.response.data.error;
    if (error?.response?.data?.message) return error.response.data.message;
    if (error?.message) return error.message;
    return 'An unexpected error occurred';
};
