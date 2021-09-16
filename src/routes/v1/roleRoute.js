import { Router } from 'express';
import catchAsync from '~/utils/catchAsync';
import validate from '~/middlewares/validate';
import authenticate from '~/middlewares/authenticate';
import roleValidation from '~/validations/roleValidation';
import roleController from '~/controllers/roleController';

const router = Router();

router.get('/', authenticate('role:read'), validate(roleValidation.getRoles), catchAsync(roleController.getRoles));
router.post('/', authenticate('role:create'), validate(roleValidation.createRole), catchAsync(roleController.createRole));
router.get('/:roleId', authenticate('role:read'), validate(roleValidation.getRole), catchAsync(roleController.getRole));
router.put('/:roleId', authenticate('role:update'), validate(roleValidation.updateRole), catchAsync(roleController.updateRole));
router.delete(
	'/:roleId',
	authenticate('role:delete'),
	validate(roleValidation.deleteRole),
	catchAsync(roleController.deleteRole)
);

export default router;
