const { Router } = require('express');

const threadControllers = require('./threadControllers');
const requireAuth = require('../auth/authMiddleware');

const answerRoutes = require('./answers/answerRoutes');

const router = Router(); 

// router.use(requireAuth);

//manage the thread
router.post('/create', threadControllers.create_thread);
router.get('/all', threadControllers.get_all_threads);
router.get('/:id', threadControllers.get_thread);
router.put('/:id', threadControllers.update_thread);
router.delete('/:id', threadControllers.delete_thread);
router.post('/:id/tags', threadControllers.add_tags);
router.delete('/:id/tags', threadControllers.remove_tags);
router.post('/:id/vote', threadControllers.vote_thread);
router.delete('/:id/vote', threadControllers.unvote_thread);

//manage the answers
router.use('/:id/answers', answerRoutes);

module.exports = router;