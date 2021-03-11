const ErrorResponse = require('../utils/errorResponse');

const errorHandler = (err, req, res, next) => {
	let error = { ...err };
	error.message = err.message;
	console.log(err.stack);

	//Mongoose bad ObjectID
	if (err.name === 'CastError') {
		const message = `resource not foun for ${err.value}`;
		error = new ErrorResponse(message, 404);
	}
	//MOngoose duplicate Key
	if (err.code === 11000) {
		const message = 'Duplicate field value entered';
		error = new ErrorResponse(message, 400);
	}

	//mongoose validation error
	if (err.name === 'ValidationError') {
		const message = Object.values(err.errors).map((val) => val.message);
		error = new ErrorResponse(message, 404);
	}
	res.status(error.statusCode || 500).json({
		success: false,
		error: error.message || 'Sever Error',
	});
};

module.exports = errorHandler;
