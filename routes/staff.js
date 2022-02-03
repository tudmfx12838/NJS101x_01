const express = require('express');

//import staff controller
const staffController = require('../controllers/staff');
//import expess js router
const router = express.Router();


//route to get add staff feature
router.get('/staffs', staffController.getStaffs);

//route to post added new staff data to database
router.post('/add-staff', staffController.postAddStaff);

//route to get staff information of view
router.get('/staff-info', staffController.getStaffInfo);

//route to post staff information to database
router.post('/staff-info', staffController.postStaffInfo);

//route to get health information
router.get('/health-info', staffController.getHealthInfo);

//route to post registried health information to database
router.post('/health-registry', staffController.postHealthInfo);

//route to get staff's timesheet of view
router.get('/', staffController.getStaffTimeSheet);


// router.post('/update-timesheet', staffController.postStartTime);
//route to post working time is begin
router.post('/timesheet-starttime', staffController.postStartTime);

//route to post working time is end
router.post('/timesheet-endtime', staffController.postEndTime);

//route to post taking a leave
router.post('/timesheet-takeleave', staffController.postTakeLeave);

//route to get staff's consultation of view
router.get('/consultation', staffController.getConsultation);

//route to post staff's consultation to database
router.post('/consultation', staffController.postConsultarion);



module.exports = router;