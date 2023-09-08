const express = require('express');
const AuthController = require('../controllers/auth.controller');

const router = express.Router();

router.post('/register', AuthController.signUp);
router.post('/login', AuthController.login);
router.post('/forgot-password', AuthController.forgotPassword);
router.post('/recover-password', AuthController.recoverPassword);

module.exports = router;
