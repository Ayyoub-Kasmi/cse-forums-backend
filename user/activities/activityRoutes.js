const { Router } = require('express');

const activityControllers = require('./activityControllers');

const router = Router({ mergeParams: true }); 

router.get('/', activityControllers.get_activities); //get the list of the activities of the current user
router.post('/', activityControllers.add_activity); //add an activity to the list of the activities of the current user
router.delete('/', activityControllers.delete_activity); //add an activity to the list of the activities of the current user

module.exports = router;