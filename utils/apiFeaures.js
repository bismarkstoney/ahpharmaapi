class APIFeatures {
	constructor(query, queryString) {
		this.query = query;
		this.queryString = queryString;
	}
	filter() {
		//Build a query
		const queryObj = { ...this.queryString };
		const excludeFields = ['page', 'sort', 'limit', 'fields', 'select'];
		excludeFields.forEach((el) => delete queryObj[el]);
		//to handle advance query
		// 1 Advance filtering
		let queryStr = JSON.stringify(queryObj);
		queryStr = queryStr.replace(
			/\b(gte|gt|lte|lt|in)\b/g,
			(match) => `$${match}`
		);
		console.log(JSON.parse(queryStr));
		this.query = this.query
			.find(JSON.parse(queryStr))
			.collation({ locale: 'en', strength: 2 });
		return this;
	}

	sort() {
		if (this.queryString.sort) {
			const sortBy = this.queryString.sort.split(',').join(' ');
			this.query = this.query.sort(sortBy);
		} else {
			this.query = this.query.sort('-createdAt');
		}
		return this;
	}

	limitFields() {
		if (this.queryString.select) {
			const fields = this.queryString.select.split(',').join(' ');
			this.query = this.query.select(fields);
		} else {
			this.query = this.query.select('-__v');
		}
		return this;
	}

	paginate() {
		const page = this.queryString.page * 1 || 1;
		const limit = this.queryString.limit * 1 || 100;
		const skip = (page - 1) * limit;
		this.query = this.query.skip(skip).limit(limit);

		return this;
	}
}

module.exports = APIFeatures;
