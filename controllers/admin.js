const fs = require("fs");
const path = require("path");
const PDFDocument = require("pdfkit");

const Staff = require("../models/staff");
const Health = require("../models/health");
const Timesheet = require("../models/timesheet");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");

const ITEMS_PER_PAGE = 3;

/*
# Method name: getStaffs
# Implementation: render staff management page
# Description: show add staff feature
*/
exports.getStaffs = (req, res, next) => {
  const page = +req.query.page || 1;
  let totalItems;

  const admin = req.user;

  Staff.find({ adminId: admin._id })
    .countDocuments()
    .then((numStaffs) => {
      totalItems = numStaffs;
      return Staff.find({ adminId: admin._id })
        .skip((page - 1) * ITEMS_PER_PAGE)
        .limit(ITEMS_PER_PAGE);
    })
    .then((staffs) => {
      res.render("admin/staff", {
        pageTitle: "Nhân Viên",
        path: "/staffs",
        staffs: staffs,
        currentPage: page,
        hasNextPage: ITEMS_PER_PAGE * page < totalItems,
        hasPreviousPage: page > 1,
        nextPage: page + 1,
        previousPage: page - 1,
        lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE)
      });

    })
    .catch((err) => console.log(err));

  // Staff.find({ adminId: admin._id })
  //   .then((staffs) => {
  //     res.render("admin/staff", {
  //       pageTitle: "Nhân Viên",
  //       path: "/staffs",
  //       staffs: staffs,
  //     });
  //   })
  //   .catch((err) => console.log(err));
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
  const email = req.body.email;
  const doB = req.body.doB;
  const salaryScale = req.body.salaryScale;
  const startDate = req.body.startDate;
  const department = req.body.department;
  const annualLeave = req.body.annualLeave;
  const image = req.file;

  const imageUrl = image.path;
  Staff.findOne({ idNumber: idNumber }) //checking exist in db or not
    .then((staffDoc) => {
      if (staffDoc) {
        return res.redirect("/staffs");
      }

      return bcrypt.hash(password, 12);
    })
    .then((hashedPassword) => {
      const staff = new Staff({
        adminId: req.user._id,
        idNumber: idNumber,
        password: hashedPassword,
        permission: permission,
        name: name,
        email: email,
        doB: doB,
        salaryScale: salaryScale,
        startDate: startDate,
        department: department,
        annualLeave: annualLeave,
        image: imageUrl,
      });

      return staff.save();
    })
    .then(() => {
      res.redirect("/staffs");
    })
    .catch((err) => console.log(err));
};

exports.getStaffDetail = (req, res, next) => {
  const staffId = req.params.staffId;
  const manage = req.query.manage;
  const admin = req.user;

  // console.log(staffId);
  // console.log(manage);
  Staff.findOne({ _id: staffId })
    .then((staff) => {
      // console.log(staff);

      res.render("admin/staff-detail", {
        pageTitle: "Thông Tin Nhân Viên",
        path: "/staff-detail",
        staff: staff,
      });
    })
    .catch((err) => console.log(err));
};

exports.postStaffDetail = (req, res, next) => {
  const staffId = req.params.staffId;
  const edit = req.query.edit;

  const admin = req.user;

  // console.log(staffId);
  // console.log(edit);
  // console.log(manage);

  const idNumber = req.body.idNumber;
  const password = req.body.password;
  const permission = req.body.permission;
  const name = req.body.name;
  const email = req.body.email;
  const doB = req.body.doB;
  const salaryScale = req.body.salaryScale;
  const startDate = req.body.startDate;
  const department = req.body.department;
  const annualLeave = req.body.annualLeave;

  let staff;
  const image = req.file;
  let imageUrl = null;
  if (image) {
    imageUrl = image.path;
  }

  if (!edit) {
    return res.redirect("/staffs");
  }

  Staff.findOne({ _id: staffId })
    .then((staffDoc) => {
      if (!staffDoc) {
        return res.redirect("/staffs");
      }

      staff = staffDoc;
      if (password) {
        return bcrypt.hash(password, 12);
      }
      return password;
    })
    .then((hashedPassword) => {
      staff.password = hashedPassword === "" ? staff.password : hashedPassword;

      staff.idNumber = staff.idNumber === idNumber ? staff.idNumber : idNumber;
      staff.permission = permission === "" ? staff.permission : permission;
      staff.name = staff.name === name ? staff.name : name;
      staff.email = staff.email === email ? staff.email : email;
      staff.doB = staff.doB === doB ? staff.doB : doB;
      staff.salaryScale =
        staff.salaryScale === salaryScale ? staff.salaryScale : salaryScale;
      staff.startDate =
        staff.startDate === startDate ? staff.startDate : startDate;
      staff.annualLeave =
        staff.annualLeave === annualLeave * 8
          ? staff.annualLeave
          : annualLeave * 8;
      staff.image = imageUrl === null ? staff.image : imageUrl;
      staff.department = department === "" ? staff.department : department;

      return staff.save();
    })
    .then(() => {
      res.redirect(`/staffs/staff-detail/${staffId}?manage=true`);
    })
    .catch((err) => console.log(err));
};

