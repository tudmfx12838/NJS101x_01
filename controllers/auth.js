const User = require('../models/user');
const Staff = require('../models/staff');
const mongoose = require('mongoose');

exports.getUserLogin = ((req, res, next) => {
    res.render('admin/user-login', {
        pageTitle: "Login",
        path:'/login'
    })
});

exports.postUserLogin = ((req, res, next) => {
    const loginId = req.body.loginId;
    const password = req.body.password;
    Staff
        .find({idNumber: loginId, password: password})
        .then(staff => {
            // console.log(mongoose.Types.ObjectId(staff._id));
            // console.log(staff);
            // console.log(staff[0]);
            // console.log(staff[0]._id);
            if(staff[0]){
                console.log(staff[0]);
                User
                .findOne() //findOne cua mongoose luon tra ve 1 user dau tien trong collection users
                .then((user) => {
                    if(!user){ //if user not exist, add new user.
                        const user = new User({
                            staffId: staff[0]._id,
                            permission: staff[0].permission
                        });
                        return user.save();
                    }
                });
            }else{
                console.log('Mã số nhân viên hoặc mật khẩu không hợp lệ');
            }
        })         
        .then((result) => {
            //add to req.user
            User
                .findOne() //findOne cua mongoose luon tra ve 1 user dau tien trong collection users
                .then((user) => {
                    // if(user){ //if user not exist, add new user.
                    //     console.log('Đăng nhập thành công');
                    //     req.user = user;
                    // } else {
                    //     console.log('Đăng nhập thất bại');
                    // }
                    req.user = user;
                });
        })
        .catch(err => console.log(err));
});