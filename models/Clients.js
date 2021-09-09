const mongoose = require('mongoose');

const clientScheme = new mongoose.Schema(
	{
		name: {
			type: String,
			required: [true, 'Please add client full name'],
			minLength: [1, 'Name is too short'],
			maxLength: [50, 'Name is too long'],
		},
		phoneNumber: {
			type: String,
			required: [true, 'Please add a phone number'],
			//unique: [true, 'Phone number already taken'],
		},
		dob: {
			type: Date,
			required: [true, 'Please add date of birth'],
		},
		gender: {
			type: String,
			required: [true, 'Please select Gender'],
		},
		age: {
			type: Number,
			required: [true, 'Age is required'],
		},
		medicalCondition: {
			type: String,
			required: [true, 'Medical Condition is required'],
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

		photo: {
			type: String,
			default: 'no.jpg',
		},
		phamarcy: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Pharmacy',
			required: [true, 'Please add a phamarcy'],
		},
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: [true, 'Please add a team member'],
		},
	},
	{ timestamps: true }
);

clientScheme.virtual('drug', {
	ref: 'Drug',
	localField: '_id',
	foreignField: 'client',
	justOne: false,
});

clientScheme.virtual('id').get(function () {
	return this._id.toHexString();
});
clientScheme.set('toObject', { virtuals: true });
clientScheme.set('toJSON', { virtuals: true });
module.exports = mongoose.model('Clients', clientScheme);
