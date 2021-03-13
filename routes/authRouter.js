const express = require('express');
const router = express.Router();
const {
	register,
	login,
	getMe,
	forgetPassword,
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');

router.route('/register').post(register);
router.route('/login').post(login);
//get current user
router.route('/me').get(protect, getMe);
router.route('/forgotpassword').post(forgetPassword);

module.exports = router;
