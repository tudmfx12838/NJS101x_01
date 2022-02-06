const express = require("express");

const router = express.Router();

const { check, body } = require("express-validator");

const authController = require("../controllers/auth");

//get user login
router.get("/login", authController.getUserLogin);

//post user login
router.post(
  "/login",
  [
    check("loginId")
      .isAlphanumeric()
      .withMessage("Mã số nhân viên không hợp lệ"),

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
      .withMessage("Mã số nhân viên không hợp lệ"),
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
