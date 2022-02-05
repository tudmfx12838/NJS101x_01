const Staff = require('../models/staff');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

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
        .findOne({idNumber: loginId})
        .then(staff => {
            if(!staff){
                return res.redirect('/login');
            }
            bcrypt
                .compare(password, staff.password)
                .then(doMatch => {
                    if(doMatch){
                        req.session.isLoggedIn = true;
                        req.session.user = staff;
                        return req.session.save((err) => {
                            //Them save() y nghia la ngan cho res.redirect("/") hoat dong doc lap, vai page co the render truoc khi session duoc update
                            console.log(err);
                            res.redirect("/staffs");
                        });
                    }

                    res.redirect('/login');
                })
                .catch(err => {
                    console.log(err);
                    res.redirect('/login');
                });
        })         
        .catch(err => console.log(err));
});

exports.postUserLogout = (req, res, next) => {
    req.session.destroy(err => {
        console.log(err);
        res.redirect('/login');
    })
};