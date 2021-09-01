import { body } from 'express-validator';

export const signup = [
	body('first_name')
		.isString()
		.notEmpty()
		.withMessage('First name is required')
		.isLength({ min: 2, max: 66 })
		.withMessage('First name must be between 2 to 66 char'),
	body('last_name')
		.isString()
		.notEmpty()
		.withMessage('Last name is required')
		.isLength({ min: 2, max: 66 })
		.withMessage('Last name must be between 2 to 66 chars'),
	body('user_name')
		.isString()
		.notEmpty()
		.withMessage('User name is required')
		.isLength({ min: 6, max: 66 })
		.withMessage('User name must be between 6 to 66 chars')
		.matches(/^(?![_.-])(?!.*[_.-]{2})[a-zA-Z0-9._-]+(?<![_.-])$/)
		.withMessage('User name is invalid'),
	body('email').isString().notEmpty().withMessage('Email is required').isEmail().withMessage('Email is invalid'),
	body('password')
		.isString()
		.trim()
		.notEmpty()
		.withMessage('Password is required')
		.isLength({ min: 6, max: 66 })
		.withMessage('Password must be between 6 to 66 chars')
];

export const signin = [
	body('user_name').isString().notEmpty().withMessage('User name is required'),
	body('password').isString().notEmpty().withMessage('Password is required')
];
