const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = require('../middleware/multer');

const {
	getPhamarcy,
	getPhamarcies,
	addPhamarcy,
	updatePhamarcy,
	deletePhamarcy,
	addPhoto,
} = require('../controllers/pharmacyController');
router.route('/:id/photo').put(addPhoto);
router.route('/').post(upload.single('logo'), addPhamarcy).get(getPhamarcies);

router
	.route('/:id')
	.put(upload.single('logo'), updatePhamarcy)
	.delete(deletePhamarcy)
	.get(getPhamarcy);

module.exports = router;
