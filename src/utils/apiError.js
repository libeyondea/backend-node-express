class ExtendableError extends Error {
	constructor(message, status, isPublic) {
		super(message);
		this.name = this.constructor.name;
		this.message = message;
		this.status = status;
		this.isPublic = isPublic;
		this.isOperational = true; // This is required since bluebird 4 doesn't append it anymore.
		Error.captureStackTrace(this, this.constructor.name);
	}
}

export default class APIError extends ExtendableError {
	constructor(message, status = 500, isPublic = false) {
		super(message, status, isPublic);
	}
}
