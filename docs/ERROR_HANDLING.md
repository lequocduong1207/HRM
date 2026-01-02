# Error Handling Guide

## 📋 **Tổng quan**

Hệ thống error handling đã được cải tiến để:
- ✅ **Bảo mật**: Không expose stack trace ra client
- ✅ **Logging**: Log errors với logger utility có màu sắc rõ ràng
- ✅ **Phân loại**: Phân biệt operational errors vs programming errors
- ✅ **Environment-aware**: Xử lý khác nhau giữa development và production

---

## 🔐 **Cải tiến Bảo mật**

### **Trước đây (KHÔNG AN TOÀN):**
```typescript
// ❌ BAD: Expose stack trace to client
res.json({
    error: err.message,
    stack: err.stack  // Leak file paths, code structure!
});
```

### **Hiện tại (AN TOÀN):**
```typescript
// ✅ GOOD: Log stack trace in server, send clean response to client
logger.error('Error occurred', err);  // Stack logged in server only

res.json({
    success: false,
    error: err.message,  // Clean message only
    statusCode: 400
});
```

---

## 📊 **Error Types**

### **1. Operational Errors (Expected)**
Lỗi dự đoán được và có thể xử lý:

```typescript
// Invalid user input
throw new AppError('Invalid email format', 400);

// Resource not found
throw new AppError('User not found', 404);

// Authentication failed
throw new AppError('Invalid credentials', 401);

// Permission denied
throw new AppError('Access denied', 403);
```

### **2. Programming Errors (Unexpected)**
Lỗi không dự đoán được (bugs):

```typescript
// Null pointer, undefined variable, syntax errors, etc.
// These are caught by error handler and logged as critical
```

---

## 🛠️ **Sử dụng AppError Class**

### **Tạo Custom Errors:**

```typescript
import { AppError } from '../middlewares/error/error-handler.middleware.js';

// Bad Request (400)
throw new AppError('Invalid input data', 400);

// Unauthorized (401)
throw new AppError('Please log in to continue', 401);

// Forbidden (403)
throw new AppError('You do not have permission', 403);

// Not Found (404)
throw new AppError('Resource not found', 404);

// Conflict (409)
throw new AppError('Email already exists', 409);

// Internal Server Error (500)
throw new AppError('Database connection failed', 500);
```

### **Trong Controllers:**

```typescript
// Example: Get user by ID
const getUser = async (req: Request, res: Response, next: NextFunction) => {
    const user = await userService.getUserById(req.params.id);
    
    if (!user) {
        // This will be caught by asyncHandler and passed to errorHandler
        throw new AppError('User not found', 404);
    }
    
    res.json({ success: true, data: user });
};

export default asyncHandler(getUser);
```

---

## 📝 **Logging với Logger Utility**

### **Import Logger:**

```typescript
import { logger } from '../utills/logger.js';
```

### **Log Levels:**

```typescript
// Error - Critical issues
logger.error('Database connection failed', error, { 
    host: 'localhost',
    port: 27017 
});

// Warning - Non-critical issues
logger.warn('Deprecated API endpoint used', { 
    endpoint: '/api/old',
    userId: '123' 
});

// Info - General information
logger.info('User logged in', { 
    userId: '123',
    ip: req.ip 
});

// Debug - Detailed debugging (only in development)
logger.debug('Cache hit', { 
    key: 'user:123',
    ttl: 3600 
});

// Request - Log HTTP requests
logger.request('GET', '/api/users', 200, 45); // method, url, status, duration
```

### **Logger Features:**

- ✅ **Colorized output** - Dễ đọc trong terminal
- ✅ **Timestamp** - ISO 8601 format
- ✅ **Conditional stack traces** - Chỉ khi `SHOW_STACK_TRACE=true`
- ✅ **Environment-aware** - Debug chỉ chạy trong development
- ✅ **Structured data** - JSON format cho data objects

---

## 🌍 **Environment Configuration**

### **.env File:**

```bash
# Set environment
NODE_ENV=development  # or 'production'

# Control stack trace visibility (development only!)
SHOW_STACK_TRACE=false  # Set to 'true' only when debugging

# Never enable SHOW_STACK_TRACE in production!
```

### **Behavior by Environment:**

| Feature | Development | Production |
|---------|------------|------------|
| Error message | ✅ Detailed | ✅ Generic/Specific |
| Error name | ✅ Included | ❌ Hidden |
| Stack trace to client | ❌ Never | ❌ Never |
| Stack trace to logs | ✅ If enabled | ❌ Never |
| Request context | ✅ Full | ⚠️ Limited |

---

## 🎯 **Xử lý các loại Errors**

### **1. Mongoose Errors**

