const crypto = require('crypto');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const UserSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: [true, 'Please add a name'],
		},

		email: {
			unique: [true, 'email is already taken'],
			type: String,
			required: [true, 'Please add an email'],
			match: [
				/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
				'Please add a valid email',
			],
		},
		phone: {
			type: String,
			required: [true, 'Please add a Phone Number'],
		},
		password: {
			type: String,
			required: [true, 'Please add a password'],
			minlength: 6,
			select: false,
		},

		resetPasswordToken: String,
		resetPasswordExpires: Date,

		role: {
			type: String,
			enum: ['user', 'admin', 'team'],
			default: 'user',
		},
		pushToken: {
			type: String,
		},
		picture: {
			type: String,
		},

		phamarcy: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Pharmacy',
		},
	},
	{ timestamps: true }
);

//Encrypt the passoerd using bcrypt

UserSchema.pre('save', async function (next) {
	if (!this.isModified('password')) {
		next();
	}
	const salt = await bcrypt.genSalt(10);
	this.password = await bcrypt.hash(this.password, salt);
});

// Sign JWT and return
UserSchema.methods.getSignedJwtToken = function () {
	return jwt.sign(
		{
			id: this.id,
			email: this.email,
			name: this.name,
			role: this.role,
			phone: this.phone,
			picture: this.picture,
			phamarcy: this.phamarcy,
		},
		process.env.JWT_SECRET,
		{
			expiresIn: process.env.JWT_EXPIRES,
		}
	);
};

UserSchema.set('toJSON', {
	virtuals: true,
});

//Match user entered password

UserSchema.methods.matchPassword = async function (enteredPassword) {
	return await bcrypt.compare(enteredPassword, this.password);
};

UserSchema.methods.getResetPasswordToken = function () {
	//Generate token
	const resetToken = crypto.randomBytes(20).toString('hex');
	// hash token and set to resetPasswordToken field
	this.resetPasswordToken = crypto
		.createHash('sha256')
		.update(resetToken)
		.digest('hex');

	//set expires
	this.resetPasswordExpires = Date.now() + 10 * 60 * 1000;
	return resetToken;
};
UserSchema.virtual('id').get(function () {
	return this._id.toHexString();
});

module.exports = mongoose.model('User', UserSchema);
