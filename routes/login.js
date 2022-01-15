const express = require('express');
const User = require('../models/user');
// const loginController = require('../controllers/login');
const router = express.Router();

router.get('/a',(req, res, next) => {
    User.findById("61e26ea6b5b6fe5e5e979334")
    .then((user) => {
      // req.user = user; //user lay tu database
      console.log(user);
      req.user = user; //user nay tra ve tu findById (ham cua mongoose) lay tu database
      next();
    })
    .catch((err) => console.log(err));
  //    next();
});


module.exports = router;