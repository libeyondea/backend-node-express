import { Router } from 'express';
import authRoute from './authRoute';
import userRoute from './userRoute';
import roleRoute from './roleRoute';

const router = Router();

router.use('/auth', authRoute);
router.use('/users', userRoute);
router.use('/roles', roleRoute);

export default router;
