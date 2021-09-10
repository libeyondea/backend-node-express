import mongoose from 'mongoose';
import { TOKEN_TYPES } from '~/config/env';
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
			enum: [TOKEN_TYPES.REFRESH, TOKEN_TYPES.RESET_PASSWORD, TOKEN_TYPES.VERIFY_EMAIL],
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
			expiresAt: expires.format(),
			blacklisted
		});
		return tokenDoc;
	}

	static async revokeToken(refreshToken) {
		const refreshTokenDoc = await this.findOne({ token: refreshToken, type: TOKEN_TYPES.REFRESH, blacklisted: false });
		if (!refreshTokenDoc) {
			throw new APIError('Token not found', 400, true);
		}
		await refreshTokenDoc.remove();
	}
}

tokenSchema.loadClass(TokenClass);

export default mongoose.model('tokens', tokenSchema);
