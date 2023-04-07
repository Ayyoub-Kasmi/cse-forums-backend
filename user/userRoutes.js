const { Router } = require('express');

const userControllers = require('./userControllers');
const requireAuth = require('../auth/authMiddleware');

//import sub-routes
const favoriteRoutes = require('./favorites/favoriteRoutes')
const activityRoutes = require('./activities/activityRoutes');

const router = Router(); 

router.use(requireAuth);

//profile management
router.get('/:id', requireAuth, userControllers.get_profile); //get the personal profile page
router.put('/:id', requireAuth, userControllers.update_profile); //edit profile information
router.delete('/:id', requireAuth, userControllers.delete_profile); //delete the profile

//favourites management
router.use('/:id/favorites', favoriteRoutes);

//activities management
router.use('/:id/activities', activityRoutes);

module.exports = router;