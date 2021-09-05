import { NODE_ENV } from '~/config/env';
import httpStatus from 'http-status';
import logger from '~/config/logger';
import APIError from '~/utils/apiError';

export const converter = (err, req, res, next) => {
	if (!(err instanceof APIError)) {
		const apiError = new APIError(err.message, err.status, err.isPublic);
		return next(apiError);
	}
	return next(err);
};

export const notFound = (req, res, next) => {
	return next(new APIError(httpStatus[404], 404, true));
};

export const handler = (err, req, res, next) => {
	logger.error(`${err.status} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
	return res.status(err.status).json({
		errors: err.isPublic ? err.message : httpStatus[err.status],
		...(NODE_ENV === 'development' && { stack: err.stack })
	});
};
