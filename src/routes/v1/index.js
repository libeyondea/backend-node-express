import { Router } from 'express';
import authRoute from './authRoute';
import userRoute from './userRoute';
import docsRoute from './docsRoute';

const router = Router();

router.use('/auth', authRoute);
router.use('/users', userRoute);
router.use('/docs', docsRoute);

export default router;
