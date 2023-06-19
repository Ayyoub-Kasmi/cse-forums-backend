const { Router } = require('express');

const authController = require('./authControllers');
const { validateBody, schemas } = require('../utils/validator');

const router = Router();

router.get('/auth/signup', authController.get_signup);
router.get('/auth/login', authController.get_login);
router.get('/auth/test', authController.test);

// router.post('/signup', validateBody(schemas.signupSchema), authController.post_signup);
router.post('/auth/signup',validateBody(schemas.signupSchema) ,authController.post_signup);
router.post('/auth/login', validateBody(schemas.loginSchema), authController.post_login);
router.get('/auth/token/refresh', authController.refresh_token);
router.post('/auth/logout', authController.post_logout);
module.exports = router;