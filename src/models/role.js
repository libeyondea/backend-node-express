import mongoose from 'mongoose';
import toJSON from './plugins/toJSONPlugin';

const roleSchema = mongoose.Schema(
	{
		name: {
			type: String,
			required: true
		},
		description: {
			type: String
		},
		permissions: [
			{
				type: mongoose.SchemaTypes.ObjectId,
				ref: 'permissions'
			}
		]
	},
	{
		timestamps: true
	}
);

roleSchema.plugin(toJSON);

export default mongoose.model('roles', roleSchema);
