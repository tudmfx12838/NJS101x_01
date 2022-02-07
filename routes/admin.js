const express = require('express');
const isAuth = require('../middleware/is_auth');

const router = express.Router();

const adminController = require('../controllers/admin');

//route to get add staff feature
router.get('/staffs', isAuth.isAdmin, isAuth.isLoggedIn, adminController.getStaffs);

//route to post added new staff data to database
router.post('/add-staff', isAuth.isAdmin, isAuth.isLoggedIn, adminController.postAddStaff);

//route to get add staff feature
router.get('/staffs/staff-detail/:staffId', isAuth.isAdmin, isAuth.isLoggedIn, adminController.getStaffDetail);

router.post('/staffs/staff-detail/:staffId', isAuth.isAdmin, isAuth.isLoggedIn, adminController.postStaffDetail);

router.get('/staffs/manage-health/:staffId', isAuth.isAdmin, isAuth.isLoggedIn, adminController.getStaffHealthDetail);

router.get('/staffs/manage-health/download/:staffId', isAuth.isAdmin, isAuth.isLoggedIn, adminController.getDownloadStaffHealthDetail);

router.get('/staffs/manage-timesheet/:staffId', isAuth.isAdmin, isAuth.isLoggedIn, adminController.getStaffTimeSheetDetail);

router.post('/staffs/manage-timesheet/add-timesheet/:staffId', isAuth.isAdmin, isAuth.isLoggedIn, adminController.postAddStaffTimeSheetDetail);

router.post('/staffs/manage-timesheet/approve/:staffId', isAuth.isAdmin, isAuth.isLoggedIn, adminController.postStaffTimeSheetDetailApprove);

router.post('/staffs/manage-timesheet/delete/:staffId', isAuth.isAdmin, isAuth.isLoggedIn, adminController.postStaffTimeSheetDetailDelete);


module.exports = router;