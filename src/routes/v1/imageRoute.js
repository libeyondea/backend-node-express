import { Router } from 'express';
import catchAsync from '~/utils/catchAsync';
import imageController from '~/controllers/imageController';
import uploadImage from '~/middlewares/uploadImage';
import authenticate from '~/middlewares/authenticate';

const router = Router();

router.post('/upload', /* authenticate(), */ /* uploadImage, */ catchAsync(imageController.uploadImage));

export default router;
