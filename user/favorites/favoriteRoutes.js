const { Router } = require('express');

const favoriteControllers = require('./favoriteControllers');

const router = Router({ mergeParams: true }); 

router.get('/', favoriteControllers.get_favorites); //get the list of the favorites of the current user
router.post('/', favoriteControllers.add_favorite); //add an item to the favorites
router.delete('/', favoriteControllers.delete_favorite); //delete an item from the favorites

module.exports = router;