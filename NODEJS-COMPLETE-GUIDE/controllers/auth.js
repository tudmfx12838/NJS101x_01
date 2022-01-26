exports.getLogin = (req, res, next) => {
  //   const isLoggedIn = req
  //     .get("Cookie")
  //     .split(";")[0]
  //     .trim()
  //     .split("=")[1] === 'true';

    console.log(req.session.isLoggedIn);
  res.render("auth/login", {
    path: "/login",
    pageTitle: "Login",
    isAuthenticated: false,
  });
};

exports.postLogin = (req, res, next) => {
  //Cau hinh HttpOnly tao co che bao mat thi phia client khong the sua cookie trong code hay tren trinh duyet
  //   res.setHeader("Set-Cookie", "loggedIn=true; HttpOnly");
  req.session.isLoggedIn = true;
  res.redirect("/");
};

// exports.postLogout = (req, res, next) => {
// //Cau hinh HttpOnly tao co che bao mat thi phia client khong the sua cookie trong code hay tren trinh duyet
//     res.setHeader("Set-Cookie", "loggedIn=true; HttpOnly");
//     res.redirect("/");
// };
