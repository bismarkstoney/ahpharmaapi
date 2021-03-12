const mongoose = require('mongoose');

const clientScheme = new mongoose.Schema(
	{
		fullname: {
			type: String,
			required: [true, 'Please add client full name'],
			minLength: [1, 'Name is too short'],
			maxLength: [50, 'Name is too long'],
		},
		phoneNumber: {
			type: String,
			required: [true, 'Please add a phone number'],
			unique: [true, 'Phone number already taken'],
		},
		dob: {
			type: Date,
			required: [true, 'Please add date of birth'],
		},
		gender: {
			type: String,
			required: [true, 'Please select Gender'],
			enum: ['Male', 'Female'],
		},
		age: {
			type: Number,
			required: [true, 'Age is required'],
		},
		email: {
			type: String,
			match: [
				/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
				'Please add a valid email',
			],
		},
		city: {
			type: String,
		},
		region: String,
		drug: {
			type: [String],
			required: [true, 'Please add a drug'],
		},
		startDate: {
			type: Date,
			required: [true, 'Please add starting date'],
		},
		endDate: {
			type: Date,
			required: [true, 'Please add ending date'],
		},
		photo: {
			type: String,
			default: 'no.jpg',
		},
		phamarcy: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Pharmacy',
			required: [true, 'Please add a phamarcy'],
		},
		team: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Team',
			required: [true, 'Please add a team member'],
		},
	},
	{ timestamps: true }
);

module.exports = mongoose.model('Clients', clientScheme);
