import { Router } from 'express';
import catchAsync from '~/utils/catchAsync';
import validate from '~/middlewares/validate';
import authenticate from '~/middlewares/authenticate';
import * as authValidation from '~/validations/authValidation';
import * as userValidation from '~/validations/userValidation';
import * as authController from '~/controllers/authController';
import * as userController from '~/controllers/userController';

const router = Router();

router.post('/auth/signup', authValidation.signup, validate, catchAsync(authController.signup));

router.post('/auth/signin', authValidation.signin, validate, catchAsync(authController.signin));

router.get('/auth/me', authenticate(), catchAsync(authController.me));

router.get('/users', authenticate('admin'), userValidation.getUsers, validate, catchAsync(userController.getUsers));

router.post('/users', authenticate('admin'), userValidation.createUser, validate, catchAsync(userController.createUser));

router.get('/users/:user_id', authenticate('admin'), userValidation.getUser, validate, catchAsync(userController.getUser));

router.put('/users/:user_id', authenticate('admin'), userValidation.updateUser, validate, catchAsync(userController.updateUser));

router.delete(
	'/users/:user_id',
	authenticate('admin'),
	userValidation.deleteUser,
	validate,
	catchAsync(userController.deleteUser)
);

export default router;
