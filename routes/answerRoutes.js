const { Router } = require('express');

const answerController = require('../controllers/answerControllers');
const { validateBody, schemas } = require('../helpers/validator');

const router = Router();

router.post('/answer/submit', validateBody(schemas.answerSchema) ,answerController.answer_post);
router.get('/answer/get',answerController.answer_get);

module.exports = router;