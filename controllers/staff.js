const Staff = require("../models/staff");
const Health = require("../models/health");
const TimeSheet = require("../models/timesheet");
const User = require("../models/user");

// const dateformat = require('dateformat');
// const dateFormat = require('date-and-time');

/*
# Method name: getStaffs
# Implementation: render staff management page
# Description: show add staff feature
*/
exports.getStaffs = (req, res, next) => {
  res.render("admin/staff", {
    pageTitle: "Nhân Viên",
    path: "/staffs",
  });
};

/*
# Method name: postAddStaff
# Implementation: add new staff
# Description: post new staff's data to database
# Staff's data: staff'id, password, permission, name, 
  date of birth, salary scale, start date, department,
  annualLeave, image
*/
exports.postAddStaff = (req, res, next) => {
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
    image: image,
  });
  console.log(req.body);
  staff
    .save()
    .then(() => {
      res.redirect("/staffs");
    })
    .catch((err) => console.log(err));
};

function escapeRegex(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};
exports.getStaffInfo = (req, res, next) => {
  // https://www.youtube.com/watch?v=9_lKMTXVk64
  var noMatch = null;
  if(req.query.search) {
      const regex = new RegExp(escapeRegex(req.query.search), 'gi');
      // Get all campgrounds from DB
      Staff.find({name: regex}, function(err, staff){
          if(err){
              console.log(err);
          } else {
            if(staff.length < 1) {
                noMatch = "No campgrounds match that query, please try again.";
            }
            // res.render("campgrounds/index",{campgrounds:allCampgrounds, noMatch: noMatch});
            console.log(staff);
            res.render("staff/staff-info", {
              pageTitle: "Thông Tin Nhân Viên",
              path: "/staff-info",
              staff: staff[0],
            });
            console.log(req.user);
          }
      });
  } else {
    req.user
      .populate("staffId")
      .then((staff) => {
        res.render("staff/staff-info", {
          pageTitle: "Thông Tin Nhân Viên",
          path: "/staff-info",
          staff: staff.staffId,
        });
        console.log(req.user);
      })
      .catch((err) => console.log(err));
  }
};

/*
# Method name: postStaffInfo
# Implementation: post edited staff's info to database
# Description: user is only edit image Url
# 
*/
exports.postStaffInfo = (req, res, next) => {
  const imageUrl = req.body.image;
  req.user
    .populate("staffId")
    .then((staff) => {
      console.log(staff.staffId.image);
      staff.staffId.image = imageUrl;
      return staff.staffId
        .save()
        .then((result) => {
          res.redirect("/staff-info");
        })
        .catch((err) => console.log(err));
    })
    .catch((err) => console.log(err));
};

/*
# Method name: getHealthInfo
# Implementation: render staff health infomation page
# Description: page consist of body temperate, vaccine and infect covid of resistry features
  list infomation after registied.
*/
exports.getHealthInfo = (req, res, next) => {
  req.user
    .populate("staffId")
    .then((staff) => {
      Health.find({ staffId: staff.staffId._id }) //findOne cua mongoose luon tra ve 1 user dau tien trong collection users
        .then((health) => {
          if (health.length <= 0) {
            //if user not exist, add new user.
            const health = new Health({
              staffId: staff.staffId._id,
            });
            health.save();
          }
        })
        .catch((err) => console.log(err));
      return staff;
    })
    .then((staff) => {
      Health.find({ staffId: staff.staffId._id }) //findOne cua mongoose luon tra ve 1 user dau tien trong collection users
        .then((health) => {
          console.log(health);
          res.render("staff/staff-health", {
            pageTitle: "Thông Tin Sức Khỏe",
            path: "/health-info",
            vaccineStatus: health[0].vaccineInfo.vaccineStatus,
            covidStatus: health[0].covidInfo.covidStatus,
            bodyStatus: health[0].bodyInfo.bodyStatus,
          });
          // console.log(health);
        })
        .catch((err) => console.log(err));
    })
    .catch((err) => console.log(err));
};

/*
# Method name: postHealthInfo
# Implementation: post staff's registed health infomation to database
# Description: from staff's health infomation view, input data and regsistry
*/
exports.postHealthInfo = (req, res, next) => {
  const healthInfo = req.body.healthInfo;
  let healthData = "";
  Health.find({ staffId: req.user.staffId._id })
    .then((health) => {
      console.log(health[0]);
      if (healthInfo == "tempCovid") {
        //Format to ISOdate before update database
        //https://docs.mongodb.com/manual/reference/method/Date/
        // const dateTime =  req.body.checkedDate + 'T' + req.body.checkedTime +'Z';
        // console.log(dateTime);
        // healthData = {temp: req.body.tempInfo, date: dateTime};
        healthData = {
          temp: req.body.tempInfo,
          date: req.body.checkedDateTime,
        };
      } else if (healthInfo == "vaccineCovid") {
        healthData = {
          time: req.body.vaccineInfo,
          date: req.body.vaccineDate,
        };
      } else if (healthInfo == "infectCovid") {
        healthData = {
          infect: req.body.infectCovid,
          date: req.body.infectedDate,
        };
      } else {
        console.log("Not found Registry");
      }
      return health[0].updateHealthInfo(healthInfo, healthData);
    })
    .then((result) => {
      res.redirect("/health-info");
    })
    .catch((err) => console.log(err));
};

