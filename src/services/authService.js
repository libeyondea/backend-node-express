import * as userService from './userService';
import APIError from '~/utils/apiError';
import User from '~/models/user';

export const signinUserWithUserNameAndPassword = async (userName, password) => {
	const user = await userService.getUserByUserName(userName);
	if (!user || !(await user.isPasswordMatch(password))) {
		throw new APIError('Incorrect user name or password', 401, true);
	}
	return user;
};

export const signup = async (body) => {
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
		password: body.password
	};
	return await User.create(user);
};
