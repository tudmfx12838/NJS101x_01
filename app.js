const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const User = require('./models/user');
const Staff = require('./models/staff');


const app = express();

//Templace Engine EJS
//And point to views's folder
app.set("view engine", "ejs");
app.set("views", "views");

//Import Router
// const loginRoutes = require('./routes/login');
const staffRoutes = require('./routes/staff');
const userRoutes = require('./routes/user');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

//Registry a user
app.use((req, res, next) => {
  User.findById("61e26ea6b5b6fe5e5e979334")
    .then((user) => {
      // req.user = user; //user lay tu database
      // console.log(user);
      req.user = user; //user nay tra ve tu findById (ham cua mongoose) lay tu database
      next();
    })
    .catch((err) => console.log(err));
  //    next();
});

//Connect to Routers
app.use(userRoutes);
app.use(staffRoutes);

//Connect to db by mongoose
mongoose
    .connect(
        'mongodb+srv://admin:1234@cluster0.2tyxr.mongodb.net/myApp?retryWrites=true&w=majority'
    )
    .then((result) => {
        app.listen(3002);
      })
    .catch((err) => {
      console.log(err);
    });
