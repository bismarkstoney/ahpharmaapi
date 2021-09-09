const path = require('path');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const Post = require('../models/Post');
const ErrorResponse = require('../utils/errorResponse');
const APIFeatures = require('../utils/apiFeaures');
const asyncHandler = require('../middleware/async');
const Category = require('../models/Category');
dotenv.config({ path: './config/config.env' });

//@desc - Get all Posts  from the database
//@route - GET /api/v1/post
//@access- public
exports.getPosts = asyncHandler(async (req, res, next) => {
	//ExECUTE THE QUERY
	const features = new APIFeatures(Post.find(), req.query)
		.filter()
		.sort()
		.limitFields()
		.paginate();
	const post = await features.query;

	res.send(post);

	// res.status(200).json({
	// 	status: 'success',
	// 	results: post.length,
	// 	data: post,
	// });
});
//@desc - Get a single client from the database
//@route - GET /api/v1/phamacy/:id
//@access- Private

exports.getPost = asyncHandler(async (req, res, next) => {
	const post = await Post.findById(req.body.id);
	if (!post) {
		return next(
			new ErrorResponse(`phamarcy not found with id ${req.params.id}`, 404)
		);
	}
	res.status(200).json({
		msg: `the data for phamarcy withn id ${req.params.id}`,
		success: true,
		data: post,
	});
});

//@desc - Add a Phamarcy
//@route - POST /api/v1/phamarcy
//@access- Private
exports.addPost = asyncHandler(async (req, res, next) => {
	const category = await Category.findById(req.body.category);
	if (!category) return res.status(400).send('Invalid Category');
	const file = req.file;
	if (!file) {
		return res.status(400).send('No Image in the request');
	}

	const fileName = req.file.filename;
	const basePath = `${req.protocol}://${req.get('host')}/uploads/`;
	const baseTwo = '/uploads/';

	//console.log(req.file);
	const post = new Post({
		_id: new mongoose.Types.ObjectId(),

		title: req.body.title,
		category: req.body.category,
		user: req.body.user,
		description: req.body.description,
		image: `${basePath}${fileName}`,
		isFeatured: req.body.isFeatured,
	});

	post
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
	//console.log(file.name);

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
exports.deletePost = asyncHandler(async (req, res, next) => {
	//because of the vituals
	const post = await Post.findByIdAndDelete(req.params.id);
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
exports.updatePost = asyncHandler(async (req, res, next) => {
	// const category = await Category.findById(req.body.category);
	// console.log(category);
	// if (!category) return res.status(400).send('Invalid Category');
	// const file = req.file;
	// if (!file) {
	// 	return res.status(400).send('No Image in the request');
	// }

	//const fileName = req.file.filename;

	//const basePath = `${req.protocol}://${req.get('host')}/uploads/`;
	const baseTwo = `/uploads/`;
	let post = await Post.findByIdAndUpdate(
		req.params.id,
		{
			title: req.body.title,
			description: req.body.description,
			category: req.body.category,
		},

		{ new: true }
	);
	if (!post) {
		return next(
			new ErrorResponse(`post not found with id ${req.params.id}`, 404)
		);
	}
	// post.save();
	res.status(200).json(post);

	// post
	// 	.save()
	// 	.then((results) => {
	// 		res.status(201).json({
	// 			message: 'Data save',
	// 			data: results,
	// 		});
	// 	})
});

exports.updatePosts = asyncHandler(async (req, res, next) => {
	const post = await Post.findByIdAndUpdate(req.params.id, req.body, {
		runValidators: true,
		new: true,
	});
	//console.log(post);
	if (!post) {
		return next(
			new ErrorResponse(`post not found with id ${req.params.id}`, 404)
		);
	}
	res.status(201).json({
		msg: 'phamarcys Added',
		success: true,
		data: post,
	});
});
