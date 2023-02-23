const { Router } = require('express');

const authController = require('../controllers/authControllers');
const { validateBody, schemas } = require('../helpers/validator');

const router = Router();

router.get('/signup', authController.get_signup);
router.get('/login', authController.get_login);
router.get('/test', authController.test);

// router.post('/signup', validateBody(schemas.signupSchema), authController.post_signup);
router.post('/signup',validateBody(schemas.signupSchema) ,authController.post_signup);
router.post('/login', validateBody(schemas.loginSchema), authController.post_login);

module.exports = router;