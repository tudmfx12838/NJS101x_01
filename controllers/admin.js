const Staff = require("../models/staff");
const bcrypt = require('bcryptjs');

/*
# Method name: getStaffs
# Implementation: render staff management page
# Description: show add staff feature
*/
exports.getStaffs = (req, res, next) => {
    if(!req.session.isLoggedIn){
      return res.redirect('/login');
    }
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

    Staff
      .findOne({idNumber: idNumber}) //checking exist in db or not
      .then(staffDoc => {
        if(staffDoc){
          return res.redirect('/staffs');
        }

        return bcrypt.hash(password, 12)
      })
      .then(hashedPassword => {
        const staff = new Staff({
          idNumber: idNumber,
          password: hashedPassword,
          permission: permission,
          name: name,
          doB: doB,
          salaryScale: salaryScale,
          startDate: startDate,
          department: department,
          annualLeave: annualLeave,
          image: image,
        });

        return staff.save();
      })
      .then(() => {
        res.redirect("/login");
      })
      .catch((err) => console.log(err));
  };