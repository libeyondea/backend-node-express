import { Router } from 'express';
import catchAsync from '~/utils/catchAsync';
import validate from '~/middlewares/validate';
import authenticate from '~/middlewares/authenticate';
import * as userValidation from '~/validations/userValidation';
import * as userController from '~/controllers/userController';

const router = Router();

router.get('/', authenticate(['read', 'user']), validate(userValidation.getUsers), catchAsync(userController.getUsers));
router.post('/', authenticate(['create', 'user']), validate(userValidation.createUser), catchAsync(userController.createUser));
router.get('/:userId', authenticate(['read', 'user']), validate(userValidation.getUser), catchAsync(userController.getUser));
router.put(
	'/:userId',
	authenticate(['update', 'user']),
	validate(userValidation.updateUser),
	catchAsync(userController.updateUser)
);
router.delete(
	'/:userId',
	authenticate(['delete', 'user']),
	validate(userValidation.deleteUser),
	catchAsync(userController.deleteUser)
);

export default router;
