const Phamarcy = require('../models/PharmacyModel');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

//@desc - Get all phamarcies  from the database
//@route - GET /api/v1/phamarcy
//@access- private
exports.getPhamarcies = asyncHandler(async (req, res, next) => {
	const phamarcy = await Phamarcy.find();
	res.status(200).json({
		results: phamarcy.length,
		msg: 'All the phamarcy',
		success: true,
		data: phamarcy,
	});
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
//@route - POST /api/v1/clients
//@access- Private
exports.addPhamarcy = asyncHandler(async (req, res, next) => {
	const phamarcy = await Phamarcy.create(req.body);
	res.status(200).json({
		msg: 'phamarcys Added',
		success: true,
		data: phamarcy,
	});
});
//@desc - Delete a phamarcy
//@route - DELETE /api/v1/phamarcy/:id
//@access- Private
exports.deletePhamarcy = asyncHandler(async (req, res, next) => {
	const phamarcy = await Phamarcy.findOneAndDelete(req.params.id);
	if (!phamarcy) {
		return next(
			new ErrorResponse(`phamarcy not found with id ${req.params.id}`, 404)
		);
	}
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
	const phamarcy = await Phamarcy.findByIdAndUpdate(req.params.id, req.body, {
		runValidators: true,
		new: true,
	});
	if (!phamarcy) {
		return next(
			new ErrorResponse(`phamarcy not found with id ${req.params.id}`, 404)
		);
	}
	res.status(200).json({
		msg: 'phamarcys Added',
		success: true,
		data: phamarcy,
	});
});
