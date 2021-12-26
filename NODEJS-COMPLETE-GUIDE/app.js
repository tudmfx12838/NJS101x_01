const http = require('http');

//npm install --save express
const express = require('express');

//npm install --save body-parser
const bodyPaser = require('body-parser');

const app = express();

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(bodyPaser.urlencoded({extended: false}));

app.use(adminRoutes);
app.use(shopRoutes);

app.listen(3000);