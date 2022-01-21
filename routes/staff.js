const express = require('express');

const staffController = require('../controllers/staff');
const router = express.Router();



router.get('/staffs', staffController.getStaffs);

router.post('/add-staff', staffController.postAddStaff);

router.get('/staff-info', staffController.getStaffInfo);

router.post('/staff-info', staffController.postStaffInfo);

router.get('/health-info', staffController.getHealthInfo);

router.post('/health-registry', staffController.postHealthInfo);

router.get('/', staffController.getStaffTimeSheet);

router.post('/update-timesheet', staffController.postStartTime);

router.get('/consultation', staffController.getConsultarion);

router.post('/consultation', staffController.postConsultarion);



module.exports = router;