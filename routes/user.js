const express = require('express');

const router = express.Router();

const userController = require('../controllers/user');

//get user login
router.get('/login', userController.getUserLogin);

//post user login
router.post('/logging', userController.postUserLogin);


module.exports = router;