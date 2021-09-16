const paginate = (schema) => {
	schema.statics.paginate = async function paginateFunc(options, populate, query) {
		const sortBy = options.sortBy ? options.sortBy : 'createdAt';
		const sortDirection = options.sortDirection && options.sortDirection === 'asc' ? 'asc' : 'desc';
		const page = options.page && parseInt(options.page, 10) > 0 ? parseInt(options.page, 10) : 1;
		const limit = options.limit && parseInt(options.limit, 10) > 0 ? parseInt(options.limit, 10) : 10;
		const skip = (page - 1) * limit;

		const countPromise = this.countDocuments(query).exec();
		let docsPromise = this.find(query)
			.sort({ [sortBy]: sortDirection })
			.skip(skip)
			.limit(limit);

		if (populate) {
			populate.split(' ').forEach((populate) => {
				docsPromise = docsPromise.populate(
					populate
						.split('.')
						.reverse()
						.reduce((a, b) => ({ path: b, populate: a }))
				);
			});
		}

		docsPromise = docsPromise.exec();

		const [totalResults, results] = await Promise.all([countPromise, docsPromise]);

		return {
			results,
			totalResults
		};
	};
};

export default paginate;
