import APIError from '~/utils/apiError';
import User from '~/models/user';

export const queryUsers = async (filters, options) => {
	return await User.paginate(filters, options);
};

export const getUserById = async (id) => {
	return await User.findById(id);
};

export const getUserByUserName = async (user_name) => {
	return await User.findOne({ user_name });
};

export const getUserByEmail = async (email) => {
	return await User.findOne({ email });
};

export const createUser = async (body) => {
	if (await User.isUserNameAlreadyExists(body.user_name)) {
		throw new APIError('User name already exists', 422, true);
	}
	if (await User.isEmailAlreadyExists(body.email)) {
		throw new APIError('Email already exists', 422, true);
	}
	const user = {
		first_name: body.first_name,
		last_name: body.last_name,
		user_name: body.user_name,
		email: body.email,
		password: body.password,
		role: body.role
	};
	return await User.create(user);
};

export const updateUserById = async (user_id, body) => {
	const user = await getUserById(user_id);
	if (!user) {
		throw new APIError('User not found', 404, true);
	}
	if (await User.isUserNameAlreadyExists(body.user_name, user_id)) {
		throw new APIError('User name already exists', 422, true);
	}
	if (await User.isEmailAlreadyExists(body.email, user_id)) {
		throw new APIError('Email already exists', 422, true);
	}
	if (body.password) {
		user.password = body.password;
	}
	user.first_name = body.first_name;
	user.last_name = body.last_name;
	user.user_name = body.user_name;
	user.email = body.email;
	user.role = body.role;
	return await user.save();
};

export const deleteUserById = async (user_id) => {
	const user = await getUserById(user_id);
	if (!user) {
		throw new APIError('User not found', 404, true);
	}
	return await user.remove();
};
