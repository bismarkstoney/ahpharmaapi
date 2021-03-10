const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
	{
		email: {
			type: String,
			required: [true, 'Please add an email'],
		},
		passowrd: {
			type: String,
			required: [true, 'Please add a password'],
		},
	},
	{ timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
