const express = require('express');
const router = express.Router();
const Rating = require('../models/Rating');
const Phamarcy = require('../models/PharmacyModel');
const User = require('../models/userModel');

const upload = require('../middleware/multer');
const APIFeatures = require('../utils/apiFeaures');

//@route  GET api/v1/Categoryts
//@Method GET
//@acess- Public
router.get('/', async (req, res) => {
	const features = new APIFeatures(Rating.find(), req.query)
		.filter()
		.sort()
		.limitFields()
		.paginate();

	const rating = await features.query;

	res.send(rating);
});

router.post('/reviews', upload.single('icon'), async (req, res) => {
	const pharmacy = await Phamarcy.findById(req.body.pharmacy);
	if (!pharmacy) return res.status(400).send('Invalid Pharmacy');
	const user = await User.findById(req.body.user);
	if (!user) return res.status(400).send('Invalid user');
	try {
		const rating = new Rating({
			pharmacy: req.body.pharmacy,
			user: req.body.user,
			stars: req.body.stars,
			text: req.body.text,
		});
		const newrating = await rating.save();
		res.status(201).json(newrating);
	} catch (error) {
		res.status(500).json({
			error: error,
			succuss: false,
		});
	}
});

router.delete('/:id', async (req, res) => {
	try {
		const rating = await Rating.findByIdAndRemove(req.params.id);
		if (!rating) {
			return res.status(404).json({
				message: `Rating not found for ${req.params.id}`,
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
		const rating = await Rating.findById(req.params.id);
		if (!rating) {
			return res.status(404).json({
				message: `drug not found for ${req.params.id}`,
			});
		}
		res.status(200).send(rating);
	} catch (error) {
		res.status(500).json({
			error: error,
			succuss: false,
		});
	}
});

router.put('/:id', upload.single('icon'), async (req, res) => {
	try {
		const rating = await Rating.findByIdAndUpdate(
			req.params.id,
			{
				pharmacy: req.body.pharmacy,
				user: req.body.user,
				stars: req.body.stars,
				text: req.body.text,
			},
			{ new: true, runValidators: true }
		);
		if (!rating) {
			return res.status(404).json({
				message: `drug not found for ${req.params.id}`,
			});
		}
		res.status(200).send(rating);
	} catch (error) {
		res.status(500).json({
			error: error.message,
			succuss: false,
		});
	}
});

module.exports = router;
