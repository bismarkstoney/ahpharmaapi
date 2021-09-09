const Clients = require('../models/Clients');
const User = require('../models/userModel');
const Phamarcy = require('../models/PharmacyModel');
const mongoose = require('mongoose');
const Drug = require('../models/Drug');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const APIFeatures = require('../utils/apiFeaures');

//@desc - Get all clients from the database
//@route - GET /api/v1/clients
//@access- private
exports.getClients = asyncHandler(async (req, res, next) => {
	const features = new APIFeatures(
		Clients.find().populate({ path: 'phamarcy' }),
		req.query
	)
		.filter()

		.sort()
		.limitFields();
	// const clients = await Clients.find().populate({
	// 	path: 'phamarcy',
	// });
	const clients = await features.query;
	res.send(clients);
	// res.status(200).json({
	// 	results: clients.length,
	// 	msg: 'All the clients',
	// 	success: true,
	// 	data: clients,
	// });
});
//@desc - Get a single client from the database
//@route - GET /api/v1/clients/:id
//@access- Private

exports.getClient = asyncHandler(async (req, res, next) => {
	const client = await Clients.findById(req.params.id);
	if (!client) {
		return next(
			new ErrorResponse(`Client not found with id ${req.params.id}`, 404)
		);
	}
	res.status(200).json({
		msg: `the data for client withn id ${req.params.id}`,
		success: true,
		data: client,
	});
});
exports.getClientDate = asyncHandler(async (req, res, next) => {
	const clients = await Clients.find({});
	res.send(clients);
});
//@desc - Add a client
//@route - POST /api/v1/clients
//@access- Private
exports.addClient = asyncHandler(async (req, res, next) => {
	const phamarcy = await Phamarcy.findById(req.body.phamarcy);
	if (!phamarcy) return res.status(400).send('Invalid phamarcy');
	const user = await User.findById(req.body.user);
	if (!user) return res.status(400).send('Invalid user');
	// const file = req.file;

	// if (!file) {
	// 	return res.status(400).send('No Image in the request');
	// }

	//const fileName = req.file.filename;
	const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;
	const baseTwo = '/uploads/';
	try {
		let client = Clients.create({
			_id: new mongoose.Types.ObjectId(),
			name: req.body.name,
			phoneNumber: req.body.phoneNumber,
			dob: req.body.dob,
			gender: req.body.gender,
			age: req.body.age,
			email: req.body.email,
			city: req.body.city,
			phamarcy: req.body.phamarcy,
			medicalCondition: req.body.medicalCondition,
			user: req.body.user,
		});
		res.status(200).json({
			data: client,
			message: 'sucess',
		});
	} catch (error) {
		res.status(400).json({
			err: error.message,
		});
	}
});
//@desc - Delete a client
//@route - DELETE /api/v1/clients/:id
//@access- Private
exports.deleteClient = asyncHandler(async (req, res, next) => {
	const client = await Clients.findByIdAndRemove(req.params.id);
	if (!client) {
		return next(
			new ErrorResponse(`Client not found with id ${req.params.id}`, 404)
		);
	}
	res.status(200).json({
		msg: 'client deleted',
		success: true,

		data: [],
	});
});
//@desc - update a client info
//@route - UPDATE /api/v1/clients/:id
//@access- Private
exports.updateClient = asyncHandler(async (req, res, next) => {
	// const drug = await Drug.findById(req.body.drug);
	// if (!drug) return res.status(400).send('Invalid Drug');
	// const phamarcy = await Phamarcy.findById(req.body.phamarcy);
	// if (!phamarcy) return res.status(400).send('Invalid phamarcy');
	// const user = await User.findById(req.body.user);
	// if (!user) return res.status(400).send('Invalid user');
	// const file = req.file;
	// if (!file) {
	// 	return res.status(400).send('No Image in the request');
	// }

	// const fileName = req.file.filename;
	// const basePath = `${req.protocol}://${req.get('host')}/uploads/`;

	try {
		let client = await Clients.findByIdAndUpdate(
			req.params.id,
			{
				fullname: req.body.fullname,
				phoneNumber: req.body.phoneNumber,
				dob: req.body.dob,
				gender: req.body.gender,
				age: req.body.age,
				email: req.body.email,
				name: req.body.name,
				city: req.body.city,
				phamarcy: req.body.phamarcy,
				medicalCondition: req.body.medicalCondition,
				user: req.body.user,
			},
			{ new: true, runValidators: true }
		);

		client = await client.save();
		res.status(201).json(client);
	} catch (error) {
		res.status(500).json({
			error: error.message,
			succuss: false,
		});
	}

	// const client = await Clients.findByIdAndUpdate(req.params.id, req.body, {
	// 	runValidators: true,
	// 	new: true,
	// });
	// if (!client) {
	// 	return next(
	// 		new ErrorResponse(`Client not found with id ${req.params.id}`, 404)
	// 	);
	// }
	// res.status(200).json({
	// 	msg: 'clients updated',
	// 	success: true,
	// 	data: client,
	// });
});
