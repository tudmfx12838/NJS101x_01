const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoDbStore = require("connect-mongodb-session")(session);
const csrf = require('csurf');

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

app.use((req, res, next) => {
  if(!req.session.user){
    next();
  } else {

    User.findById(req.session.user._id)
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((err) => console.log(err)); 
  }
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use(errorController.getPageError);

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
