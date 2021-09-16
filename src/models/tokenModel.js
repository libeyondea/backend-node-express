import httpStatus from 'http-status';
import mongoose from 'mongoose';
import config from '~/config/config';
import APIError from '~/utils/apiError';
import toJSON from './plugins/toJSONPlugin';

const tokenSchema = mongoose.Schema(
	{
		user: {
			type: mongoose.SchemaTypes.ObjectId,
			ref: 'users',
			required: true
		},
		token: {
			type: String,
			required: true,
			index: true
		},
		type: {
			type: String,
			enum: [config.TOKEN_TYPES.REFRESH, config.TOKEN_TYPES.RESET_PASSWORD, config.TOKEN_TYPES.VERIFY_EMAIL],
			required: true
		},
		blacklisted: {
			type: Boolean,
			default: false
		},
		expiresAt: {
			type: Date,
			required: true
		}
	},
	{
		timestamps: true
	}
);

tokenSchema.plugin(toJSON);

class TokenClass {
	static async saveToken(token, userId, expires, type, blacklisted = false) {
		const tokenDoc = await this.create({
			user: userId,
			token,
			type,
			expiresAt: expires,
			blacklisted
		});
		return tokenDoc;
	}

	static async revokeToken(token, type) {
		const tokenDoc = await this.findOne({ token: token, type: type, blacklisted: false });
		if (!tokenDoc) {
			throw new APIError('Token not found', httpStatus.BAD_REQUEST);
		}
		await tokenDoc.remove();
	}
}

tokenSchema.loadClass(TokenClass);

const Token = mongoose.model('tokens', tokenSchema);

export default Token;
