import gravatar from 'gravatar';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '~/models/User';
import { validationResult } from 'express-validator';
import { SECRET_KEY } from '~/config/env';
import { APIError } from '~/config/errors';
import httpStatus from 'http-status';

const authController = {
	signup: async (req, res, next) => {
		try {
			const errors = validationResult(req);

			if (!errors.isEmpty()) {
				throw new APIError(errors.array({ onlyFirstError: true }), 422, true);
			}

			const avatar = gravatar.url(req.body.email, {
				s: '200',
				r: 'pg',
				d: 'mm'
			});

			const passwordGenSalt = bcrypt.genSaltSync(10);

			const passwordHash = bcrypt.hashSync(req.body.password, passwordGenSalt);

			const user = new User({
				first_name: req.body.first_name,
				last_name: req.body.last_name,
				user_name: req.body.user_name,
				email: req.body.email,
				password: passwordHash,
				avatar
			});

			await user.save();

			return res.json({
				success: true,
				data: user
			});
		} catch (err) {
			next(err);
		}
	},
	signin: async (req, res, next) => {
		try {
			const errors = validationResult(req);

			if (!errors.isEmpty()) {
				throw new APIError(errors.array(), 422, true);
			}

			const user_name = req.body.user_name;
			const password = req.body.password;

			const user = await User.findOne({ user_name }).exec();

			if (!user) {
				throw new APIError('Incorrect user name or password', 422, true);
			}

			const isMatch = bcrypt.compareSync(password, user.password);

			if (!isMatch) {
				throw new APIError('Incorrect user name or password', 422, true);
			}

			const payload = {
				id: user.id,
				first_name: user.first_name,
				last_name: user.last_name,
				user_name: user.user_name,
				avatar: user.avatar
			};

			const accessToken = jwt.sign(payload, SECRET_KEY, { expiresIn: 3600 });

			if (accessToken) {
				return res.json({
					success: true,
					data: {
						access_token: accessToken
					}
				});
			}
		} catch (err) {
			return next(err);
		}
	},
	me: async (req, res, next) => {
		try {
			return res.json({
				success: true,
				data: {
					id: req.user.id,
					first_name: req.user.first_name,
					last_name: req.user.last_name,
					user_name: req.user.user_name,
					email: req.user.email
				}
			});
		} catch (err) {
			next(err);
		}
	}
};

export default authController;
