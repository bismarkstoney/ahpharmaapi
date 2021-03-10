const mongoose = require('mongoose');
const Team = require('../models/teamModel');
//@desc - Get all team from the database
//@route - GET /api/v1/teams
//@access- private
exports.getTeams = async (req, res, next) => {
	try {
		const team = await Team.find();
		res.status(200).json({
			results: team.length,
			msg: 'All the team',
			success: true,
			data: team,
		});
	} catch (error) {
		res.status(400).json({
			message: error.message,
			success: false,
		});
	}
};
//@desc - Get a single team from the database
//@route - GET /api/v1/teams/:id
//@access- Private

exports.getTeam = async (req, res, next) => {
	try {
		const team = await Team.findById(req.params.id);
		if (!team) {
			return res.status(400).json({
				success: false,
			});
		}
		res.status(200).json({
			msg: `the data for team withn id ${req.params.id}`,
			success: true,
			data: team,
		});
	} catch (error) {
		res.status(400).json({
			success: false,
			message: error.message,
		});
	}
};

//@desc - Add a Team
//@route - POST /api/v1/teams
//@access- Private
exports.addTeam = async (req, res, next) => {
	try {
		const team = await Team.create(req.body);
		res.status(200).json({
			msg: 'team Added',
			success: true,
			data: team,
		});
	} catch (error) {
		res.status(400).json({
			success: false,
			message: error.message,
		});
	}
};
//@desc - Delete a Team member
//@route - DELETE /api/v1/teams/:id
//@access- Private
exports.deleteTeam = async (req, res, next) => {
	try {
		const team = await Team.findOneAndDelete(req.params.id);
		if (!team) {
			return res.status(400).json({
				success: false,
			});
		}
		res.status(200).json({
			msg: 'team deleted',
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
//@desc - update a team member info
//@route - UPDATE /api/v1/team/:id
//@access- Private
exports.updateTeam = async (req, res, next) => {
	try {
		const team = await Team.findByIdAndUpdate(req.params.id, req.body, {
			runValidators: true,
			new: true,
		});
		if (!team) {
			return res.status(400).json({
				success: false,
			});
		}
		res.status(200).json({
			msg: 'team is updated',
			success: true,
			data: team,
		});
	} catch (error) {
		res.status(400).json({
			success: false,
			message: error.message,
		});
	}
};
