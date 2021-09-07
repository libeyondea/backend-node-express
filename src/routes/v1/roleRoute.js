import { Router } from 'express';
import catchAsync from '~/utils/catchAsync';
import validate from '~/middlewares/validate';
import authenticate from '~/middlewares/authenticate';
import * as roleValidation from '~/validations/roleValidation';
import * as roleController from '~/controllers/roleController';

const router = Router();

router.get('/', authenticate(['read', 'role']), validate(roleValidation.getRoles), catchAsync(roleController.getRoles));
router.post('/', authenticate(['create', 'role']), validate(roleValidation.createRole), catchAsync(roleController.createRole));
router.get('/:roleId', authenticate(['read', 'role']), validate(roleValidation.getRole), catchAsync(roleController.getRole));
router.put(
	'/:roleId',
	authenticate(['update', 'role']),
	validate(roleValidation.updateRole),
	catchAsync(roleController.updateRole)
);
router.delete(
	'/:roleId',
	authenticate(['delete', 'role']),
	validate(roleValidation.deleteRole),
	catchAsync(roleController.deleteRole)
);

export default router;
