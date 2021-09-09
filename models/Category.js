const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
	name: {
		type: String,
		required: [true, 'Please add a category'],
		unique: true,
	},
	color: { type: String },
	icon: { type: String },
	image: { type: String },
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		required: [true, 'Please add a team member'],
	},
});

categorySchema.virtual('id').get(function () {
	return this._id.toHexString();
});
categorySchema.set('toObject', { virtuals: true });
categorySchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Category', categorySchema);
