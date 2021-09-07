import mongoose from 'mongoose';
import paginate from './plugins/paginatePlugin';
import toJSON from './plugins/toJSONPlugin';

const roleSchema = mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
			unique: true
		},
		description: {
			type: String,
			default: ''
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
roleSchema.plugin(paginate);

roleSchema.statics.isNameAlreadyExists = async function (name, excludeUserId) {
	return !!(await this.findOne({ name, _id: { $ne: excludeUserId } }));
};

export default mongoose.model('roles', roleSchema);
