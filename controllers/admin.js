const Staff = require("../models/staff");

/*
# Method name: getStaffs
# Implementation: render staff management page
# Description: show add staff feature
*/
exports.getStaffs = (req, res, next) => {
    res.render("admin/staff", {
      pageTitle: "Nhân Viên",
      path: "/staffs",
      isAuthenticated: req.session.isLoggedIn
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