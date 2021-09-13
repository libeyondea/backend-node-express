class APIError extends Error {
	constructor(message, status, isOperational = true) {
		super(message);
		this.name = this.constructor.name;
		this.status = status;
		this.isOperational = isOperational;
		Error.captureStackTrace(this, this.constructor);
	}
}

export default APIError;
