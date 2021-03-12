const User = require('../models/userModel');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

//@desc      Register a user
//@route     POST /api/v1/auth/register
//@access    Public
exports.register = asyncHandler(async (req, res, next) => {
	const { name, email, password, role } = req.body;

	//create user
	const user = await User.create({
		name,
		email,
		password,
		role,
	});

	//CREATE A TOKEN
	// const token = user.getSignedJwtToken();
	// res.status(200).json({
	// 	success: true,
	// 	token,
	// });

	sendTokemResponse(user, 200, res);
});

//@desc      LOGIN a user
//@route     POST /api/v1/auth/register
//@access    Public
exports.login = asyncHandler(async (req, res, next) => {
	const { email, password } = req.body;

	//VALIDATE EMAIL AND PASSWORD
	if (!email || !password) {
		return next(new ErrorResponse('Invalid credientails', 404));
	}

	//check for user
	const user = await User.findOne({ email }).select('+password');
	if (!user) {
		return next(new ErrorResponse('Invalid credientails', 401));
	}

	//check if password matches
	const isMatch = await user.matchPassword(password);
	if (!isMatch) {
		return next(new ErrorResponse('Invalid credientails', 401));
	}

	// //CREATE A TOKEN
	// const token = user.getSignedJwtToken();
	// res.status(200).json({
	// 	success: true,
	// 	token,
	// });

	sendTokemResponse(user, 200, res);
});

//Get Toke from model. create cookie and send response

const sendTokemResponse = (user, statusCode, res) => {
	const token = user.getSignedJwtToken();
	const options = {
		expires: new Date(
			Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
		),
		httpOnly: true,
	};

	//if in production
	if (process.env.NODE_ENV === 'production') {
		options.secure = true;
	}
	res.status(statusCode).cookie('token', token, options).json({
		success: true,
		token,
	});
};

//@desc      Get current logged in user
//@route     POST /api/v1/auth/me
//@access    Privatet

//get current user
exports.getMe = asyncHandler(async (req, res, next) => {
	const user = await User.findById(req.user.id);

	res.status(200).json({
		success: true,
		data: user,
	});
});
