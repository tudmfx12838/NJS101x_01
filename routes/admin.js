const express = require('express');

const router = express.Router();

const adminController = require('../controllers/admin');

//route to get add staff feature
router.get('/staffs', adminController.getStaffs);

//route to post added new staff data to database
router.post('/add-staff', adminController.postAddStaff);

module.exports = router;