import { Router } from 'express';
import userValidate from '~/validation/user';
import authController from '~/controllers/authController';
import authenticate from '~/config/authenticate';

const router = Router();

router.post('/users/signup', userValidate.signup, authController.signup);

router.post('/users/signin', userValidate.signin, authController.signin);

router.get('/users/me', authenticate, authController.me);

export default router;
