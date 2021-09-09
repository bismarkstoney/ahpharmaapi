const express = require('express');
const router = express.Router();
const Drug = require('../models/Drug');
const mongoose = require('mongoose');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/multer');
const APIFeatures = require('../utils/apiFeaures');
//@route  GET api/v1/Categoryts
//@Method GET
//@acess- Public
router.get('/', async (req, res) => {
	const features = new APIFeatures(
		Drug.find().populate({ path: 'client' }).populate({ path: 'phamarcy' }),
		req.query
	)
		.filter()

		.sort()
		.limitFields();

	const drugs = await features.query;
	res.send(drugs);

	// const drugList = await Drug.find().populate('client');
	// if (!drugList) {
	// 	return res.status(500).json({ sucess: false });
	// }
	// res.send(drugList);
});

router.post('/', upload.single('name'), async (req, res) => {
	try {
		const drug = new Drug({
			_id: new mongoose.Types.ObjectId(),
			name: req.body.name,
			startDate: req.body.startDate,
			endDate: req.body.endDate,
			client: req.body.client,
			user: req.body.user,
		});
		const newdrug = await drug.save();
		res.status(201).json(newdrug);
	} catch (error) {
		res.status(500).json({
			error: error.message,
			succuss: false,
		});
	}
});

router.delete('/:id', protect, authorize('admin'), async (req, res) => {
	try {
		const drug = await Drug.findByIdAndRemove(req.params.id);
		if (!drug) {
			return res.status(404).json({
				message: `Drug not found for ${req.params.id}`,
			});
		}
		res.status(200).json({
			sucess: true,
			message: 'Record deleted',
		});
	} catch (error) {
		res.status(500).json({
			error: error,
			succuss: false,
		});
	}
});

router.get('/:id', protect, authorize('admin'), async (req, res) => {
	try {
		const drug = await Drug.findById(req.params.id);
		if (!drug) {
			return res.status(404).json({
				message: `Drug not found for ${req.params.id}`,
			});
		}
		res.status(200).send(drug);
	} catch (error) {
		res.status(500).json({
			error: error,
			succuss: false,
		});
	}
});

router.put('/:id', protect, authorize('admin'), async (req, res) => {
	try {
		const drug = await Drug.findByIdAndUpdate(
			req.params.id,
			{
				name: req.body.name,
				startDate: req.body.startDate,
				endDate: req.body.endDate,
				user: req.body.user,
			},
			{ new: true, runValidators: true }
		);
		if (!drug) {
			return res.status(404).json({
				message: `Drug not found for ${req.params.id}`,
			});
		}
		res.status(200).send(drug);
	} catch (error) {
		res.status(500).json({
			error: error,
			succuss: false,
		});
	}
});

module.exports = router;
