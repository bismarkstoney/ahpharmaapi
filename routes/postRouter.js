const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/multer');
// const multer = require('multer');
// const Post = require('../models/Post');
// const mongoose = require('mongoose');

const {
	getPosts,
	getPost,

	addPost,
	addPhoto,
	updatePosts,
	updatePost,
	deletePost,
} = require('../controllers/postController');

router.route('/').post(upload.single('image'), addPost);
router.get('/', getPosts);
router.route('/update/:id').put(upload.single('image'), updatePost);
router.route('/singlepost').get(getPost);
router.route('/:id').delete(deletePost);

module.exports = router;
