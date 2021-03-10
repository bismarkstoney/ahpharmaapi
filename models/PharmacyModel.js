const mongoose = require('mongoose');

const pharmacyScheme = new mongoose.Schema(
	{
		name: {
			type: String,
			required: [true, 'Please add a pharmacy name'],
			unique: true,
			minLength: [1, 'Name is too short'],
			maxLength: [100, 'Name is too long'],
		},
		city: {
			type: String,
			required: [true, 'Please enter city'],
		},
		district: {
			type: String,
			required: [true, 'Please enter city'],
		},
		phoneNumber: {
			type: String,
			required: [true, 'Please enter a phone number'],
		},
		logo: {
			type: String,
			default: 'logo.png',
		},
		// team: {
		// 	type: mongoose.Schema.Types.ObjectId,
		// 	required: true,
		// 	ref: 'User',
		// },
		medicalHistroy: [
			{
				fullname: {
					type: String,
					required: [true, 'Please add client full name'],
				},
				dob: {
					type: Date,
					required: [true, 'Please add date of birth'],
				},

				age: String,
				dose: { type: Array, required: [true, 'Please list all the drugs'] },
				timesperDay: {
					type: String,
					required: [true, 'Please add times per day'],
				},

				allergy: {
					type: Boolean,
					default: false,
				},
				user: {
					type: mongoose.Schema.Types.ObjectId,
					ref: 'Client',
					required: true,
				},
			},
		],
	},
	{ timestamps: true }
);

module.exports = mongoose.model('Pharmacy', pharmacyScheme);
