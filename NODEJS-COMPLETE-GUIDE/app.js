const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoDbStore = require("connect-mongodb-session")(session);
const csrf = require('csurf');
const flash = require('connect-flash');

const errorController = require("./controllers/error");
const User = require("./models/user");

const MONGODB_URL = "mongodb+srv://admin:yYoPp04jYzN8lHf7@cluster0.gqluc.mongodb.net/myShop?retryWrites=true&w=majority";

const app = express();

const store = new MongoDbStore({
  uri: MONGODB_URL,
  collection: "sessions",
  // expires  them vao de tu xoa sau het phien
});

const csrfProtection = csrf();

//Thiet lap templating engine by EJS
app.set("view engine", "ejs");
//Thiet lap noi tim thay bo cuc thu muc views
app.set("views", "views");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const authRoutes = require("./routes/auth");


app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use(session({
  secret: 'my secret', //secret dc su dung de dang ky ma bam bi mat ID trong cookie
  resave: false, //session se khong duoc luu doi voi moi req dc thuc hien
  saveUninitialized: false, //dam bao khong co session nao duoc luu cho 1 req khi khong can thiet
  store: store //Thiet lap store de luu truu session tren mongodb
})); 
app.use(csrfProtection);
app.use(flash());

app.use((req, res, next) => {
  if(!req.session.user){
    return next();
  }
    User.findById(req.session.user._id)
    .then((user) => {
      if(!user){
        return next();
      }
      req.user = user;
      next();
    })
    .catch((err) => {
      throw new Error(err);
    }); 

});

app.use((req, res, next) =>{
  res.locals.isAuthenticated = req.session.isLoggedIn; //tinh nang dac biet res.locals. cua expessjs dung de thiet lap cac bien cuc bo truyen vao cac view
  res.locals.csrfToken = req.csrfToken();
  next();
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use('/500', errorController.get500);
app.use(errorController.getPageError);

app.use((error, req, res, next) => {
  // console.log('Hello');
  res.redirect('/500');
});

mongoose
  .connect(
    MONGODB_URL
  )
  .then((result) => {
    app.listen(3000);
  })
  .catch((err) => {
    console.log(err);
  });
