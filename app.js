const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const User = require('./models/user');

const app = express();



app.use('/admin', (req, res, next) => {
    console.log('admin here !');
});

mongoose
    .connect(
        'mongodb+srv://admin:1234@cluster0.2tyxr.mongodb.net/myApp?retryWrites=true&w=majority'
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
    
        app.listen(3001);
      })
      .catch((err) => {
        console.log(err);
      });
