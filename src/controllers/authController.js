import * as authService from '~/services/authService';
import * as tokenService from '~/services/tokenService';

export const signup = async (req, res) => {
	const user = await authService.signup(req.body);
	return res.json({
		success: true,
		data: user
	});
};

export const signin = async (req, res) => {
	const { userName, password } = req.body;
	const user = await authService.signinUserWithUserNameAndPassword(userName, password);
	const token = await tokenService.generateAuthToken(user);
	return res.json({
		success: true,
		data: {
			token
		}
	});
};

export const me = async (req, res) => {
	return res.json({
		success: true,
		data: {
			id: req.user.id,
			firstName: req.user.firstName,
			lastName: req.user.lastName,
			userName: req.user.userName,
			email: req.user.email,
			avatar: req.user.avatar,
			role: req.user.role
		}
	});
};
