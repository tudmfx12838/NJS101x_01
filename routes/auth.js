const express = require('express');

const router = express.Router();

const authController = require('../controllers/auth');

//get user login
router.get('/login', authController.getUserLogin);

//post user login
router.post('/login', authController.postUserLogin);

//post user logout
router.post('/logout', authController.postUserLogout);

//get user reset password
router.get('/reset', authController.getReset);

//post user reset password
router.post('/reset', authController.postReset);

router.get('/reset/:token', authController.getNewPassword);

router.post('/new-password', authController.postNewPassword);

module.exports = router;