```typescript
// CastError (Invalid ObjectId)
// Input: "invalid_id"
// Response: "Invalid _id: invalid_id"

// Duplicate Key Error
// Input: { email: "existing@email.com" }
// Response: "Duplicate field value: email = 'existing@email.com'"

// Validation Error
// Input: { age: -5 }
// Response: "Invalid input data. Age must be positive"
```

### **2. JWT Errors**

```typescript
// Invalid Token
// Response: "Invalid token. Please log in again!"

// Expired Token
// Response: "Your token has expired! Please log in again."
```

### **3. Custom Business Logic Errors**

```typescript
// Service layer
const deleteUser = async (userId: string) => {
    const user = await userRepository.findById(userId);
    
    if (!user) {
        throw new AppError('User not found', 404);
    }
    
    if (user.role === 'admin') {
        throw new AppError('Cannot delete admin users', 403);
    }
    
    return await userRepository.delete(userId);
};
```

---

## 🔍 **Debugging Errors**

### **Development Mode:**

1. **Enable stack traces:**
   ```bash
   # .env
   SHOW_STACK_TRACE=true
   ```

2. **Check terminal logs:**
   ```
   [2024-01-15T10:30:45.123Z] [ERROR] POST /api/users
   Error: User not found
   Stack: Error: User not found
       at getUserById (file:///d:/HRM/backend/src/services/user.service.ts:45:15)
       ...
   ```

3. **Check response:**
   ```json
   {
     "success": false,
     "error": "User not found",
     "statusCode": 404,
     "name": "AppError"
   }
   ```

### **Production Mode:**

1. **Monitor logs** - Use log aggregation service (ELK, Datadog, etc.)
2. **Set up alerts** - Email/Slack notifications for critical errors
3. **Track error metrics** - Error rate, response times, error types

---

## 🚀 **Best Practices**

### **DO:**

✅ **Always use AppError for operational errors**
```typescript
throw new AppError('Resource not found', 404);
```

✅ **Wrap async handlers**
```typescript
export default asyncHandler(myController);
```

✅ **Log errors with context**
```typescript
logger.error('Payment failed', err, { orderId, userId, amount });
```

✅ **Use meaningful error messages**
```typescript
throw new AppError('Email already registered. Please use a different email.', 409);
```

✅ **Validate input early**
```typescript
if (!email || !password) {
    throw new AppError('Email and password are required', 400);
}
```

### **DON'T:**

❌ **Never expose stack traces to clients**
```typescript
// BAD
res.json({ error: err.stack });
```

❌ **Never log sensitive data**
```typescript
// BAD
logger.error('Login failed', err, { password: req.body.password });
```

❌ **Don't use generic error messages**
```typescript
// BAD
throw new Error('Error');  // Use AppError instead!
```

❌ **Don't catch errors without handling**
```typescript
// BAD
try {
    // ...
} catch (err) {
    console.log(err);  // Use logger.error() instead!
}
```

---

## 🔧 **Testing Error Handling**

### **Test Operational Errors:**

```typescript
describe('User Controller', () => {
    it('should return 404 when user not found', async () => {
        const res = await request(app)
            .get('/api/users/invalid_id')
            .expect(404);
        
        expect(res.body.success).toBe(false);
        expect(res.body.error).toContain('Invalid _id');
    });
});
```

### **Test Error Logging:**

```typescript
it('should log errors correctly', async () => {
    const logSpy = jest.spyOn(logger, 'error');
    
    await request(app)
        .post('/api/users')
        .send({ invalid: 'data' })
        .expect(400);
    
    expect(logSpy).toHaveBeenCalled();
});
```

---

## 📈 **Monitoring & Alerting**

### **Recommended Tools:**

1. **Sentry** - Error tracking and monitoring
2. **Datadog** - APM and log aggregation
3. **Winston/Pino** - Production-grade logging
4. **ELK Stack** - Elasticsearch, Logstash, Kibana

### **Metrics to Track:**

- Error rate (errors/minute)
- Error types distribution
- Response time by endpoint
- Failed authentication attempts
- 5xx vs 4xx errors ratio

---

## 🛡️ **Security Checklist**

- [x] Stack traces không bao giờ được gửi đến client
- [x] Logs không chứa passwords, tokens, hoặc PII
- [x] Production errors được log ra file/service, không console
- [x] Generic error messages cho programming errors
- [x] Rate limiting cho authentication endpoints
- [x] Input validation trước khi xử lý
- [x] HTTPS được bật trong production
- [x] Environment variables được bảo vệ
- [ ] Log rotation được cấu hình (TODO)
- [ ] Error monitoring service được tích hợp (TODO)

---

## 📚 **Tài liệu tham khảo**

- [Express Error Handling](https://expressjs.com/en/guide/error-handling.html)
- [Node.js Error Best Practices](https://nodejs.org/en/docs/guides/error-handling)
- [OWASP Error Handling](https://cheatsheetseries.owasp.org/cheatsheets/Error_Handling_Cheat_Sheet.html)
