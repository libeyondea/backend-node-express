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
	const { user_name, password } = req.body;
	const user = await authService.signinUserWithUserNameAndPassword(user_name, password);
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
			first_name: req.user.first_name,
			last_name: req.user.last_name,
			user_name: req.user.user_name,
			email: req.user.email,
			avatar: req.user.avatar,
			role: req.user.role
		}
	});
};
