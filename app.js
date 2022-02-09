const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoDbStore = require("connect-mongodb-session")(session);
const csrf = require("csurf");
const flash = require("connect-flash");
const multer = require("multer");

const Staff = require("./models/staff");

const MONGODB_URL =
  "mongodb+srv://admin:1234@cluster0.2tyxr.mongodb.net/myApp?retryWrites=true&w=majority";
const app = express();

//Configure to store session in db
const store = new MongoDbStore({
  uri: MONGODB_URL,
  collection: "sessions",
  // expires  them vao de tu xoa sau het phien
});

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
    //cb(null, "new Date().toISOString()" + "-" + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/png' || 
      file.mimetype === 'image/jpg' || 
      file.mimetype === 'image/jpeg') {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const csrfProtection = csrf();

//Templace Engine EJS
//And point to views's folder
app.set("view engine", "ejs");
app.set("views", "views");

//Import Router
// const loginRoutes = require('./routes/login');
const staffRoutes = require("./routes/staff");
const authRoutes = require("./routes/auth");
const adminRouter = require("./routes/admin");
const errorController = require("./controllers/error");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).single("image")
); //image a name of image file at view edit-produt.ejs, {dest: 'images'} them folder luu tru

app.use(express.static(path.join(__dirname, "public")));
app.use('/images', express.static(path.join(__dirname, "images")));// Khac voi tep css tinh o public, images phai kem path vi gi thi xem video 326

app.use(
  session({
    secret: "my secret",
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);

app.use(csrfProtection);
app.use(flash());

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();

  if (req.session.user) {
    res.locals.permission = req.session.user.permission;
    // console.log(req.user.permission);
  }

  next();
});

app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }

  Staff.findById(req.session.user._id)
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((err) => console.log(err));
});



//Connect to Routers
app.use(adminRouter);
app.use(staffRoutes);
app.use(authRoutes);

app.use('/500', errorController.get500);
app.use(errorController.getPageError);

app.use((error, req, res, next) => {
  // console.log('Hello');
  // res.redirect('/500');
  res.status(500).render('500', {
    pageTitle: "Error!",
    path: '/500',
    // isAuthenticated: req.session.isLoggedIn
  });
});

//Connect to db by mongoose
mongoose
  .connect(MONGODB_URL)
  .then((result) => {
    app.listen(3002);
  })
  .catch((err) => {
    console.log(err);
  });

// app.listen(process.env.PORT || 8080, '0.0.0.0', () => {
//   console.log('Server is running');
// })
