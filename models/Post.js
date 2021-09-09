const mongoose = require('mongoose');
const slugify = require('slugify');
//const geocoder = require('../utils/geocoder');

const postSchema = new mongoose.Schema(
	{
		title: {
			type: String,
			required: [true, 'Please add a title'],
			unique: true,
			minLength: [1, 'Title is too short'],
			maxLength: [100, 'Title is too long'],

			trim: true,
		},

		slug: String,

		description: {
			type: String,
			required: [true, 'Please add a Description '],
		},

		isFeatured: {
			type: Boolean,
			default: false,
		},
		image: {
			type: String,
			required: [true, 'Please add an image'],
		},
		user: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
			ref: 'User',
		},

		category: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Category',
			//required: true,
		},
	},
	{ timestamps: true }
);

// Set Object and Json property to true. Default is set to false
postSchema.set('toObject', { virtuals: true });
postSchema.set('toJSON', { virtuals: true });

postSchema.virtual('id').get(function () {
	return this._id.toHexString();
});

postSchema.pre('save', function (next) {
	this.slug = slugify(this.title, { lower: true });
	next();
});

// //delete a  client with phamarcy
// pharmacyScheme.pre('remove', async function (next) {
// 	console.log('clients been remove from the database');
// 	await this.model('Clients').deleteMany({ phamarcy: this_id });
// 	next();
// });
//REVERSE POPULATE
// pharmacyScheme.virtual('clients', {
// 	ref: 'Clients',
// 	localField: '_id',
// 	foreignField: 'phamarcy',
// 	justOne: false,
// });

//Geocode and create location field
// pharmacyScheme.pre('save', async function(next){
// 	const  loc= await geocoder.geocode
// })
module.exports = mongoose.model('Post', postSchema);
