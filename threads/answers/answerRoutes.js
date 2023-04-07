const { Router } = require('express');

const answerControllers = require('./answerControllers');
const requireAuth = require('../../auth/authMiddleware');

const replyRoutes = require('./replies/replyRoutes');

const router = Router( {mergeParams: true }); 

// router.use(requireAuth);

//manage the answers
router.post('/create', answerControllers.create_answer);
router.get('/all', answerControllers.get_all_answers);
router.put('/:answerId', answerControllers.update_answer);
router.delete('/:answerId', answerControllers.delete_answer);
router.post('/:answerId/like', answerControllers.like_answer);
router.delete('/:answerId/like', answerControllers.unlike_answer)

//manage replies to answers
router.use('/:answerId/replies', replyRoutes);

module.exports = router;