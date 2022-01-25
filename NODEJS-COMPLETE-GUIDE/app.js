const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const session = require("express-session");

const errorController = require("./controllers/error");
const User = require("./models/user");

const app = express();

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
  saveUninitialized: false //dam bao khong co session nao duoc luu cho 1 req khi khong can thiet
})); 

app.use((req, res, next) => {
  User.findById("61de3047734cb18074b8da08")
    .then((user) => {
      // req.user = user; //user lay tu database
      req.user = user; //user nay tra ve tu findById (ham cua mongoose) lay tu database
      next();
    })
    .catch((err) => console.log(err));
  //    next();
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);


app.use(errorController.getPageError);

mongoose
  .connect(
    "mongodb+srv://admin:yYoPp04jYzN8lHf7@cluster0.gqluc.mongodb.net/myShop?retryWrites=true&w=majority"
  )
  .then((result) => {
    User
        .findOne() //findOne cua mongoose luon tra ve 1 user dau tien trong collection users
        .then((user) => {
            if(!user){ //if user not exist, add new user.
                const user = new User({
                    name: "Tu",
                    email: "test@node",
                    cart: {
                      items: [],
                    },
                  });
                user.save();
            }
        });

    app.listen(3000);
  })
  .catch((err) => {
    console.log(err);
  });
