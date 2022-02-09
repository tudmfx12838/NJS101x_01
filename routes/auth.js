const express = require("express");

const router = express.Router();

const { check, body } = require("express-validator");

const Staff = require('../models/staff');
const authController = require("../controllers/auth");

const isAuth = require('../middleware/is_auth');

//get user login
router.get("/login", isAuth.isNotLoggedIn , authController.getUserLogin);

//post user login
router.post(
  "/login", isAuth.isNotLoggedIn,
  [
    check("loginId")
      .isAlphanumeric()
      .withMessage("Mã số nhân viên không hợp lệ")
      .custom((value, {req}) => {
        return Staff.findOne({ idNumber: value }).then((staffDoc) => {
          if (!staffDoc) {
            return Promise.reject(
              //them loi xac thuc khong dong bo
              "Mã số nhân viên không tồn tại!11"
            );
          }
      });
    }),
    // body("password")
    //   .isLength({min: 5})
    //   .withMessage("Mật khẩu có ít nhất 5 ký tự")
    // body("password", "Mật khẩu có ít nhất 5 ký tự").isLength({ min: 5 }),
  ],
  authController.postUserLogin
);

//post user logout
router.post("/logout", authController.postUserLogout);

//get user reset password
router.get("/reset", authController.getReset);

//post user reset password
router.post(
  "/reset",
  [
    body("idNumber")
      .isAlphanumeric()
      .withMessage("Mã số nhân viên không hợp lệ")
      .custom((value, {req}) => {
        return Staff.findOne({ idNumber: value }).then((staffDoc) => {
          if (!staffDoc) {
            return Promise.reject(
              //them loi xac thuc khong dong bo
              "Mã số nhân viên không tồn tại!"
            );
          }
      });
    }),
  ],
  authController.postReset
);

router.get("/reset/:token", authController.getNewPassword);

router.post(
  "/new-password",
  [
    body("password", "Mật khẩu có ít nhất 5 ký tự").isLength({ min: 5 }),
    body("pwConfirm").custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Mật khẩu không trùng khớp");
      }
      return true;
    }),
  ],
  authController.postNewPassword
);

module.exports = router;
