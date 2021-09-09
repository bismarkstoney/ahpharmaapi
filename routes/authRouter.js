const express = require('express');
const router = express.Router();
const upload = require('../middleware/multer');
const {
	register,
	login,
	getMe,
	forgetPassword,
	updateUser,
	getAlluers,
	registerUser,
} = require('../controllers/authController');
const { protect, authorize } = require('../middleware/auth');

//router.route('/register').post(register);
router.route('/registeruser').post(upload.single('picture'), register);
router.route('/users').get(getAlluers);
router.route('/login').post(login);
//get current user
router.route('/me').get(protect, getMe);
router.route('/forgotpassword').post(forgetPassword);
//router.route('/updateuser').post(updateUser);
router.route('/updateuser/:id').put(upload.single('picture'), updateUser);

module.exports = router;
