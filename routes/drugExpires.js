const express = require('express');
const router = express.Router();
const ExpireDrug = require('../models/ExpireDrugs');
const upload = require('../middleware/multer');
const APIFeatures = require('../utils/apiFeaures');

//@route  GET api/v1/Categoryts
//@Method GET
//@acess- Public
router.get('/', async (req, res) => {
	const features = new APIFeatures(ExpireDrug.find(), req.query)
		.filter()
		.sort()
		.limitFields();
	// const clients = await Clients.find().populate({
	// 	path: 'phamarcy',
	// });
	const expiredDrugs = await features.query;
	res.send(expiredDrugs);

	// const expiredrugList = await ExpireDrug.find();
	// if (!expiredrugList) {
	// 	return res.status(500).json({ sucess: false });
	// }
	// res.send(expiredrugList);
});

router.post('/', upload.single('icon'), async (req, res) => {
	try {
		const drug = new ExpireDrug({
			name: req.body.name,
			quantity: req.body.quantity,
			price: req.body.price,
			expireDate: req.body.expireDate,
			contact: req.body.contact,
			phamarcy: req.body.phamarcy,
			user: req.body.user,
		});
		const newdrug = await drug.save();
		res.status(201).json(newdrug);
	} catch (error) {
		res.status(500).json({
			error: error,
			succuss: false,
		});
	}
});

router.delete('/:id', async (req, res) => {
	try {
		const drug = await ExpireDrug.findByIdAndRemove(req.params.id);
		if (!drug) {
			return res.status(404).json({
				message: `Category not found for ${req.params.id}`,
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
		const drug = await ExpireDrug.findById(req.params.id);
		if (!drug) {
			return res.status(404).json({
				message: `drug not found for ${req.params.id}`,
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

router.put('/:id', upload.single('icon'), async (req, res) => {
	try {
		const drug = await ExpireDrug.findByIdAndUpdate(
			req.params.id,
			{
				name: req.body.name,
				quantity: req.body.quantity,
				expireDate: req.body.expireDate,
				contact: req.body.contact,
				phamarcy: req.body.phamarcy,
				price: req.body.price,
			},
			{ new: true, runValidators: true }
		);
		if (!drug) {
			return res.status(404).json({
				message: `drug not found for ${req.params.id}`,
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
