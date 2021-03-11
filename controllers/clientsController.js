const Clients = require('../models/Clients');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

//@desc - Get all clients from the database
//@route - GET /api/v1/clients
//@access- private
exports.getClients = asyncHandler(async (req, res, next) => {
	const clients = await Clients.find();
	res.status(200).json({
		results: clients.length,
		msg: 'All the clients',
		success: true,
		data: clients,
	});
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

//@desc - Add a client
//@route - POST /api/v1/clients
//@access- Private
exports.addClient = asyncHandler(async (req, res, next) => {
	const client = await Clients.create(req.body);
	res.status(200).json({
		msg: 'clients Added',
		success: true,
		data: client,
	});
});
//@desc - Delete a client
//@route - DELETE /api/v1/clients/:id
//@access- Private
exports.deleteClient = asyncHandler(async (req, res, next) => {
	const client = await Clients.findOneAndDelete(req.params.id);
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
	const client = await Clients.findByIdAndUpdate(req.params.id, req.body, {
		runValidators: true,
		new: true,
	});
	if (!client) {
		return next(
			new ErrorResponse(`Client not found with id ${req.params.id}`, 404)
		);
	}
	res.status(200).json({
		msg: 'clients Added',
		success: true,
		data: client,
	});
});
