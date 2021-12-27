const path = require('path');
//npm install --save express
const express = require('express');

//npm install --save body-parser
const bodyPaser = require('body-parser');

const app = express();

const rootDir = require('./util/path');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(bodyPaser.urlencoded({extended: false}));

app.use('/admin/', adminRoutes);
app.use(shopRoutes);

app.use((req, res, next) => {
    //res.status(404).send('<h1>Page Not Found</h1>');
    res.status(404).sendFile(path.join(rootDir, 'views','404.html'));

});
app.listen(3000);