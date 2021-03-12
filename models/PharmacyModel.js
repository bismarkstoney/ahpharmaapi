const mongoose = require('mongoose');
const slugify = require('slugify');
//const geocoder = require('../utils/geocoder');

const pharmacyScheme = new mongoose.Schema(
	{
		name: {
			type: String,
			required: [true, 'Please add a pharmacy name'],
			unique: true,
			minLength: [1, 'Name is too short'],
			maxLength: [100, 'Name is too long'],
			trim: true,
		},
		email: {
			type: String,
			match: [
				/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
				'Please add a valid email',
			],
		},
		slug: String,
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
		user: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
			ref: 'User',
		},
	},
	{ timestamps: true }
);

// Set Object and Json property to true. Default is set to false
pharmacyScheme.set('toObject', { virtuals: true });
pharmacyScheme.set('toJSON', { virtuals: true });

pharmacyScheme.pre('save', function (next) {
	this.slug = slugify(this.name, { lower: true });
	next();
});

//delete a  client with phamarcy
pharmacyScheme.pre('remove', async function (next) {
	console.log('clients been remove from the database');
	await this.model('Clients').deleteMany({ phamarcy: this_id });
	next();
});
//REVERSE POPULATE
pharmacyScheme.virtual('clients', {
	ref: 'Clients',
	localField: '_id',
	foreignField: 'phamarcy',
	justOne: false,
});

//Geocode and create location field
// pharmacyScheme.pre('save', async function(next){
// 	const  loc= await geocoder.geocode
// })
module.exports = mongoose.model('Pharmacy', pharmacyScheme);
