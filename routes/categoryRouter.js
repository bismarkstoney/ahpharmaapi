const express = require('express');
const router = express.Router();
const Category = require('../models/Category');
const upload = require('../middleware/multer');
const APIFeatures = require('../utils/apiFeaures');

//@route  GET api/v1/Categoryts
//@Method GET
//@acess- Public
router.get('/', async (req, res) => {
	const features = new APIFeatures(Category.find(), req.query)
		.filter()
		.sort()
		.limitFields()
		.paginate();
	const categories = await features.query;

	res.send(categories);

	// const categoryList = await Category.find();
	// if (!categoryList) {
	// 	return res.status(500).json({ sucess: false });
	// }
	// res.send(categoryList);
});

router.post('/', upload.single('icon'), async (req, res) => {
	//const file = req.file;
	// if (!file) {
	// 	return res.status(400).send('No Image in the request');
	// }

	// const fileName = req.file.filename;
	// const basePath = `${req.protocol}://${req.get('host')}/uploads/`;
	// const baseTwo = '/uploads/';

	try {
		const catagory = new Category({
			name: req.body.name,
			icon: req.body.icon,
			color: req.body.color,
			user: req.body.user,
		});
		const newcategory = await catagory.save();
		res.status(201).json(newcategory);
	} catch (error) {
		res.status(500).json({
			error: error,
			succuss: false,
		});
	}
});

router.delete('/:id', async (req, res) => {
	try {
		const category = await Category.findByIdAndRemove(req.params.id);
		if (!category) {
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
		const category = await Category.findById(req.params.id);
		if (!category) {
			return res.status(404).json({
				message: `Category not found for ${req.params.id}`,
			});
		}
		res.status(200).send(category);
	} catch (error) {
		res.status(500).json({
			error: error,
			succuss: false,
		});
	}
});

router.put('/:id', upload.single('icon'), async (req, res) => {
	try {
		const category = await Category.findByIdAndUpdate(
			req.params.id,
			{
				name: req.body.name,
				icon: req.body.icon,
				color: req.body.color,
			},
			{ new: true, runValidators: true }
		);
		if (!category) {
			return res.status(404).json({
				message: `Category not found for ${req.params.id}`,
			});
		}
		res.status(200).send(category);
	} catch (error) {
		res.status(500).json({
			error: error,
			succuss: false,
		});
	}
});

module.exports = router;
