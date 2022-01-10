const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const errorController = require('./controllers/error');
const mongoConnect = require('./util/database').mongoConnect;
const app = express();

//Thiet lap templating engine by EJS
app.set('view engine', 'ejs');
//Thiet lap noi tim thay bo cuc thu muc views
app.set('views', 'views');


const User = require('./models/user');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
    User
        .findById('61dbe082ee456c981655d765')
        .then(user => {
            req.user = user;
            next();
        })
        .catch(err => console.log(err));
   // next();
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.getPageError);

mongoConnect(() => {
    app.listen(3000);
});