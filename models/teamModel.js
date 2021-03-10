import mongoose from 'mongoose';

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
		passowrd: {
			type: String,
			required: [true, 'Please add a password'],
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

const Team = mongoose.model('Team', teamSchema);
export default Team;
