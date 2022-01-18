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
                            staff: staff.staffId,
                            timesheet: timesheet[0]
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
    // const timeNow = new Date().toLocaleString('en-US', { timeZone: 'Japan' });
    const timeInfo = req.body.timeInfo;
    const timeNow = new Date();
    console.log(timeInfo);
    req.user
        .populate('staffId')
        .then(staff => {
            TimeSheet
            .find({staffId: req.user.staffId})
            .then(timesheet => {
                if(timeInfo == 'startTime'){
                    console.log(timeNow.getHours());
                    timesheet[0]
                        .addStartTime({location: req.body.location, startTime: timeNow})
                        .then(result => {
                            res.redirect('/');
                        })
                        .catch(err => console.log(err));
                } else if (timeInfo == 'endTime' && (timesheet[0].locations.length > 0) && (timesheet[0].startTimes.length > 0)) {
                    timesheet[0]
                        .addEndTime(timeNow)
                        .then(result => {
                            res.redirect('/');
                        })
                        .catch(err => console.log(err));
                } else if (timeInfo == 'leaveRegist') {
                    const startDateTime = new Date(req.body.startDateTime);
                    const endDateTime = new Date(req.body.endDateTime);
                    const dateLeave = req.body.dateLeave;
                    const annualLeave = staff.staffId.annualLeave;

                    if(startDateTime.getTime() <=  endDateTime.getTime()) {
                        //console.log((endDateTime.getTime() - startDateTime.getTime())/(1000*60*60*24) + 24);    
                        let countWithoutSatAndSun = 0;
                        const curDate = new Date(startDateTime.getTime());
                        while (curDate <= endDateTime) {
                            const dayOfWeek = curDate.getDay();
                            if(dayOfWeek !== 0 && dayOfWeek !== 6) countWithoutSatAndSun++;
                            curDate.setDate(curDate.getDate() + 1);
                        }
                        // console.log(countWithoutSatAndSun*8);
                        // console.log('---------------');
                        // console.log(dateLeave);
                        // console.log(annualLeave);
                        if(countWithoutSatAndSun > 1 && countWithoutSatAndSun*8 == dateLeave && dateLeave <= annualLeave){
                            timesheet[0]
                                .addTakeLeave({startDateTime: new Date(req.body.startDateTime), endtDateTime: new Date(req.body.endDateTime), dateLeave: dateLeave})
                                .then(result => {
                                    staff.staffId.annualLeave = annualLeave - dateLeave;
                                    staff.staffId.save().then(() => {}).catch(err => console.log(err));
                                    res.redirect('/');
                                })
                                .catch(err => console.log(err));
                        } else if (dateLeave <= 8 && dateLeave <= annualLeave){
                            timesheet[0]
                            .addTakeLeave({startDateTime: new Date(req.body.startDateTime), endtDateTime: new Date(req.body.endDateTime), dateLeave: dateLeave})
                            .then(result => {
                                staff.staffId.annualLeave = annualLeave - dateLeave;
                                staff.staffId.save().then(() => {}).catch(err => console.log(err));
                                res.redirect('/');
                            })
                            .catch(err => console.log(err));
                        } else {
                            console.log('Số ngày nghỉ lớn hơn ngày phép còn hoặc thời gian nghỉ vào số ngày chọn không phù hợp');
                        }
                    } else {
                        console.log('Vui lòng chọn ngày bắt đầu nghỉ <= nghỉ đến ngày');
                    }
                }
            })
            .catch(err => console.log(err));
        })
        .catch(err => console.log(err));
});


exports.getConsultarion = ((req, res, next) => {
    TimeSheet
    .find({staffId: req.user.staffId})
    .then(timesheet => {
        // console.log(timesheet[0].timeResults[0].locations[0].location);
        // var data ="111";
        // for (let timeResult of timesheet[0].timeResults) {
        //     data++;
        //     for (let i = 0; i < timeResult.startTimes.length; i++) {
            
        //         console.log( timeResult.locations[i].location +'('+ timeResult.startTimes[i].startTime + ')');
        //     }
        //     // console.log(timeResult.startTimes);
        //     // console.log(data);
        // }

        res.render('staff/staff-consultation', {
            pageTitle: "Tra Cứu",
            path:'/consultation',
            timeResults: timesheet[0].timeResults
            // covidStatus: health.covidInfo.covidStatus,
            // bodyStatus: health.bodyInfo.bodyStatus,
        });
    })
    .catch(err => console.log(err));
});