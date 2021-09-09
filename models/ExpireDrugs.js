const mongoose = require('mongoose');

const drugExpireSchema = new mongoose.Schema({
	name: {
		type: String,
		required: [true, 'Please name is required'],
	},
	quantity: {
		type: Number,
		required: [true, 'Quantity is required'],
	},
	expireDate: {
		type: Date,
		required: [true, 'Expire date is required'],
	},
	contact: {
		type: String,
		required: true,
	},
	price: {
		type: Number,
		required: [true, 'Price is required'],
	},
	phamarcy: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Phamarcy',
		required: true,
	},

	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		required: [true, 'Please add a user'],
	},
});

drugExpireSchema.virtual('id').get(function () {
	return this._id.toHexString();
});
drugExpireSchema.set('toObject', { virtuals: true });
drugExpireSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('ExpireDrug', drugExpireSchema);
