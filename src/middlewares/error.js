import httpStatus from 'http-status';
import { NODE_ENV } from '~/config/env';
import logger from '~/config/logger';
import APIError from '~/utils/apiError';

export const converter = (err, req, res, next) => {
	if (!(err instanceof APIError)) {
		const status = err.status || httpStatus.INTERNAL_SERVER_ERROR;
		const message = err.message || httpStatus[status];
		const apiError = new APIError(message, status, false);
		apiError.stack = err.stack;
		return next(apiError);
	}
	return next(err);
};

export const notFound = (req, res, next) => {
	return next(new APIError(httpStatus[httpStatus.NOT_FOUND], httpStatus.NOT_FOUND));
};

export const handler = (err, req, res, next) => {
	let { status, message } = err;
	if (NODE_ENV === 'production' && !err.isOperational) {
		status = httpStatus.INTERNAL_SERVER_ERROR;
		message = httpStatus[httpStatus.INTERNAL_SERVER_ERROR];
	}
	if (NODE_ENV === 'development') {
		logger.error(err);
	}
	return res.status(status).json({
		errors: message,
		...(NODE_ENV === 'development' && { stack: err.stack })
	});
};
