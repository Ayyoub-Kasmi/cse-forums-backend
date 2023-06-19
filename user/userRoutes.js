const { Router } = require('express');

const userControllers = require('./userControllers');
const {verifyUser} = require('../auth/authMiddlewares');
const userRoles = require('../prisma/userRoles');

//import sub-routes
const favoriteRoutes = require('./favorites/favoriteRoutes')
const activityRoutes = require('./activities/activityRoutes');

const router = Router(); 

router.use(verifyUser);

//profile management
router.route('/:id')
    .get(userControllers.get_profile) //get the personal profile page
    .put(userControllers.update_profile) //edit profile information
    .delete(userControllers.delete_profile) //delete the profile

//favourites management
router.use('/:id/favorites', favoriteRoutes);

//activities management
router.use('/:id/activities', activityRoutes);

module.exports = router;