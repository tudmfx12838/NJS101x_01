const Staff = require("../models/staff");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const { validationResult } = require("express-validator");

exports.getUserLogin = (req, res, next) => {
  let message = req.flash("error");
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }

  // console.log(req.flash('error'));
  // console.log(req.session.isLoggedIn);

  res.render("auth/user-login", {
    pageTitle: "Login",
    path: "/login",
    errorMessage: message,
    oldInput: { loginId: "" },
    validationErrors: [],
    // isAuthenticated: req.session.isLoggedIn,
    // csrfToken: req.csrfToken() //duoc cung cap boi goi csrfProtection trong middleware app.js
  });
};

exports.postUserLogin = (req, res, next) => {
  const loginId = req.body.loginId;
  const password = req.body.password;

  const errors = validationResult(req);
  console.log(errors.array());
  if (!errors.isEmpty()) {
    return res.status(422).render("auth/user-login", {
      path: "/login",
      pageTitle: "Login",
      errorMessage: errors.array()[0].msg,
      oldInput: { loginId: loginId },
      validationErrors: errors.array(),
    });
  }

  Staff.findOne({ idNumber: loginId })
    .then((staff) => {
      if (!staff) {
        // req.flash("error", "Mã số nhân viên hoặc mật khẩu không đúng !");
        return res.status(422).render("auth/user-login", {
          path: "/login",
          pageTitle: "Login",
          errorMessage: errors.array()[0].msg,
          oldInput: { loginId: loginId },
          validationErrors: [],
        });
      }
      bcrypt
        .compare(password, staff.password)
        .then((doMatch) => {
          if (doMatch) {
            req.session.isLoggedIn = true;
            req.session.user = staff;
            return req.session.save((err) => {
              //Them save() y nghia la ngan cho res.redirect("/") hoat dong doc lap, vai page co the render truoc khi session duoc update
              console.log(err);
              res.redirect("/");
            });
          }
          // req.flash("error", "Mã số nhân viên hoặc mật khẩu không đúng !");
          // console.log(errors);
          return res.status(422).render("auth/user-login", {
            path: "/login",
            pageTitle: "Login",
            errorMessage: "Mật khẩu không đúng !",
            oldInput: { loginId: loginId },
            validationErrors: [{ param: "password" }],
          });
        })
        .catch((err) => {
          console.log(err);
          res.redirect("/login");
        });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.postUserLogout = (req, res, next) => {
  req.session.destroy((err) => {
    console.log(err);
    res.redirect("/login");
  });
};

exports.getReset = (req, res, next) => {
  let message = req.flash("error");
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render("auth/user-reset", {
    path: "/reset",
    pageTitle: "Reset Password",
    errorMessage: message,
    validationErrors: [],
  });
};

exports.postReset = (req, res, next) => {
  const errors = validationResult(req);
  console.log(errors.array());
  if (!errors.isEmpty()) {
    return res.status(422).render("auth/user-reset", {
      path: "/reset",
      pageTitle: "Reset Password",
      errorMessage: errors.array()[0].msg,
      validationErrors: errors.array(),
    });
  }

  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      console.log(err);
      return res.redirect("/reset");
    }

    const token = buffer.toString("hex");
    Staff.findOne({ idNumber: req.body.idNumber })
      .then((user) => {
        if (!user) {
          // req.flash("error", "Mã số nhân viên không tồn tại !");
          return res.status(422).render("auth/user-reset", {
            path: "/reset",
            pageTitle: "Reset Password",
            errorMessage: errors.array()[0].msg,
            validationErrors: errors.array(),
          });
        }

        user.resetToken = token;
        user.resetTokenExpiration = Date.now() + 3600000; //3600000 milisecond = 1hour
        return user.save().then((result) => {
          req.flash(
            "error",
            "Kiểm tra mail xác nhận trước khi thay đổi mật khẩu"
          );
        });
      })
      .then((result) => {
        res.redirect("/login");
      })
      .catch((err) => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
      });
  });
};

exports.getNewPassword = (req, res, next) => {
  const token = req.params.token;
  Staff.findOne({
    resetToken: token,
    resetTokenExpiration: { $gt: Date.now() },
  })
    .then((user) => {
      console.log(user);
      let message = req.flash("error");
      if (message.length > 0) {
        message = message[0];
      } else {
        message = null;
      }
      res.render("auth/user-new-password", {
        path: "/new-password",
        pageTitle: "New Password",
        errorMessage: message,
        userId: user._id.toString(),
        passwordToken: token,
        validationErrors: [],
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.postNewPassword = (req, res, next) => {
  const newPassword = req.body.password;
  // const pwConfirm = req.body.pwConfirm;
  const userId = req.body.userId;
  const passwordToken = req.body.passwordToken;
  let resetUser;

  const errors = validationResult(req);
  console.log(errors.array());
  if (!errors.isEmpty()) {
    return res.status(422).render("auth/user-new-password", {
      path: "/new-password",
      pageTitle: "New Password",
      errorMessage: errors.array()[0].msg,
      userId: userId.toString(),
      passwordToken: passwordToken,
      validationErrors: errors.array(),
    });
  }

  Staff.findOne({
    resetToken: passwordToken,
    resetTokenExpiration: { $gt: Date.now() },
    _id: userId,
  })
    .then((user) => {
      resetUser = user;
      return bcrypt.hash(newPassword, 12);
    })
    .then((hashedPassword) => {
      resetUser.password = hashedPassword;
      resetUser.resetToken = undefined;
      resetUser.resetTokenExpiration = undefined;
      return resetUser.save();
    })
    .then((result) => {
      res.redirect("/login");
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};
