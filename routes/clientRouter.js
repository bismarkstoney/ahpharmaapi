const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');

const {
	getClients,
	getClient,
	deleteClient,
	addClient,
	updateClient,
} = require('../controllers/clientsController');

router
	.route('/')
	.post(protect, authorize('team', 'admin'), addClient)
	.get(protect, authorize('team', 'admin'), getClients);
router
	.route('/:id')
	.put(protect, authorize('team', 'admin'), updateClient)
	.delete(protect, authorize('team', 'admin'), deleteClient)
	.get(protect, authorize('team', 'admin'), getClient);

module.exports = router;
