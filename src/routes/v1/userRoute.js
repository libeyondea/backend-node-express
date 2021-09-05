import { Router } from 'express';
import catchAsync from '~/utils/catchAsync';
import validate from '~/middlewares/validate';
import authenticate from '~/middlewares/authenticate';
import * as userValidation from '~/validations/userValidation';
import * as userController from '~/controllers/userController';

const router = Router();

router.get('/', authenticate(['read', 'user']), userValidation.getUsers, validate, catchAsync(userController.getUsers));
router.post('/', authenticate(['create', 'user']), userValidation.createUser, validate, catchAsync(userController.createUser));
router.get('/:userId', authenticate(['read', 'user']), userValidation.getUser, validate, catchAsync(userController.getUser));
router.put(
	'/:userId',
	authenticate(['update', 'user']),
	userValidation.updateUser,
	validate,
	catchAsync(userController.updateUser)
);
router.delete(
	'/:userId',
	authenticate(['delete', 'user']),
	userValidation.deleteUser,
	validate,
	catchAsync(userController.deleteUser)
);

export default router;
