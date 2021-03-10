const mongoose = require('mongoose');

const teamSchema = mongoose.Schema(
	{
		fullname: {
			type: String,
			required: [true, 'Please add a full name'],
		},
		email: {
			type: String,
			required: [true, 'Please add an email'],
		},

		phone: {
			type: String,
			required: [true, 'Please a phone number'],
		},
		picture: {
			type: String,
			default: 'no.jpg',
		},
	},
	{ timestamps: true }
);

module.exports = mongoose.model('Team', teamSchema);