exports.getStaffHealthDetail = (req, res, next) => {
  const staffId = req.params.staffId;
  const manage = req.query.manage;
  const admin = req.user;

  console.log(staffId);
  console.log(manage);

  Staff.findOne({ _id: staffId })
    .then((staffDoc) => {
      if (!staffDoc) {
        return res.redirect("/staffs");
      }
      console.log(staffDoc);
      return staffDoc;
    })
    .then((staff) => {
      Health.find({ staffId: staff._id }) //findOne cua mongoose luon tra ve 1 user dau tien trong collection users
        .then((health) => {
          console.log(health);

          return res.render("admin/staff-health-detail", {
            pageTitle: "Sức Khỏe Nhân Viên",
            path: "/staff-health-detail",
            staff: staff,
            vaccineStatus:
              health.length <= 0 ? false : health[0].vaccineInfo.vaccineStatus,
            covidStatus:
              health.length <= 0 ? false : health[0].vaccineInfo.covidStatus,
            bodyStatus:
              health.length <= 0 ? false : health[0].vaccineInfo.bodyStatus,
          });
        });
    })
    .catch((err) => console.log(err));
};

exports.getDownloadStaffHealthDetail = (req, res, next) => {
  const staffId = req.params.staffId;
  const manage = req.query.manage;
  const admin = req.user;

  console.log(staffId);
  console.log(manage);
  Staff.findOne({ _id: staffId })
    .then((staff) => {
      Health.findOne({ staffId: staff._id }) //findOne cua mongoose luon tra ve 1 user dau tien trong collection users
        .then((health) => {
          if (!health) {
            return res.redirect(
              `/staffs/manage-health/${staff._id}?manage=true`
            );
          }
          const vaccineStatus = health.vaccineInfo.vaccineStatus;
          const covidStatus = health.covidInfo.covidStatus;
          const bodyStatus = health.bodyInfo.bodyStatus;

          const healthName =
            "health-" +
            staff.name +
            "-" +
            staff.idNumber +
            "-" +
            staff._id +
            ".pdf";
          const pathHealth = path.join("data", "healths", healthName);

          const pdfDoc = new PDFDocument();
          res.setHeader("Content-Type", "application/pdf");
          res.setHeader(
            "Content-Disposition",
            'attachment; filename="' + healthName + '"'
          ); //inline

          pdfDoc.pipe(fs.createWriteStream(pathHealth)); //Khoi tao write Stream
          pdfDoc.pipe(res);

          pdfDoc.fontSize(40).text("---Thong Tin Suc Khoe---", {
            underline: false,
          });

          pdfDoc.fontSize(20).text("================================");
          pdfDoc.fontSize(20).text("Thong Tin Nhan Vien");
          pdfDoc.fontSize(15).text("Ten: " + staff.name);
          pdfDoc.fontSize(15).text("MSNV: " + staff.idNumber);
          pdfDoc
            .fontSize(15)
            .text("Ngay sinh: " + staff.doB.toISOString().substring(0, 10));
          pdfDoc.fontSize(15).text("Phong ban: " + staff.department);
          pdfDoc.fontSize(20).text("================================");
          pdfDoc.fontSize(20).text("Thong Tin Than Nhiet");
          if (bodyStatus.length > 0) {
            for (let bst of bodyStatus) {
              pdfDoc
                .fontSize(15)
                .text(
                  "Nhiet do: " +
                    bst.temp +
                    " C - Ngay do: " +
                    bst.date.toISOString().substring(0, 10)
                );
            }
          } else {
            pdfDoc.fontSize(15).text("Thong tin chua cap nhat");
          }
          pdfDoc.fontSize(20).text("================================");
          pdfDoc.fontSize(20).text("Thong Tin Tiem Vaccine");
          if (vaccineStatus.length > 0) {
            for (let vst of vaccineStatus) {
              pdfDoc
                .fontSize(15)
                .text(
                  "Lan tiem: " +
                    vst.time +
                    " - Ngay tiem: " +
                    vst.date.toISOString().substring(0, 10)
                );
            }
          } else {
            pdfDoc.fontSize(15).text("Thong tin chua cap nhat");
          }
          pdfDoc.fontSize(20).text("================================");
          pdfDoc.fontSize(20).text("Thong Tin Test Covid");
          if (covidStatus.length > 0) {
            for (let cst of covidStatus) {
              pdfDoc
                .fontSize(15)
                .text(
                  "Ket qua: " +
                    (cst.infect === false ? "Am tinh" : "Duong tinh") +
                    " - Ngay test: " +
                    cst.date.toISOString().substring(0, 10)
                );
            }
          } else {
            pdfDoc.fontSize(15).text("Thong tin chua cap nhat");
          }
          pdfDoc.fontSize(20).text("================================");
          return pdfDoc.end();
        });
    })
    .catch((err) => console.log(err));
};

