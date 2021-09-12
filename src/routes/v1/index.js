import { Router } from 'express';
import authRoute from './authRoute';
import userRoute from './userRoute';
import roleRoute from './roleRoute';
import imageRoute from './imageRoute';

const router = Router();

router.use('/auth', authRoute);
router.use('/users', userRoute);
router.use('/roles', roleRoute);
router.use('/images', imageRoute);

export default router;
