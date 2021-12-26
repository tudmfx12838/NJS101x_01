const http = require('http');

const express = require('express');

const app = express();

app.use("/",(req, res, next) => {
    console.log('This always run!');
    next();
});

app.use('/add-product',(req, res, next) => {
    console.log('In another midleware!');
    res.send('<h1>The "Add Product" Page!</h1>');
});

app.use('/',(req, res, next) => {
    console.log('In another midleware1!');
    res.send('<h1>Hello from Express!</h1>');
});

const server = http.createServer(app);

server.listen(3000);