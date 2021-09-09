const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema({
	pharmacy: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Pharmacy',
		required: [true, 'Phamarcy is required'],
	},
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		required: [true, 'User is required'],
	},
	stars: {
		type: Number,
		required: [true, 'Star is required'],
		min: 1,
		max: 5,
		default: 0,
	},
	text: {
		type: String,
		required: [true, 'Please add some text'],
		maxlength: 100,
	},
});

//Prevent users from submitting more than one rating for a phamarcy
ratingSchema.index({ pharmacy: 1, user: 1 }, { unique: true });

ratingSchema.statics.getAverageRating = async function (pharmacyId) {
	console.log('Calculate the average');

	const obj = await this.aggregate([
		{
			$match: {
				pharmacy: pharmacyId,
			},
		},
		{
			$group: {
				_id: '$pharmacy',
				nRating: { $sum: 1 },
				averageRating: { $avg: '$stars' },
			},
		},
	]);
	console.log(obj, 'obj');
	//put it into the database
	try {
		if (obj.length > 0) {
			await this.model('Pharmacy').findByIdAndUpdate(pharmacyId, {
				averageRating: obj[0].averageRating,
				ratingQunatity: obj[0].nRating,
			});
		} else {
			await this.model('Pharmacy').findByIdAndUpdate(pharmacyId, {
				averageRating: 0,
				ratingQunatity: 0,
			});
		}
	} catch (err) {
		console.error(err);
	}
};
//call getAverageCost after save
ratingSchema.post('save', async function (next) {
	await this.constructor.getAverageRating(this.pharmacy);
});
//call getAverageCost before remove
// ratingSchema.pre('remove', async function (next) {
// 	this.constructor.getAverageRating(this.pharmacy);
// 	await this.constructor.getAverageRating(this.pharmacy);
// });

//findByIdAndUpdate
ratingSchema.pre(/^findOneAnd/, async function (next) {
	let r;
	this.r = await this.findOne();
	console.log(r);
	next();
});

ratingSchema.post(/^findOneAnd/, async function () {
	//this.constructor.getAverageRating(this.pharmacy);
	await this.r.constructor.getAverageRating(this.r.pharmacy);
});

ratingSchema.virtual('id').get(function () {
	return this._id.toHexString();
});
ratingSchema.set('toObject', { virtuals: true });
ratingSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Rating', ratingSchema);
