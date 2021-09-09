const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/multer');
// const multer = require('multer');
// const Post = require('../models/Post');
// const mongoose = require('mongoose');

const {
	getTip,
	getTips,
	addTip,
	addPhoto,
	updateTip,
	deleteTip,
} = require('../controllers/tipsController');

router.route('/').post(upload.single('image'), addTip);
router.get('/', getTips);
router.route('/update/:id').put(upload.single('image'), updateTip);
router.route('/singlepost').get(getTip);
router.route('/:id').delete(deleteTip);

module.exports = router;
