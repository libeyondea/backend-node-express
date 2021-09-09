import APIError from '~/utils/apiError';
import User from '~/models/user';
import Role from '~/models/role';

export const getUsers = async (filters, options) => {
	const users = await User.paginate(filters, options, ['firstName', 'lastName', 'userName']);
	return users;
};

export const getUserById = async (id) => {
	const user = await User.findById(id);
	return user;
};

export const getUserByUserName = async (userName) => {
	const user = await User.findOne({ userName });
	return user;
};

export const getUserByEmail = async (email) => {
	const user = await User.findOne({ email });
	return user;
};

export const createUser = async (body) => {
	if (await User.isUserNameAlreadyExists(body.userName)) {
		throw new APIError('User name already exists', 400, true);
	}
	if (await User.isEmailAlreadyExists(body.email)) {
		throw new APIError('Email already exists', 400, true);
	}
	const roles = [];
	await Promise.all(
		body.roles.map(async (rid) => {
			if (await Role.findById(rid)) {
				roles.push(rid);
			}
		})
	);
	body.roles = roles;
	const newUser = await User.create(body);
	return newUser;
};

export const updateUserById = async (userId, body) => {
	const user = await getUserById(userId);
	if (!user) {
		throw new APIError('User not found', 404, true);
	}
	if (await User.isUserNameAlreadyExists(body.userName, userId)) {
		throw new APIError('User name already exists', 400, true);
	}
	if (await User.isEmailAlreadyExists(body.email, userId)) {
		throw new APIError('Email already exists', 400, true);
	}
	if (body.roles) {
		const roles = [];
		await Promise.all(
			body.roles.map(async (rid) => {
				if (await Role.findById(rid)) {
					roles.push(rid);
				}
			})
		);
		body.roles = roles;
	}
	Object.assign(user, body);
	const updateUser = await user.save();
	return updateUser;
};

export const deleteUserById = async (userId) => {
	const user = await getUserById(userId);
	if (!user) {
		throw new APIError('User not found', 404, true);
	}
	const deleteUser = await user.remove();
	return deleteUser;
};
