const paginate = (schema) => {
	schema.statics.paginate = async function (filters, options) {
		const sortBy = options.sortBy ? options.sortBy : 'createdAt';
		const sortDirection = options.sortDirection && options.sortDirection === 'asc' ? 'asc' : 'desc';
		const page = options.page && parseInt(options.page) > 0 ? parseInt(options.page) : 1;
		const limit = options.limit && parseInt(options.limit) > 0 ? parseInt(options.limit) : 10;
		const skip = (page - 1) * limit;
		const q = filters.q || '';
		const query = {
			$or: [
				{
					firstName: {
						$regex: q,
						$options: 'i'
					}
				},
				{
					lastName: {
						$regex: q,
						$options: 'i'
					}
				},
				{
					userName: {
						$regex: q,
						$options: 'i'
					}
				}
			]
		};
		const countPromise = this.countDocuments(query).exec();
		const docsPromise = this.find(query)
			.sort({ [sortBy]: sortDirection })
			.skip(skip)
			.limit(limit)
			.exec();
		return Promise.all([countPromise, docsPromise]).then((values) => {
			const [totalResults, results] = values;
			const result = {
				results,
				totalResults
			};
			return Promise.resolve(result);
		});
	};
};

export default paginate;
