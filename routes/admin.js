const express = require('express');
const isAuth = require('../middleware/is_auth');

const router = express.Router();

const adminController = require('../controllers/admin');

//route to get add staff feature
router.get('/staffs', isAuth.isAdmin, isAuth.isLoggedIn, adminController.getStaffs);

//route to post added new staff data to database
router.post('/add-staff', isAuth.isAdmin, isAuth.isLoggedIn, adminController.postAddStaff);

module.exports = router;