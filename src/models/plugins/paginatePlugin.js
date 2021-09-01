const paginate = (schema) => {
	schema.statics.paginate = async function (filters, options) {
		const sort_by = options.sort_by ? options.sort_by : 'created_at';
		const sort_direction = options.sort_direction && options.sort_direction === 'asc' ? 'asc' : 'desc';
		const page = options.page && parseInt(options.page) > 0 ? parseInt(options.page) : 1;
		const limit = options.limit && parseInt(options.limit) > 0 ? parseInt(options.limit) : 10;
		const skip = (page - 1) * limit;
		const q = filters.q || '';
		const query = {
			$or: [
				{
					first_name: {
						$regex: q,
						$options: 'i'
					}
				},
				{
					last_name: {
						$regex: q,
						$options: 'i'
					}
				},
				{
					user_name: {
						$regex: q,
						$options: 'i'
					}
				}
			]
		};
		const countPromise = this.countDocuments(query).exec();
		const docsPromise = this.find(query)
			.sort({ [sort_by]: sort_direction })
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
