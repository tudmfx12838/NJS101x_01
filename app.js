const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use('/admin', (req, res, next) => {
    console.log('admin here !');
});

app.listen(3001);

