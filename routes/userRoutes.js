const { Router } = require('express');

const userControllers = require('../controllers/userControllers');
const { validateBody, schemas } = require('../helpers/validator');

const router = Router();

//profile management
router.get('/user/:id', userControllers.get_profile); //get the personal profile page
router.put('/user/:id', userControllers.update_profile); //edit profile information
router.delete('/user/:id', userControllers.delete_profile); //delete the profile

//favourites management
router.get('/user/:id/favorites', userControllers.get_favorites); //get the list of the favorites of the current user
router.post('/user/:id/favorites', userControllers.add_favorite); //add an item to the favorites
router.delete('/user/:id/favorites', userControllers.delete_favorite); //delete an item from the favorites

//activities management
router.get('/user/:id/activities', userControllers.get_activities); //get the list of the activities of the current user
router.post('/user/:id/activities', userControllers.add_activity); //add an activity to the list of the activities of the current user
router.delete('/user/:id/activities', userControllers.delete_activity); //add an activity to the list of the activities of the current user

module.exports = router;