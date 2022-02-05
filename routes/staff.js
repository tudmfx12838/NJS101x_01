const express = require('express');
const isAuth = require('../middleware/is_auth');

//import staff controller
const staffController = require('../controllers/staff');
//import expess js router
const router = express.Router();


//route to get staff information of view
router.get('/staff-info', isAuth, staffController.getStaffInfo);

//route to post staff information to database
router.post('/staff-info', isAuth, staffController.postStaffInfo);

//route to get health information
router.get('/health-info', isAuth, staffController.getHealthInfo);

//route to post registried health information to database
router.post('/health-registry', isAuth, staffController.postHealthInfo);

//route to get staff's timesheet of view
router.get('/', isAuth, staffController.getStaffTimeSheet);


// router.post('/update-timesheet', staffController.postStartTime);
//route to post working time is begin
router.post('/timesheet-starttime', isAuth, staffController.postStartTime);

//route to post working time is end
router.post('/timesheet-endtime', isAuth, staffController.postEndTime);

//route to post taking a leave
router.post('/timesheet-takeleave', isAuth, staffController.postTakeLeave);

//route to get staff's consultation of view
router.get('/consultation', isAuth, staffController.getConsultation);

//route to post staff's consultation to database
router.post('/consultation', isAuth, staffController.postConsultarion);


module.exports = router;