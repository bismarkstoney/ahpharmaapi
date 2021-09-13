const User = require('../models/userModel');
const mongoose = require('mongoose');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const sendEmail = require('../utils/sendEmail');
const bcrypt = require('bcryptjs');

//@desc      Register a user
//@route     POST /api/v1/auth/register
//@access    Public
exports.register = asyncHandler(async (req, res, next) => {
	const { name, email, phone, password, phamarcy } = req.body;

	//create user
	const user = await User.create({
		name,
		email,
		phone,
		password,
		phamarcy,
	});

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
		data: user,
	});
};

//@desc      Get current logged in user
//@route     GET /api/v1/auth/me
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
	res.status(200).json({
		success: true,
		data: user,
	});
});

//@desc   get User Profile
//@route   /api/users/profile
//@acess  Private
exports.getUser = asyncHandler(async (req, res, next) => {
	const user = await User.findById(req.user._id);
	if (user) {
		res.json({
			_id: user._id,
			name: user.name,
			email: user.email,
			role: user.role,
			picture: user.picture,
		});
	} else {
		res.status(400);
		throw new ErrorResponse('Invalid userData ', 404);
	}
});

exports.updateUser = asyncHandler(async (req, res, next) => {
	const file = req.file;
	// if (!file) {
	// 	return res.status(400).send('No Image in the request');
	// }
	const basePath = `${req.protocol}://${req.get('host')}/uploads/`;
	const fileName = req.file.filename;
	const user = await User.findByIdAndUpdate(
		req.params.id,

		{
			name: req.body.name,
			phone: req.body.phone,
			email: req.body.email,
			picture: `${basePath }${fileName}`,
			//pushToken: req.body.pushToken,
			role: req.body.role,
			//phamarcy: req.body.phamarcy,
		},
		{
			runValidators: true,
			new: true,
		}
	);
	if (!user) {
		return next(
			new ErrorResponse(`user not found with id ${req.params.id}`, 404)
		);
	}

	res.status(200).json({
		msg: 'user updated',
		success: true,
		data: user,
	});
	// let user = await User.findByIdAndUpdate(
	// 	req.params.id,
	// 	{
	// 		name: req.body.name,
	// 		phone: req.body.phone,
	// 		email: req.body.email,
	// 		picture: `${baseTwo}${fileName}`,
	// 	},
	// 	{ new: true, runValidators: true }
	// );
	// console.log(user);
	// user.save();
	//res.send(updatedUser);

	// res.status(400);
	// throw new ErrorResponse('Invalid userData ', 404);
	//sendTokemResponse(user, 200, res);
});

//@desc Get all users

exports.getAlluers = asyncHandler(async (req, res, next) => {
	const user = await User.find().select('-password');
	if (!user) {
		return res.status(500).json({ sucess: false });
	}
	res.send(user);
});

exports.registerUser = asyncHandler(async (req, res, next) => {
	const usercheck = await User.findOne({ email });
	if (usercheck) {
		return next(new ErrorResponse('Email already taken', 401));
	}
	const file = req.file;
	if (!file) {
		return res.status(400).send('No Image in the request');
	}

	const fileName = req.file.filename;
	const basePath = `${req.protocol}://${req.get('host')}/uploads/`;
	const baseTwo = '/uploads/';
	let user = new User({
		name: req.body.name,
		phone: req.body.phone,
		email: req.body.email,
		picture: `${basePath}${fileName}`,
		password: req.body.password,
		phamarcy: req.body.phamarcy,
	});

	user = await user.save();
	//res.status(200).json(user);

	sendTokemResponse(user, 200, res);
});
