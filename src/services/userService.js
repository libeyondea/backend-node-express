import APIError from '~/utils/apiError';
import User from '~/models/user';

export const queryUsers = async (filters, options) => {
	return await User.paginate(filters, options);
};

export const getUserById = async (id) => {
	return await User.findById(id);
};

export const getUserByUserName = async (userName) => {
	return await User.findOne({ userName });
};

export const getUserByEmail = async (email) => {
	return await User.findOne({ email });
};

export const createUser = async (body) => {
	if (await User.isUserNameAlreadyExists(body.userName)) {
		throw new APIError('User name already exists', 422, true);
	}
	if (await User.isEmailAlreadyExists(body.email)) {
		throw new APIError('Email already exists', 422, true);
	}
	const user = {
		firstName: body.firstName,
		lastName: body.lastName,
		userName: body.userName,
		email: body.email,
		password: body.password,
		role: body.role
	};
	return await User.create(user);
};

export const updateUserById = async (userId, body) => {
	const user = await getUserById(userId);
	if (!user) {
		throw new APIError('User not found', 404, true);
	}
	if (await User.isUserNameAlreadyExists(body.userName, userId)) {
		throw new APIError('User name already exists', 422, true);
	}
	if (await User.isEmailAlreadyExists(body.email, userId)) {
		throw new APIError('Email already exists', 422, true);
	}
	if (body.password) {
		user.password = body.password;
	}
	user.firstName = body.firstName;
	user.lastName = body.lastName;
	user.userName = body.userName;
	user.email = body.email;
	user.role = body.role;
	return await user.save();
};

export const deleteUserById = async (userId) => {
	const user = await getUserById(userId);
	if (!user) {
		throw new APIError('User not found', 404, true);
	}
	return await user.remove();
};
