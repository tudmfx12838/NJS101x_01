const path = require('path');

const express = require('express');

const rootDir = require('../util/path');
const adminData = require('./admin');

const router = express.Router();

router.get('/', (req, res, next) => {
  //console.log(adminData.products);
  //res.sendFile(path.join(rootDir, 'views', 'shop.html'));
  const products = adminData.products;
  res.render('shop', {
    prods: products, 
    docTitle: 'My Shop',
    pageTitle: 'Shop', 
    path: '/', hasProduct: products.length > 0,
    activeShop: true,
    activeAddProduct: false,
    productCSS: true,
    formCSS: false,
  });
});

module.exports = router;
