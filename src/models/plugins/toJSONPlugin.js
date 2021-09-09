function normalizeId(ret) {
	if (ret._id && typeof ret._id === 'object' && ret._id.toString) {
		if (typeof ret.id === 'undefined') {
			ret.id = ret._id.toString();
		}
	}
	if (typeof ret._id !== 'undefined') {
		delete ret._id;
	}
}

function removePrivatePaths(ret, schema) {
	for (const path in schema.paths) {
		if (schema.paths[path].options && schema.paths[path].options.private) {
			if (typeof ret[path] !== 'undefined') {
				delete ret[path];
			}
		}
	}
}

function removeVersion(ret) {
	if (typeof ret.__v !== 'undefined') {
		delete ret.__v;
	}
}

function toJSON(schema) {
	// NOTE: this plugin is actually called *after* any schema's
	// custom toJSON has been defined, so we need to ensure not to
	// overwrite it. Hence, we remember it here and call it later
	let transform;
	if (schema.options.toJSON && schema.options.toJSON.transform) {
		transform = schema.options.toJSON.transform;
	}

	// Extend toJSON options
	schema.options.toJSON = Object.assign(schema.options.toJSON || {}, {
		transform(doc, ret, options) {
			// Remove private paths
			if (schema.options.removePrivatePaths !== false) {
				removePrivatePaths(ret, schema);
			}

			// Remove version
			if (schema.options.removeVersion !== false) {
				removeVersion(ret);
			}

			// Normalize ID
			if (schema.options.normalizeId !== false) {
				normalizeId(ret);
			}

			// Call custom transform if present
			if (transform) {
				return transform(doc, ret, options);
			}

			return ret;
		}
	});
}

export default toJSON;
