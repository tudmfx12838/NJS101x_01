const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require("express-session");
const MongoDbStore = require("connect-mongodb-session")(session);

const Staff = require('./models/staff');

const MONGODB_URL = "mongodb+srv://admin:1234@cluster0.2tyxr.mongodb.net/myApp?retryWrites=true&w=majority";
const app = express();

//Configure to store session in db
const store = new MongoDbStore({
  uri: MONGODB_URL,
  collection: "sessions",
  // expires  them vao de tu xoa sau het phien
});

//Templace Engine EJS
//And point to views's folder
app.set("view engine", "ejs");
app.set("views", "views");

//Import Router
// const loginRoutes = require('./routes/login');
const staffRoutes = require('./routes/staff');
const authRoutes = require('./routes/auth');
const adminRouter = require('./routes/admin');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use(session({
  secret: 'my secret',
  resave: false,
  saveUninitialized: false,
  store: store
}));


// //Registry a user
// app.use((req, res, next) => {
//   Staff.findById("61e26ea6b5b6fe5e5e979334")
//     .then((user) => {
//       // req.user = user; //user lay tu database
//       // console.log(user);
//       req.user = user; //user nay tra ve tu findById (ham cua mongoose) lay tu database
//       next();
//     })
//     .catch((err) => console.log(err));
//   //    next();
// });

app.use((req, res, next) => {
  if(!req.session.user){
    next();
  } else {
    
    Staff.findById(req.session.user._id)
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((err) => console.log(err)); 
  }
});

//Connect to Routers
app.use(authRoutes);
app.use(staffRoutes);
app.use(adminRouter);

//Connect to db by mongoose
mongoose
    .connect(
      MONGODB_URL
    )
    .then((result) => {
        app.listen(3002);
      })
    .catch((err) => {
      console.log(err);
    });