/*
# Method name: getStaffTimeSheet
# Implementation: render staff time sheet registion page
# Description: show working status, start time working, end time working and take leave feature
*/
exports.getStaffTimeSheet = (req, res, next) => {
  req.user
    .populate("staffId")
    .then((staff) => {
      TimeSheet.find({ staffId: staff.staffId._id })
        .then((timesheet) => {
          // console.log(timesheet);
          if (timesheet.length <= 0) {
            //if user not exist, add new user.
            const timesheet = new TimeSheet({
              staffId: staff.staffId._id,
              workInfo: [],
              timeTotal: [],
              workStatus: false,
            });
            timesheet.save();
            return res.redirect("/");
          } else {
            res.render("staff/staff-timesheet", {
              pageTitle: "Chấm Công",
              path: "/",
              staff: staff.staffId,
              timesheet: timesheet[0],
              // covidStatus: health.covidInfo.covidStatus,
              // bodyStatus: health.bodyInfo.bodyStatus,
            });
          }
        })
        .catch((err) => console.log(err));
    })
    .then((staff) => {
      //
    })
    .catch((err) => console.log(err));
};

/*
# Method name: postStartTime
# Implementation: post starttime and working place to database
# Description: checkin feature
*/
exports.postStartTime = (req, res, next) => {
  // const timeNow = new Date().toLocaleString('en-US', { timeZone: 'Japan' });
  const timeNow = new Date();
  // console.log(timeInfo);
  req.user
    .populate("staffId")
    .then((staff) => {
      TimeSheet.find({ staffId: req.user.staffId }).then((timesheet) => {
        // console.log(timeNow.getHours());
        timesheet[0]
          .addStartTime({ location: req.body.location, startTime: timeNow })
          .then((result) => {
            res.redirect("/");
          })
          .catch((err) => console.log(err));
      });
    })
    .catch((err) => console.log(err));
};

/*
# Method name: postStartTime
# Implementation: post endtime and working place to database
# Description: checkout feature
*/
exports.postEndTime = (req, res, next) => {
  const timeNow = new Date();
  // console.log(timeInfo);
  req.user
    .populate("staffId")
    .then((staff) => {
      TimeSheet.find({ staffId: req.user.staffId }).then((timesheet) => {

        //Before checking out, must check regsisted start time and working place are existing or not
        //If not, imform to user
        if (
          timesheet[0].locations.length > 0 &&
          timesheet[0].startTimes.length > 0 && 
          timesheet[0].workStatus
        ) {
          timesheet[0]
            .addEndTime(timeNow)
            .then((result) => {
              res.redirect("/");
            })
            .catch((err) => console.log(err));
        } else {
          console.log('Chưa đăng ký thời gian và địa điểm làm việc');
        }
      });
    })
    .catch((err) => console.log(err));
};

/*
# Method name: postTakeLeave
# Implementation: post registed leave to database
# Description: take leave feature
*/
exports.postTakeLeave = (req, res, next) => {
  const timeNow = new Date();
  // console.log(timeInfo);
  req.user
    .populate("staffId")
    .then((staff) => {
      TimeSheet.find({ staffId: req.user.staffId }).then((timesheet) => {

        //Get from input data from take leave input form
        const startDateTime = new Date(req.body.startDateTime);
        const endDateTime = new Date(req.body.endDateTime);
        const leaveTime = parseInt(req.body.leaveTime);

        //Get user annauleave info
        const annualLeave = staff.staffId.annualLeave;

        //Checking start time and end time are valid or not
        //Leave rule: start time is alway less than and equal to end time
        if (startDateTime.getTime() <= endDateTime.getTime()) {
          //console.log((endDateTime.getTime() - startDateTime.getTime())/(1000*60*60*24) + 24);

          //Saturday and Sunday(default leave) will be filtered out and keep normal date
          let countWithoutSatAndSun = 0;
          let leaveTime_ar = [];
          const curDate = startDateTime;
          while (curDate <= endDateTime) {
            const dayOfWeek = curDate.getDay();
            if (dayOfWeek !== 0 && dayOfWeek !== 6) {
              countWithoutSatAndSun++;
              leaveTime_ar.push({
                date: curDate.toISOString().substring(0, 10),
                leaveTime: leaveTime,
              });
            }
            curDate.setDate(curDate.getDate() + 1);
          }

          //Caculate total leave time
          const sumTimeLeave = leaveTime * leaveTime_ar.length;

          //Checking leave is existing or not in database
          let checkExist = [];
          timesheet[0].takeLeaveInfo.forEach((tlf) => {
            leaveTime_ar.forEach((lt_item) => {
              if (lt_item.date == tlf.date) {
                checkExist.push(tlf.date); //push existing date into array
              }
            });
          });

          //Checking chose date leave valid or not
          //Checking chose date leave has being existed in database or not
          //Checking user chose leave time <= user's annual leave or not
          //if chose data leave valid, they've not existed yet and leave time <= user's annual leave, add new take leave to database
          //update staff annual leave
          if (leaveTime_ar.length >= 1) {
            if (checkExist.length <= 0) {
              if (sumTimeLeave <= annualLeave) {
                timesheet[0].addTakeLeave(leaveTime_ar).then((result) => {
                  staff.staffId.annualLeave = annualLeave - sumTimeLeave;
                  staff.staffId
                    .save()
                    .then(() => {})
                    .catch((err) => console.log(err));
                  res.redirect("/");
                });
              } else {
                console.log(
                  "Vui lòng chọn số giờ nghỉ phép trong khoảng hiện có: " +
                    annualLeave +
                    " giờ"
                );
              }
            } else { //
              console.log(
                `Ngày ${checkExist} đã đăng ký nghỉ phép, vui lòng kiểm tra lại`
              );
            }
          } else { //leaveTime_ar.length < 1, inform user must choose date different form Sat and Sun
            console.log(
              "Vui lòng chọn ngày khác T7 và CN(2 ngày nghỉ cố định)"
            );
          }
        } else { //Leave rule: start time is alway less than and equal to end time
          console.log("Vui lòng chọn ngày bắt đầu nghỉ <= nghỉ đến ngày");
        }
        
      });
    })
    .catch((err) => console.log(err));
};

