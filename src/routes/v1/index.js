import { Router } from 'express';
import authRoute from './authRoute';
import userRoute from './userRoute';
import roleRoute from './roleRoute';
import setupRoute from './setupRoute';

const router = Router();

router.use('/setup', setupRoute);
router.use('/auth', authRoute);
router.use('/users', userRoute);
router.use('/roles', roleRoute);

export default router;
