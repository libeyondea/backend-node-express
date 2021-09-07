import { Router } from 'express';
import catchAsync from '~/utils/catchAsync';
import validate from '~/middlewares/validate';
import authenticate from '~/middlewares/authenticate';
import * as authValidation from '~/validations/authValidation';
import * as authController from '~/controllers/authController';

const router = Router();

router.post('/setup', catchAsync(authController.setup));

router.post('/signup', validate(authValidation.signup), catchAsync(authController.signup));
router.post('/signin', validate(authValidation.signin), catchAsync(authController.signin));
router.get('/me', authenticate(), catchAsync(authController.me));
router.post('/logout', validate(authValidation.logout), catchAsync(authController.logout));
router.post('/refresh-tokens', validate(authValidation.refreshTokens), catchAsync(authController.refreshTokens));

export default router;
