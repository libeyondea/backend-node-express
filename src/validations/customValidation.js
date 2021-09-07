export const mongoId = (value, helpers) => {
	if (!value.match(/^(0x|0h)?[0-9A-F]{24}$/i)) {
		return helpers.message('{{#label}} must be a valid mongo id');
	}
	return value;
};
