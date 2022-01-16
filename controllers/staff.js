const Staff = require('../models/staff');
const Health = require('../models/health');
const TimeSheet = require('../models/timesheet');
const User = require('../models/user');
const { redirect } = require('express/lib/response');

// const dateformat = require('dateformat');
// const dateFormat = require('date-and-time');

exports.getStaffs = ((req, res, next) => {
    res.render('admin/staff', {
        pageTitle: "Nhân Viên",
        path:'/staffs'
    })
});

exports.postAddStaff = ((req, res, next) => {
    const idNumber = req.body.idNumber;
    const password = req.body.password;
    const permission = req.body.permission;
    const name = req.body.name;
    const doB = req.body.doB;
    const salaryScale = req.body.salaryScale;
    const startDate = req.body.startDate;
    const department = req.body.department;
    const annualLeave = req.body.annualLeave;
    const image = req.body.image;
    const staff = new Staff({
        idNumber: idNumber,
        password: password,
        permission: permission,
        name: name,
        doB: doB,
        salaryScale: salaryScale,
        startDate: startDate,
        department: department,
        annualLeave: annualLeave,
        image: image
    });
    console.log(req.body);
    staff
        .save()
        .then(() => {
            res.redirect('/staffs');
        })
        .catch(err => console.log(err));
});


exports.getStaffInfo = ((req, res, next) => {
    req.user
        .populate('staffId')
        .then(staff => {
            res.render('staff/staff-info', {
                pageTitle: "Thông Tin Nhân Viên",
                path:'/staff-info',
                staff: staff.staffId
            });
            console.log(req.user);
        })
        .catch(err => console.log(err));
});

exports.getHealthInfo = ((req, res, next) => {
    req.user
        .populate('staffId')
        .then(staff => {
            Health
                .find({staffId: staff.staffId._id}) //findOne cua mongoose luon tra ve 1 user dau tien trong collection users
                .then((health) => {
                    if(health.length <= 0){ //if user not exist, add new user.
                        const health = new Health({
                            staffId: staff.staffId._id,
                        });
                        health.save();
                    } 
                })
                .catch(err => console.log(err));

            return staff;
        })
        .then((staff) => {
            Health
                .find({staffId: staff.staffId._id}) //findOne cua mongoose luon tra ve 1 user dau tien trong collection users
                .then((health) => {
                    console.log(health);
                    res.render('staff/staff-health', {
                        pageTitle: "Thông Tin Sức Khỏe",
                        path:'/health-info',
                        vaccineStatus: health[0].vaccineInfo.vaccineStatus,
                        covidStatus: health[0].covidInfo.covidStatus,
                        bodyStatus: health[0].bodyInfo.bodyStatus,
                    });
                    // console.log(health);
                })
                .catch(err => console.log(err));
        })
        .catch(err => console.log(err));
});

exports.postHealthInfo = ((req, res, next) => {
    const healthInfo = req.body.healthInfo;
    let healthData = '';
    Health
        .find({staffId: req.user.staffId._id})
        .then(health => {
            console.log(health[0]);
            if(healthInfo == 'tempCovid'){
                //Format to ISOdate before update database
                //https://docs.mongodb.com/manual/reference/method/Date/
                // const dateTime =  req.body.checkedDate + 'T' + req.body.checkedTime +'Z';
                // console.log(dateTime);
                // healthData = {temp: req.body.tempInfo, date: dateTime};
                healthData = {temp: req.body.tempInfo, date: req.body.checkedDateTime};
            } else if(healthInfo == 'vaccineCovid') {
                healthData = {time: req.body.vaccineInfo, date: req.body.vaccineDate};
                
            } else if(healthInfo == 'infectCovid') {
                healthData = {infect: req.body.infectCovid, date: req.body.infectedDate};

            } else {
                console.log('Not found Registry')
            }
            return health[0].updateHealthInfo(healthInfo, healthData);
        })
        .then(result => {
            res.redirect('/health-info');
        })
        .catch(err => console.log(err));
});


exports.getStaffTimeSheet = ((req, res, next) => {
    req.user
        .populate('staffId')
        .then(staff => {
            TimeSheet
                .find({staffId: staff.staffId._id})
                .then(timesheet => {
                    console.log(timesheet);
                    if(timesheet.length <= 0){ //if user not exist, add new user.
                        const timesheet = new TimeSheet({
                            staffId: staff.staffId._id,
                            workInfo: [],
                            timeTotal: [],
                            workStatus: false
                        });
                        timesheet.save();
                        return res.redirect('/');
                    } else {

                        res.render('staff/staff-timesheet', {
                            pageTitle: "Chấm Công",
                            path:'/',
                            staff: staff
                            // covidStatus: health.covidInfo.covidStatus,
                            // bodyStatus: health.bodyInfo.bodyStatus,
                        });
                    }
                })
                .catch(err => console.log(err));
        })
        .then((staff) => {
            //
        })
        .catch(err => console.log(err));
});

exports.postStartTime = ((req, res, next) => {
    const timeNow = new Date().toLocaleString('en-US', { timeZone: 'Japan' });
    const location = req.body.location;
    const timeInfo = req.body.timeInfo;

    TimeSheet
        .find({staffId: req.user.staffId._id})
        .then(timesheet => {
            if(timeInfo == 'startTime'){
                timesheet[0]
                    .addStartTime({location: location, startTime: timeNow})
                    .then(result => {
                        res.redirect('/');
                    })
                    .catch(err => console.log(err));
            } else if (timeInfo == 'endTime') {
                timesheet[0]
                    .addEndTime(timeNow)
                    .then(result => {
                        res.redirect('/');
                    })
                    .catch(err => console.log(err));
            }

        })
        .catch(err => console.log(err));
});

