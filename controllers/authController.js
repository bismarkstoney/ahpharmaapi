const User = require('../models/userModel');

const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const sendEmail = require('../utils/sendEmail');

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

//@desc      Get current logged in user
//@route     POST /api/v1/auth/forgotpassword
//@access    Public

//get current user
exports.forgetPassword = asyncHandler(async (req, res, next) => {
	const user = await User.findOne({ email: req.body.email });
	if (!user) {
		return next(new ErrorResponse('There is no user with that email', 404));
	}

	//get reset token
	const resetToken = user.getResetPasswordToken();
	await user.save({ validateBeforeSave: false });
	//create rest url
	const resetUrl = `${req.protocol}://${req.get(
		'host'
	)}//api/v1/resetpassword/${resetToken}`;
	const message = `Please use the link to reset your password  \n\n ${resetUrl}`;
	try {
		await sendEmail({
			email: user.email,
			subject: 'Password reset',
			message,
		});
		res.status(200).json({ success: true, data: 'email send' });
	} catch (err) {
		user.resetPasswordToken = undefined;
		user.resetPasswordExpire = undefined;
		await user.save({ validateBeforeSave: false });
		return next(new ErrorResponse('email could not been sent', 404));
	}
	//console.log(resetToken);
	// res.status(200).json({
	// 	success: true,
	// 	data: user,
	// });
});
