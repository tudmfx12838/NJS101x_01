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
const db = require('./util/database');

app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));

db.execute('SELECT * FROM products').then().catch();

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.getPageError);

app.listen(3000);
