const Team = require('../models/teamModel');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

//@desc - Get all phamarcies  from the database
//@route - GET /api/v1/teams
//@access- private
exports.getTeams = asyncHandler(async (req, res, next) => {
	const team = await Team.find();
	res.status(200).json({
		results: team.length,
		msg: 'All the team',
		success: true,
		data: team,
	});
});
//@desc - Get a single team member from the database
//@route - GET /api/v1/teams/:id
//@access- Private

exports.getTeam = asyncHandler(async (req, res, next) => {
	const team = await Team.findById(req.params.id);
	if (!team) {
		return next(
			new ErrorResponse(`team member  not found with id ${req.params.id}`, 404)
		);
	}
	res.status(200).json({
		msg: `the data for team withn id ${req.params.id}`,
		success: true,
		data: team,
	});
});

//@desc - Add ateam
//@route - POST /api/v1/clients
//@access- Private
exports.addTeam = asyncHandler(async (req, res, next) => {
	const team = await Team.create(req.body);
	res.status(200).json({
		msg: 'Team member Added',
		success: true,
		data: team,
	});
});
//@desc - Delete  a  team member
//@route - DELETE /api/v1/teams/:id
//@access- Private
exports.deleteTeam = asyncHandler(async (req, res, next) => {
	const team = await team.findOneAndDelete(req.params.id);
	if (!team) {
		return next(
			new ErrorResponse(`team member not found with id ${req.params.id}`, 404)
		);
	}
	res.status(200).json({
		msg: 'team member deleted',
		success: true,
		data: [],
	});
});
//@desc - update a team member  info
//@route - UPDATE /api/v1/teams/:id
//@access- Private
exports.updateTeam = asyncHandler(async (req, res, next) => {
	const team = await Team.findByIdAndUpdate(req.params.id, req.body, {
		runValidators: true,
		new: true,
	});
	if (!team) {
		return next(
			new ErrorResponse(`team member not found with id ${req.params.id}`, 404)
		);
	}
	res.status(200).json({
		msg: 'taem member updated',
		success: true,
		data: team,
	});
});
