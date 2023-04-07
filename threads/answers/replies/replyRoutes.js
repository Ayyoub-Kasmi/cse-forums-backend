const { Router } = require('express');

const requireAuth = require('../../../auth/authMiddleware');

const replyControllers = require('./replyControllers');

const router = Router( {mergeParams: true }); 

// router.use(requireAuth);

//manage replies
router.post('/create', replyControllers.create_reply);
router.get('/all', replyControllers.get_all_replies);
router.put('/:replyId', replyControllers.update_reply);
router.delete('/:replyId', replyControllers.delete_reply);
router.post('/:replyId/like', replyControllers.like_reply);
router.delete('/:replyId/like', replyControllers.unlike_reply)


module.exports = router;