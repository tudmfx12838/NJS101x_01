const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require("express-session");
const MongoDbStore = require("connect-mongodb-session")(session);
const csrf = require('csurf');
const flash = require('connect-flash');

const Staff = require('./models/staff');

const MONGODB_URL = "mongodb+srv://admin:1234@cluster0.2tyxr.mongodb.net/myApp?retryWrites=true&w=majority";
const app = express();

//Configure to store session in db
const store = new MongoDbStore({
  uri: MONGODB_URL,
  collection: "sessions",
  // expires  them vao de tu xoa sau het phien
});

const csrfProtection = csrf();

//Templace Engine EJS
//And point to views's folder
app.set("view engine", "ejs");
app.set("views", "views");

//Import Router
// const loginRoutes = require('./routes/login');
const staffRoutes = require('./routes/staff');
const authRoutes = require('./routes/auth');
const adminRouter = require('./routes/admin');
const errorController = require("./controllers/error");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use(session({
  secret: 'my secret',
  resave: false,
  saveUninitialized: false,
  store: store
}));

app.use(csrfProtection);
app.use(flash());

app.use((req, res, next) => {
  if(!req.session.user){
    return next();
  } 
    
  Staff.findById(req.session.user._id)
  .then((user) => {
    req.user = user;
    next();
  })
  .catch((err) => console.log(err)); 
});

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();

  if(req.session.user){
    res.locals.permission = req.session.user.permission;
    // console.log(req.user.permission);
  }
  
  next();
});

//Connect to Routers
app.use(authRoutes);
app.use(staffRoutes);
app.use(adminRouter);

app.use(errorController.getPageError);

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
