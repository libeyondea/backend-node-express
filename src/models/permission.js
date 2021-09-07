import mongoose from 'mongoose';
import toJSON from './plugins/toJSONPlugin';

const permissionSchema = mongoose.Schema(
	{
		controller: {
			type: String,
			required: true
		},
		action: {
			type: String,
			required: true
		},
		enabled: {
			type: Boolean,
			default: true
		}
	},
	{
		timestamps: true
	}
);

permissionSchema.index({ controller: 1, action: 1 }, { unique: true });

permissionSchema.plugin(toJSON);

export default mongoose.model('permissions', permissionSchema);
