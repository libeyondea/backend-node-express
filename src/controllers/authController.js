import * as authService from '~/services/authService';
import * as tokenService from '~/services/tokenService';

export const signup = async (req, res) => {
	const user = await authService.signup(req.body);
	const tokens = await tokenService.generateAuthTokens(user);
	return res.json({
		success: true,
		data: { user, tokens }
	});
};

export const signin = async (req, res) => {
	const { userName, password } = req.body;
	const user = await authService.signinWithUserNameAndPassword(userName, password);
	const tokens = await tokenService.generateAuthTokens(user);
	return res.json({
		success: true,
		data: { user, tokens }
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

export const logout = async (req, res) => {
	await authService.logout(req.body.refreshToken);
	return res.json({
		success: true,
		data: {}
	});
};

export const refreshTokens = async (req, res) => {
	const tokens = await authService.refreshTokens(req.body.refreshToken);
	return res.json({
		success: true,
		data: {
			tokens
		}
	});
};
