import * as userService from './userService';
import APIError from '~/utils/apiError';
import User from '~/models/user';

export const signinUserWithUserNameAndPassword = async (user_name, password) => {
	const user = await userService.getUserByUserName(user_name);
	if (!user || !(await user.isPasswordMatch(password))) {
		throw new APIError('Incorrect user name or password', 401, true);
	}
	return user;
};

export const signup = async (body) => {
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
		password: body.password
	};
	return await User.create(user);
};
