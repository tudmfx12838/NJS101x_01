const express = require('express');

const router = express.Router();

const userController = require('../controllers/auth');

//get user login
router.get('/login', userController.getUserLogin);

//post user login
router.post('/login', userController.postUserLogin);

router.post('/logout', userController.postUserLogout);


module.exports = router;