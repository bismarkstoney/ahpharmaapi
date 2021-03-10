import mongoose from 'mongoose';

const UserSchema = mongoose.Schema(
	{
		name: {
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
	},
	{ timestamps: true }
);

const User = mongoose.model('User', userSchema);
export default User;
