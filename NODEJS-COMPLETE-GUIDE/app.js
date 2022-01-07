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
const Product = require('./models/product');
const User = require('./models/user');
const Cart = require('./models/cart');
const CartItem = require('./models/cart-item');

app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
    User
        .findByPk(1)
        .then(user => {
            req.user = user;
            next();
        })
        .catch(err => console.log(err));
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.getPageError);

//Tao cac moi quan he
Product.belongsTo(User, {constraints: true, onDelete: 'CASCADE'});
User.hasMany(Product);
User.hasOne(Cart);
Cart.belongsTo(User);
Cart.belongsToMany(Product, {through: CartItem});
Product.belongsToMany(Cart, {through: CartItem});

sequelize
    // .sync({force: true})//force: true . Se tu dong Drop table va tao lai
    .sync()
    .then(result => {
        return User.findByPk(1);
    })
    .then(user => {
        if(!user){
            return  User.create({name: 'Tu', email: 'tu@js.com'});
        }
        return user;
    })
    .then(user => {
        //console.log(user);
        user.createCart();
    })
    .then(cart => {
        app.listen(3000);
    })
    .catch(err => {
        console.log(err);
    });


