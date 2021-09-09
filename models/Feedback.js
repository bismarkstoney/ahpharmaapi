const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
	title: {
		type: String,
		required: [true, 'Please add a title'],
	},
	message: { type: String },
	contact: { type: String },
	phamarcy: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Pharmacy',
		required: [true, 'phamarcy  is required'],
	},
});

feedbackSchema.virtual('id').get(function () {
	return this._id.toHexString();
});

feedbackSchema.set('toJSON', {
	virtuals: true,
});
module.exports = mongoose.model('Feedback', feedbackSchema);
