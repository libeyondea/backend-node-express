import { validationResult } from 'express-validator';
import APIError from '~/utils/apiError';

const validate = (req, res, next) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return next(new APIError(errors.array({ onlyFirstError: true }), 422, true));
	}
	return next();
};

export default validate;
