const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ dest: 'uploads/', limits: { fileSize: 2000000 } });

const {
	getClients,
	getClient,
	deleteClient,
	addClient,
	updateClient,
} = require('../controllers/clientsController');

router.route('/').post(addClient).get(getClients);
router.route('/:id').put(updateClient).delete(deleteClient).get(getClient);

module.exports = router;
