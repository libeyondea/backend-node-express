import { Router } from 'express';
import catchAsync from '~/utils/catchAsync';
import validate from '~/middlewares/validate';
import authenticate from '~/middlewares/authenticate';
import * as authValidation from '~/validations/authValidation';
import * as authController from '~/controllers/authController';

const router = Router();

router.post('/setup', catchAsync(authController.setup));
router.post('/signup', authValidation.signup, validate, catchAsync(authController.signup));
router.post('/signin', authValidation.signin, validate, catchAsync(authController.signin));
router.get('/me', authenticate(), catchAsync(authController.me));
router.post('/logout', authValidation.logout, validate, catchAsync(authController.logout));
router.post('/refresh-tokens', authValidation.refreshTokens, validate, catchAsync(authController.refreshTokens));

export default router;