/*
# Method name: getConsultation
# Implementation: render staff consultation page
# Description: show recored timesheet, can select date to view
*/
exports.getConsultation = (req, res, next) => {

  req.user
    .populate("staffId")
    .then((staff) => {
      // TimeSheet.find({ location: 'Côn*' })
      // .then((timesheet) => {
      //   console.log(timesheet);
      // })
      // .catch((err) => console.log(err));
      //calSalary
      TimeSheet.find({ staffId: staff.staffId._id })
        .then((timesheet) => {
          res.render("staff/staff-consultation", {
            pageTitle: "Tra Cứu",
            path: "/consultation",
            timeResults: timesheet[0].timeResults,
            timeSheetDatas: timesheet[0].timeSheetDatas,
            takeLeaveInfo: timesheet[0].takeLeaveInfo,
            monthSalary: timesheet[0].monthSalary,
          });
        })
        .catch((err) => console.log(err));
    })
    .catch((err) => console.log(err));
};

/*
# Method name: postConsultarion
# Implementation: post month salary info to database which want to show out consultation page
# Description: following selected date to show timesheet information
*/
exports.postConsultarion = (req, res, next) => {
  const monthSalary = req.body.monthSalary;

  req.user
    .populate("staffId")
    .then((staff) => {
      TimeSheet.find({ staffId: staff.staffId._id })
        .then((timesheet) => {
          let calSalary = 0;
          let countDate = 0;
          let sumData = { overTime: 0, incompleteTime: 0 };
          timesheet[0].timeSheetDatas.forEach((tsd) => {
            if (tsd.date.substring(0, 7) == monthSalary) {
              sumData.overTime += tsd.overTime;
              sumData.incompleteTime += tsd.incompleteTime;
              countDate += 1;
            }
          });

          console.log(countDate);
          if (countDate > 0) {
            calSalary =
              300000 * staff.staffId.salaryScale +
              (sumData.overTime - sumData.incompleteTime) * 200000;
          } else {
            calSalary = 0;
            // res.redirect("/consultation");
          }

          timesheet[0].monthSalary.month = monthSalary;
          timesheet[0].monthSalary.salary = calSalary;
          return timesheet[0]
            .save()
            .then((result) => {
              console.log(calSalary);
              res.redirect("/consultation");
            })
            .catch((err) => console.log(err));

          //   if (timesheet[0].monthSalaries.length <= 0) {
          //     timesheet[0].monthSalaries.push({
          //       month: monthSalary,
          //       salary: calSalary,
          //     });
          //     return timesheet[0]
          //       .save()
          //       .then((result) => {
          //         // res.redirect("/consultation");
          //       })
          //       .catch((err) => console.log(err));
          //   } else {
          //     const monthSalarieIndex = timesheet[0].monthSalaries.findIndex(
          //       (monthSalarie) => {
          //         return monthSalarie.month == monthSalary;
          //       }
          //     );
          //     if (monthSalarieIndex < 0) {
          //       timesheet[0].monthSalaries.push({
          //         month: monthSalary,
          //         salary: calSalary,
          //       });
          //       return timesheet[0]
          //         .save()
          //         .then((result) => {
          //         //   res.redirect("/consultation");
          //         })
          //         .catch((err) => console.log(err));
          //     } else {
          //       timesheet[0].monthSalaries[monthSalarieIndex].salary = calSalary;
          //       return timesheet[0]
          //         .save()
          //         .then((result) => {
          //         //   res.redirect("/consultation");
          //         })
          //         .catch((err) => console.log(err));
          //     }
          //   }
        })
        .catch((err) => console.log(err));
    })
    .catch((err) => console.log(err));
};

