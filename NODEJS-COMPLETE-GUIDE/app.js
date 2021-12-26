const http = require('http');

const express = require('express');

const app = express();

app.use((req, res, next) => {
    console.log('In the midleware!');
    next();//Allows the request to continue to next midleware in line
});

app.use((req, res, next) => {
    console.log('In another midleware!');
});

const server = http.createServer(app);

server.listen(3000);