exports.getStaffTimeSheetDetail = (req, res, next) => {
  const staffId = req.params.staffId;
  const manage = req.query.manage;
  const admin = req.user;

  // console.log(staffId);
  // console.log(manage);

  Staff.findOne({ _id: staffId })
    .then((staffDoc) => {
      if (!staffDoc) {
        return res.redirect("/staffs");
      }
      // console.log(staffDoc);
      return staffDoc;
    })
    .then((staff) => {
      Timesheet.findOne({ staffId: staff._id }) //findOne cua mongoose luon tra ve 1 user dau tien trong collection users
        .then((timesheet) => {
          return res.render("admin/staff-consultaion-detail", {
            pageTitle: "Tra Cứu",
            path: "/consultation",
            timesheet: timesheet === null ? null : timesheet,
            staff: staff,
          });
        });
    })
    .catch((err) => console.log(err));
};

exports.postAddStaffTimeSheetDetail = (req, res, next) => {
  const staffId = req.params.staffId;
  const add = req.query.add;

  const WORKINGTIMEONDAY = 480; //8hour = 480 minute
  const location = req.body.location;
  const startTime = new Date(req.body.startTime);
  const endTime = new Date(req.body.endTime);
  const leaveTime = parseInt(req.body.leaveTime);

  console.log(req.body.leaveTime);

  const year = startTime.getFullYear();
  const month =
    startTime.getMonth() + 1 < 10
      ? "0" + (startTime.getMonth() + 1)
      : startTime.getMonth() + 1;
  const date =
    startTime.getDate() < 10 ? "0" + startTime.getDate() : startTime.getDate();
  const today = `${year}-${month}-${date}`;

  //Implement udapte timeResults
  const timeTotal =
    endTime.getHours() * 60 +
    endTime.getMinutes() -
    (startTime.getHours() * 60 + startTime.getMinutes()) +
    leaveTime * 60;

  const incompleteTime =
    timeTotal < WORKINGTIMEONDAY ? WORKINGTIMEONDAY - timeTotal : 0;
  const overTime =
    timeTotal > WORKINGTIMEONDAY ? timeTotal - WORKINGTIMEONDAY : 0;
  const approveStatus = false;

  const addtimeResult = {
    locations: [{ location: location }],
    startTimes: [{ startTime: startTime }],
    endTime: endTime,
    timeTotal: timeTotal,
  };

  const addtimeSheetData = {
    date: today,
    timeTotal: timeTotal,
    incompleteTime: incompleteTime,
    overTime: overTime,
    approveStatus: approveStatus,
  };

  // console.log(leaveTime);

  const takeLeaveInfo = {
    date: today,
    leaveTime: leaveTime,
  };

  Staff.findOne({ _id: staffId })
    .then((staffDoc) => {
      if (!staffDoc) {
        return res.redirect("/staffs");
      }
      // console.log(staffDoc);
      return staffDoc;
    })
    .then((staff) => {
      Timesheet.findOne({ staffId: staff._id }) //findOne cua mongoose luon tra ve 1 user dau tien trong collection users
        .then((timesheet) => {
          timesheet.timeResults.push(addtimeResult);
          timesheet.timeSheetDatas.push(addtimeSheetData);
          if (leaveTime > 0) {
            timesheet.takeLeaveInfo.push(takeLeaveInfo);
          }
          return timesheet.save();
        });
    })
    .then((result) => {
      res.redirect(`/staffs/manage-timesheet/${staffId}?manage=true`);
    })
    .catch((err) => console.log(err));
};

