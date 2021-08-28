import { check } from 'express-validator';
import User from '~/models/User';

const userValidate = {
	signup: [
		check('first_name')
			.notEmpty()
			.withMessage('First name is required')
			.isLength({ min: 6, max: 66 })
			.withMessage('First name must be between 2 to 66 char'),
		check('last_name', 'Last name is required').notEmpty(),
		check('last_name', 'Last name must be between 2 to 66 chars').isLength({ min: 6, max: 66 }),
		check('user_name', 'User name is required').notEmpty(),
		check('user_name', 'User name must be between 2 to 66 chars').isLength({ min: 6, max: 66 }),
		check('user_name').custom(async (value) => {
			const user = await User.findOne({
				user_name: value
			});
			if (user) {
				return Promise.reject('User name already exists');
			}
		}),
		check('email', 'Email is required').notEmpty(),
		check('email', 'Email is invalid').isEmail(),
		check('email').custom(async (value) => {
			const user = await User.findOne({
				email: value
			});
			if (user) {
				return Promise.reject('Email already exists');
			}
		}),
		check('password', 'Password is required').notEmpty(),
		check('password', 'Password must be between 2 to 66 chars').isLength({ min: 6, max: 66 }),
		check('password_confirm').custom((value, { req }) => {
			if (value !== req.body.password) {
				throw new Error('Password confirmation does not match password');
			}
			return true;
		})
	],
	signin: [
		check('user_name', 'User name is required').notEmpty(),
		check('user_name', 'User name must be between 2 to 66 chars').isLength({ min: 6, max: 66 }),
		check('password', 'Password is required').notEmpty(),
		check('password', 'Password must be between 2 to 66 chars').isLength({ min: 6, max: 66 })
	]
};

export default userValidate;
