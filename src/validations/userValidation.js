import { body, param, query } from 'express-validator';

export const createUser = [
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
		.notEmpty()
		.withMessage('Password is required')
		.isLength({ min: 6, max: 66 })
		.withMessage('Password must be between 6 to 66 chars'),
	body('role')
		.isString()
		.notEmpty()
		.withMessage('Role is required')
		.isIn(['admin', 'user'])
		.withMessage('Role must be `user` or `admin`')
];

export const getUsers = [
	query('q').isString().withMessage('Search field must be a string').optional({ nullable: true }),
	query('limit').isInt().withMessage('Limit must be a integer').optional({ nullable: true }),
	query('page').isInt().withMessage('Page must be a integer').optional({ nullable: true }),
	query('sort_by').isString().withMessage('Sort by must be a string').optional({ nullable: true }),
	query('sort_direction').isString().withMessage('Sort direction must be a string').optional({ nullable: true })
];

export const getUser = [
	param('user_id').isString().withMessage('User id must be a string').isMongoId().withMessage('User id must be a valid mongo id')
];

export const updateUser = [
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
		.withMessage('User name must be between 6 to 66 chars'),
	body('email').isString().notEmpty().withMessage('Email is required').isEmail().withMessage('Email is invalid'),
	body('password')
		.isString()
		.trim()
		.isLength({ min: 6, max: 66 })
		.withMessage('Password must be between 6 to 66 chars')
		.optional({ nullable: true, checkFalsy: true }),
	body('role')
		.isString()
		.notEmpty()
		.withMessage('Role is required')
		.isIn(['admin', 'user'])
		.withMessage('Role must be `user` or `admin`')
];

export const deleteUser = [
	param('user_id').isString().withMessage('User id must be a string').isMongoId().withMessage('User id must be a valid mongo id')
];
