const paginate = (schema) => {
	schema.statics.paginate = async function paginateFunc(filters, options, searchFields = []) {
		const sortBy = options.sortBy ? options.sortBy : 'createdAt';
		const sortDirection = options.sortDirection && options.sortDirection === 'asc' ? 'asc' : 'desc';
		const page = options.page && parseInt(options.page, 10) > 0 ? parseInt(options.page, 10) : 1;
		const limit = options.limit && parseInt(options.limit, 10) > 0 ? parseInt(options.limit, 10) : 10;
		const skip = (page - 1) * limit;
		const q = filters.q || '';
		const searchFieldsArr = searchFields.map((f) => {
			return {
				[f]: {
					$regex: q,
					$options: 'i'
				}
			};
		});
		const query = {
			$or: searchFieldsArr
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
