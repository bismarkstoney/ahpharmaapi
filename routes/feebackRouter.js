const express = require('express');
const router = express.Router();
const Feedback = require('../models/Feedback');
const upload = require('../middleware/multer');
const APIFeatures = require('../utils/apiFeaures');

//@route  GET api/v1/Feebackts
//@Method GET
//@acess- Public
router.get('/', async (req, res) => {
	const features = new APIFeatures(Feedback.find(), req.query)
		.filter()

		.sort()
		.limitFields();
	// const clients = await Clients.find().populate({
	// 	path: 'phamarcy',
	// });
	const feedback = await features.query;
	res.send(feedback);

	// const feebackList = await Feeback.find();
	// if (!feebackList) {
	// 	return res.status(500).json({ sucess: false });
	// }
	// res.send(feebackList);
});

router.post('/', upload.single('image'), async (req, res) => {
	try {
		const feeback = new Feedback({
			title: req.body.title,
			message: req.body.message,
			contact: req.body.contact,
			phamarcy: req.body.phamarcy,
		});
		const newfeedback = await feeback.save();
		res.status(201).json(newfeedback);
	} catch (error) {
		console.log(error);
	}
});

router.delete('/:id', async (req, res) => {
	try {
		const feeback = await Feeback.findByIdAndRemove(req.params.id);
		if (!feeback) {
			return res.status(404).json({
				message: `Feeback not found for ${req.params.id}`,
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

router.get('/:id', async (req, res) => {
	try {
		const feeback = await Feeback.findById(req.params.id);
		if (!feeback) {
			return res.status(404).json({
				message: `Feeback not found for ${req.params.id}`,
			});
		}
		res.status(200).send(feeback);
	} catch (error) {
		res.status(500).json({
			error: error,
			succuss: false,
		});
	}
});

router.put('/:id', async (req, res) => {
	try {
		const feeback = await Feeback.findByIdAndUpdate(
			req.params.id,
			{
				title: req.body.name,
				message: req.body.message,
				contact: req.body.contact,
			},
			{ new: true, runValidators: true }
		);
		if (!feeback) {
			return res.status(404).json({
				message: `Feeback not found for ${req.params.id}`,
			});
		}
		res.status(200).send(feeback);
	} catch (error) {
		res.status(500).json({
			error: error,
			succuss: false,
		});
	}
});

module.exports = router;