exports.postStaffTimeSheetDetailApprove = (req, res, next) => {
  const staffId = req.params.staffId;
  const approve = req.query.approve;
  const admin = req.user;

  const thisDate = req.body.thisDate;

  Staff.findOne({ _id: staffId })
    .then((staffDoc) => {
      if (!staffDoc) {
        return res.redirect("/staffs");
      }
      // console.log(staffDoc);
      return staffDoc;
    })
    .then((staff) => {
      Timesheet.findOne({ staffId: staff._id }) //findOne cua mongoose luon tra ve 1 user dau tien trong collection users
        .then((timesheet) => {
          const index = timesheet.timeSheetDatas.findIndex((tsd) => {
            return tsd.date === thisDate;
          });
          timesheet.timeSheetDatas[index].approveStatus = true;
          return timesheet.save();
        });
    })
    .then((result) => {
      res.redirect(`/staffs/manage-timesheet/${staffId}?manage=true`);
    })
    .catch((err) => console.log(err));
};

exports.postStaffTimeSheetDetailDelete = (req, res, next) => {
  const staffId = req.params.staffId;
  const deleteQuery = req.query.delete;
  const admin = req.user;

  const thisDate = req.body.thisDate;

  Staff.findOne({ _id: staffId })
    .then((staffDoc) => {
      if (!staffDoc) {
        return res.redirect("/staffs");
      }
      // console.log(staffDoc);
      return staffDoc;
    })
    .then((staff) => {
      Timesheet.findOne({ staffId: staff._id }) //findOne cua mongoose luon tra ve 1 user dau tien trong collection users
        .then((timesheet) => {
          const index = timesheet.timeSheetDatas.findIndex((tsd) => {
            return tsd.date === thisDate;
          });
          timesheet.timeSheetDatas.splice(index, 1);
          return timesheet.save();
        });
    })
    .then((result) => {
      res.redirect(`/staffs/manage-timesheet/${staffId}?manage=true`);
    })
    .catch((err) => console.log(err));
};

exports.getStaffConsultaionSearch = (req, res, next) => {
  const search = req.query.search;
  const staffId = req.params.staffId;

  Staff.findOne({ idNumber: search })
  .then((staffDoc) => {
    if (!staffDoc) {
      return res.redirect(`/staffs/manage-timesheet/${staffId}?manage=true`);
    }
    // console.log(staffDoc);
    return staffDoc;
  })
  .then((staff) => {
    res.redirect(`/staffs/manage-timesheet/${staff.id}?manage=true`);
  })
  .then((result) => {
    
  })
  .catch((err) => console.log(err));

}

exports.getStaffHealthSearch = (req, res, next) => {
  const search = req.query.search;
  const staffId = req.params.staffId;

  Staff.findOne({ idNumber: search })
  .then((staffDoc) => {
    if (!staffDoc) {
      return res.redirect(`/staffs/manage-health/${staffId}?manage=true`);
    }
    // console.log(staffDoc);
    return staffDoc;
  })
  .then((staff) => {
    res.redirect(`/staffs/manage-health/${staff.id}?manage=true`);
  })
  .then((result) => {
    
  })
  .catch((err) => console.log(err));

}