import { Router } from 'express';
import catchAsync from '~/utils/catchAsync';
import validate from '~/middlewares/validate';
import authenticate from '~/middlewares/authenticate';
import * as userValidation from '~/validations/userValidation';
import * as userController from '~/controllers/userController';

const router = Router();

router.get('/', authenticate('admin'), userValidation.getUsers, validate, catchAsync(userController.getUsers));
router.post('/', authenticate('admin'), userValidation.createUser, validate, catchAsync(userController.createUser));
router.get('/:userId', authenticate('admin'), userValidation.getUser, validate, catchAsync(userController.getUser));
router.put('/:userId', authenticate('admin'), userValidation.updateUser, validate, catchAsync(userController.updateUser));
router.delete('/:userId', authenticate('admin'), userValidation.deleteUser, validate, catchAsync(userController.deleteUser));

export default router;
