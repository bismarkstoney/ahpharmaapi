const express = require('express');
const router = express.Router();

const {
	getTeam,
	getTeams,
	deleteTeam,
	addTeam,
	updateTeam,
} = require('../controllers/teamController');

router.route('/').post(addTeam).get(getTeams);
router.route('/:id').put(updateTeam).delete(deleteTeam).get(getTeam);

module.exports = router;
