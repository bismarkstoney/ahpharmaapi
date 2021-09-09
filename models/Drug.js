const mongoose = require('mongoose');

const drugSchema = new mongoose.Schema({
	name: [
		{
			type: [String],
			required: [true, 'Please add name'],
		},
	],
	startDate: {
		type: Date,
		required: [true, 'Please add a start date'],
	},
	endDate: {
		type: Date,
		required: [true, 'Please add a end date'],
	},
	client: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Clients',
		required: [true, 'Please add a client'],
	},

	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		required: [true, 'Please add a user'],
	},
});

drugSchema.virtual('id').get(function () {
	return this._id.toHexString();
});

drugSchema.set('toJSON', {
	virtuals: true,
});
module.exports = mongoose.model('Drug', drugSchema);
