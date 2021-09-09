const path = require('path');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const Tips = require('../models/Tips');
const ErrorResponse = require('../utils/errorResponse');
const APIFeatures = require('../utils/apiFeaures');
const asyncHandler = require('../middleware/async');
const Category = require('../models/Category');
dotenv.config({ path: './config/config.env' });

//@desc - Get all Posts  from the database
//@route - GET /api/v1/post
//@access- public
exports.getTips = asyncHandler(async (req, res, next) => {
	//ExECUTE THE QUERY
	const features = new APIFeatures(Tips.find(), req.query)
		.filter()
		.sort()
		.limitFields()
		.paginate();
	const tips = await features.query;
	res.send(tips);
	// res.status(200).json({
	// 	status: 'success',
	// 	results: tips.length,
	// 	data: tips,
	// });
});
//@desc - Get a single client from the database
//@route - GET /api/v1/phamacy/:id
//@access- Private

exports.getTip = asyncHandler(async (req, res, next) => {
	const tip = await Tips.findById(req.params.id);
	if (!tip) {
		return next(
			new ErrorResponse(`record not found with id ${req.params.id}`, 404)
		);
	}
	res.status(200).json({
		msg: `the data for record with id ${req.params.id}`,
		success: true,
		data: tip,
	});
});

//@desc - Add a Phamarcy
//@route - POST /api/v1/phamarcy
//@access- Private
exports.addTip = asyncHandler(async (req, res, next) => {
	const file = req.file;
	if (!file) {
		return res.status(400).send('No Image in the request');
	}

	const fileName = req.file.filename;
	const basePath = `${req.protocol}://${req.get('host')}/uploads/`;
	const baseTwo = '/uploads/';
	//console.log(req.file);
	const tip = new Tips({
		_id: new mongoose.Types.ObjectId(),
		title: req.body.title,
		description: req.body.description,
		image: `${baseTwo}${fileName}`,
		user: req.body.user,
	});

	tip
		.save()
		.then((results) => {
			res.status(201).json({
				message: 'hello',
				data: results,
			});
		})
		.catch((err) => console.log(err));
});

//@desc - Upload a logo for phamarcy
//@route - POST /api/v1/phamarcy
//@access- Private
exports.addPhoto = asyncHandler(async (req, res, next) => {
	const post = await Post.findById(req.params.id);
	if (!post) {
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
	file.name = `photo_${post._id}${path.parse(file.name).ext}`;
	console.log(file.name);

	file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async (err) => {
		if (err) {
			console.log(err);
			return next(new ErrorResponse(`Problem with file uplaod`, 500));
		}
		await Post.findByIdAndUpdate(req.params.is, { photo: file.name });
		res.status(200).json({
			sucess: true,
			data: file.name,
		});
	});
});

//@desc - Delete a phamarcy
//@route - DELETE /api/v1/phamarcy/:id
//@access- Private
exports.deleteTip = asyncHandler(async (req, res, next) => {
	//because of the vituals
	const post = await Tips.findByIdAndDelete(req.params.id);
	if (!post) {
		return next(
			new ErrorResponse(`post not found with id ${req.params.id}`, 404)
		);
	}
	post.remove();
	res.status(200).json({
		msg: 'post deleted',
		success: true,
		data: [],
	});
});
//@desc - update a client info
//@route - UPDATE /api/v1/clients/:id
//@access- Private
exports.updateTip = asyncHandler(async (req, res, next) => {
	// const file = req.file;
	// if (!file) {
	// 	return res.status(400).send('No Image in the request');
	// }
	// const tips = await Tips.findByIdAndDelete(req.params.id);
	// if (!tips) {
	// 	return next(
	// 		new ErrorResponse(`tips not found with id ${req.params.id}`, 404)
	// 	);
	// }
	//const fileName = req.file.filename;
	// const basePath = `${req.protocol}://${req.get('host')}/uploads/`;
	const baseTwo = '/uploads/';
	let tip = await Tips.findByIdAndUpdate(
		req.params.id,
		{
			title: req.body.title,
			description: req.body.description,

			//image: `${baseTwo}${fileName}`,
		},

		{ new: true, runValidators: true }
	);
	if (!tip) {
		return next(
			new ErrorResponse(`tip not found with id ${req.params.id}`, 404)
		);
	}
	res.status(200).json({
		msg: 'posts Added',
		success: true,
		data: tip,
	});

	// post
	// 	.save()
	// 	.then((results) => {
	// 		res.status(201).json({
	// 			message: 'Data save',
	// 			data: results,
	// 		});
	// 	})
});
