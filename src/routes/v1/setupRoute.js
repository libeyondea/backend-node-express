import { Router } from 'express';
import catchAsync from '~/utils/catchAsync';
import * as setupController from '~/controllers/setupController';

const router = Router();

router.post('/', catchAsync(setupController.setup));

export default router;
