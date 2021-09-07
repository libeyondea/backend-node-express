import APIError from '~/utils/apiError';
import User from '~/models/user';
import Role from '~/models/role';

export const getUsers = async (filters, options) => {
	return await User.paginate(filters, options, ['firstName', 'lastName', 'userName']);
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
		throw new APIError('User name already exists', 400, true);
	}
	if (await User.isEmailAlreadyExists(body.email)) {
		throw new APIError('Email already exists', 400, true);
	}
	let roles = [];
	await Promise.all(
		body.roles.map(async (rid) => {
			if (await Role.findById(rid)) {
				roles.push(rid);
			}
		})
	);
	body.roles = roles;
	return await User.create(body);
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
		let roles = [];
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
	return await user.save();
};

export const deleteUserById = async (userId) => {
	const user = await getUserById(userId);
	if (!user) {
		throw new APIError('User not found', 404, true);
	}
	return await user.remove();
};
