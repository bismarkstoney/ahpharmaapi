const express = require('express');
const router = express.Router();

const {
	getPhamarcy,
	getPhamarcies,
	addPhamarcy,
	updatePhamarcy,
	deletePhamarcy,
} = require('../controllers/pharmacyController');

router.route('/').post(addPhamarcy).get(getPhamarcies);
router
	.route('/:id')
	.put(updatePhamarcy)
	.delete(deletePhamarcy)
	.get(getPhamarcy);

module.exports = router;
