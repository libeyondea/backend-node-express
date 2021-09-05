import { Router } from 'express';
import authRoute from './authRoute';
import userRoute from './userRoute';

const router = Router();

router.use('/auth', authRoute);
router.use('/users', userRoute);

export default router;
