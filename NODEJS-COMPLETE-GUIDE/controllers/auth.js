const User = require("../models/user");

exports.getLogin = (req, res, next) => {
  console.log(req.session.isLoggedIn);
  res.render("auth/login", {
    path: "/login",
    pageTitle: "Login",
    isAuthenticated: false,
  });
};

exports.postLogin = (req, res, next) => {
  User.findById("61de3047734cb18074b8da08")
  .then((user) => {
    req.session.isLoggedIn = true;
    req.session.user = user;
    res.redirect("/");
  })
  .catch((err) => console.log(err)); 
};

exports.postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    console.log(err);
    res.redirect('/');
  });
};
