const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/multer');
const {
	getClients,
	getClient,
	deleteClient,
	addClient,
	updateClient,
	getClientDate,
} = require('../controllers/clientsController');

router.route('/name').get(getClientDate, getClients);
router.route('/').post(upload.single('photo'), addClient).get(getClients);

router
	.route('/:id')
	.put(upload.single('photo'), updateClient)
	.delete(deleteClient)
	.get(protect, authorize('team', 'admin'), getClient);

module.exports = router;
