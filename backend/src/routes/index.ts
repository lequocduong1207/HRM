import { Router } from 'express';
import apiV1Routes from './v1/index.js';

const router = Router();

router.use('/v1', apiV1Routes);

export default router;