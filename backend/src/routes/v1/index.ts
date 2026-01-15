import { Router } from 'express';
import authRoutes from './auth.routes.js';
import employeeRoutes from './employee.routes.js';
import attendanceRoutes from './attendance.routes.js';
import departmentRoutes from './department.routes.js';
import userRoutes from './user.routes.js';
import auditRoutes from './audit.routes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/employees', employeeRoutes);
router.use('/attendances', attendanceRoutes);
router.use('/departments', departmentRoutes);
router.use('/audit-logs', auditRoutes);

export default router;