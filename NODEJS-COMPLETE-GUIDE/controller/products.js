const products = [];

exports.getAddProduct = (req, res, next) => {
    //res.sendFile(path.join(rootDir, 'views', 'add-product.html'));
    res.render('add-product',{
      pageTitle: 'Add Product',
      path: '/admin/add-product',
      activeShop: false,
      activeAddProduct: true,
      productCSS: true,
      formCSS: true,
    });
};

exports.postAddProduct = (req, res, next) => {
    //console.log(req.body);
    products.push({title: req.body.title});
    res.redirect('/');
};

exports.getProducts = (req, res, next) => {
    //console.log(adminData.products);
    //res.sendFile(path.join(rootDir, 'views', 'shop.html'));
    //const products = adminData.products;
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
};

