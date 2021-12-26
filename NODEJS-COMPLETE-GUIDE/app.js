const http = require('http');

//npm install --save express
const express = require('express');

//npm install --save body-parser
const bodyPaser = require('body-parser');

const app = express();

app.use(bodyPaser.urlencoded({extended: false}));

app.use('/add-product',(req, res, next) => {
    res.send('<form action="/product" method="POST"><input type="text" name="title"><button type="submit">Add Prodcut</button></form>')
});

app.use('/product', (req, res, next) => {
    console.log(req.body)
    res.redirect('/');
});

app.use('/',(req, res, next) => {
    console.log('In another midleware1!');
    res.send('<h1>Hello from Express!</h1>');
});

const server = http.createServer(app);

server.listen(3000);