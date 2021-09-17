import multer from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import APIError from '~/utils/apiError';
import fs from 'fs';
import httpStatus from 'http-status';

const storage = multer.diskStorage({
	destination: (req, file, callback) => {
		const dir = 'public/images';
		if (!fs.existsSync(dir)) {
			fs.mkdirSync(dir, { recursive: true });
		}
		callback(null, dir);
	},
	filename: (req, file, callback) => {
		callback(null, uuidv4() + path.extname(file.originalname));
	}
});

const upload = multer({
	storage: storage,
	limits: {
		fileSize: 6 * 1024 * 1024
	},
	fileFilter: (req, file, callback) => {
		var ext = path.extname(file.originalname);
		if (ext !== '.png' && ext !== '.jpg' && ext !== '.gif' && ext !== '.jpeg') {
			return callback(new APIError('File image unsupported', httpStatus.BAD_REQUEST));
		}
		callback(null, true);
	}
}).single('image');

const uploadImage = (req, res, next) => {
	let test = 1;
	if (test === 1) {
		return next(new APIError(httpStatus[httpStatus.UNAUTHORIZED], httpStatus.UNAUTHORIZED));
	}
	upload(req, res, (err) => {
		if (err instanceof multer.MulterError) {
			return next(new APIError(err.message, httpStatus.BAD_REQUEST));
		} else if (err) {
			return next(err);
		}
		return next();
	});
};

export default uploadImage;
