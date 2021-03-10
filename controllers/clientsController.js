const mongoose = require('mongoose');
const Clients = require('../models/Clients');
//@desc - Get all clients from the database
//@route - GET /api/v1/clients
//@access- private
exports.getClients = async (req, res, next) => {
	res.status(200).json({
		msg: 'All the clients',
		success: true,
	});
};
//@desc - Get a single client from the database
//@route - GET /api/v1/clients/:id
//@access- Private

exports.getClient = (req, res, next) => {
	res.status(200).json({
		msg: `the data for client withn id ${req.params.id}`,
		success: true,
	});
};

//@desc - Add a client
//@route - POST /api/v1/clients
//@access- Private
exports.addClient = async (req, res, next) => {
	const client = await Clients.create(req.body);
	res.status(200).json({
		msg: 'clients Added',
		success: true,
		data: client,
	});
};
//@desc - Delete a client
//@route - DELETE /api/v1/clients/:id
//@access- Private
exports.deleteClient = (req, res, next) => {
	res.status(200).json({
		msg: `client with ${req.params.id} deleted`,
		success: true,
	});
};
//@desc - update a client info
//@route - UPDATE /api/v1/clients/:id
//@access- Private
exports.updateClient = (req, res, next) => {
	res.status(200).json({
		msg: `client with ${req.params.id} updated`,
		success: true,
	});
};
