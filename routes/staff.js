const express = require('express');

const staffController = require('../controllers/staff');
const router = express.Router();



router.get('/staffs', staffController.getStaffs);

router.post('/add-staff', staffController.postAddStaff);

router.get('/staff-info', staffController.getStaffInfo);

router.get('/health-info', staffController.getHealthInfo);

router.post('/health-registry', staffController.postHealthInfo);

module.exports = router;