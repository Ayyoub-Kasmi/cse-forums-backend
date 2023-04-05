const { Router } = require('express');

const userControllers = require('../controllers/userControllers');
const requireAuth = require('../middlewares/authMiddleware');
const checkUser = require('../middlewares/userCheckMiddlware');

const router = Router(); 

//profile management
router.get('/user/:id', requireAuth, checkUser, userControllers.get_profile); //get the personal profile page
router.put('/user/:id', requireAuth, checkUser, userControllers.update_profile); //edit profile information
router.delete('/user/:id', requireAuth, checkUser, userControllers.delete_profile); //delete the profile

//favourites management
router.get('/user/:id/favorites', requireAuth, checkUser, userControllers.get_favorites); //get the list of the favorites of the current user
router.post('/user/:id/favorites', requireAuth, checkUser, userControllers.add_favorite); //add an item to the favorites
router.delete('/user/:id/favorites', requireAuth, checkUser, userControllers.delete_favorite); //delete an item from the favorites

//activities management
router.get('/user/:id/activities', requireAuth, checkUser, userControllers.get_activities); //get the list of the activities of the current user
router.post('/user/:id/activities', requireAuth, checkUser, userControllers.add_activity); //add an activity to the list of the activities of the current user
router.delete('/user/:id/activities', requireAuth, checkUser, userControllers.delete_activity); //add an activity to the list of the activities of the current user

module.exports = router;