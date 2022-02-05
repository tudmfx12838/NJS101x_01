const Staff = require('../models/staff');
const mongoose = require('mongoose');

exports.getUserLogin = ((req, res, next) => {
    res.render('auth/user-login', {
        pageTitle: "Login",
        path:'/login',
        isAuthenticated: req.session.isLoggedIn
    })
});

exports.postUserLogin = ((req, res, next) => {
    const loginId = req.body.loginId;
    const password = req.body.password;

    Staff
        .find({idNumber: loginId, password: password})
        .then(staff => {
            // console.log(mongoose.Types.ObjectId(staff._id));
            // console.log(staff[0]);
            if(staff[0]){
                req.session.isLoggedIn = true;
                req.session.user = staff[0];
                return req.session.save((err) => {
                    //Them save() y nghia la ngan cho res.redirect("/") hoat dong doc lap, vai page co the render truoc khi session duoc update
                    console.log(err);
                    res.redirect("/staffs");
                });
                
            }else{
                console.log('Mã số nhân viên hoặc mật khẩu không hợp lệ');
            }
        })         
        .then((result) => {
        })
        .catch(err => console.log(err));
    // req.session.isLoggedIn = true;
    // req.session.isLoggedIn1 = false;
    // res.redirect('/login');
});

exports.postUserLogout = (req, res, next) => {
    req.session.destroy(err => {
        console.log(err);
        res.redirect('/login');
    })
};