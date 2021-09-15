import { Router } from 'express';
import catchAsync from '~/utils/catchAsync';
import validate from '~/middlewares/validate';
import authenticate from '~/middlewares/authenticate';
import * as userValidation from '~/validations/userValidation';
import * as userController from '~/controllers/userController';

const router = Router();

router.get('/', authenticate('user:read'), validate(userValidation.getUsers), catchAsync(userController.getUsers));
router.post('/', authenticate('user:create'), validate(userValidation.createUser), catchAsync(userController.createUser));
router.get('/:userId', authenticate('user:read'), validate(userValidation.getUser), catchAsync(userController.getUser));
router.put('/:userId', authenticate('user:update'), validate(userValidation.updateUser), catchAsync(userController.updateUser));
router.delete(
	'/:userId',
	authenticate('user:delete'),
	validate(userValidation.deleteUser),
	catchAsync(userController.deleteUser)
);

export default router;
