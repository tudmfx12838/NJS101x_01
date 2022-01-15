const Staff = require('../models/staff');
const Health = require('../models/health');
const User = require('../models/user');

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
                .findOne() //findOne cua mongoose luon tra ve 1 user dau tien trong collection users
                .then((health) => {
                    if(!health){ //if user not exist, add new user.
                        const health = new Health({
                            staffId: staff.staffId._id,
                        });
                        health.save();
                    } 
                })
                .catch(err => console.log(err));
        })
        .then(() => {
            Health
                .findOne() //findOne cua mongoose luon tra ve 1 user dau tien trong collection users
                .then((health) => {
                    res.render('staff/staff-health', {
                        pageTitle: "Thông Tin Sức Khỏe",
                        path:'/staff-health',
                        // staff: staff
                    });
                    // console.log(health);
                })
                .catch(err => console.log(err));
        })
        .catch(err => console.log(err));
});

exports.postHealthInfo = ((req, res, next) => {
    const healthInfo = req.body.healthInfo;
    Health
        .find({staffId: req.user.staffId._id})
        .then(health => {
            // console.log(req.user._id);
            console.log(health[0]);
            // console.log(health.bodyInfo.bodyStatus);
            if(healthInfo == 'tempCovid'){
                const bodyStatus = {temp: req.body.tempInfo, date: req.body.checkedTime};
                console.log(bodyStatus);
                // console.log({status: bodyInfo});
                health[0]
                    .addToBodyInfo(bodyStatus)
                    .then(result => {
                        res.redirect('/health-info');
                        console.log('Đăng ký thân nhiệt thành công');
                    })
                    .catch(err => console.log(err));
            } else if(healthInfo == 'vaccineCovid') {
                const covidStatus = {time: req.body.vaccineInfo, date: req.body.vaccineDate};
                console.log(covidStatus);
                // console.log({status: bodyInfo});
                health[0]
                    .addToVaccineInfo(covidStatus)
                    .then(result => {
                        res.redirect('/health-info');
                        console.log('Đăng ký thông tin vaccine thành công');
                    })
                    .catch(err => console.log(err));
            } else if(healthInfo == 'infectCovid') {
                const covidStatus = {infect: req.body.infectCovid, date: req.body.infectedDate};
                console.log(covidStatus);
                // console.log({status: bodyInfo});
                health[0]
                    .addToCovidInfo(covidStatus)
                    .then(result => {
                        res.redirect('/health-info');
                        console.log('Đăng ký thông tin nhiễm Covid thành công');
                    })
                    .catch(err => console.log(err));
            } else {
                console.log('Not found Registry')
            }

        })
});