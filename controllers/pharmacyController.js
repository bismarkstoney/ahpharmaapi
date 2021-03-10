const mongoose = require('mongoose');
const Phamarcy = require('../models/PharmacyModel');
//@desc - Get all clients from the database
//@route - GET /api/v1/clients
//@access- private
exports.getPhamarcies = async (req, res, next) => {
	try {
		const phamarcy = await Phamarcy.find();
		res.status(200).json({
			results: phamarcy.length,
			msg: 'All the phamarcy',
			success: true,
			data: phamarcy,
		});
	} catch (error) {
		res.status(400).json({
			message: error.message,
			success: false,
		});
	}
};
//@desc - Get a single client from the database
//@route - GET /api/v1/clients/:id
//@access- Private

exports.getPhamarcy = async (req, res, next) => {
	try {
		const phamarcy = await Phamarcy.findById(req.params.id);
		if (!phamarcy) {
			return res.status(400).json({
				success: false,
			});
		}
		res.status(200).json({
			msg: `the data for phamarcy withn id ${req.params.id}`,
			success: true,
			data: phamarcy,
		});
	} catch (error) {
		res.status(400).json({
			success: false,
			message: error.message,
		});
	}
};

//@desc - Add a client
//@route - POST /api/v1/clients
//@access- Private
exports.addPhamarcy = async (req, res, next) => {
	try {
		const phamarcy = await Phamarcy.create(req.body);
		res.status(200).json({
			msg: 'phamarcy Added',
			success: true,
			data: phamarcy,
		});
	} catch (error) {
		console.log(error.message);
	}
};
//@desc - Delete a client
//@route - DELETE /api/v1/clients/:id
//@access- Private
exports.deletePhamarcy = async (req, res, next) => {
	try {
		const phamarcy = await Phamarcy.findOneAndDelete(req.params.id);
		if (!phamarcy) {
			return res.status(400).json({
				success: false,
			});
		}
		res.status(200).json({
			msg: 'phamarcy deleted',
			success: true,
			data: [],
		});
	} catch (error) {
		res.status(400).json({
			success: false,
			message: error.message,
		});
	}
};
//@desc - update a phamarcy info
//@route - UPDATE /api/v1/phamarcys/:id
//@access- Private
exports.updatePhamarcy = async (req, res, next) => {
	try {
		const phamarcy = await Phamarcy.findByIdAndUpdate(req.params.id, req.body, {
			runValidators: true,
			new: true,
		});
		if (!phamarcy) {
			return res.status(400).json({
				success: false,
			});
		}
		res.status(200).json({
			msg: 'Phamarcy is updated',
			success: true,
			data: phamarcy,
		});
	} catch (error) {
		res.status(400).json({
			success: false,
			message: error.message,
		});
	}
};
