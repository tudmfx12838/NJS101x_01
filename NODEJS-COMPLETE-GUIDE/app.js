const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const app = express();

//Thiet lap templating engine by EJS
app.set('view engine', 'ejs');
//Thiet lap noi tim thay bo cuc thu muc views
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const errorController = require('./controllers/error');
const sequelize = require('./util/database');

app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.getPageError);

sequelize
    .sync()
    .then((result) => {
        //console.log(result);
        app.listen(3000);
    })
    .catch(err => {
        console.log(err);
    });


