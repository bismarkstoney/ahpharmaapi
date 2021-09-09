const path = require('path');
const dotenv = require('dotenv');
const Phamarcy = require('../models/PharmacyModel');
const fileupload = require('express-fileupload');
const User = require('../models/userModel');
const ErrorResponse = require('../utils/errorResponse');
const APIFeatures = require('../utils/apiFeaures');
const asyncHandler = require('../middleware/async');
dotenv.config({ path: './config/config.env' });
const mongoose = require('mongoose');
//@desc - Get all phamarcies  from the database
//@route - GET /api/v1/phamarcy
//@access- private
exports.getPhamarcies = asyncHandler(async (req, res, next) => {
	//ExECUTE THE QUERY
	const features = new APIFeatures(
		Phamarcy.find().populate('clients').populate('rating'),
		req.query
	)
		.filter()
		.sort()
		.limitFields()
		.paginate();
	const phamarcy = await features.query;
	res.send(phamarcy);
	// res.status(200).json({
	// 	status: 'success',
	// 	results: phamarcy.length,
	// 	data: phamarcy,
	// });
});
//@desc - Get a single client from the database
//@route - GET /api/v1/phamacy/:id
//@access- Private

exports.getPhamarcy = asyncHandler(async (req, res, next) => {
	const phamarcy = await Phamarcy.findById(req.params.id);
	if (!phamarcy) {
		return next(
			new ErrorResponse(`phamarcy not found with id ${req.params.id}`, 404)
		);
	}
	res.status(200).json({
		msg: `the data for phamarcy withn id ${req.params.id}`,
		success: true,
		data: phamarcy,
	});
});

//@desc - Add a Phamarcy
//@route - POST /api/v1/phamarcy
//@access- Private
exports.addPhamarcy = asyncHandler(async (req, res, next) => {
	// const user = await User.findById(req.params.id);
	//add a user
	//req.body.user = req.user.id;
	// if (!user) return res.status(400).send('user not found');
	const phamarcy = await Phamarcy.create({
		//_id: new mongoose.Types.ObjectId(),
		name: req.body.name,
		email: req.body.email,
		phoneNumber: req.body.phoneNumber,
		city: req.body.city,
		district: req.body.district,
		user: req.body.user,
	});
	res.status(200).json({
		msg: 'phamarcys Added',
		success: true,
		data: phamarcy,
	});
});

//@desc - Upload a logo for phamarcy
//@route - POST /api/v1/phamarcy
//@access- Private
exports.addPhoto = asyncHandler(async (req, res, next) => {
	const phamarcy = await Phamarcy.findById(req.params.id);
	if (!phamarcy) {
		return next(
			new ErrorResponse(`No resources found with id of ${req.params.id}`, 404)
		);
	}
	if (!req.files) {
		return next(new ErrorResponse(`Please upload a file`, 404));
	}
	///console.log(req.files.file.mimetype);
	const file = req.files.file;
	if (!file.mimetype.startsWith('image')) {
		return next(new ErrorResponse(`Please upload a valid file`, 404));
	}
	//check a file size
	if (file.size > process.env.MAX_FILE_UPLOAD) {
		return next(
			new ErrorResponse(
				`Please upload an image less thsn ${process.env.MAX_FILE_UPLOAD}`,
				400
			)
		);
	}

	//create a custome file name
	file.name = `photo_${phamarcy._id}${path.parse(file.name).ext}`;
	//console.log(file.name);

	file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async (err) => {
		if (err) {
			console.log(err);
			return next(new ErrorResponse(`Problem with file uplaod`, 500));
		}
		await Phamarcy.findByIdAndUpdate(req.params.is, { photo: file.name });
		res.status(200).json({
			sucess: true,
			data: file.name,
		});
	});
});

//@desc - Delete a phamarcy
//@route - DELETE /api/v1/phamarcy/:id
//@access- Private
exports.deletePhamarcy = asyncHandler(async (req, res, next) => {
	//because of the vituals
	const phamarcy = await Phamarcy.findById(req.params.id);
	if (!phamarcy) {
		return next(
			new ErrorResponse(`phamarcy not found with id ${req.params.id}`, 404)
		);
	}
	phamarcy.remove();
	res.status(200).json({
		msg: 'phamarcy deleted',
		success: true,
		data: [],
	});
});
//@desc - update a client info
//@route - UPDATE /api/v1/clients/:id
//@access- Private
exports.updatePhamarcy = asyncHandler(async (req, res, next) => {
	const phamarcy = await Phamarcy.findByIdAndUpdate(
		req.params.id,

		{
			name: req.body.name,
			email: req.body.email,
			city: req.body.city,
			district: req.body.district,
			phoneNumber: req.body.phoneNumber,
		},
		{
			runValidators: true,
			new: true,
		}
	);
	//console.log(phamarcy);
	if (!phamarcy) {
		return next(
			new ErrorResponse(`phamarcy not found with id ${req.params.id}`, 404)
		);
	}
	res.status(201).json({
		msg: 'phamarcys Added',
		success: true,
		data: phamarcy,
	});
});
