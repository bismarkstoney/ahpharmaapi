const User = require('../models/userModel');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

//@desc      Register a user
//@route     GET /api/v1/auth/register
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
	const token = user.getSignedJwtToken();
	res.status(200).json({
		success: true,
		token,
	});
});
